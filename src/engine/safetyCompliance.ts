import type { GameState, GameLog } from '../types/index';
import { SAFETY_REQUIRED_PER_PERIOD } from '../config/gameConfig';

export interface SafetyCheckResult {
  newState: GameState;
  logs: GameLog[];
  isGameOver: boolean;
}

export function checkSafetyCompliance(state: GameState): SafetyCheckResult {
  const logs: GameLog[] = [];
  let isGameOver = false;
  let newProject = { ...state.project };
  let newState = { ...state, project: newProject };

  const qi = newProject.quarterInProject;
  // Check every 2 project quarters (at qi = 2, 4, 6, 8...)
  if (qi < 2 || qi % 2 !== 0) {
    return { newState: state, logs, isGameOver };
  }

  const arr = newProject.safetyActivityCount ?? [];
  const actual = (arr[qi - 2] ?? 0) + (arr[qi - 1] ?? 0);
  const carry = newProject.safetyCarryoverDeficit ?? 0;
  const required = SAFETY_REQUIRED_PER_PERIOD + carry;

  if (actual < required) {
    const owe = required - actual;
    newProject.safetyCarryoverDeficit = owe;
    if ((newProject.safetyComplianceStrikes ?? 0) >= 1) {
      newState.gamePhase = 'ENDING';
      newState.endingType = 'SAFETY_NONCOMPLIANCE';
      logs.push({
        quarter: state.totalQuarters,
        message: '安全教育活动再次未达标，按规定办理清退。',
        type: 'DANGER',
      });
      isGameOver = true;
    } else {
      newProject.safetyComplianceStrikes = 1;
      newProject.safetyComplianceAlert = `安全活动不足：本周期 ${actual}/${required} 次，下周期需补足。`;
      logs.push({
        quarter: state.totalQuarters,
        message: `安全活动不足：${actual}/${required} 次，已发出警告。`,
        type: 'WARNING',
      });
    }
  } else {
    newProject.safetyCarryoverDeficit = 0;
    newProject.safetyComplianceStrikes = 0;
  }

  newState.project = newProject;
  return { newState, logs, isGameOver };
}

export function checkSafetyMidPeriodHint(state: GameState): string | undefined {
  const qi = state.project.quarterInProject;
  if (qi < 1 || qi % 2 !== 1) return undefined;

  const arr = state.project.safetyActivityCount ?? [];
  const done = arr[qi - 1] ?? 0;
  const carry = state.project.safetyCarryoverDeficit ?? 0;
  const required = SAFETY_REQUIRED_PER_PERIOD + carry;
  const remaining = Math.max(0, required - done);
  if (remaining <= 0) return undefined;

  return done === 0
    ? `周期过半，安全活动打卡还是零。本周期还需 ${remaining} 次。`
    : `安全活动进度 ${done}/${required}，还差 ${remaining} 次。`;
}
