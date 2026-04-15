import { useCallback, useRef, type Dispatch, type SetStateAction } from 'react';
import type { Action, Asset, GameState, ProjectType, LifeChoice } from '../types/index';

export type ActionExecutionInterceptor = (action: Action, run: (a: Action) => void) => boolean;
import { BOSS_INTERACTIONS } from '../data/bossInteractions';
import { COWORKER_INTERACTIONS } from '../data/coworkerInteractions';
import { pickInsufficientSalaryBlock, pickInsufficientMaterialsBlock } from '../data/narrativeTexts/softBlockCopy';
import {
  advanceToNextQuarter,
  applyQuarterRandomEventEffect,
  randomExternalMomentThreshold,
  type SectionReviewDetail,
} from '../engine/quarterTransition';
import { computeActionEffect, canExecuteAction } from '../engine/actionHandlers';
import { getActionsPerQuarter } from '../engine/promotionSystem';
import { startNewProject, evaluateProject, type ProjectScore } from '../engine/projectManager';
import { checkPromotionEligibility, applyPromotion } from '../engine/promotionSystem';
import { computeEndingGrade } from '../engine/endingSystem';
import { roundEffectRecord } from '../utils/format';
import { clamp100, applyInteractionDelta, applyCoworkerInteractionDelta, makePeerMoment } from '../app/gameFlowHelpers';
import { useModals } from './useModals';

type Modals = ReturnType<typeof useModals>;

import type { AnnualReviewResult } from '../engine/annualReview';

export function useConstructionGameHandlers(
  state: GameState,
  setState: Dispatch<SetStateAction<GameState>>,
  addLog: (message: string, type?: 'INFO' | 'SUCCESS' | 'WARNING' | 'DANGER') => void,
  modals: Modals,
  isLoading: boolean,
  setIsLoading: (v: boolean) => void,
  setSectionReviewDetail: (v: SectionReviewDetail | null) => void,
  setWarningMessage: (v: string) => void,
  setProjectScore: (v: ProjectScore | null) => void,
  interceptActionExecution?: ActionExecutionInterceptor,
  setAnnualReviewResult?: (v: AnnualReviewResult | null) => void
) {
  const pendingActionRef = useRef<Action | null>(null);
  const stateRef = useRef(state);
  stateRef.current = state;

  const checkGameOver = useCallback(
    (s: GameState) => {
      if (s.morale <= 0 || s.stamina <= 0 || s.energy <= 0 || s.reputation <= 0) {
        addLog('关键指标跌至谷底。', 'DANGER');
        modals.setIsGameOver(true);
        setState((prev) => ({ ...prev, gamePhase: 'ENDING', endingType: 'BURNOUT' }));
      } else if (s.safetyRisk >= 100) {
        addLog('安全事故，工地全面停工。', 'DANGER');
        modals.setIsGameOver(true);
        setState((prev) => ({ ...prev, gamePhase: 'ENDING', endingType: 'SAFETY_ACCIDENT' }));
      }
    },
    [addLog, modals, setState]
  );

  const openSoftBlockEvent = (title: string, body: string) => {
    modals.setCurrentEvent({ title, description: body, effect: {} });
    modals.setIsEventModalOpen(true);
  };

  const nextQuarter = useCallback(() => {
    if (isLoading || modals.isGameOver || state.gamePhase !== 'PLAYING') return;
    setIsLoading(true);
    const result = advanceToNextQuarter(state);
    setSectionReviewDetail(result.sectionReviewDetail);
    setState(result.newState);
    if (result.annualReview) {
      setAnnualReviewResult?.(result.annualReview);
    }
    if (result.isGameOver) {
      modals.setIsGameOver(true);
    } else if (result.isProjectComplete) {
      const score = evaluateProject(result.newState);
      setProjectScore(score);
      modals.setIsProjectScoreModalOpen(true);
    } else {
      modals.setIsSummaryModalOpen(true);
      if (result.newState.project.pendingAssetOffer) modals.setIsAssetOfferModalOpen(true);
    }
    setIsLoading(false);
  }, [isLoading, modals, setIsLoading, setSectionReviewDetail, setState, state, setProjectScore]);

  const closeQuarterSummary = () => {
    modals.setIsSummaryModalOpen(false);
    if (state.pendingQuarterChoice) modals.setIsQuarterChoiceOpen(true);
  };

  const runActionEffect = useCallback(
    (a: Action) => {
      const cur = stateRef.current;
      const out = computeActionEffect(cur, a);
      let next = { ...out.newState, actionsSinceExternalMoment: cur.actionsSinceExternalMoment + 1 };
      if (next.actionsSinceExternalMoment >= next.externalMomentThreshold) {
        next = {
          ...next,
          moments: [makePeerMoment(next), ...next.moments].slice(0, 120),
          actionsSinceExternalMoment: 0,
          externalMomentThreshold: randomExternalMomentThreshold(),
        };
      }
      setState(next);
      out.logs.forEach((line, i) => {
        if (i === 0) {
          modals.setCurrentEvent({ title: out.eventTitle, description: line, effect: out.eventEffect });
        } else addLog(line, 'INFO');
      });
      if (out.planCompletedLog) addLog(out.planCompletedLog, 'SUCCESS');
      modals.setIsEventModalOpen(true);
      checkGameOver(next);
    },
    [addLog, checkGameOver, modals, setState]
  );

  const handleAction = (action: Action, force = false, opts?: { skipIntercept?: boolean }) => {
    const s = stateRef.current;
    if (modals.isGameOver || s.gamePhase !== 'PLAYING') return;
    const chk = canExecuteAction(s, action);
    if (!chk.ok) {
      if (chk.reason?.includes('工资')) {
        const b = pickInsufficientSalaryBlock();
        openSoftBlockEvent(b.title, b.body);
      } else if (chk.reason?.includes('物资')) {
        const b = pickInsufficientMaterialsBlock();
        openSoftBlockEvent(b.title, b.body);
      } else if (chk.reason) addLog(chk.reason, 'WARNING');
      return;
    }
    if (!force && s.safetyRisk >= 72 && (action.id === 'do_construction' || action.id === 'write_plan')) {
      pendingActionRef.current = action;
      setWarningMessage('现场隐患指数偏高，继续可能把风险顶到红线。确认继续？');
      modals.setIsWarningModalOpen(true);
      return;
    }
    if (interceptActionExecution && !opts?.skipIntercept) {
      if (interceptActionExecution(action, runActionEffect)) return;
    }
    runActionEffect(action);
  };

  const confirmWarning = () => {
    modals.setIsWarningModalOpen(false);
    const a = pendingActionRef.current;
    pendingActionRef.current = null;
    if (a) handleAction(a, true);
  };

  const checkActionQuota = (): boolean => {
    const max = getActionsPerQuarter(stateRef.current.careerStage);
    if (stateRef.current.actionsThisQuarter >= max) {
      addLog(`本季度行动次数已达上限（${max} 次），请进入下一季度。`, 'WARNING');
      return false;
    }
    return true;
  };

  const onWorkWalk = () => {
    if (modals.isGameOver) return;
    if (!checkActionQuota()) return;
    if (state.walksThisQuarter >= 3) {
      addLog('本季散步次数已用完。', 'WARNING');
      return;
    }
    setState((prev) => ({
      ...prev,
      actionsThisQuarter: prev.actionsThisQuarter + 1,
      walksThisQuarter: prev.walksThisQuarter + 1,
      morale: clamp100(prev.morale + 6),
      stamina: clamp100(prev.stamina + 6),
      energy: clamp100(prev.energy - 8),
    }));
    addLog('围着基坑走了一圈，风吹走一半焦虑。', 'INFO');
  };

  const onDormRest = () => {
    if (modals.isGameOver) return;
    if (!checkActionQuota()) return;
    setState((prev) => ({
      ...prev,
      actionsThisQuarter: prev.actionsThisQuarter + 1,
      energy: clamp100(prev.energy + 28),
      morale: clamp100(prev.morale - 3),
    }));
    addLog('板房躺平半小时，世界安静得像停工检修。', 'INFO');
  };

  const onOuting = () => {
    if (modals.isGameOver) return;
    if (!checkActionQuota()) return;
    if (state.salary < 500) {
      const b = pickInsufficientSalaryBlock();
      openSoftBlockEvent(b.title, b.body);
      return;
    }
    setState((prev) => ({
      ...prev,
      actionsThisQuarter: prev.actionsThisQuarter + 1,
      salary: prev.salary - 500,
      morale: clamp100(prev.morale + 12),
      stamina: clamp100(prev.stamina + 10),
      energy: clamp100(prev.energy + 15),
    }));
    addLog('外出放风：工地围墙外的一顿简餐，比专家论证还治愈。', 'SUCCESS');
  };

  const onWithdrawSubmit = () => {
    if (modals.isGameOver) return;
    if (state.project.submittedSections <= 0) {
      addLog('没有排队送审的分项可撤回。', 'WARNING');
      return;
    }
    setState((prev) => ({
      ...prev,
      project: { ...prev.project, submittedSections: prev.project.submittedSections - 1 },
    }));
    addLog('撤回了一项分项送审。', 'INFO');
  };

  const runBossInteraction = () => {
    if (modals.isGameOver) return;
    if (!checkActionQuota()) return;
    if (state.interactionsThisQuarter.includes('boss')) {
      addLog('本季与领导的互动额度已用。', 'WARNING');
      return;
    }
    const pick = BOSS_INTERACTIONS[Math.floor(Math.random() * BOSS_INTERACTIONS.length)]!;
    const line = pick.texts[Math.floor(Math.random() * pick.texts.length)]!;
    let next = applyInteractionDelta(state, pick.effect);
    next = {
      ...next,
      actionsThisQuarter: next.actionsThisQuarter + 1,
      interactionsThisQuarter: [...next.interactionsThisQuarter, 'boss'],
      project: { ...next.project, bossLastInteractedQuarter: state.totalQuarters },
    };
    setState(next);
    modals.setCurrentEvent({
      title: `汇报 · ${pick.label}`,
      description: `${pick.description}\n\n${line}`,
      effect: roundEffectRecord(pick.effect as Record<string, number>),
    });
    modals.setIsEventModalOpen(true);
    checkGameOver(next);
  };

  const runCoworkerInteraction = (cwId: string) => {
    if (modals.isGameOver) return;
    if (!checkActionQuota()) return;
    if (state.interactionsThisQuarter.includes(cwId)) {
      addLog('这位工友本季已聊透了。', 'WARNING');
      return;
    }
    const pick = COWORKER_INTERACTIONS[Math.floor(Math.random() * COWORKER_INTERACTIONS.length)]!;
    const line = pick.texts[Math.floor(Math.random() * pick.texts.length)]!;
    let next = applyCoworkerInteractionDelta(state, pick.effect, cwId);
    next = {
      ...next,
      actionsThisQuarter: next.actionsThisQuarter + 1,
      interactionsThisQuarter: [...next.interactionsThisQuarter, cwId],
      project: {
        ...next.project,
        coworkers: next.project.coworkers.map((c) =>
          c.id === cwId ? { ...c, lastInteractedQuarter: state.totalQuarters } : c
        ),
      },
    };
    setState(next);
    modals.setCurrentEvent({
      title: `工友圈 · ${pick.label}`,
      description: `${pick.description}\n\n${line}`,
      effect: roundEffectRecord(pick.effect as Record<string, number>),
    });
    modals.setIsEventModalOpen(true);
    checkGameOver(next);
  };

  const applyQuarterChoiceOption = (opt: NonNullable<GameState['pendingQuarterChoice']>['options'][number]) => {
    const scenarioTitle = state.pendingQuarterChoice?.title ?? '项目部抉择';
    setState((prev) => {
      const merged = applyQuarterRandomEventEffect({ ...prev, pendingQuarterChoice: undefined }, roundEffectRecord(opt.deltas as Record<string, number>));
      queueMicrotask(() => checkGameOver(merged));
      return merged;
    });
    modals.setIsQuarterChoiceOpen(false);
    addLog(`你选择了「${opt.label}」。`, 'INFO');
    const effectFromChoice: Record<string, number> = {};
    for (const [k, v] of Object.entries(opt.deltas)) {
      if (typeof v === 'number' && !Number.isNaN(v) && v !== 0) effectFromChoice[k] = Math.round(v);
    }
    modals.setCurrentEvent({
      title: `${scenarioTitle} · 结果`,
      description: opt.outcomeText,
      effect: roundEffectRecord(effectFromChoice),
    });
    modals.setIsEventModalOpen(true);
  };

  // === v2 Transfer Period handlers ===

  const openTransferPanel = () => {
    modals.setIsProjectScoreModalOpen(false);
    // Check promotion eligibility
    const promoCheck = checkPromotionEligibility(state);
    if (promoCheck.eligible) {
      modals.setIsPromotionModalOpen(true);
    } else {
      modals.setIsTransferModalOpen(true);
    }
  };

  const acceptPromotion = () => {
    setState((prev) => applyPromotion(prev));
    modals.setIsPromotionModalOpen(false);
    addLog('恭喜晋升！新的篇章开始了。', 'SUCCESS');
    modals.setIsTransferModalOpen(true);
  };

  const declinePromotion = () => {
    modals.setIsPromotionModalOpen(false);
    modals.setIsTransferModalOpen(true);
  };

  const selectNextProject = (projectType: ProjectType) => {
    setState((prev) => startNewProject(prev, projectType));
    modals.setIsTransferModalOpen(false);
    addLog('新项目开工！', 'SUCCESS');
  };

  const openLifeChoices = () => {
    modals.setIsTransferModalOpen(false);
    modals.setIsLifeChoiceModalOpen(true);
  };

  const applyLifeChoice = (choice: LifeChoice) => {
    modals.setIsLifeChoiceModalOpen(false);
    if (choice.isEnding) {
      const grade = computeEndingGrade(state);
      setState((prev) => ({
        ...prev,
        gamePhase: 'ENDING',
        endingType: choice.endingType,
        endingGrade: grade,
        careerHistory: [
          ...prev.careerHistory,
          {
            totalQuarter: prev.totalQuarters,
            type: 'LIFE_CHOICE' as const,
            description: choice.label,
          },
        ],
      }));
      modals.setIsGameOver(true);
      addLog(`人生抉择：${choice.label}`, 'SUCCESS');
    } else if (choice.id === 'jump_ship') {
      // Jump ship: salary +30%, reset project-level stuff
      setState((prev) => ({
        ...prev,
        salary: Math.round(prev.salary * 1.3),
        networkValue: prev.networkValue + 10,
        careerHistory: [
          ...prev.careerHistory,
          {
            totalQuarter: prev.totalQuarters,
            type: 'CAREER_CHANGE' as const,
            description: '跳槽同行',
          },
        ],
      }));
      addLog('跳槽成功！工资涨了 30%，但一切关系从头开始。', 'SUCCESS');
      modals.setIsTransferModalOpen(true);
    } else if (choice.id === 'grad_school') {
      setState((prev) => ({
        ...prev,
        careerStage: Math.min(4, prev.careerStage + 1),
        totalQuarters: prev.totalQuarters + 8, // skip 2 project cycles
        experience: prev.experience + 200,
        certificates: prev.certificates + 15,
        careerHistory: [
          ...prev.careerHistory,
          {
            totalQuarter: prev.totalQuarters,
            type: 'CAREER_CHANGE' as const,
            description: '考研深造后回归',
          },
        ],
      }));
      addLog('两年研究生毕业，带着学位回到工地，职级提升一级。', 'SUCCESS');
      modals.setIsTransferModalOpen(true);
    } else {
      // 'continue' - just go back to transfer modal to pick project
      modals.setIsTransferModalOpen(true);
    }
  };

  const buyAsset = (asset: Asset) => {
    if (state.salary < asset.price) {
      addLog('工资不够。', 'WARNING');
      return;
    }
    setState((prev) => ({
      ...prev,
      salary: prev.salary - asset.price,
      assets: [...prev.assets, asset],
      project: { ...prev.project, pendingAssetOffer: undefined, assetVendorTitle: undefined },
    }));
    addLog(`采购入账：${asset.name}。`, 'SUCCESS');
    modals.setIsAssetOfferModalOpen(false);
  };

  const sellAsset = (asset: Asset) => {
    setState((prev) => ({
      ...prev,
      salary: prev.salary + asset.sellPrice,
      assets: prev.assets.filter((a) => a.id !== asset.id),
    }));
    addLog(`变卖：${asset.name}，回血 ¥${asset.sellPrice}。`, 'INFO');
  };

  const handleMomentInteract = (momentId: string) => {
    setState((prev) => ({
      ...prev,
      moments: prev.moments.map((m) =>
        m.id === momentId && !m.hasInteracted ? { ...m, hasInteracted: true, likes: m.likes + 1 } : m
      ),
      morale: prev.moments.some((m) => m.id === momentId && !m.hasInteracted)
        ? clamp100(prev.morale + 2)
        : prev.morale,
    }));
  };

  const declineAssetOffer = () => {
    setState((prev) => ({
      ...prev,
      project: { ...prev.project, pendingAssetOffer: undefined, assetVendorTitle: undefined },
    }));
    modals.setIsAssetOfferModalOpen(false);
    addLog('婉拒了供货商。', 'INFO');
  };

  return {
    pendingActionRef,
    nextQuarter,
    closeQuarterSummary,
    handleAction,
    confirmWarning,
    onWorkWalk,
    onDormRest,
    onOuting,
    onWithdrawSubmit,
    runBossInteraction,
    runCoworkerInteraction,
    applyQuarterChoiceOption,
    buyAsset,
    sellAsset,
    handleMomentInteract,
    declineAssetOffer,
    // v2 transfer
    openTransferPanel,
    acceptPromotion,
    declinePromotion,
    selectNextProject,
    openLifeChoices,
    applyLifeChoice,
  };
}
