/**
 * Certificate Registry — defines all obtainable certificates in the game.
 * Each certificate has a total study points needed. Actions contribute study points
 * rather than granting whole certificates instantly.
 */

export interface CertificateDef {
  id: string;
  name: string;
  description: string;
  pointsRequired: number;
  /** Which action IDs contribute study points toward this cert */
  contributingActions: string[];
  /** Minimum career stage to unlock */
  minStage: number;
}

export const CERTIFICATE_REGISTRY: CertificateDef[] = [
  {
    id: 'safety_c',
    name: '安全员C证',
    description: '施工企业项目专职安全员必备，上岗基本证件。',
    pointsRequired: 30,
    contributingActions: ['safety_training', 'cert_study'],
    minStage: 0,
  },
  {
    id: 'constructor_2',
    name: '二级建造师',
    description: '建筑行业核心资质，项目经理必备证书之一。',
    pointsRequired: 60,
    contributingActions: ['cert_study', 'study_drawings', 'write_plan'],
    minStage: 0,
  },
  {
    id: 'constructor_1',
    name: '一级建造师',
    description: '建筑行业高级资质，大型项目负责人必备。',
    pointsRequired: 120,
    contributingActions: ['cert_study', 'study_drawings', 'write_plan', 'expert_review'],
    minStage: 1,
  },
  {
    id: 'quality_cert',
    name: '质量员证',
    description: '工程质量管理岗位专业证书。',
    pointsRequired: 35,
    contributingActions: ['cert_study', 'material_check', 'lab_curve_trace'],
    minStage: 0,
  },
  {
    id: 'cost_engineer',
    name: '造价工程师',
    description: '工程造价管理专业资质，商务岗核心竞争力。',
    pointsRequired: 80,
    contributingActions: ['cert_study', 'shadow_estimator'],
    minStage: 1,
  },
  {
    id: 'surveyor_cert',
    name: '测量员证',
    description: '工程测量岗位专业证书。',
    pointsRequired: 40,
    contributingActions: ['cert_study', 'survey_line'],
    minStage: 0,
  },
  {
    id: 'safety_engineer',
    name: '注册安全工程师',
    description: '安全生产管理领域的高级资质。',
    pointsRequired: 100,
    contributingActions: ['cert_study', 'safety_training'],
    minStage: 1,
  },
  {
    id: 'bim_cert',
    name: 'BIM工程师',
    description: '建筑信息模型技术应用证书，数字化建造方向。',
    pointsRequired: 50,
    contributingActions: ['cert_study', 'tech_innovation', 'self_learn_coding'],
    minStage: 0,
  },
  {
    id: 'senior_engineer',
    name: '高级工程师职称',
    description: '专业技术人员高级职称评审，需论文+项目业绩。',
    pointsRequired: 150,
    contributingActions: ['cert_study', 'expert_review', 'tech_innovation', 'industry_exchange'],
    minStage: 2,
  },
];

export const CERT_BY_ID = Object.fromEntries(
  CERTIFICATE_REGISTRY.map(c => [c.id, c])
) as Record<string, CertificateDef>;

/**
 * Given an action ID and the old `certificateGain` value, distribute study points
 * across eligible certificates (ones where this action is a contributor and not yet completed).
 * Returns the updated certProgress map and the number of newly completed certificates.
 */
export function applyCertStudyPoints(
  actionId: string,
  rawPoints: number,
  currentProgress: Record<string, number>,
  careerStage: number,
): { newProgress: Record<string, number>; newlyCompleted: string[] } {
  const prog = { ...currentProgress };
  const newlyCompleted: string[] = [];

  const eligible = CERTIFICATE_REGISTRY.filter(
    c => c.minStage <= careerStage && c.contributingActions.includes(actionId)
  );
  if (eligible.length === 0) return { newProgress: prog, newlyCompleted };

  const pointsEach = Math.max(1, Math.ceil(rawPoints / eligible.length));

  for (const cert of eligible) {
    const current = prog[cert.id] ?? 0;
    if (current >= cert.pointsRequired) continue;
    const next = Math.min(cert.pointsRequired, current + pointsEach);
    prog[cert.id] = next;
    if (next >= cert.pointsRequired && current < cert.pointsRequired) {
      newlyCompleted.push(cert.id);
    }
  }

  return { newProgress: prog, newlyCompleted };
}

export function countCompletedCerts(progress: Record<string, number>): number {
  return CERTIFICATE_REGISTRY.filter(c => (progress[c.id] ?? 0) >= c.pointsRequired).length;
}

export function getCompletedCertIds(progress: Record<string, number>): string[] {
  return CERTIFICATE_REGISTRY.filter(c => (progress[c.id] ?? 0) >= c.pointsRequired).map(c => c.id);
}
