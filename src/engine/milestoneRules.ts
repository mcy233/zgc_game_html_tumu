/**
 * milestoneRules.ts is deprecated in v2.
 * Use endingSystem.ts for ending narratives and grades.
 * This file is kept as a stub to avoid broken imports in legacy code.
 */

import type { EndingGrade } from '../types/index';

export function computeGraduationHonor(
  _projects: number,
  _reputation: number,
  _reviews: number
): EndingGrade {
  return 'PASS';
}

export function graduationEnding(
  _honor: EndingGrade,
  _projects: number,
  _rep: number,
  _reviews: number
): { title: string; body: string; accent: string } {
  return { title: '', body: '', accent: '' };
}

export function failureGameOverCopy(_m: string): { title: string; body: string } {
  return { title: '', body: '' };
}

export const TERMINAL_MILESTONES: string[] = [];
