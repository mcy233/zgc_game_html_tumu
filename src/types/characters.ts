export type BossType = 'MICROMANAGER' | 'GHOST' | 'SUPPORTIVE' | 'CELEBRITY';

export interface Coworker {
  id: string;
  name: string;
  role: '老师傅' | '前辈' | '同期' | '新来的';
  year: number;
  status: string;
  favor: number;
  lastInteractedQuarter?: number;
}

export interface BossProfile {
  label: string;
  description: string;
  approvalMultiplier: number;
  progressMultiplier: number;
  approvalGainRate: number;
  requirements: { reputation?: number; certificates?: number; projects?: number };
}
