/** 季度伊始待玩家抉择的第二类随机事件（关闭「季度总结」后弹出） */
export type PendingQuarterChoice = {
  title: string;
  description: string;
  options: {
    id: string;
    label: string;
    hint: string;
    /** 选择确定后，结果浮窗中的叙事（不含数值，数值由 deltas 单独展示） */
    outcomeText: string;
    /** 对当前状态的增量（可正可负）；键名与 GameState 数值字段一致，在运行时 clamp */
    deltas: Partial<Record<string, number>>;
  }[];
};

export interface GameLog {
  quarter: number;
  message: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'DANGER';
}

/** Life crossroads choice available during project transfer period */
export interface LifeChoice {
  id: string;
  label: string;
  description: string;
  /** Conditions that must be met for this choice to appear */
  conditions: {
    minStage?: number;
    maxStage?: number;
    minReputation?: number;
    minNetwork?: number;
    minSalary?: number;
    minCertificates?: number;
    minCivilExamPrep?: number;
    minGradExamPrep?: number;
    minCodingSkill?: number;
    minManagementSkill?: number;
  };
  /** Whether this is a terminal ending */
  isEnding: boolean;
  /** Ending type for narrative generation */
  endingType?:
    | 'CIVIL_SERVANT'
    | 'TECH_INDUSTRY'
    | 'HQ_MANAGEMENT'
    | 'ENTREPRENEUR'
    | 'GRAD_SCHOOL'
    | 'JUMP_SHIP';
}
