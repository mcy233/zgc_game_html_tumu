import { useState, useCallback } from 'react';
import type { GameState, GameLog, Moment, CareerTrack } from '../types/index';
import { createInitialState } from '../config/initialState';
import { generateFirstProject } from '../engine/projectManager';

const MAX_LOGS = 50;
const MAX_MOMENTS = 120;

export function useGameState() {
  const [state, setState] = useState<GameState>(() => {
    const initial = createInitialState('TECH');
    return {
      ...initial,
      signatureQuoteSeed: Math.floor(Math.random() * 0xffffffff) >>> 0,
      project: generateFirstProject(0),
    };
  });

  const addLog = useCallback((message: string, type: GameLog['type'] = 'INFO') => {
    setState((prev) => ({
      ...prev,
      logs: [{ quarter: prev.totalQuarters, message, type }, ...prev.logs].slice(0, MAX_LOGS),
    }));
  }, []);

  const addMoment = useCallback((moment: Moment) => {
    setState((prev) => ({
      ...prev,
      moments: [moment, ...prev.moments].slice(0, MAX_MOMENTS),
    }));
  }, []);

  const resetGame = useCallback((track: CareerTrack) => {
    const initial = createInitialState(track);
    setState({
      ...initial,
      signatureQuoteSeed: Math.floor(Math.random() * 0xffffffff) >>> 0,
      project: generateFirstProject(0),
    });
  }, []);

  return { state, setState, addLog, addMoment, resetGame };
}
