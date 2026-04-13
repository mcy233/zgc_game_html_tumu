import type { GameState, ProjectState, CareerTrack } from '../types/index';
import { BRAND_WELCOME_LOG } from './branding';

function createInitialProject(): ProjectState {
  return {
    type: 'RESIDENTIAL',
    name: '（待分配）',
    phase: 'PREP',
    quarterInProject: 0,
    totalQuarters: 8,
    progress: 0,
    ownerSatisfaction: 50,
    bossApproval: 0,
    coworkers: [],
    bossName: '未分配',
    bossType: 'SUPPORTIVE',
    materials: 1000,
    planProgress: 0,
    submittedSections: 0,
    completedSections: 0,
    weather: '晴',
    safetyActivityCount: [],
    bossLastInteractedQuarter: 0,
    drawingReviewByQuarter: [],
    safetyCarryoverDeficit: 0,
    safetyComplianceStrikes: 0,
  };
}

export function createInitialState(track: CareerTrack = 'TECH'): GameState {
  return {
    totalQuarters: 0,
    currentProjectIndex: 0,
    season: '春季',

    playerName: '',
    playerContactEmail: '',
    playerOfficeRoom: '',
    playerEducation: '',
    signatureQuoteSeed: 0,

    careerTrack: track,
    careerStage: 0,

    gamePhase: 'PLAYING',

    morale: 80,
    stamina: 90,
    energy: 100,
    safetyRisk: 0,
    reputation: 10,

    salary: 3000,
    certificates: 0,
    experience: 0,
    networkValue: 0,
    civilExamPrep: 0,
    gradExamPrep: 0,
    codingSkill: 0,
    managementSkill: 0,
    lifetimeEarnings: 0,
    totalProjectsCompleted: 0,

    project: createInitialProject(),

    actionsThisQuarter: 0,
    walksThisQuarter: 0,
    interactionsThisQuarter: [],
    actionsSinceExternalMoment: 0,
    externalMomentThreshold: 4 + Math.floor(Math.random() * 8),
    lowDrawingWorkClickCount: 0,

    assets: [],

    unlockedHonors: [],
    honorUnlockOrder: [],
    honorHomeDisplayMode: 'latest',
    honorHomePinnedId: null,

    careerHistory: [],

    logs: [{ quarter: 0, message: BRAND_WELCOME_LOG, type: 'INFO' }],
    moments: [],
  };
}

/** Legacy compat: static initial state (TECH track default) */
export const INITIAL_STATE: GameState = createInitialState('TECH');
