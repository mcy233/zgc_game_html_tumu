/**
 * Annual Performance Review System
 * Triggered every 4 quarters (1 year). Evaluates the player's performance
 * and determines promotion eligibility with salary adjustments.
 */

import type { GameState } from '../types/index';
import { checkPromotionEligibility, applyPromotion } from './promotionSystem';
import { getCareerTitle } from '../data/careerPaths';
import { MAX_CAREER_STAGE } from '../config/gameConfig';

export interface AnnualReviewResult {
  year: number;
  performanceScore: number;
  performanceGrade: 'S' | 'A' | 'B' | 'C' | 'D';
  salaryRaise: number;
  promoted: boolean;
  oldTitle: string;
  newTitle: string;
  narrativeLines: string[];
  newState: GameState;
}

function computePerformanceScore(state: GameState): number {
  let score = 0;

  score += Math.min(25, state.project.bossApproval * 0.25);
  score += Math.min(20, state.project.ownerSatisfaction * 0.2);
  score += Math.min(15, (100 - state.safetyRisk) * 0.15);
  score += Math.min(15, state.reputation * 0.15);
  score += Math.min(10, state.experience * 0.02);
  score += Math.min(10, state.project.completedSections * 2);
  score += Math.min(5, state.certificates * 2.5);

  return Math.round(Math.min(100, score));
}

function gradeFromScore(score: number): AnnualReviewResult['performanceGrade'] {
  if (score >= 85) return 'S';
  if (score >= 70) return 'A';
  if (score >= 55) return 'B';
  if (score >= 40) return 'C';
  return 'D';
}

export function isAnnualReviewQuarter(totalQuarters: number): boolean {
  return totalQuarters > 0 && totalQuarters % 4 === 0;
}

export function performAnnualReview(state: GameState): AnnualReviewResult {
  const year = Math.ceil(state.totalQuarters / 4);
  const score = computePerformanceScore(state);
  const grade = gradeFromScore(score);
  const narrativeLines: string[] = [];
  let newState = { ...state };

  const salaryRaiseMap = { S: 2000, A: 1200, B: 600, C: 0, D: -500 };
  const salaryRaise = salaryRaiseMap[grade];
  newState.salary = Math.max(0, newState.salary + salaryRaise);
  newState.lifetimeEarnings += Math.max(0, salaryRaise);

  const oldTitle = getCareerTitle(state.careerTrack, state.careerStage);

  let promoted = false;
  if (grade !== 'D' && state.careerStage < MAX_CAREER_STAGE) {
    const eligibility = checkPromotionEligibility(state);
    if (eligibility.eligible) {
      newState = applyPromotion(newState);
      promoted = true;
    }
  }

  const newTitle = getCareerTitle(newState.careerTrack, newState.careerStage);

  if (grade === 'S') {
    narrativeLines.push(`年度考核评定：卓越(S)。公司上下一致认可你的表现。`);
  } else if (grade === 'A') {
    narrativeLines.push(`年度考核评定：优秀(A)。领导在总结会上特别点名表扬了你。`);
  } else if (grade === 'B') {
    narrativeLines.push(`年度考核评定：合格(B)。中规中矩，不功不过的一年。`);
  } else if (grade === 'C') {
    narrativeLines.push(`年度考核评定：基本合格(C)。领导委婉地说"还需努力"。`);
  } else {
    narrativeLines.push(`年度考核评定：不合格(D)。被约谈了，差点被调去后勤。`);
  }

  if (salaryRaise > 0) {
    narrativeLines.push(`获得年度绩效奖金 ¥${salaryRaise}。`);
  } else if (salaryRaise < 0) {
    narrativeLines.push(`因表现不佳，被扣除绩效 ¥${Math.abs(salaryRaise)}。`);
  }

  if (promoted) {
    narrativeLines.push(`恭喜晋升！${oldTitle} → ${newTitle}。从此承担更大的责任。`);
  }

  if (grade === 'D') {
    newState.morale = Math.max(0, newState.morale - 10);
    newState.reputation = Math.max(0, newState.reputation - 3);
  } else if (grade === 'S' || grade === 'A') {
    newState.morale = Math.min(100, newState.morale + 10);
  }

  return {
    year,
    performanceScore: score,
    performanceGrade: grade,
    salaryRaise,
    promoted,
    oldTitle,
    newTitle,
    narrativeLines,
    newState,
  };
}
