import type { GameState } from '../types/index';

export const DEFAULT_PROFILE_HEADLINE = '工地小白（进场实习中）';

export type ProfileHonorDef = {
  id: string;
  priority: number;
  headlineTitle: string;
  popupTitle: string;
  unlockBody: string;
  condition: (s: GameState) => boolean;
};

const H: ProfileHonorDef[] = [
  // --- 收集 / 巅峰 ---
  {
    id: 'grandmaster',
    priority: 0,
    headlineTitle: '一代宗师',
    popupTitle: '称号解锁：一代宗师',
    unlockBody: '段位、资历、名声全拉满。再往上走，只能去当行业传说本人了。',
    condition: s =>
      s.careerStage >= 4 && s.experience >= 1000 && s.reputation >= 80,
  },
  // --- 职业阶段（既有）---
  {
    id: 'career_stage_4',
    priority: 1,
    headlineTitle: '行业领袖',
    popupTitle: '称号解锁：行业领袖',
    unlockBody: '你已达到职业最高阶段。行业会议上你坐主席台，签字盖章的分量不是一个项目能衡量的。',
    condition: s => s.careerStage >= 4,
  },
  {
    id: 'career_stage_3',
    priority: 2,
    headlineTitle: '项目骨干',
    popupTitle: '称号解锁：项目骨干',
    unlockBody: '经理级别了。项目的走向和结果，你说了不少算。',
    condition: s => s.careerStage >= 3,
  },
  {
    id: 'career_stage_2',
    priority: 3,
    headlineTitle: '独当一面',
    popupTitle: '称号解锁：独当一面',
    unlockBody: '负责人了。签字有了分量，锅也更大了。',
    condition: s => s.careerStage >= 2,
  },
  {
    id: 'industry_titan',
    priority: 4,
    headlineTitle: '行业泰斗',
    popupTitle: '称号解锁：行业泰斗',
    unlockBody: '口碑 90+，业内提到你都要先咳嗽两声以示尊重。',
    condition: s => s.reputation >= 90,
  },
  {
    id: 'career_stage_1',
    priority: 5,
    headlineTitle: '正式员工',
    popupTitle: '称号解锁：正式员工',
    unlockBody: '试用期结束，从"那个新来的"变成了"X工"。',
    condition: s => s.careerStage >= 1,
  },
  {
    id: 'projects_five',
    priority: 6,
    headlineTitle: '项目老炮',
    popupTitle: '称号解锁：项目老炮',
    unlockBody: '五个项目都扛过来了。你的名字在工地江湖里已经小有名气。',
    condition: s => s.totalProjectsCompleted >= 5,
  },
  {
    id: 'network_titan',
    priority: 7,
    headlineTitle: '人脉通天',
    popupTitle: '称号解锁：人脉通天',
    unlockBody: '人脉 80+，通讯录比材料清单还厚，打个电话能摇来半座城。',
    condition: s => s.networkValue >= 80,
  },
  {
    id: 'projects_three',
    priority: 8,
    headlineTitle: '多面手',
    popupTitle: '称号解锁：多面手',
    unlockBody: '完成三个项目。切换标段比切换输入法还熟练。',
    condition: s => s.totalProjectsCompleted >= 3,
  },
  {
    id: 'owner_bestie',
    priority: 9,
    headlineTitle: '甲方之友',
    popupTitle: '称号解锁：甲方之友',
    unlockBody: '甲方满意度拉满。群里的红包你抢不抢不重要，重要的是你永远被@在最前面。',
    condition: s => s.project.ownerSatisfaction >= 90,
  },
  {
    id: 'experience_500',
    priority: 10,
    headlineTitle: '经验丰富',
    popupTitle: '称号解锁：经验丰富',
    unlockBody: '经验值突破 500。你的每一步都踩在钢筋上，稳。',
    condition: s => s.experience >= 500,
  },
  {
    id: 'network_50',
    priority: 11,
    headlineTitle: '人脉广阔',
    popupTitle: '称号解锁：人脉广阔',
    unlockBody: '人脉值达到 50。名片交换完，朋友圈又多了一百个"工友"。',
    condition: s => s.networkValue >= 50,
  },
  {
    id: 'reputation_80',
    priority: 12,
    headlineTitle: '甲方最佳伙伴',
    popupTitle: '称号解锁：甲方最佳伙伴',
    unlockBody: '口碑 80+。甲方群里你的消息永远秒回。',
    condition: s => s.reputation >= 80,
  },
  {
    id: 'salary_100k',
    priority: 13,
    headlineTitle: '存款六位数',
    popupTitle: '称号解锁：存款六位数',
    unlockBody: '工资账面突破十万。在工地攒钱，你做到了城市白领羡慕的事。',
    condition: s => s.salary >= 100000,
  },
  {
    id: 'quarter_20',
    priority: 14,
    headlineTitle: '工地老油条',
    popupTitle: '称号解锁：工地老油条',
    unlockBody: '在工地待了 20 个季度以上。晴雨表不在气象台，在你膝盖。',
    condition: s => s.totalQuarters >= 20,
  },
  // --- 职业成就（扩展）---
  {
    id: 'tech_master',
    priority: 15,
    headlineTitle: '技术大拿',
    popupTitle: '称号解锁：技术大拿',
    unlockBody: '技术线走到管理岗，图纸和规范看见你都要立正。',
    condition: s => s.careerTrack === 'TECH' && s.careerStage >= 3,
  },
  {
    id: 'build_iron',
    priority: 16,
    headlineTitle: '铁血施工',
    popupTitle: '称号解锁：铁血施工',
    unlockBody: '施工线扛到高层，塔吊见了你都想喊一声大哥。',
    condition: s => s.careerTrack === 'BUILD' && s.careerStage >= 3,
  },
  {
    id: 'biz_elite',
    priority: 17,
    headlineTitle: '商务精英',
    popupTitle: '称号解锁：商务精英',
    unlockBody: '商务线混到经理级，合同条款在你眼里都是人情世故。',
    condition: s => s.careerTrack === 'BIZ' && s.careerStage >= 3,
  },
  {
    id: 'project_finisher',
    priority: 18,
    headlineTitle: '项目终结者',
    popupTitle: '称号解锁：项目终结者',
    unlockBody: '五个项目善终。你是行走的竣工验收通知书。',
    condition: s => s.totalProjectsCompleted >= 5,
  },
  {
    id: 'mentor_pro',
    priority: 19,
    headlineTitle: '带新人达人',
    popupTitle: '称号解锁：带新人达人',
    unlockBody: '经验 800+ 还带过队，实习生见你比见安全员还紧张。',
    condition: s => s.experience >= 800 && s.careerStage >= 2,
  },
  {
    id: 'scheme_king',
    priority: 20,
    headlineTitle: '方案之王',
    popupTitle: '称号解锁：方案之王',
    unlockBody: '经验与证书双高，改方案改到打印机都认你做干爹。',
    condition: s => s.experience >= 500 && s.certificates >= 25,
  },
  {
    id: 'safety_model',
    priority: 21,
    headlineTitle: '安全标兵',
    popupTitle: '称号解锁：安全标兵',
    unlockBody: '八个季度安全红线守得比工资还牢，安监站都想给你发锦旗。',
    condition: s => s.totalQuarters >= 8 && s.safetyRisk < 20,
  },
  {
    id: 'full_attendance_warrior',
    priority: 22,
    headlineTitle: '全勤战士',
    popupTitle: '称号解锁：全勤战士',
    unlockBody: '一年以上体力条仍坚挺，咖啡见了你都要喊前辈。',
    condition: s => s.totalQuarters >= 12 && s.stamina > 50,
  },
  {
    id: 'oily_veteran_32q',
    priority: 23,
    headlineTitle: '老油条',
    popupTitle: '称号解锁：老油条',
    unlockBody: '八个年头在工地泡出来，规范背得比身份证号还熟。',
    condition: s => s.totalQuarters >= 32,
  },
  {
    id: 'certified_gate',
    priority: 24,
    headlineTitle: '持证上岗',
    popupTitle: '称号解锁：持证上岗',
    unlockBody: '证书堆到两位数，检查的人问你有没有证，你先问对方要不要复印件。',
    condition: s => s.certificates >= 10,
  },
  {
    id: 'grind_king',
    priority: 25,
    headlineTitle: '卷王本王',
    popupTitle: '称号解锁：卷王本王',
    unlockBody: '经验拉满士气却低迷，你不是在加班，你是在给加班办终身会员。',
    condition: s => s.experience >= 300 && s.morale < 40,
  },
  // --- 收集成就 ---
  {
    id: 'collect_projects_3',
    priority: 26,
    headlineTitle: '项目达人',
    popupTitle: '称号解锁：项目达人',
    unlockBody: '三个项目盖章收工，履历表已经比安全交底还长。',
    condition: s => s.totalProjectsCompleted >= 3,
  },
  {
    id: 'collect_projects_8',
    priority: 27,
    headlineTitle: '老江湖',
    popupTitle: '称号解锁：老江湖',
    unlockBody: '八个项目见过世面，什么奇葩甲方你都能微笑说"收到"。',
    condition: s => s.totalProjectsCompleted >= 8,
  },
  {
    id: 'collect_salary_100k',
    priority: 28,
    headlineTitle: '万元户',
    popupTitle: '称号解锁：万元户',
    unlockBody: '存款六位数，工地板房里你算低调的理财博主。',
    condition: s => s.salary >= 100000,
  },
  {
    id: 'lifetime_half_mil',
    priority: 29,
    headlineTitle: '百万身家',
    popupTitle: '称号解锁：百万身家',
    unlockBody: '这辈子账面流水过半百万，钱虽然路过，但路过得很壮观。',
    condition: s => s.lifetimeEarnings >= 500000,
  },
  {
    id: 'certs_30',
    priority: 30,
    headlineTitle: '双证在手',
    popupTitle: '称号解锁：双证在手',
    unlockBody: '证书 30+，墙上挂一排，拍照都要开广角。',
    condition: s => s.certificates >= 30,
  },
  {
    id: 'certs_50',
    priority: 31,
    headlineTitle: '证书满墙',
    popupTitle: '称号解锁：证书满墙',
    unlockBody: '证书 50+，再考下去办公室要改库房了。',
    condition: s => s.certificates >= 50,
  },
  // --- 生活 / 隐藏 ---
  {
    id: 'moonlight_tribe',
    priority: 40,
    headlineTitle: '月光族',
    popupTitle: '称号解锁：月光族',
    unlockBody: '干了一年存款还不到一百，钱包比安全帽内衬还干净。',
    condition: s => s.salary < 100 && s.totalQuarters >= 4,
  },
  {
    id: 'iron_rice_prep',
    priority: 41,
    headlineTitle: '铁饭碗预备役',
    popupTitle: '称号解锁：铁饭碗预备役',
    unlockBody: '行测申论刷出肌肉记忆，工地只是你备考路上的大型自习室。',
    condition: s => s.civilExamPrep >= 15,
  },
  {
    id: 'code_novice',
    priority: 42,
    headlineTitle: '代码新手',
    popupTitle: '称号解锁：代码新手',
    unlockBody: '会写两行脚本就敢跟总工聊数字化，勇气可嘉。',
    condition: s => s.codingSkill >= 10,
  },
  {
    id: 'degree_grinder',
    priority: 43,
    headlineTitle: '学历狂魔',
    popupTitle: '称号解锁：学历狂魔',
    unlockBody: '考研执念与证书齐飞，书没读完墙先挂满。',
    condition: s => s.gradExamPrep >= 10 && s.certificates >= 20,
  },
  {
    id: 'zen_worker',
    priority: 44,
    headlineTitle: '佛系打工',
    popupTitle: '称号解锁：佛系打工',
    unlockBody: '心态超好口碑随缘，主打一个情绪稳定地摆烂。',
    condition: s => s.morale >= 80 && s.reputation < 30,
  },
  {
    id: 'social_phobia_site',
    priority: 45,
    headlineTitle: '社交恐惧',
    popupTitle: '称号解锁：社交恐惧',
    unlockBody: '两年工地人脉还是个位数，群聊里你永远是"正在输入…"然后没发。',
    condition: s => s.networkValue < 5 && s.totalQuarters >= 8,
  },
  {
    id: 'gear_collector',
    priority: 46,
    headlineTitle: '装备收藏家',
    popupTitle: '称号解锁：装备收藏家',
    unlockBody: '五件家当起步，别人攒首付你攒工位周边。',
    condition: s => s.assets.length >= 5,
  },
  {
    id: 'reputation_comeback',
    priority: 47,
    headlineTitle: '口碑翻盘',
    popupTitle: '称号解锁：口碑翻盘',
    unlockBody: '四年磨一剑，甲方终于从拉黑边缘改口叫老师。',
    condition: s => s.reputation >= 60 && s.totalQuarters >= 16,
  },
  {
    id: 'wellness_guru',
    priority: 48,
    headlineTitle: '养生达人',
    popupTitle: '称号解锁：养生达人',
    unlockBody: '体力心情精力三维拉满，保温杯里泡的不是枸杞，是职场玄学。',
    condition: s => s.stamina >= 90 && s.morale >= 90 && s.energy >= 90,
  },
  {
    id: 'live_on_the_edge',
    priority: 49,
    headlineTitle: '险中求存',
    popupTitle: '称号解锁：险中求存',
    unlockBody: '安全风险 80+ 还没杀青，阎王翻生死簿都得先搜你工号。',
    condition: s => s.safetyRisk >= 80 && s.gamePhase !== 'ENDING',
  },
  // --- 兜底：完成第 1 季度 ---
  {
    id: 'rookie_fresh',
    priority: 100,
    headlineTitle: '初来乍到',
    popupTitle: '称号解锁：初来乍到',
    unlockBody: '第一个季度熬过去了，安全帽终于有了一点故事感。',
    condition: s => s.totalQuarters >= 1,
  },
];

export const PROFILE_HONORS: readonly ProfileHonorDef[] = [...H].sort((a, b) => a.priority - b.priority);

export const PROFILE_HONOR_BY_ID: Record<string, ProfileHonorDef> = Object.fromEntries(
  PROFILE_HONORS.map(h => [h.id, h])
);

export function resolveHomeHeadlineTitle(state: GameState): string {
  const unlocked = new Set(state.unlockedHonors ?? []);
  if (unlocked.size === 0) return DEFAULT_PROFILE_HEADLINE;
  if (state.honorHomeDisplayMode === 'pinned' && state.honorHomePinnedId) {
    const h = PROFILE_HONOR_BY_ID[state.honorHomePinnedId];
    if (h && unlocked.has(state.honorHomePinnedId)) return h.headlineTitle;
  }
  const order = state.honorUnlockOrder ?? [];
  for (let i = order.length - 1; i >= 0; i--) {
    const id = order[i]!;
    if (!unlocked.has(id)) continue;
    const h = PROFILE_HONOR_BY_ID[id];
    if (h) return h.headlineTitle;
  }
  return DEFAULT_PROFILE_HEADLINE;
}

export function listUnlockedHonorsOrdered(state: GameState): ProfileHonorDef[] {
  const unlocked = new Set(state.unlockedHonors ?? []);
  const order = state.honorUnlockOrder ?? [];
  const seen = new Set<string>();
  const out: ProfileHonorDef[] = [];
  for (const id of order) {
    if (seen.has(id) || !unlocked.has(id)) continue;
    seen.add(id);
    const h = PROFILE_HONOR_BY_ID[id];
    if (h) out.push(h);
  }
  for (const id of state.unlockedHonors) {
    if (seen.has(id)) continue;
    seen.add(id);
    const h = PROFILE_HONOR_BY_ID[id];
    if (h) out.push(h);
  }
  return out;
}

export function scanNewHonorIds(state: GameState): string[] {
  const have = new Set(state.unlockedHonors ?? []);
  return PROFILE_HONORS.filter(h => h.condition(state) && !have.has(h.id)).map(h => h.id);
}
