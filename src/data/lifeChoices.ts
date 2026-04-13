import type { LifeChoice } from '../types/index';

export const LIFE_CHOICES: LifeChoice[] = [
  {
    id: 'continue',
    label: '继续干',
    description: '进入下一个项目，继续在工地拼搏。',
    conditions: {},
    isEnding: false,
  },
  {
    id: 'jump_ship',
    label: '跳槽同行',
    description: '带着口碑和经验跳到另一家公司，工资涨 30%，但一切关系从头开始。',
    conditions: { minReputation: 40, minNetwork: 30 },
    isEnding: false,
    endingType: 'JUMP_SHIP',
  },
  {
    id: 'civil_servant',
    label: '考公上岸',
    description: '备考公务员，从此朝九晚五，告别日晒雨淋。需要一定的证书储备和存款。',
    conditions: { minCertificates: 20, minSalary: 50000, minCivilExamPrep: 20 },
    isEnding: true,
    endingType: 'CIVIL_SERVANT',
  },
  {
    id: 'tech_industry',
    label: '转行互联网',
    description: '学编程、投简历、面试造火箭。从搬砖变搬代码，996 换了个形式。',
    conditions: { minNetwork: 50, minSalary: 30000, minCodingSkill: 15 },
    isEnding: true,
    endingType: 'TECH_INDUSTRY',
  },
  {
    id: 'hq_management',
    label: '回总部管理',
    description: '离开工地一线，去公司总部做管理岗。从此PPT比施工日志写得多。',
    conditions: { minStage: 2, minReputation: 60, minManagementSkill: 10 },
    isEnding: true,
    endingType: 'HQ_MANAGEMENT',
  },
  {
    id: 'grad_school',
    label: '考研深造',
    description: '重返校园读研究生。暂离工地两个项目周期后回来，职级 +1。',
    conditions: { maxStage: 1, minCertificates: 15, minGradExamPrep: 15 },
    isEnding: false,
    endingType: 'GRAD_SCHOOL',
  },
  {
    id: 'entrepreneur',
    label: '分包创业',
    description: '拉一支队伍自己干。高风险高回报，老板梦从此开始。',
    conditions: { minStage: 2, minSalary: 100000, minNetwork: 60 },
    isEnding: true,
    endingType: 'ENTREPRENEUR',
  },
];

/** Get available life choices based on current state */
export function getAvailableLifeChoices(state: {
  careerStage: number;
  reputation: number;
  networkValue: number;
  salary: number;
  certificates: number;
  civilExamPrep: number;
  gradExamPrep: number;
  codingSkill: number;
  managementSkill: number;
}): LifeChoice[] {
  return LIFE_CHOICES.filter(choice => {
    const c = choice.conditions;
    if (c.minStage !== undefined && state.careerStage < c.minStage) return false;
    if (c.maxStage !== undefined && state.careerStage > c.maxStage) return false;
    if (c.minReputation !== undefined && state.reputation < c.minReputation) return false;
    if (c.minNetwork !== undefined && state.networkValue < c.minNetwork) return false;
    if (c.minSalary !== undefined && state.salary < c.minSalary) return false;
    if (c.minCertificates !== undefined && state.certificates < c.minCertificates) return false;
    if (c.minCivilExamPrep !== undefined && state.civilExamPrep < c.minCivilExamPrep) return false;
    if (c.minGradExamPrep !== undefined && state.gradExamPrep < c.minGradExamPrep) return false;
    if (c.minCodingSkill !== undefined && state.codingSkill < c.minCodingSkill) return false;
    if (c.minManagementSkill !== undefined && state.managementSkill < c.minManagementSkill) return false;
    return true;
  });
}
