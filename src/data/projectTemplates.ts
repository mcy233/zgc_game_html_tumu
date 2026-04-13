import type { ProjectType, ProjectPhase, BossType } from '../types/index';

export interface ProjectTemplate {
  type: ProjectType;
  label: string;
  description: string;
  /** Base total quarters for this project type */
  baseQuarters: number;
  /** Variance in quarters (+/-) */
  quarterVariance: number;
  /** Difficulty multiplier (affects progress requirements, safety risks) */
  difficultyMultiplier: number;
  /** Reputation gain multiplier upon completion */
  reputationMultiplier: number;
  /** Available from project index N */
  availableFromProject: number;
  /** Minimum career stage to be offered this project type */
  minStage: number;
  /** Phase breakdown: fractions that sum to 1.0 */
  phaseBreakdown: Record<ProjectPhase, number>;
  /** Possible project name templates */
  nameTemplates: string[];
}

export const PROJECT_TEMPLATES: Record<ProjectType, ProjectTemplate> = {
  RESIDENTIAL: {
    type: 'RESIDENTIAL',
    label: '住宅楼盘',
    description: '城市住宅小区项目，工期规律，标准化程度高，适合新人锻炼。',
    baseQuarters: 8,
    quarterVariance: 1,
    difficultyMultiplier: 1.0,
    reputationMultiplier: 1.0,
    availableFromProject: 0,
    minStage: 0,
    phaseBreakdown: { PREP: 0.15, FOUNDATION: 0.25, MAIN: 0.4, FINISHING: 0.2 },
    nameTemplates: [
      '翡翠湖畔花园',
      '锦绣华庭',
      '阳光雅苑',
      '碧水蓝天小区',
      '金色家园',
      '滨江一号',
      '紫荆花园',
      '星河湾',
    ],
  },
  COMMERCIAL: {
    type: 'COMMERCIAL',
    label: '商业综合体',
    description: '商业中心或购物广场项目，甲方要求高，设计变更频繁。',
    baseQuarters: 10,
    quarterVariance: 2,
    difficultyMultiplier: 1.3,
    reputationMultiplier: 1.3,
    availableFromProject: 1,
    minStage: 1,
    phaseBreakdown: { PREP: 0.15, FOUNDATION: 0.2, MAIN: 0.4, FINISHING: 0.25 },
    nameTemplates: [
      '万象天地广场',
      '中央商务区',
      '银泰中心',
      '龙湖天街',
      '华润万象城',
      '星光大道商业街',
      '世纪金源购物中心',
    ],
  },
  BRIDGE: {
    type: 'BRIDGE',
    label: '市政桥梁',
    description: '跨江/跨河大桥或高架桥项目，技术含量高，天气影响显著。',
    baseQuarters: 10,
    quarterVariance: 2,
    difficultyMultiplier: 1.5,
    reputationMultiplier: 1.5,
    availableFromProject: 2,
    minStage: 1,
    phaseBreakdown: { PREP: 0.2, FOUNDATION: 0.3, MAIN: 0.35, FINISHING: 0.15 },
    nameTemplates: [
      '清江大桥',
      '望月高架',
      '滨河特大桥',
      '城北立交',
      '环城快速路高架',
      '新区跨湖大桥',
    ],
  },
  HIGHRISE: {
    type: 'HIGHRISE',
    label: '超高层',
    description: '200米以上超高层建筑，施工难度和安全风险都是顶级。',
    baseQuarters: 12,
    quarterVariance: 2,
    difficultyMultiplier: 1.8,
    reputationMultiplier: 1.8,
    availableFromProject: 2,
    minStage: 2,
    phaseBreakdown: { PREP: 0.15, FOUNDATION: 0.25, MAIN: 0.45, FINISHING: 0.15 },
    nameTemplates: [
      '城市之巅大厦',
      '金融中心T1塔楼',
      '天际线国际中心',
      '云端广场',
      '新区第一高楼',
      '国际金融中心',
    ],
  },
  TUNNEL: {
    type: 'TUNNEL',
    label: '隧道/地铁',
    description: '地铁区间或山岭隧道，全封闭施工环境，特殊工种多。',
    baseQuarters: 12,
    quarterVariance: 3,
    difficultyMultiplier: 2.0,
    reputationMultiplier: 2.0,
    availableFromProject: 3,
    minStage: 2,
    phaseBreakdown: { PREP: 0.2, FOUNDATION: 0.2, MAIN: 0.45, FINISHING: 0.15 },
    nameTemplates: [
      '城际铁路隧道段',
      '地铁X号线区间',
      '穿山隧道工程',
      '过江通道盾构段',
      '环线地下段',
    ],
  },
};

/** Company name prefix pool */
const COMPANY_PREFIXES = [
  '中建某局',
  '中铁某局',
  '中交某公司',
  '中冶某公司',
  '本地城建集团',
  '省建工集团',
  '市政工程公司',
  '某央企子公司',
];

/** Generate a random project name */
export function generateProjectName(type: ProjectType): string {
  const template = PROJECT_TEMPLATES[type];
  const names = template.nameTemplates;
  const name = names[Math.floor(Math.random() * names.length)];
  const prefix = COMPANY_PREFIXES[Math.floor(Math.random() * COMPANY_PREFIXES.length)];
  return `${prefix} · ${name}项目`;
}

/** Get available project types for a given stage and project index */
export function getAvailableProjectTypes(stage: number, projectIndex: number): ProjectType[] {
  return (Object.keys(PROJECT_TEMPLATES) as ProjectType[]).filter((t) => {
    const tmpl = PROJECT_TEMPLATES[t];
    return projectIndex >= tmpl.availableFromProject && stage >= tmpl.minStage;
  });
}

/** Calculate total quarters for a project */
export function rollProjectQuarters(type: ProjectType): number {
  const tmpl = PROJECT_TEMPLATES[type];
  const variance =
    Math.floor(Math.random() * (tmpl.quarterVariance * 2 + 1)) - tmpl.quarterVariance;
  return tmpl.baseQuarters + variance;
}

/** Get the phase for a given quarter within a project */
export function getProjectPhase(
  type: ProjectType,
  quarterInProject: number,
  totalQuarters: number
): ProjectPhase {
  const tmpl = PROJECT_TEMPLATES[type];
  const fraction = quarterInProject / totalQuarters;
  let cumulative = 0;
  for (const phase of ['PREP', 'FOUNDATION', 'MAIN', 'FINISHING'] as ProjectPhase[]) {
    cumulative += tmpl.phaseBreakdown[phase];
    if (fraction < cumulative) return phase;
  }
  return 'FINISHING';
}

/** Phase display name */
export function phaseLabel(phase: ProjectPhase): string {
  switch (phase) {
    case 'PREP':
      return '进场准备';
    case 'FOUNDATION':
      return '基础施工';
    case 'MAIN':
      return '主体施工';
    case 'FINISHING':
      return '收尾验收';
  }
}

/** Generate random boss for a new project */
export function rollBossType(): BossType {
  const types: BossType[] = ['MICROMANAGER', 'GHOST', 'SUPPORTIVE', 'CELEBRITY'];
  return types[Math.floor(Math.random() * types.length)];
}
