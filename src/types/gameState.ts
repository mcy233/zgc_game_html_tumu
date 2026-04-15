import type { Coworker, BossType } from './characters';
import type { PendingQuarterChoice, GameLog } from './events';
import type { Asset } from './assets';
import type { CareerTrack } from './actions';

export type WeatherType = '晴' | '多云' | '小雨' | '大雨' | '高温' | '寒潮' | '大风';

export type ProjectType = 'RESIDENTIAL' | 'COMMERCIAL' | 'BRIDGE' | 'HIGHRISE' | 'TUNNEL';

export type ProjectPhase = 'PREP' | 'FOUNDATION' | 'MAIN' | 'FINISHING';

export type MomentFeedSource = 'PROJECT_DEPT' | 'PEER' | 'OTHER_SITE' | 'BOSS' | 'SELF';

export type EndingGrade = 'MYTHIC' | 'LEGEND' | 'STAR' | 'MERIT' | 'PASS' | 'SCRAPE';

export interface Moment {
  id: string;
  quarter: number;
  content: string;
  author: string;
  likes: number;
  comments: { author: string; content: string }[];
  hasInteracted: boolean;
  timestamp: string;
  feedSource?: MomentFeedSource;
}

export interface CareerEvent {
  totalQuarter: number;
  type:
    | 'PROMOTE'
    | 'PROJECT_START'
    | 'PROJECT_END'
    | 'CAREER_CHANGE'
    | 'ACHIEVEMENT'
    | 'LIFE_CHOICE';
  description: string;
}

export interface ProjectState {
  type: ProjectType;
  name: string;
  phase: ProjectPhase;
  quarterInProject: number;
  totalQuarters: number;
  progress: number;
  ownerSatisfaction: number;
  bossApproval: number;
  coworkers: Coworker[];
  bossName: string;
  bossType: BossType;
  materials: number;
  planProgress: number;
  submittedSections: number;
  completedSections: number;
  weather: WeatherType;
  safetyActivityCount: number[];
  /** Number of quarters since last boss interaction */
  bossLastInteractedQuarter: number;
  /** Per-quarter drawing review counts */
  drawingReviewByQuarter: number[];
  /** Safety compliance tracking */
  safetyCarryoverDeficit: number;
  safetyComplianceStrikes: number;
  safetyComplianceAlert?: string;
  safetyMidPeriodHint?: string;
  /** Quarterly lab/site notice */
  quarterNotice?: {
    title: string;
    description: string;
    effect: Record<string, number>;
  };
  /** Pending asset offer */
  pendingAssetOffer?: Asset;
  assetVendorTitle?: string;
}

/** Whether the game is in normal play, transfer period, or ended */
export type GamePhase = 'PLAYING' | 'TRANSFER' | 'ENDING';

export interface GameState {
  // --- Global time ---
  totalQuarters: number;
  currentProjectIndex: number;
  season: '春季' | '夏季' | '秋季' | '冬季';

  // --- Player identity ---
  playerName: string;
  playerContactEmail: string;
  playerOfficeRoom: string;
  playerEducation: string;
  signatureQuoteSeed: number;

  // --- Career ---
  careerTrack: CareerTrack;
  careerStage: number; // 0=intern, 1=regular, 2=lead, 3=manager, 4=executive

  // --- Game phase ---
  gamePhase: GamePhase;

  // --- Core stats (0-100, cross-project persistent) ---
  morale: number;
  stamina: number;
  energy: number;
  safetyRisk: number;
  reputation: number;

  // --- Cross-project resources ---
  salary: number;
  certificates: number;
  /** Per-certificate study progress: { certId: accumulated points } */
  certProgress: Record<string, number>;
  experience: number;
  networkValue: number;
  /** 隐性进度：人生选择条件判定 */
  civilExamPrep: number;
  gradExamPrep: number;
  codingSkill: number;
  managementSkill: number;
  lifetimeEarnings: number;
  totalProjectsCompleted: number;

  // --- Current project (nested) ---
  project: ProjectState;

  // --- Per-quarter action tracking ---
  actionsThisQuarter: number;
  walksThisQuarter: number;
  interactionsThisQuarter: string[];
  actionsSinceExternalMoment: number;
  externalMomentThreshold: number;
  lowDrawingWorkClickCount: number;

  // --- Assets (cross-project) ---
  assets: Asset[];

  // --- Quarter events ---
  pendingQuarterChoice?: PendingQuarterChoice;

  // --- Honors ---
  unlockedHonors: string[];
  honorUnlockOrder: string[];
  honorHomeDisplayMode: 'latest' | 'pinned';
  honorHomePinnedId: string | null;

  // --- Career history ---
  careerHistory: CareerEvent[];

  // --- Ending ---
  endingGrade?: EndingGrade;
  endingType?: string;

  // --- History ---
  logs: GameLog[];
  moments: Moment[];
}
