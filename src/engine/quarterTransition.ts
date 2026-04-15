import type { GameState, GameLog } from '../types/index';
import { SEASONS } from '../config/gameConfig';
import { BRAND } from '../config/branding';
import { pickRandomQuarterChoice } from '../data/quarterChoiceEvents';
import { ASSETS_LIBRARY, pickRandomAssetVendorTitle } from '../data/assets';
import { rollSeasonWeather, weatherQuarterNote } from './weatherSystem';
import { updateProjectPhase, isProjectComplete, enterTransferPeriod, computeBaseQuarterProgress, checkScheduleStatus } from './projectManager';
import { getQuarterlySalary } from './promotionSystem';
import { isAnnualReviewQuarter, performAnnualReview, type AnnualReviewResult } from './annualReview';
import { ACTIONS } from '../data/actions';

export interface SectionReviewDetail {
  submitted: number;
  accepted: number;
  rejected: number;
  lines: string[];
  delta: {
    morale: number;
    reputation: number;
    salary: number;
    completedSections: number;
    stamina: number;
    energy: number;
    experience: number;
    bossApproval: number;
  };
}

/** Alias for UI / legacy imports — same shape as {@link SectionReviewDetail}. */
export type PaperReviewDetail = SectionReviewDetail;

export interface QuarterTransitionResult {
  newState: GameState;
  logs: GameLog[];
  sectionReviewDetail: SectionReviewDetail | null;
  isGameOver: boolean;
  isProjectComplete: boolean;
  annualReview: AnnualReviewResult | null;
}

const MAX_LOGS = 50;

function clamp(n: number, min = 0, max = 100): number {
  return Math.min(max, Math.max(min, n));
}

/** Review submitted sections (similar to old paper review) */
export function computeSectionReview(submitted: number): SectionReviewDetail {
  let accepted = 0;
  for (let i = 0; i < submitted; i++) {
    if (Math.random() > 0.48) accepted++;
  }
  const rejected = submitted - accepted;
  const lines: string[] = [`本季度共 ${submitted} 个分项提交验收。`];
  const delta = {
    morale: 0,
    reputation: 0,
    salary: 0,
    completedSections: 0,
    stamina: 0,
    energy: 0,
    experience: 0,
    bossApproval: 0,
  };

  if (accepted > 0) {
    lines.push(`${accepted} 个通过验收并完工销项。`);
    delta.morale += accepted * 12;
    delta.reputation += accepted * 6;
    delta.bossApproval += accepted * 4;
    delta.completedSections += accepted;
    delta.experience += accepted * 15;
    const party = accepted * (300 + Math.floor(Math.random() * 200));
    delta.salary -= party;
    lines.push(`惯例：分项过审要请监理吃肉，花费约 ¥${party}。`);
  }
  if (rejected > 0) {
    lines.push(`${rejected} 个被打回复审。`);
    delta.morale -= rejected * 10;
    delta.reputation -= rejected * 3;
    delta.stamina -= rejected * 3;
    delta.energy -= rejected * 6;
    delta.bossApproval -= rejected * 2;
  }
  return { submitted, accepted, rejected, lines, delta };
}

/** Apply random event effects to nested state */
export function applyQuarterRandomEventEffect(state: GameState, effect: Record<string, number>): GameState {
  let s = { ...state };
  let p = { ...s.project };

  for (const [key, delta] of Object.entries(effect)) {
    if (typeof delta !== 'number' || Number.isNaN(delta)) continue;

    if (key === 'bossApproval') {
      p.bossApproval = clamp(p.bossApproval + delta);
      continue;
    }
    if (key === 'ownerSatisfaction') {
      p.ownerSatisfaction = clamp(p.ownerSatisfaction + delta);
      continue;
    }
    if (key === 'progress') {
      p.progress = clamp(p.progress + delta);
      continue;
    }
    if (key === 'planProgress') {
      p.planProgress = clamp(p.planProgress + delta);
      continue;
    }
    if (key === 'materials') {
      p.materials = Math.max(0, p.materials + delta);
      continue;
    }

    if (key === 'morale') {
      s.morale = clamp(s.morale + delta);
      continue;
    }
    if (key === 'stamina') {
      s.stamina = clamp(s.stamina + delta);
      continue;
    }
    if (key === 'energy') {
      s.energy = clamp(s.energy + delta);
      continue;
    }
    if (key === 'safetyRisk') {
      s.safetyRisk = clamp(s.safetyRisk + delta);
      continue;
    }
    if (key === 'reputation') {
      s.reputation = clamp(s.reputation + delta);
      continue;
    }
    if (key === 'salary') {
      s.salary = Math.max(0, s.salary + delta);
      continue;
    }
    if (key === 'certificates') {
      s.certificates = Math.max(0, s.certificates + delta);
      continue;
    }
    if (key === 'experience') {
      s.experience = Math.max(0, s.experience + delta);
      continue;
    }
    if (key === 'networkValue') {
      s.networkValue = Math.max(0, s.networkValue + delta);
      continue;
    }
  }

  s.project = p;
  return s;
}

export function randomExternalMomentThreshold(): number {
  return 4 + Math.floor(Math.random() * 8);
}

function prependLogs(state: GameState, entries: GameLog[]): GameState {
  return { ...state, logs: [...entries, ...state.logs].slice(0, MAX_LOGS) };
}

/** Main quarter transition - the heart of v2 game loop */
export function advanceToNextQuarter(prev: GameState): QuarterTransitionResult {
  if (prev.gamePhase !== 'PLAYING') {
    return { newState: prev, logs: [], sectionReviewDetail: null, isGameOver: false, isProjectComplete: false, annualReview: null };
  }

  const nextTotalQ = prev.totalQuarters + 1;
  const nextProjectQ = prev.project.quarterInProject + 1;
  const nextSeason = SEASONS[(nextTotalQ - 1) % 4]!;
  const nextWeather = rollSeasonWeather(nextSeason);
  const quarterlySalary = getQuarterlySalary(prev.careerStage);

  const sectionReviewDetail =
    prev.project.submittedSections > 0 ? computeSectionReview(prev.project.submittedSections) : null;
  const reviewDelta = sectionReviewDetail?.delta ?? {
    morale: 0,
    reputation: 0,
    salary: 0,
    completedSections: 0,
    stamina: 0,
    energy: 0,
    experience: 0,
    bossApproval: 0,
  };

  let newProject = {
    ...prev.project,
    quarterInProject: nextProjectQ,
    weather: nextWeather,
    submittedSections: 0,
    completedSections: prev.project.completedSections + reviewDelta.completedSections,
    bossApproval: clamp(prev.project.bossApproval + reviewDelta.bossApproval),
    materials: Math.max(0, prev.project.materials + 400),
    planProgress: prev.project.planProgress,
    safetyComplianceAlert: undefined,
    safetyMidPeriodHint: undefined,
    quarterNotice: undefined,
  };

  let newState: GameState = {
    ...prev,
    totalQuarters: nextTotalQ,
    season: nextSeason,
    actionsThisQuarter: 0,
    walksThisQuarter: 0,
    interactionsThisQuarter: [],
    pendingQuarterChoice: undefined,
    energy: clamp(prev.energy + reviewDelta.energy + 20),
    morale: clamp(prev.morale + reviewDelta.morale + 10),
    stamina: clamp(prev.stamina + reviewDelta.stamina + 10),
    reputation: clamp(prev.reputation + reviewDelta.reputation),
    salary: Math.max(0, prev.salary + reviewDelta.salary + quarterlySalary),
    lifetimeEarnings: prev.lifetimeEarnings + quarterlySalary,
    experience: prev.experience + reviewDelta.experience + 5,
    project: newProject,
  };

  for (const asset of newState.assets) {
    if (asset.effect.materialsGainPerQuarter) {
      newState.project = {
        ...newState.project,
        materials: newState.project.materials + asset.effect.materialsGainPerQuarter,
      };
    }
    if (asset.effect.salaryGainPerQuarter) {
      newState.salary += asset.effect.salaryGainPerQuarter;
    }
  }

  const availableAssets = ASSETS_LIBRARY.filter((a) => !newState.assets.some((o) => o.id === a.id));
  if (availableAssets.length > 0) {
    newState.project = {
      ...newState.project,
      pendingAssetOffer: availableAssets[Math.floor(Math.random() * availableAssets.length)],
      assetVendorTitle: pickRandomAssetVendorTitle(),
    };
  }

  if (prev.project.bossLastInteractedQuarter !== prev.totalQuarters) {
    newState.project = { ...newState.project, bossApproval: Math.max(0, newState.project.bossApproval - 5) };
  }

  newState.project = {
    ...newState.project,
    coworkers: newState.project.coworkers.map((c) => {
      if ((c.lastInteractedQuarter ?? 0) !== prev.totalQuarters) {
        return { ...c, favor: Math.max(0, c.favor - 4) };
      }
      return c;
    }),
  };

  const baseProgress = computeBaseQuarterProgress(newState.project);
  newState.project = {
    ...newState.project,
    progress: clamp(newState.project.progress + baseProgress),
  };

  const phaseResult = updateProjectPhase(newState.project);
  newState.project = phaseResult.project;

  const transitionLogs: GameLog[] = [];
  let isGameOver = false;

  transitionLogs.push({
    quarter: nextTotalQ,
    message: `本季度项目基础施工推进 +${Math.round(baseProgress)}% 进度。`,
    type: 'INFO',
  });

  const maxFavorCoworkers = newState.project.coworkers.filter(c => c.favor >= 100);
  if (maxFavorCoworkers.length > 0) {
    const buff = maxFavorCoworkers.length * 5;
    newState.morale = Math.min(100, newState.morale + buff);
    newState.stamina = Math.min(100, newState.stamina + buff);
    newState.energy = Math.min(100, newState.energy + buff);
    transitionLogs.push({
      quarter: nextTotalQ,
      message: `${maxFavorCoworkers.map(c => c.name).join('、')} 好感度满值！帮你顶班、请你吃饭、替你跑腿（心态 +${buff}，体力 +${buff}，精力 +${buff}）。`,
      type: 'SUCCESS',
    });
  }

  const scheduleStatus = checkScheduleStatus(newState.project);
  if (scheduleStatus === 'BEHIND') {
    newState.project = { ...newState.project, ownerSatisfaction: Math.max(0, newState.project.ownerSatisfaction - 5) };
    transitionLogs.push({
      quarter: nextTotalQ,
      message: '项目进度落后于计划工期，甲方开始施压。',
      type: 'WARNING',
    });
  } else if (scheduleStatus === 'AHEAD') {
    newState.project = { ...newState.project, ownerSatisfaction: Math.min(100, newState.project.ownerSatisfaction + 3) };
    transitionLogs.push({
      quarter: nextTotalQ,
      message: '项目进度超前，甲方非常满意。',
      type: 'SUCCESS',
    });
  }

  if (sectionReviewDetail) {
    transitionLogs.push({
      quarter: nextTotalQ,
      message: sectionReviewDetail.lines.join(' '),
      type:
        sectionReviewDetail.accepted > 0
          ? 'SUCCESS'
          : sectionReviewDetail.rejected > 0
            ? 'WARNING'
            : 'INFO',
    });
  }

  if (phaseResult.phaseChanged) {
    const phaseName = (() => {
      switch (newState.project.phase) {
        case 'PREP':
          return '进场准备';
        case 'FOUNDATION':
          return '基础施工';
        case 'MAIN':
          return '主体施工';
        case 'FINISHING':
          return '收尾验收';
      }
    })();
    transitionLogs.push({
      quarter: nextTotalQ,
      message: `项目进入新阶段：${phaseName}。工作重心和要求都将发生变化。`,
      type: 'SUCCESS',
    });
  }

  const wNote = weatherQuarterNote(newState.project.weather);
  if (wNote) {
    transitionLogs.push({ quarter: nextTotalQ, message: wNote, type: 'INFO' });
  }

  const ownerDelta = computeOwnerDelta(newState);
  newState.project = {
    ...newState.project,
    ownerSatisfaction: clamp(newState.project.ownerSatisfaction + ownerDelta),
  };

  const ownerBonus = getOwnerBonusSalary(newState.project.ownerSatisfaction);
  newState.salary = Math.max(0, newState.salary + ownerBonus);
  if (ownerBonus !== 0) {
    transitionLogs.push({
      quarter: nextTotalQ,
      message:
        ownerBonus > 0
          ? `甲方满意度结算：履约奖 ¥${ownerBonus}。`
          : `甲方满意度偏低，扣款 ¥${-ownerBonus}。`,
      type: ownerBonus > 0 ? 'SUCCESS' : 'WARNING',
    });
  }

  if (newState.morale <= 0 || newState.stamina <= 0 || newState.energy <= 0 || newState.reputation <= 0) {
    isGameOver = true;
    newState.gamePhase = 'ENDING';
    newState.endingType = 'BURNOUT';
    transitionLogs.push({
      quarter: nextTotalQ,
      message:
        newState.energy <= 0
          ? '精力彻底见底，你决定放自己一个长假。'
          : newState.reputation <= 0
            ? '口碑跌到尘埃，行业内已经没人愿意带你。'
            : '心态和体力同时告急，你收拾行李离开了工地。',
      type: 'DANGER',
    });
  }

  if (!isGameOver && newState.safetyRisk >= 100) {
    isGameOver = true;
    newState.gamePhase = 'ENDING';
    newState.endingType = 'SAFETY_ACCIDENT';
    transitionLogs.push({
      quarter: nextTotalQ,
      message: '重大安全事故发生，停工令下达，你被列入责任追查名单。',
      type: 'DANGER',
    });
  }

  let projectComplete = false;
  if (!isGameOver && isProjectComplete(newState.project)) {
    const quartersUsed = newState.project.quarterInProject;
    const planned = newState.project.totalQuarters;
    const earlyBy = planned - quartersUsed;
    newState = enterTransferPeriod(newState);
    projectComplete = true;

    if (earlyBy > 0) {
      const earlyBonus = earlyBy * 3000;
      newState.salary += earlyBonus;
      newState.lifetimeEarnings += earlyBonus;
      newState.reputation = Math.min(100, newState.reputation + earlyBy * 3);
      transitionLogs.push({
        quarter: nextTotalQ,
        message: `${prev.project.name} 提前 ${earlyBy} 个季度竣工！获得提前竣工奖金 ¥${earlyBonus}，口碑大幅提升！`,
        type: 'SUCCESS',
      });
    } else if (earlyBy < 0) {
      const penaltyPerQ = 2000;
      const penalty = Math.abs(earlyBy) * penaltyPerQ;
      newState.salary = Math.max(0, newState.salary - penalty);
      newState.reputation = Math.max(0, newState.reputation - Math.abs(earlyBy) * 2);
      transitionLogs.push({
        quarter: nextTotalQ,
        message: `${prev.project.name} 延期 ${Math.abs(earlyBy)} 个季度完工，扣除违约金 ¥${penalty}，甲方满意度下降。`,
        type: 'WARNING',
      });
    } else {
      transitionLogs.push({
        quarter: nextTotalQ,
        message: `${prev.project.name} 按期竣工，进入转场评估期。`,
        type: 'SUCCESS',
      });
    }
  }

  if (!isGameOver && !projectComplete && Math.random() < 0.35) {
    newState.pendingQuarterChoice = pickRandomQuarterChoice(newState.project.phase);
  }

  const yearNum = Math.ceil(nextTotalQ / 4);
  transitionLogs.push({
    quarter: nextTotalQ,
    message: `进入第 ${yearNum} 年 ${nextSeason}，${newState.project.name}（${BRAND.short}）。本季工资到账。`,
    type: 'INFO',
  });

  let annualReview: AnnualReviewResult | null = null;
  if (!isGameOver && isAnnualReviewQuarter(nextTotalQ)) {
    const reviewResult = performAnnualReview(newState);
    annualReview = reviewResult;
    newState = reviewResult.newState;
    for (const line of reviewResult.narrativeLines) {
      transitionLogs.push({ quarter: nextTotalQ, message: line, type: reviewResult.performanceGrade === 'D' ? 'WARNING' : 'SUCCESS' });
    }
  }

  const discoveryResult = checkHiddenActionDiscovery(newState, nextTotalQ);
  newState = discoveryResult.state;
  transitionLogs.push(...discoveryResult.logs);

  newState = prependLogs(newState, transitionLogs);

  return {
    newState,
    logs: transitionLogs,
    sectionReviewDetail,
    isGameOver,
    isProjectComplete: projectComplete,
    annualReview,
  };
}

interface DiscoveryCondition {
  actionId: string;
  check: (s: GameState) => boolean;
}

const DISCOVERY_CONDITIONS: DiscoveryCondition[] = [
  { actionId: 'civil_exam_prep', check: (s) => s.totalQuarters >= 4 && s.careerStage >= 1 && Math.random() < 0.4 },
  { actionId: 'grad_exam_prep', check: (s) => s.totalQuarters >= 2 && s.careerStage <= 1 && Math.random() < 0.35 },
  { actionId: 'self_learn_coding', check: (s) => s.totalQuarters >= 3 && Math.random() < 0.3 },
  { actionId: 'mba_night_school', check: (s) => s.careerStage >= 2 && s.totalQuarters >= 8 && Math.random() < 0.5 },
];

function checkHiddenActionDiscovery(state: GameState, quarter: number): { state: GameState; logs: GameLog[] } {
  const logs: GameLog[] = [];
  const discovered = new Set(state.discoveredActions ?? []);
  for (const cond of DISCOVERY_CONDITIONS) {
    if (discovered.has(cond.actionId)) continue;
    if (!cond.check(state)) continue;
    const action = ACTIONS.find(a => a.id === cond.actionId);
    if (!action) continue;
    discovered.add(cond.actionId);
    logs.push({
      quarter,
      message: action.discoveryHint ?? `你发现了新的可能性：${action.label}。`,
      type: 'SUCCESS',
    });
  }
  if (discovered.size !== (state.discoveredActions ?? []).length) {
    return { state: { ...state, discoveredActions: [...discovered] }, logs };
  }
  return { state, logs };
}

function computeOwnerDelta(state: GameState): number {
  let delta = 0;
  if (state.project.progress > 60) delta += 2;
  if (state.project.progress > 80) delta += 3;
  if (state.safetyRisk > 50) delta -= 3;
  if (state.safetyRisk > 80) delta -= 5;
  delta += state.project.completedSections * 1;
  if (state.reputation > 60) delta += 1;
  return delta;
}

function getOwnerBonusSalary(satisfaction: number): number {
  if (satisfaction >= 90) return 2000;
  if (satisfaction >= 70) return 1000;
  if (satisfaction >= 50) return 500;
  if (satisfaction >= 30) return 0;
  return -500;
}
