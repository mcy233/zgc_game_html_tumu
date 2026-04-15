import type { GameState, Moment } from '../types/index';
import type { BossInteractionEffect } from '../data/bossInteractions';
import type { CoworkerInteractionEffect } from '../data/coworkerInteractions';
import { getCareerTitle } from '../data/careerPaths';
import { phaseLabel } from '../data/projectTemplates';

export const PM_NAMES = ['周铁军', '吴立柱', '郑标高', '王节点', '冯浇筑', '陈验筋'];

export const SITE_SCHOOLS = ['某铁路高职', '某建工学院', '某交通职院', '某理工土木系'] as const;

export const PEER_MOMENT_POOL = [
  '监理例会纪要写「原则同意」，翻译：下周继续扯皮。',
  '班组群里有人发「今晚加班」，你默默把消息标成未读。',
  '混凝土试块编号贴反了，资料员在打印机前灵魂出窍。',
  '塔吊司机在对讲机里讲段子，比你周报还精彩。',
  '甲方群里甩来新 PDF，文件名写着「最终版_真的最终」。',
  '隔壁标段又出了安全通报，你默默检查了一下自己的围挡。',
  '食堂换了新师傅，大家比关心节点还关心今天的菜。',
];

export function pickSchool(): string {
  return SITE_SCHOOLS[Math.floor(Math.random() * SITE_SCHOOLS.length)]!;
}

export function clamp100(n: number): number {
  return Math.min(100, Math.max(0, n));
}

export function applyInteractionDelta(prev: GameState, delta: BossInteractionEffect): GameState {
  let s = { ...prev };
  let p = { ...s.project };
  if (delta.morale != null) s.morale = clamp100(s.morale + delta.morale);
  if (delta.stamina != null) s.stamina = clamp100(s.stamina + delta.stamina);
  if (delta.energy != null) s.energy = clamp100(s.energy + delta.energy);
  if (delta.bossApproval != null) p.bossApproval = clamp100(p.bossApproval + delta.bossApproval);
  if (delta.materials != null) p.materials = Math.max(0, p.materials + delta.materials);
  if (delta.planProgress != null) {
    p.planProgress = clamp100(p.planProgress + delta.planProgress);
    if (p.planProgress >= 100) {
      p.submittedSections += 1;
      p.planProgress = 0;
    }
  }
  if (delta.progress != null) p.progress = clamp100(p.progress + delta.progress);
  if (delta.reputation != null) s.reputation = clamp100(s.reputation + delta.reputation);
  if (delta.salary != null) s.salary = Math.max(0, s.salary + delta.salary);
  if (delta.certificates != null) s.certificates = Math.max(0, s.certificates + delta.certificates);
  if (delta.safetyRisk != null) s.safetyRisk = clamp100(s.safetyRisk + delta.safetyRisk);
  if (delta.reviews != null) s.experience = Math.max(0, s.experience + (delta.reviews ?? 0));
  s.project = p;
  return s;
}

export function applyCoworkerInteractionDelta(
  prev: GameState,
  delta: CoworkerInteractionEffect,
  cwId: string
): GameState {
  const { coworkerApproval: _drop, ...bossLike } = delta;
  let s = applyInteractionDelta(prev, bossLike);
  if (delta.coworkerApproval != null) {
    s = {
      ...s,
      project: {
        ...s.project,
        coworkers: s.project.coworkers.map((c) =>
          c.id === cwId ? { ...c, favor: clamp100(c.favor + delta.coworkerApproval!) } : c
        ),
      },
    };
  }
  return s;
}

export function seedCoworkers(q: number): GameState['project']['coworkers'] {
  return [
    {
      id: 'cw_a',
      name: '钢筋华哥',
      position: '老师傅',
      role: '老师傅',
      year: 3,
      status: '在绑扎钢筋',
      favor: 52,
      lastInteractedQuarter: q,
    },
    {
      id: 'cw_b',
      name: '管线阿伟',
      position: '施工员',
      role: '前辈',
      year: 2,
      status: '被监理追着要回复单',
      favor: 48,
      lastInteractedQuarter: q,
    },
  ];
}

/** Main task hint for the current project phase */
export function mainTaskHintHtml(s: GameState): string | null {
  const title = getCareerTitle(s.careerTrack, s.careerStage);
  const phaseName = phaseLabel(s.project.phase);

  switch (s.project.phase) {
    case 'PREP':
      return `<strong class="text-indigo-700">${title}</strong> · ${phaseName}阶段：做好安全培训、熟悉图纸、准备开工资料。`;
    case 'FOUNDATION':
      return `<strong class="text-indigo-700">${title}</strong> · ${phaseName}阶段：基础施工是关键，注意地质风险和安全管理。`;
    case 'MAIN':
      return `<strong class="text-indigo-700">${title}</strong> · ${phaseName}阶段：主体结构冲刺，盯进度、抓质量、控安全。`;
    case 'FINISHING':
      return `<strong class="text-indigo-700">${title}</strong> · ${phaseName}阶段：收尾验收在即，资料闭合和整改是重点。`;
  }
}

export function makePeerMoment(s: GameState): Moment {
  const content = PEER_MOMENT_POOL[Math.floor(Math.random() * PEER_MOMENT_POOL.length)]!;
  const authors = ['监理老赵', '分包老钱', '安全员小孙', '资料员阿周'];
  const author = authors[Math.floor(Math.random() * authors.length)]!;
  return {
    id: `m-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    quarter: s.totalQuarters,
    content,
    author,
    likes: Math.floor(Math.random() * 12),
    comments: [],
    hasInteracted: false,
    timestamp: '刚刚',
    feedSource: 'PEER',
  };
}
