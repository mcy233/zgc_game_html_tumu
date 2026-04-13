import type { GameState } from '../types/index';
import { SAFETY_REQUIRED_PER_PERIOD as SAFETY_REQUIRED_PER_PERIOD_CFG } from '../config/gameConfig';

export const SAFETY_REQUIRED_PER_PERIOD = SAFETY_REQUIRED_PER_PERIOD_CFG;
export const DRAWING_REVIEW_REQUIRED_PER_TWO_QUARTERS = 4;

export function ensureQuarterStatArray(arr: number[] | undefined, minLength: number): number[] {
  const a = [...(arr ?? [])];
  while (a.length < minLength) a.push(0);
  return a;
}

export function bumpQuarterStat(arr: number[], quarter: number, delta: number): number[] {
  const next = ensureQuarterStatArray(arr, quarter);
  const i = quarter - 1;
  next[i] = (next[i] ?? 0) + delta;
  return next;
}

export function getDrawingSupportFactor(state: GameState): number {
  const q = state.project.quarterInProject;
  const arr = state.project.drawingReviewByQuarter ?? [];
  if (q <= 1) return Math.min(1, (arr[0] ?? 0) / DRAWING_REVIEW_REQUIRED_PER_TWO_QUARTERS);
  const sum = (arr[q - 2] ?? 0) + (arr[q - 1] ?? 0);
  return Math.min(1, sum / DRAWING_REVIEW_REQUIRED_PER_TWO_QUARTERS);
}

export function getTeamAtmosphereProgressMultiplier(state: GameState): number {
  let sum = state.project.bossApproval;
  for (const c of state.project.coworkers) sum += c.favor;
  const max = 100 + 100 * state.project.coworkers.length;
  const t = max > 0 ? sum / max : 0.5;
  return 0.82 + 0.28 * Math.min(1, Math.max(0, t));
}

export function relationMoodLabel(favor: number): string {
  if (favor < 25) return '冷淡';
  if (favor < 50) return '点头之交';
  if (favor < 75) return '友好';
  return '热情';
}

const COLD_SITE_LINES = [
  '早班会散场没人跟你对眼神，对讲机里只有你一个人在"收到"。',
  '食堂排队时工友们自动隔开半米——不是防疫，是氛围冻住了。',
  '项目部群里你发进度照片，半天只有监理回了个玫瑰表情。',
];

export function pickColdAtmosphereLine(): string {
  return COLD_SITE_LINES[Math.floor(Math.random() * COLD_SITE_LINES.length)]!;
}

const WEAK_DRAWING_LINES = [
  '图集与变更单对不上，班组问你"到底按哪张"。',
  '立面节点翻了三本图集还是懵，你在玩"大家来找茬·地狱难度"。',
  '结构图与机电图叠在一起像抽象画，安全员以为你在摸鱼。',
];

export function pickWeakDrawingLine(): string {
  return WEAK_DRAWING_LINES[Math.floor(Math.random() * WEAK_DRAWING_LINES.length)]!;
}
