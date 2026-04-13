import { useEffect, useRef } from 'react';
import type { GameState } from '../../types/gameState';
import { gameAudioBus } from './AudioManager';

export interface GameAudioModals {
  isEventModalOpen: boolean;
  isSummaryModalOpen: boolean;
  isQuarterChoiceOpen: boolean;
  isWarningModalOpen: boolean;
  isAssetOfferModalOpen: boolean;
  isTransferModalOpen: boolean;
  isPromotionModalOpen: boolean;
  isLifeChoiceModalOpen: boolean;
  isProjectScoreModalOpen: boolean;
  isGameOver: boolean;
  showLLMSettings: boolean;
}

const MODAL_KEYS: (keyof GameAudioModals)[] = [
  'isEventModalOpen',
  'isSummaryModalOpen',
  'isQuarterChoiceOpen',
  'isWarningModalOpen',
  'isAssetOfferModalOpen',
  'isTransferModalOpen',
  'isPromotionModalOpen',
  'isLifeChoiceModalOpen',
  'isProjectScoreModalOpen',
  'showLLMSettings',
];

export function useGameAudio(state: GameState, modals: GameAudioModals): void {
  const mountedRef = useRef(false);
  const prevModalsRef = useRef<GameAudioModals | null>(null);
  const prevGameOverRef = useRef(modals.isGameOver);
  const prevCareerStageRef = useRef(state.careerStage);
  const prevHonorsRef = useRef<string[]>([...state.unlockedHonors]);
  const careerAudioReadyRef = useRef(false);
  const honorAudioReadyRef = useRef(false);

  useEffect(() => {
    const prev = prevModalsRef.current;
    prevModalsRef.current = { ...modals };

    if (!mountedRef.current) {
      mountedRef.current = true;
      prevGameOverRef.current = modals.isGameOver;
      return;
    }

    if (prev) {
      const goWas = prevGameOverRef.current;
      const goNow = modals.isGameOver;
      if (!goWas && goNow) {
        gameAudioBus.emit('game_over');
      }
      prevGameOverRef.current = goNow;

      for (const key of MODAL_KEYS) {
        const was = prev[key];
        const now = modals[key];
        if (!was && now) {
          gameAudioBus.emit('modal_open');
        } else if (was && !now) {
          gameAudioBus.emit('modal_close');
        }
      }
    }
  }, [
    modals.isEventModalOpen,
    modals.isSummaryModalOpen,
    modals.isQuarterChoiceOpen,
    modals.isWarningModalOpen,
    modals.isAssetOfferModalOpen,
    modals.isTransferModalOpen,
    modals.isPromotionModalOpen,
    modals.isLifeChoiceModalOpen,
    modals.isProjectScoreModalOpen,
    modals.isGameOver,
    modals.showLLMSettings,
  ]);

  useEffect(() => {
    if (!careerAudioReadyRef.current) {
      careerAudioReadyRef.current = true;
      prevCareerStageRef.current = state.careerStage;
      return;
    }
    const prev = prevCareerStageRef.current;
    if (state.careerStage > prev) {
      gameAudioBus.emit('promotion');
    }
    prevCareerStageRef.current = state.careerStage;
  }, [state.careerStage]);

  useEffect(() => {
    if (!honorAudioReadyRef.current) {
      honorAudioReadyRef.current = true;
      prevHonorsRef.current = [...state.unlockedHonors];
      return;
    }
    const prev = new Set(prevHonorsRef.current);
    const added = state.unlockedHonors.filter((id) => !prev.has(id));
    prevHonorsRef.current = [...state.unlockedHonors];
    if (added.length > 0) {
      gameAudioBus.emit('achievement');
    }
  }, [state.unlockedHonors]);
}
