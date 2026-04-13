import type { CareerTrack } from '../types/index';

export interface StageDefinition {
  stage: number; // 0=intern, 1=regular, 2=lead, 3=manager, 4=executive
  titleByTrack: Record<CareerTrack, string>; // Chinese job title per track
  /** Promotion requirements to reach THIS stage (stage 0 has none) */
  promotionRequirements?: {
    minCertificates?: number;
    minReputation?: number;
    minExperience?: number;
    minCompletedSections?: number; // total across all projects
    minOwnerSatisfaction?: number; // current project
    minBossApproval?: number; // current project
    minReviews?: number; // lifetime industry reviews
    minNetwork?: number;
  };
  /** Base quarterly salary for this stage */
  baseSalary: number;
  /** Actions per quarter at this stage */
  actionsPerQuarter: number;
  /** Description of role at this stage */
  descriptionByTrack: Record<CareerTrack, string>;
  /** Failure risk at this stage */
  failureRiskByTrack: Record<CareerTrack, string>;
}

export const CAREER_STAGES: StageDefinition[] = [
  {
    stage: 0,
    titleByTrack: {
      TECH: '见习技术员',
      BUILD: '见习施工员',
      BIZ: '见习商务员',
    },
    baseSalary: 4000,
    actionsPerQuarter: 18,
    descriptionByTrack: {
      TECH: '跟着师傅学看图，安全帽还崭新。能做的事不多，但要考的证不少。',
      BUILD: '白天搬砖测量，晚上抄规范。鞋上的泥比你的工龄还厚。',
      BIZ: '在电脑前算量对账，Excel 是你最亲密的战友。',
    },
    failureRiskByTrack: {
      TECH: '试用期考核不过，被劝退',
      BUILD: '安全事故或体力不支，被劝退',
      BIZ: '算量频繁出错，被劝退',
    },
  },
  {
    stage: 1,
    titleByTrack: {
      TECH: '技术员',
      BUILD: '施工员',
      BIZ: '商务员',
    },
    promotionRequirements: {
      minCertificates: 12,
      minBossApproval: 55,
      minExperience: 80,
    },
    baseSalary: 6500,
    actionsPerQuarter: 20,
    descriptionByTrack: {
      TECH: '能独立编方案、做技术交底了。师傅开始放手让你独当一面。',
      BUILD: '工人开始叫你"X工"了。现场调度、质量把控，你说了算。',
      BIZ: '成本分析报告写得越来越溜，甲方变更令你也能接住了。',
    },
    failureRiskByTrack: {
      TECH: '技术方案出重大纰漏，被降级',
      BUILD: '安全管理疏漏，被追责',
      BIZ: '成本核算严重失误，被追责',
    },
  },
  {
    stage: 2,
    titleByTrack: {
      TECH: '技术负责人',
      BUILD: '施工负责人',
      BIZ: '商务主管',
    },
    promotionRequirements: {
      minCertificates: 20,
      minReputation: 45,
      minExperience: 250,
      minCompletedSections: 3,
      minOwnerSatisfaction: 55,
    },
    baseSalary: 10000,
    actionsPerQuarter: 22,
    descriptionByTrack: {
      TECH: '带技术小团队了。审方案、协调设计院、管图纸变更，操心的事翻了一倍。',
      BUILD: '手下管着几个施工段。工人出了问题，你是第一个被@的人。',
      BIZ: '带着两个新人做标书和结算。甲方的电话直接打到你手机上。',
    },
    failureRiskByTrack: {
      TECH: '技术事故追责，被撤换',
      BUILD: '重大安全事故，被停职',
      BIZ: '亏损项目追责，被撤换',
    },
  },
  {
    stage: 3,
    titleByTrack: {
      TECH: '项目总工',
      BUILD: '项目施工经理',
      BIZ: '项目商务经理',
    },
    promotionRequirements: {
      minCertificates: 28,
      minReputation: 65,
      minExperience: 600,
      minCompletedSections: 8,
      minOwnerSatisfaction: 60,
      minNetwork: 40,
    },
    baseSalary: 18000,
    actionsPerQuarter: 24,
    descriptionByTrack: {
      TECH: '全面技术把控。BIM、新技术引进、创优申报，你是项目的技术大脑。',
      BUILD: '施工全局调度。工期、人员、机械、安全，四条线你都得看。',
      BIZ: '合同、变更、结算、索赔全管。项目能不能赚钱，你说了算。',
    },
    failureRiskByTrack: {
      TECH: '重大质量事故，被撤职',
      BUILD: '群体安全事件，被追究刑责',
      BIZ: '合同纠纷败诉，被追责',
    },
  },
  {
    stage: 4,
    titleByTrack: {
      TECH: '公司总工',
      BUILD: '项目经理',
      BIZ: '公司商务总监',
    },
    promotionRequirements: {
      minReputation: 80,
      minExperience: 1200,
      minCompletedSections: 15,
      minNetwork: 65,
    },
    baseSalary: 30000,
    actionsPerQuarter: 26,
    descriptionByTrack: {
      TECH: '公司级技术权威。新标准、新工法、行业话语权，你的签字值千万。',
      BUILD: '统管一个项目的全部。工期成本安全质量，你对甲方和公司双向负责。',
      BIZ: '公司商务板块的掌舵者。投标策略、成本红线、合同条款，都经你手。',
    },
    failureRiskByTrack: {
      TECH: '技术路线决策失误，被降级',
      BUILD: '项目亏损严重，被免职',
      BIZ: '连续投标失败，被边缘化',
    },
  },
];

/** Get the Chinese title for a given track and stage */
export function getCareerTitle(track: CareerTrack, stage: number): string {
  const def = CAREER_STAGES[Math.min(stage, CAREER_STAGES.length - 1)];
  return def ? def.titleByTrack[track] : '未知职级';
}

/** Get the stage definition */
export function getStageDefinition(stage: number): StageDefinition | undefined {
  return CAREER_STAGES[Math.min(stage, CAREER_STAGES.length - 1)];
}

/** Check if player meets promotion requirements for target stage */
export function meetsPromotionRequirements(
  targetStage: number,
  stats: {
    certificates: number;
    reputation: number;
    experience: number;
    totalCompletedSections: number;
    ownerSatisfaction: number;
    bossApproval: number;
    networkValue: number;
  }
): { met: boolean; missing: string[] } {
  const def = CAREER_STAGES[targetStage];
  if (!def || !def.promotionRequirements) return { met: true, missing: [] };
  const req = def.promotionRequirements;
  const missing: string[] = [];
  if (req.minCertificates && stats.certificates < req.minCertificates)
    missing.push(`资质证书 ${stats.certificates}/${req.minCertificates}`);
  if (req.minReputation && stats.reputation < req.minReputation)
    missing.push(`行业口碑 ${stats.reputation}/${req.minReputation}`);
  if (req.minExperience && stats.experience < req.minExperience)
    missing.push(`经验值 ${stats.experience}/${req.minExperience}`);
  if (req.minCompletedSections && stats.totalCompletedSections < req.minCompletedSections)
    missing.push(`已完工分项 ${stats.totalCompletedSections}/${req.minCompletedSections}`);
  if (req.minOwnerSatisfaction && stats.ownerSatisfaction < req.minOwnerSatisfaction)
    missing.push(`甲方满意度 ${stats.ownerSatisfaction}/${req.minOwnerSatisfaction}`);
  if (req.minBossApproval && stats.bossApproval < req.minBossApproval)
    missing.push(`上级信任 ${stats.bossApproval}/${req.minBossApproval}`);
  if (req.minNetwork && stats.networkValue < req.minNetwork)
    missing.push(`人脉值 ${stats.networkValue}/${req.minNetwork}`);
  return { met: missing.length === 0, missing };
}
