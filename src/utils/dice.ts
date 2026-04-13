/** 与 `actionHandlers` 内旧版 roll* 一致：区间 + 近似均值 */

export function rollPlanSafetyRiskDelta(): number {
  return Math.max(2, Math.min(8, Math.round(5 + (Math.random() - 0.5) * 5)));
}

export function rollDrawingPlanProgressDelta(): number {
  return Math.max(1, Math.min(5, Math.round(3 + (Math.random() - 0.5) * 2)));
}

export function rollConstructionPlanProgressDelta(): number {
  return Math.max(3, Math.min(8, Math.round(5 + (Math.random() - 0.5) * 4)));
}
