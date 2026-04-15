export type ActionCategory = 'DAILY' | 'CONSTRUCTION' | 'TEAM';
export type CareerTrack = 'TECH' | 'BUILD' | 'BIZ';

export interface Action {
  id: string;
  label: string;
  description: string;
  descriptions?: string[];
  strategyHint?: string;
  category: ActionCategory;
  energyCost: number;
  moraleCost: number;
  staminaCost: number;
  salaryCost: number;
  materialsCost: number;
  progressGain: number;
  approvalGain: number;
  salaryGain: number;
  certificateGain?: number;
  safetyRiskChange?: number;
  coworkerApprovalGain?: number;
  experienceGain?: number;
  networkGain?: number;
  /** Career track restriction (undefined = available to all) */
  requiredTrack?: CareerTrack;
  /** Minimum career stage (0=intern, 1=regular, 2=lead, 3=manager, 4=exec) */
  requiredStageMin?: number;
  /** Maximum career stage (actions disappear after this) */
  requiredStageMax?: number;
  /** Minimum project index to unlock (0-based) */
  unlockedByProject?: number;
  /** Hidden actions require discovery via events before appearing */
  hidden?: boolean;
  /** Hint shown to the player upon discovering this hidden action */
  discoveryHint?: string;
}
