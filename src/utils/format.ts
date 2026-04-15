/** English state / effect field → Chinese display label */
export const STAT_LABELS: Record<string, string> = {
  morale: '心态值',
  stamina: '体力值',
  energy: '精力值',
  reputation: '行业口碑',
  ownerSatisfaction: '甲方满意度',
  safetyRisk: '安全隐患',
  salary: '工资',
  materials: '物资',
  progress: '阶段进度',
  planProgress: '施工方案进度',
  submittedProjects: '送审分项工程',
  projectsCompleted: '已完工程',
  reviews: '行业评价',
  certificates: '资质证书',
  studyPoints: '备考进度',
  bossApproval: '上级信任度',
  coworkerApproval: '工友好感度',
  favor: '工友好感度',
  quarter: '季度',
  year: '年份',
  workQuarters: '跟师季度数',
  walksThisQuarter: '本季散步次数',
  actionsThisQuarter: '本季行动次数',
  actionsSinceExternalMoment: '距下条动态行动数',
  lowDrawingWorkClickCount: '图纸不足施工点击',
  moraleCostMultiplier: '心态消耗倍数',
  staminaCostMultiplier: '体力消耗倍数',
  energyGainMultiplier: '精力恢复倍数',
  progressGainMultiplier: '阶段进度获得倍数',
  reputationGainMultiplier: '口碑获得倍数',
  materialsGainPerQuarter: '每季度物资',
  salaryGainPerQuarter: '每季度工资',
  experience: '经验值',
  networkValue: '人脉值',
  network: '人脉值',
  totalProjectsCompleted: '累计完工项目',
  lifetimeEarnings: '累计收入',
  civilExamPrep: '考公准备度',
  gradExamPrep: '考研准备度',
  codingSkill: '编程能力',
  managementSkill: '管理能力',
};

export function effectStatLabel(key: string): string {
  return STAT_LABELS[key] ?? key;
}

/** 展示单条数值变化（含正负号，0 为 `0`） */
export function formatEffectDisplayValue(val: number): string {
  if (!Number.isFinite(val)) return '—';
  const n = Math.abs(val - Math.round(val)) < 1e-6 ? Math.round(val) : Math.round(val * 10) / 10;
  if (n === 0) return '0';
  return n > 0 ? `+${n}` : `${n}`;
}

export function roundEffectRecord(effect: Record<string, number>): Record<string, number> {
  const out: Record<string, number> = {};
  for (const [k, v] of Object.entries(effect)) {
    if (typeof v === 'number' && !Number.isNaN(v) && v !== 0) out[k] = Math.round(v);
  }
  return out;
}
