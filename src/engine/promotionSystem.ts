import type { GameState, CareerEvent, CareerTrack } from '../types/index';
import { CAREER_STAGES, getCareerTitle, meetsPromotionRequirements } from '../data/careerPaths';
import { MAX_CAREER_STAGE } from '../config/gameConfig';
import { getCompletedCertIds } from '../data/certificateRegistry';

/** Target stage after promotion (1–4); narratives keyed by this, not current intern stage */
type PromotionTargetStage = 1 | 2 | 3 | 4;

export interface PromotionCheckResult {
  eligible: boolean;
  currentTitle: string;
  nextTitle: string;
  missing: string[];
  bonusConditions: string[];
}

/** Check if player can be promoted to the next stage */
export function checkPromotionEligibility(state: GameState): PromotionCheckResult {
  const nextStage = state.careerStage + 1;
  const currentTitle = getCareerTitle(state.careerTrack, state.careerStage);

  if (nextStage > MAX_CAREER_STAGE) {
    return {
      eligible: false,
      currentTitle,
      nextTitle: '已达最高职级',
      missing: ['已到达职业天花板'],
      bonusConditions: [],
    };
  }

  const nextTitle = getCareerTitle(state.careerTrack, nextStage);

  const { met, missing } = meetsPromotionRequirements(nextStage, {
    certificates: state.certificates,
    completedCertIds: getCompletedCertIds(state.certProgress),
    careerTrack: state.careerTrack,
    reputation: state.reputation,
    experience: state.experience,
    totalCompletedSections: state.project.completedSections + (state.totalProjectsCompleted > 0 ? state.totalProjectsCompleted * 3 : 0),
    ownerSatisfaction: state.project.ownerSatisfaction,
    bossApproval: state.project.bossApproval,
    networkValue: state.networkValue,
  });

  const bonusConditions: string[] = [];
  if (state.project.bossApproval >= 80) bonusConditions.push('上级高度信任');
  if (state.reputation >= 80) bonusConditions.push('行业口碑优秀');
  if (state.totalProjectsCompleted >= 3) bonusConditions.push('项目经验丰富');

  return {
    eligible: met,
    currentTitle,
    nextTitle,
    missing,
    bonusConditions,
  };
}

/** Apply promotion to the game state */
export function applyPromotion(prev: GameState): GameState {
  const newStage = Math.min(prev.careerStage + 1, MAX_CAREER_STAGE);
  const newTitle = getCareerTitle(prev.careerTrack, newStage);
  const stageDef = CAREER_STAGES[newStage];

  const event: CareerEvent = {
    totalQuarter: prev.totalQuarters,
    type: 'PROMOTE',
    description: `晋升为 ${newTitle}`,
  };

  const salaryRaise = stageDef ? stageDef.baseSalary - (CAREER_STAGES[prev.careerStage]?.baseSalary ?? 0) : 2000;

  return {
    ...prev,
    careerStage: newStage,
    salary: prev.salary + salaryRaise,
    morale: Math.min(100, prev.morale + 20),
    careerHistory: [...prev.careerHistory, event],
  };
}

const PROMOTION_NARRATIVES: Record<CareerTrack, Record<PromotionTargetStage, string>> = {
  TECH: {
    1:
      '师傅不再每天盯着你看图了，因为他开始把图甩给你说「你来」。板房从六人间换到四人间，你终于有了自己的半张桌子和一个插座。第一次独立签技术交底的时候，手心全是汗——不是热的，是怕的。可签完那一刻，你突然懂了：怕，说明这事终于算在你头上了。',
    2:
      '会议纪要里开始出现你的名字，而且不是抄送那一栏。小年轻喊你「某工」时尾音都恭敬了半度，你心里暗爽，脸上还要装淡定。审图意见你写「原则同意」四个字前，会多瞄一眼窗外——那一片脚手架，忽然都像在等你点头。',
    3:
      '名片上终于印了「总工程师」四个字。开会时不再坐角落了，你有了一把转椅和一只会议专属水杯。设计院打电话来不再找你领导，直接找你——每一次铃声都是一个新的责任。你开玩笑说铃声像催命，同事说那是身价上涨的声音。',
    4:
      '集团红头文件里你的名字和「公司总工」绑在一起，打印机吐纸的声音都像礼炮。以前你改别人的方案，现在你定方向，别人改你的意见。回家路上你想起当年抄规范抄到睡着——笑了，又有点鼻酸：原来真的能从图纸堆里，走到签字能换一栋楼的地方。',
  },
  BUILD: {
    1:
      '对讲机里终于有人喊你「某工」而不是「喂那个」。晨会你不用再缩在最后一排，安全帽上的公司logo都被汗渍浸得更像「老员工认证」。第一次独自签混凝土浇筑令，泵车师傅冲你竖大拇指——你差点回敬一个礼，忍住了，怕显得太幼稚。',
    2:
      '你手下有了固定班组，工人扯皮先找你，监理挑刺也先@你。手机电量掉得比混凝土坍落度还快。可深夜收工，现场灯一盏盏灭掉的时候，你会站在基坑边抽一口风：这片坑，是你带着人一寸寸填起来的，土腥味里居然有点甜。',
    3:
      '工期、人机料法环全挂在你名下，项目经理看你像看救火队长。甲方来视察，介绍到你这儿会多停半分钟——那半分钟够你背一遍文明施工口号。你学会了在骂娘和微笑之间无缝切换，像切换施工日志的模板：累，但爽。',
    4:
      '项目经理的胸牌挂上那天，你在办公室对着镜子整理了三次领带——其实工地根本没人看你领带。从此罚款单、奖励单、工期函都往你桌上堆。你发朋友圈只敢发「现场一切正常」，因为你知道：你发的不是状态，是军令状。',
  },
  BIZ: {
    1:
      'Excel 从「表格」变成了你的第二母语，变更单上的数字你一眼能看出哪里「温柔得不像甲方」。领导把一叠签证复印件推过来时说「你核一下」，你点头，心里在尖叫：终于轮到我对别人的粗心皱眉了。咖啡戒不掉，但熬夜算量时，灯下的影子像个真正的商务。',
    2:
      '你带两个新人对量，他们叫你「老师」时你差点把鼠标扔出去——你明明觉得自己还在学徒期。甲方的电话开始直接进你通讯录，备注从「某总」变成「某总（别接太快显得闲）」。每一次谈判散场，你都知道：省下来的每一分钱，都是项目部晚饭能不能加鸡腿。',
    3:
      '合同、索赔、结算三条线在你桌上会师，盖章声比工地打桩还密。财务见你眼睛会亮，分包见你腿会软——你夹在中间，像一块会走路的防火墙。有人说商务冷血，你只笑：冷血的是条款，热血的是你想把项目从亏损边缘拽回来的那股劲。',
    4:
      '「商务总监」四个字印在名片上，投标会议室里你坐的那一侧，空气都薄一点。你审别人的标书，红笔一挥像判官，心里却记得自己当年被退标三次的狼狈。现在猎头加你微信，备注写「行业稀缺人才」——你截图给老婆看，她说：先把房贷算清楚再飘。',
  },
};

/** Get promotion narrative text (modal opens before accept; uses next stage). */
export function getPromotionNarrative(state: GameState): { title: string; body: string } {
  const track = state.careerTrack;
  const nextStage = state.careerStage + 1;
  const nextTitle = getCareerTitle(track, nextStage);

  if (nextStage < 1 || nextStage > MAX_CAREER_STAGE) {
    return {
      title: `晋升：${getCareerTitle(track, state.careerStage)}`,
      body: `恭喜晋升为 ${nextTitle}！新的挑战在等着你。`,
    };
  }

  const body =
    PROMOTION_NARRATIVES[track][nextStage as PromotionTargetStage] ??
    `恭喜晋升为 ${nextTitle}！新的挑战在等着你。`;

  return {
    title: `晋升：${nextTitle}`,
    body,
  };
}

const STAGE_CHANGE_EFFECTS: Record<
  CareerTrack,
  Record<'0-1' | '1-2' | '2-3' | '3-4', string[]>
> = {
  TECH: {
    '0-1': [
      '独立签字权限开放',
      '板房升级：六人间→四人间',
      '开始有人叫你「老师」',
      '技术交底由你主讲',
      '图纸变更单开始经你手',
    ],
    '1-2': [
      '下属开始向你汇报',
      '甲方开始记住你的名字',
      '出差报销额度提升',
      '方案评审你有一票否决权（精神上）',
      '设计院联系邮箱里你是主送',
    ],
    '2-3': [
      '获得公司年会发言资格',
      '行业协会邀请入会',
      '猎头开始打你电话',
      '创优申报你是第一责任人',
      'BIM 账号权限全开',
    ],
    '3-4': [
      '名片重新印刷',
      '公司决策层列席',
      '行业论坛主题发言邀请',
      '集团技术标准编委会挂名',
      '重大方案「总工办」终审到你案头',
    ],
  },
  BUILD: {
    '0-1': [
      '独立签字权限开放',
      '板房升级：六人间→四人间',
      '对讲机频道里你是被@对象',
      '晨会站第二排',
      '混凝土浇筑令可独立签发',
    ],
    '1-2': [
      '下属开始向你汇报',
      '甲方开始记住你的名字',
      '出差报销额度提升',
      '班组调配表上你是签字栏',
      '监理例会你必须到场',
    ],
    '2-3': [
      '获得公司年会发言资格',
      '行业协会邀请入会',
      '猎头开始打你电话',
      '总进度计划由你拍板',
      '大型机械进场你点头才算',
    ],
    '3-4': [
      '名片重新印刷',
      '公司决策层列席',
      '行业论坛主题发言邀请',
      '项目经理部公章交接仪式（心理版）',
      '甲方董事长视察指定由你汇报',
    ],
  },
  BIZ: {
    '0-1': [
      '独立签字权限开放',
      '板房升级：六人间→四人间',
      '开始有人叫你「老师」',
      '签证单核算默认归你',
      '成本月报出现你的署名',
    ],
    '1-2': [
      '下属开始向你汇报',
      '甲方开始记住你的名字',
      '出差报销额度提升',
      '商务谈判对方对接升级为主管级',
      '分包结算初审你签字才流转',
    ],
    '2-3': [
      '获得公司年会发言资格',
      '行业协会邀请入会',
      '猎头开始打你电话',
      '合同谈判你坐主位一侧',
      '索赔函抄送栏你是第一行',
    ],
    '3-4': [
      '名片重新印刷',
      '公司决策层列席',
      '行业论坛主题发言邀请',
      '投标定价会你有一锤定音权',
      '战略客户框架协议由你牵头',
    ],
  },
};

/** Short bullets describing visible world changes after this promotion (for modal list). */
export function getStageChangeEffects(fromStage: number, toStage: number, track: CareerTrack): string[] {
  if (toStage !== fromStage + 1 || fromStage < 0 || toStage > MAX_CAREER_STAGE) {
    return [];
  }
  const key = `${fromStage}-${toStage}` as '0-1' | '1-2' | '2-3' | '3-4';
  return STAGE_CHANGE_EFFECTS[track][key] ?? [];
}

/** Get the actions-per-quarter limit for current stage */
export function getActionsPerQuarter(careerStage: number): number {
  const def = CAREER_STAGES[Math.min(careerStage, CAREER_STAGES.length - 1)];
  return def?.actionsPerQuarter ?? 20;
}

/** Get quarterly salary based on career stage */
export function getQuarterlySalary(careerStage: number): number {
  const def = CAREER_STAGES[Math.min(careerStage, CAREER_STAGES.length - 1)];
  return def?.baseSalary ?? 4000;
}
