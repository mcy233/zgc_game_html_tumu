import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence } from 'motion/react';

import { BRAND_GAME_TITLE } from './config/branding';
import { scanNewHonorIds, PROFILE_HONOR_BY_ID, listUnlockedHonorsOrdered, resolveHomeHeadlineTitle } from './data/honors';
import { TUTORIAL_STEPS } from './data/narrativeTexts/onboarding';
import { getCareerTitle } from './data/careerPaths';
import { getAvailableProjectTypes, phaseLabel } from './data/projectTemplates';
import { getAvailableLifeChoices } from './data/lifeChoices';
import {
  checkPromotionEligibility,
  getActionsPerQuarter,
  getPromotionNarrative,
  getQuarterlySalary,
  getStageChangeEffects,
} from './engine/promotionSystem';
import type { SectionReviewDetail } from './engine/quarterTransition';
import type { ProjectScore } from './engine/projectManager';
import type { Action, CareerTrack } from './types/index';

import { useLayout } from './hooks/useLayout';
import { useGameState } from './hooks/useGameState';
import { useModals } from './hooks/useModals';
import { useConstructionGameHandlers, type ActionExecutionInterceptor } from './hooks/useConstructionGameHandlers';
import { effectStatLabel, formatEffectDisplayValue } from './utils/format';
import { formatAssetEffectLines } from './data/assets';

import { QuarterSummaryModal } from './components/modals/QuarterSummaryModal';
import { ChoiceModal } from './components/modals/ChoiceModal';
import { GameOverModal } from './components/modals/GameOverModal';
import { WarningModal } from './components/modals/WarningModal';
import { AssetOfferModal } from './components/modals/AssetOfferModal';
import { HonorUnlockModal } from './components/modals/HonorUnlockModal';
import { TransferModal } from './components/modals/TransferModal';
import { PromotionModal } from './components/modals/PromotionModal';
import { LifeChoiceModal } from './components/modals/LifeChoiceModal';
import { ProjectScoreModal } from './components/modals/ProjectScoreModal';
import { TopBar } from './components/layout/TopBar';
import { BottomNav } from './components/layout/BottomNav';
import { ProfilePanel } from './components/panels/ProfilePanel';
import { EventModal } from './components/modals/EventModal';
import { SiteLoginScreen } from './components/screens/SiteLoginScreen';
import { CenterMainPanel } from './components/game/CenterMainPanel';
import { RightFeedColumn } from './components/game/RightFeedColumn';
import { GuideAndSettingsModals } from './components/modals/GuideAndSettingsModals';
import { mainTaskHintHtml, pickSchool } from './app/gameFlowHelpers';
import { buildEmailFromDisplayName, buildRandomOfficeRoom, generateRandomPlayerName } from './playerName';
import { generateFirstProject } from './engine/projectManager';
import { createInitialState } from './config/initialState';
import { SEASONS } from './config/gameConfig';
import { FloatingNumbers } from './systems/animation/FloatingNumbers';
import { QuarterTransitionOverlay } from './systems/animation/QuarterTransitionOverlay';
import { useFloatingNumbers } from './systems/animation/useFloatingNumber';
import { WeatherParticles, weatherTypeToParticlesWeather } from './systems/animation/WeatherParticles';
import { isFeatureEnabled } from './systems/featureFlags';
import { MinigameHost } from './systems/minigame/MinigameHost';
import { getMinigameForAction } from './systems/minigame/registry';
import type { MinigameConfig, MinigameResult } from './systems/minigame/types';
import { gameAudioBus } from './systems/audio/AudioManager';
import { useGameAudio } from './systems/audio/useGameAudio';
import { useTheme } from './systems/theme/useTheme';
import { pickActionScenario, type ActionScenario, type ScenarioChoice } from './data/actionScenarios';
import { ActionScenarioModal } from './components/modals/ActionScenarioModal';
import type { AnnualReviewResult } from './engine/annualReview';
import { AnnualReviewModal } from './components/modals/AnnualReviewModal';

type FloatStatSnapshot = {
  morale: number;
  stamina: number;
  energy: number;
  safetyRisk: number;
  salary: number;
  experience: number;
  networkValue: number;
  certificates: number;
  reputation: number;
  materials: number;
  progress: number;
  planProgress: number;
};

export default function App() {
  const { state, setState, addLog } = useGameState();
  const { activeTab, setActiveTab, rightTab, setRightTab, layoutZone, setLayoutZone } = useLayout();
  const modals = useModals();
  const { mode: themeMode, resolvedTheme, setMode: setThemeMode } = useTheme();

  useGameAudio(state, modals);

  const onToggleTheme = useCallback(() => {
    setThemeMode(resolvedTheme === 'light' ? 'dark' : 'light');
  }, [resolvedTheme, setThemeMode]);

  const [sessionReady, setSessionReady] = useState(false);
  const [loginNameInput, setLoginNameInput] = useState('');
  const [selectedTrack, setSelectedTrack] = useState<CareerTrack>('TECH');
  const [isLoading, setIsLoading] = useState(false);
  const [sectionReviewDetail, setSectionReviewDetail] = useState<SectionReviewDetail | null>(null);
  const [warningMessage, setWarningMessage] = useState('');
  const [projectScore, setProjectScore] = useState<ProjectScore | null>(null);
  const [showSurvivalGuide, setShowSurvivalGuide] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [tutorialIndex, setTutorialIndex] = useState(0);
  const [showSettingsShell, setShowSettingsShell] = useState(false);
  const [summaryMainTaskHtml, setSummaryMainTaskHtml] = useState<string | null>(null);
  const [showQuarterTransition, setShowQuarterTransition] = useState(false);
  const [annualReviewResult, setAnnualReviewResult] = useState<AnnualReviewResult | null>(null);
  const [activeMinigame, setActiveMinigame] = useState<MinigameConfig | null>(null);
  const [pendingActionForMinigame, setPendingActionForMinigame] = useState<Action | null>(null);
  const pendingMinigameActionRef = useRef<Action | null>(null);

  const [activeScenario, setActiveScenario] = useState<ActionScenario | null>(null);
  const [scenarioActionLabel, setScenarioActionLabel] = useState('');
  const pendingScenarioActionRef = useRef<Action | null>(null);

  const clearMinigameSession = useCallback(() => {
    pendingMinigameActionRef.current = null;
    setPendingActionForMinigame(null);
    setActiveMinigame(null);
  }, []);

  const interceptActionExecution = useCallback<ActionExecutionInterceptor>((action, _run) => {
    const scenario = pickActionScenario(action.id);
    if (scenario) {
      pendingScenarioActionRef.current = action;
      setScenarioActionLabel(action.label);
      setActiveScenario(scenario);
      return true;
    }
    if (!isFeatureEnabled('enableMinigames')) return false;
    const config = getMinigameForAction(action.id);
    if (!config) return false;
    pendingMinigameActionRef.current = action;
    setPendingActionForMinigame(action);
    setActiveMinigame(config);
    return true;
  }, []);

  const handlers = useConstructionGameHandlers(
    state,
    setState,
    addLog,
    modals,
    isLoading,
    setIsLoading,
    setSectionReviewDetail,
    setWarningMessage,
    setProjectScore,
    interceptActionExecution,
    setAnnualReviewResult
  );

  const onScenarioChoose = useCallback((choice: ScenarioChoice) => {
    const a = pendingScenarioActionRef.current;
    setActiveScenario(null);
    pendingScenarioActionRef.current = null;
    if (!a) return;
    const mod: Record<string, unknown> = { ...a };
    for (const [key, delta] of Object.entries(choice.modifiers)) {
      const current = mod[key];
      if (typeof current === 'number') {
        mod[key] = current + (delta as number);
      } else if (current === undefined && typeof delta === 'number') {
        mod[key] = delta;
      }
    }
    mod.description = choice.narrative;
    handlers.handleAction(mod as unknown as Action, true, { skipIntercept: true });
  }, [handlers]);

  const onMinigameSkip = useCallback(() => {
    const a = pendingMinigameActionRef.current;
    clearMinigameSession();
    if (a) handlers.handleAction(a, true, { skipIntercept: true });
  }, [handlers, clearMinigameSession]);

  const onMinigameComplete = useCallback(
    (result: MinigameResult) => {
      const a = pendingMinigameActionRef.current;
      clearMinigameSession();
      if (!a) return;
      const scaled: Action = {
        ...a,
        experienceGain:
          a.experienceGain != null ? Math.round(a.experienceGain * result.bonusMultiplier) : undefined,
        certificateGain:
          a.certificateGain != null ? Math.round(a.certificateGain * result.bonusMultiplier) : undefined,
      };
      handlers.handleAction(scaled, true, { skipIntercept: true });
    },
    [handlers, clearMinigameSession]
  );

  const { items: floatingNumberItems, spawn: spawnFloatingNumber } = useFloatingNumbers();
  const prevFloatStatsRef = useRef<FloatStatSnapshot | null>(null);

  const honorPopupQueueRef = useRef<{ popupTitle: string; unlockBody: string }[]>([]);
  const [honorPopup, setHonorPopup] = useState<{ popupTitle: string; unlockBody: string } | null>(null);
  const prevUnlockedHonorsRef = useRef<string[]>([...state.unlockedHonors]);
  const lastSeenTopMomentIdRef = useRef<string | null>(null);

  const hasUnreadMoments = state.moments.length > 0 && state.moments[0]!.id !== lastSeenTopMomentIdRef.current;

  const unlockedHonorsSorted = useMemo(
    () => listUnlockedHonorsOrdered(state),
    [state.unlockedHonors, state.honorUnlockOrder]
  );
  const honorWallItems = useMemo(
    () => unlockedHonorsSorted.map(h => ({ id: h.id, headlineTitle: h.headlineTitle, unlockBody: h.unlockBody })),
    [unlockedHonorsSorted]
  );

  const careerTitle = getCareerTitle(state.careerTrack, state.careerStage);
  const actionsPerQuarter = getActionsPerQuarter(state.careerStage);

  const summaryModalWasOpenRef = useRef(false);
  useLayoutEffect(() => {
    if (modals.isSummaryModalOpen && !summaryModalWasOpenRef.current) {
      setSummaryMainTaskHtml(mainTaskHintHtml(state));
    }
    if (!modals.isSummaryModalOpen) setSummaryMainTaskHtml(null);
    summaryModalWasOpenRef.current = modals.isSummaryModalOpen;
  }, [modals.isSummaryModalOpen, state]);

  useEffect(() => {
    if (rightTab === 'MOMENTS' && state.moments[0]) {
      lastSeenTopMomentIdRef.current = state.moments[0]!.id;
    }
  }, [rightTab, state.moments]);

  useEffect(() => {
    if (!sessionReady) {
      prevFloatStatsRef.current = null;
      return;
    }

    const cur: FloatStatSnapshot = {
      morale: state.morale,
      stamina: state.stamina,
      energy: state.energy,
      safetyRisk: state.safetyRisk,
      salary: state.salary,
      experience: state.experience,
      networkValue: state.networkValue,
      certificates: state.certificates,
      reputation: state.reputation,
      materials: state.project.materials,
      progress: state.project.progress,
      planProgress: state.project.planProgress,
    };

    if (!isFeatureEnabled('enableFloatingNumbers')) {
      prevFloatStatsRef.current = cur;
      return;
    }

    if (prevFloatStatsRef.current === null) {
      prevFloatStatsRef.current = cur;
      return;
    }

    const prev = prevFloatStatsRef.current;
    prevFloatStatsRef.current = cur;

    const emit = (delta: number, label: string, anchorId: string) => {
      if (delta !== 0) spawnFloatingNumber(delta, label, anchorId);
    };

    emit(cur.morale - prev.morale, '心态', 'ff-stat-morale');
    emit(cur.stamina - prev.stamina, '体力', 'ff-stat-stamina');
    emit(cur.energy - prev.energy, '精力', 'ff-stat-energy');
    emit(cur.safetyRisk - prev.safetyRisk, '隐患', 'ff-stat-safety');
    emit(cur.salary - prev.salary, '工资', 'ff-stat-salary');
    emit(cur.experience - prev.experience, '经验', 'ff-stat-experience');
    emit(cur.networkValue - prev.networkValue, '人脉', 'ff-stat-network');
    emit(cur.certificates - prev.certificates, '证书', 'ff-stat-certificates');
    emit(cur.reputation - prev.reputation, '口碑', 'ff-stat-reputation');
    emit(cur.materials - prev.materials, '物资', 'ff-stat-materials');
    emit(cur.progress - prev.progress, '阶段进度', 'ff-stat-progress');
    emit(cur.planProgress - prev.planProgress, '方案进度', 'ff-stat-plan');
  }, [
    sessionReady,
    spawnFloatingNumber,
    state.morale,
    state.stamina,
    state.energy,
    state.safetyRisk,
    state.salary,
    state.experience,
    state.networkValue,
    state.certificates,
    state.reputation,
    state.project.materials,
    state.project.progress,
    state.project.planProgress,
  ]);

  // Honor scanning
  useEffect(() => {
    setState(prev => {
      const ids = scanNewHonorIds(prev);
      if (ids.length === 0) return prev;
      const prevOrder = prev.honorUnlockOrder ?? [];
      const orderAdd = ids.filter(id => !prevOrder.includes(id));
      return {
        ...prev,
        unlockedHonors: [...new Set([...prev.unlockedHonors, ...ids])],
        honorUnlockOrder: [...prevOrder, ...orderAdd],
      };
    });
  }, [
    setState, state.totalQuarters, state.careerStage, state.totalProjectsCompleted,
    state.reputation, state.certificates, state.experience, state.networkValue,
    state.morale, state.safetyRisk, state.salary,
  ]);

  useEffect(() => {
    const prev = prevUnlockedHonorsRef.current;
    const added = state.unlockedHonors.filter(id => !prev.includes(id));
    prevUnlockedHonorsRef.current = state.unlockedHonors;
    for (const id of added) {
      const h = PROFILE_HONOR_BY_ID[id];
      if (h) honorPopupQueueRef.current.push({ popupTitle: h.popupTitle, unlockBody: h.unlockBody });
    }
  }, [state.unlockedHonors]);

  useEffect(() => {
    if (honorPopup) return;
    if (activeMinigame) return;
    if (modals.isEventModalOpen || modals.isSummaryModalOpen || modals.isQuarterChoiceOpen ||
        modals.isGameOver || modals.isWarningModalOpen || modals.isAssetOfferModalOpen ||
        modals.isTransferModalOpen || modals.isPromotionModalOpen || modals.isLifeChoiceModalOpen ||
        modals.isProjectScoreModalOpen) return;
    const next = honorPopupQueueRef.current[0];
    if (!next) return;
    const t = setTimeout(() => { honorPopupQueueRef.current.shift(); setHonorPopup(next); }, 400);
    return () => clearTimeout(t);
  }, [honorPopup, activeMinigame, modals.isEventModalOpen, modals.isSummaryModalOpen, modals.isQuarterChoiceOpen,
      modals.isGameOver, modals.isWarningModalOpen, modals.isAssetOfferModalOpen,
      modals.isTransferModalOpen, modals.isPromotionModalOpen, modals.isLifeChoiceModalOpen,
      modals.isProjectScoreModalOpen, state.unlockedHonors]);

  useEffect(() => {
    if (!showTutorial) return;
    const step = TUTORIAL_STEPS[tutorialIndex];
    if (!step) return;
    if (step.layoutZone) setLayoutZone(step.layoutZone);
    if (step.activeTab) setActiveTab(step.activeTab);
    if (step.rightTab) setRightTab(step.rightTab);
  }, [showTutorial, tutorialIndex, setLayoutZone, setActiveTab, setRightTab]);

  const dismissHonorPopup = useCallback(() => {
    const next = honorPopupQueueRef.current.shift();
    setHonorPopup(next ?? null);
  }, []);

  const handleBeginNextQuarter = useCallback(() => {
    if (isLoading || modals.isGameOver || state.gamePhase !== 'PLAYING') return;
    gameAudioBus.emit('quarter_advance');
    if (!isFeatureEnabled('enableQuarterTransition')) {
      handlers.nextQuarter();
      return;
    }
    setShowQuarterTransition(true);
  }, [handlers, isLoading, modals.isGameOver, state.gamePhase]);

  const onQuarterTransitionComplete = useCallback(() => {
    setShowQuarterTransition(false);
    handlers.nextQuarter();
  }, [handlers]);

  const drawNameFromLot = () => setLoginNameInput(generateRandomPlayerName().trim().slice(0, 24));

  const commitPlayerLogin = () => {
    const raw = loginNameInput.trim().slice(0, 24);
    if (!raw) return;
    const initial = createInitialState(selectedTrack);
    setState({
      ...initial,
      signatureQuoteSeed: Math.floor(Math.random() * 0xffffffff) >>> 0,
      project: generateFirstProject(0),
      playerName: raw,
      playerContactEmail: buildEmailFromDisplayName(raw),
      playerOfficeRoom: buildRandomOfficeRoom(),
      playerEducation: pickSchool(),
    });
    setSessionReady(true);
  };

  const disabledPlay = !sessionReady || modals.isGameOver || state.gamePhase !== 'PLAYING';
  const tutorialNext = () => {
    if (tutorialIndex + 1 >= TUTORIAL_STEPS.length) setShowTutorial(false);
    else setTutorialIndex(i => i + 1);
  };

  return (
    <div className="relative min-h-dvh min-h-[100svh] flex flex-col bg-[#F0F2F5] dark:bg-gray-950 text-[#1A1A1A] dark:text-gray-100 font-sans selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black">
      {/* Layer 1: Weather canvas (z-5) – sits above page bg, below all panels */}
      {sessionReady && isFeatureEnabled('enableWeatherParticles') && (
        <WeatherParticles weather={weatherTypeToParticlesWeather(state.project.weather)} />
      )}

      <FloatingNumbers items={floatingNumberItems} />
      {isFeatureEnabled('enableQuarterTransition') && (
        <QuarterTransitionOverlay
          show={showQuarterTransition}
          seasonLabel={SEASONS[state.totalQuarters % 4]!}
          onComplete={onQuarterTransitionComplete}
        />
      )}
      {!sessionReady && (
        <SiteLoginScreen
          loginNameInput={loginNameInput}
          setLoginNameInput={setLoginNameInput}
          selectedTrack={selectedTrack}
          setSelectedTrack={setSelectedTrack}
          onDrawName={drawNameFromLot}
          onCommit={commitPlayerLogin}
        />
      )}

      <TopBar
        gameTitle={BRAND_GAME_TITLE}
        season={state.season}
        totalQuarters={state.totalQuarters}
        projectName={state.project.name}
        careerTitle={careerTitle}
        projectPhase={phaseLabel(state.project.phase)}
        weather={state.project.weather}
        onOpenSettings={() => setShowSettingsShell(true)}
        onOpenSurvivalGuide={() => setShowSurvivalGuide(true)}
        onStartTutorial={() => { setTutorialIndex(0); setShowTutorial(true); }}
        onOpenLLMSettings={() => modals.setShowLLMSettings(true)}
        themeMode={themeMode}
        onToggleTheme={onToggleTheme}
      />

      <div className="relative z-10 flex-1 flex flex-col min-h-0 w-full max-w-7xl mx-auto lg:px-6 pb-[calc(4.15rem+env(safe-area-inset-bottom,0px))] lg:pb-0">
        <main className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 lg:gap-8 gap-0 px-3 sm:px-4 lg:px-0 py-3 lg:py-6 w-full min-w-0">
          <div
            id="onb-archive-column"
            className={`flex flex-col gap-4 sm:gap-6 lg:col-span-3 min-h-0 overflow-y-auto lg:overflow-visible scrollbar-hide ${
              layoutZone !== 'ARCHIVE' ? 'max-lg:hidden' : ''
            }`}
          >
            <ProfilePanel
              state={state}
              disabled={disabledPlay}
              onWorkWalk={handlers.onWorkWalk}
              onDormRest={handlers.onDormRest}
              onOuting={handlers.onOuting}
              onWithdrawSubmit={handlers.onWithdrawSubmit}
            />
          </div>

          <CenterMainPanel
            state={state}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            layoutZone={layoutZone}
            disabledPlay={disabledPlay}
            headlineTitle={resolveHomeHeadlineTitle(state)}
            onAction={handlers.handleAction}
            onBossInteraction={handlers.runBossInteraction}
            onCoworkerInteraction={handlers.runCoworkerInteraction}
            onSellAsset={handlers.sellAsset}
          />

          <RightFeedColumn
            state={state}
            layoutZone={layoutZone}
            rightTab={rightTab}
            setRightTab={setRightTab}
            honorWallItems={honorWallItems}
            logs={state.logs}
            hasUnreadMoments={hasUnreadMoments}
            onMomentInteract={handlers.handleMomentInteract}
            sessionReady={sessionReady}
            isLoading={isLoading || showQuarterTransition}
            isGameOver={modals.isGameOver}
            onNextQuarter={handleBeginNextQuarter}
          />
        </main>
      </div>

      <BottomNav
        layoutZone={layoutZone}
        setLayoutZone={setLayoutZone}
        hasUnreadMoments={hasUnreadMoments}
        actionsRemaining={actionsPerQuarter - state.actionsThisQuarter}
        actionsTotal={actionsPerQuarter}
        isLoading={isLoading || showQuarterTransition}
        isGameOver={modals.isGameOver}
        onNextQuarter={handleBeginNextQuarter}
        sessionReady={sessionReady}
      />

      <EventModal
        open={modals.isEventModalOpen}
        event={modals.currentEvent}
        onClose={() => modals.setIsEventModalOpen(false)}
      />

      <AnimatePresence>
        {modals.isSummaryModalOpen && (
          <QuarterSummaryModal
            state={state}
            paperReviewDetail={sectionReviewDetail}
            mainTaskHtml={summaryMainTaskHtml}
            onClose={handlers.closeQuarterSummary}
            effectStatLabel={effectStatLabel}
            formatEffectDisplayValue={formatEffectDisplayValue}
          />
        )}
      </AnimatePresence>

      <ChoiceModal
        open={modals.isQuarterChoiceOpen}
        choice={state.pendingQuarterChoice ?? null}
        onSelect={handlers.applyQuarterChoiceOption}
      />

      <GameOverModal open={modals.isGameOver} state={state} />

      <WarningModal
        open={modals.isWarningModalOpen}
        message={warningMessage}
        onConfirm={handlers.confirmWarning}
        onCancel={() => { modals.setIsWarningModalOpen(false); handlers.pendingActionRef.current = null; }}
      />

      <AssetOfferModal
        open={modals.isAssetOfferModalOpen}
        asset={state.project.pendingAssetOffer ?? null}
        vendorTitle={state.project.assetVendorTitle}
        playerSalary={state.salary}
        onBuy={handlers.buyAsset}
        onDecline={handlers.declineAssetOffer}
        formatAssetEffectLines={formatAssetEffectLines}
      />

      <ProjectScoreModal
        open={modals.isProjectScoreModalOpen}
        score={projectScore}
        projectName={state.project.name}
        onContinue={handlers.openTransferPanel}
      />

      <PromotionModal
        open={modals.isPromotionModalOpen}
        promotionCheck={checkPromotionEligibility(state)}
        promotionNarrative={modals.isPromotionModalOpen ? getPromotionNarrative(state) : null}
        stageChangeEffects={
          modals.isPromotionModalOpen
            ? getStageChangeEffects(state.careerStage, state.careerStage + 1, state.careerTrack)
            : []
        }
        salaryQuarterlyBefore={getQuarterlySalary(state.careerStage)}
        salaryQuarterlyAfter={getQuarterlySalary(state.careerStage + 1)}
        onAccept={handlers.acceptPromotion}
        onDecline={handlers.declinePromotion}
      />

      <TransferModal
        open={modals.isTransferModalOpen}
        availableTypes={getAvailableProjectTypes(state.careerStage, state.currentProjectIndex + 1)}
        careerTitle={careerTitle}
        onSelectProject={handlers.selectNextProject}
        onOpenLifeChoices={handlers.openLifeChoices}
      />

      <LifeChoiceModal
        open={modals.isLifeChoiceModalOpen}
        choices={getAvailableLifeChoices(state)}
        careerTitle={careerTitle}
        onSelect={handlers.applyLifeChoice}
        onCancel={() => { modals.setIsLifeChoiceModalOpen(false); modals.setIsTransferModalOpen(true); }}
      />

      <HonorUnlockModal popup={honorPopup} onDismiss={dismissHonorPopup} />

      <GuideAndSettingsModals
        showSurvivalGuide={showSurvivalGuide}
        onCloseSurvival={() => setShowSurvivalGuide(false)}
        showTutorial={showTutorial}
        tutorialIndex={tutorialIndex}
        onCloseTutorial={() => setShowTutorial(false)}
        onTutorialNext={tutorialNext}
        showSettingsShell={showSettingsShell}
        onCloseSettings={() => setShowSettingsShell(false)}
        showLLMSettings={modals.showLLMSettings}
        onCloseLLM={() => modals.setShowLLMSettings(false)}
      />

      <AnnualReviewModal
        open={!!annualReviewResult}
        result={annualReviewResult}
        onClose={() => setAnnualReviewResult(null)}
      />

      <ActionScenarioModal
        open={!!activeScenario}
        scenario={activeScenario}
        actionLabel={scenarioActionLabel}
        onChoose={onScenarioChoose}
      />

      <MinigameHost config={activeMinigame} onComplete={onMinigameComplete} onSkip={onMinigameSkip} />
    </div>
  );
}
