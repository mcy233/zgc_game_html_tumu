import type { GameState } from '../types/index';

export function tickOwnerSatisfaction(state: GameState): number {
  let delta = 0;
  if (state.project.progress > 60) delta += 2;
  if (state.project.progress > 80) delta += 3;
  if (state.safetyRisk > 50) delta -= 3;
  if (state.safetyRisk > 80) delta -= 5;
  delta += state.project.completedSections * 1;
  if (state.reputation > 60) delta += 1;
  return Math.min(100, Math.max(0, state.project.ownerSatisfaction + delta));
}

export function getOwnerBonusSalary(satisfaction: number): number {
  if (satisfaction >= 90) return 2000;
  if (satisfaction >= 70) return 1000;
  if (satisfaction >= 50) return 500;
  if (satisfaction >= 30) return 0;
  return -500;
}

export function ownerSatisfactionLabel(value: number): string {
  if (value >= 90) return '非常满意';
  if (value >= 70) return '比较满意';
  if (value >= 50) return '一般';
  if (value >= 30) return '不太满意';
  return '很不满意';
}

export function generateOwnerInspectionEvent(
  satisfaction: number
): { title: string; description: string; effect: Record<string, number> } | null {
  if (Math.random() > 0.25) return null;
  if (satisfaction >= 70) {
    return {
      title: '甲方巡检 · 好评',
      description: '甲方代表带着总工来现场转了一圈，对施工质量和现场管理表示认可。',
      effect: { reputation: 3, morale: 5, salary: 500 },
    };
  }
  if (satisfaction >= 40) {
    return {
      title: '甲方巡检 · 整改',
      description: '甲方代表皱着眉头发了一份整改通知单。',
      effect: { morale: -8, safetyRisk: -5, reputation: -2 },
    };
  }
  return {
    title: '甲方巡检 · 警告',
    description: '甲方总监亲自来了："限期三天整改！"',
    effect: { morale: -15, reputation: -5, safetyRisk: -3, salary: -1000 },
  };
}
