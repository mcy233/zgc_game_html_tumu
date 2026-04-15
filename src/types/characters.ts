export type BossType = 'MICROMANAGER' | 'GHOST' | 'SUPPORTIVE' | 'CELEBRITY';

export type CoworkerPosition =
  | '施工员' | '技术员' | '商务员' | '质量员' | '安全员' | '采购员'
  | '施工负责人' | '技术负责人' | '商务主管' | '质量主管' | '安全主管'
  | '老师傅' | '实习生';

export interface Coworker {
  id: string;
  name: string;
  position: CoworkerPosition;
  /** @deprecated kept for backward compat, mapped from position */
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
