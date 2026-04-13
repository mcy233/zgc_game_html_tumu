import { DEFAULT_ACTIONS_PER_QUARTER } from '../../config/gameConfig';

const ACTIONS_PER_QUARTER = DEFAULT_ACTIONS_PER_QUARTER;

/** 与主界面 Tab 一致：首页 / 学习 / 工作 / 团队 / 资产 */
export type OnboardingTab = 'HOME' | 'DAILY' | 'CONSTRUCTION' | 'TEAM' | 'ASSETS';
export type OnboardingRightTab = 'LOGS' | 'MOMENTS' | 'HONORS';

const S = 'text-amber-700 dark:text-amber-400 font-semibold';
const T = 'text-blue-700 dark:text-blue-400 font-semibold';

function em(cls: string, inner: string): string {
  return '<strong class="' + cls + '">' + inner + '</strong>';
}

export type TutorialStep = {
  id: string;
  title: string;
  body: string;
  highlightId?: string;
  layoutZone?: 'ARCHIVE' | 'MAIN' | 'FEED';
  activeTab?: OnboardingTab;
  rightTab?: OnboardingRightTab;
};

export const SURVIVAL_GUIDE_META = {
  title: '进场须知',
  subtitle: '重生之我在工地做土木 · 项目部生存指南',
} as const;

export const SURVIVAL_SECTIONS: {
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
  highlight?: string[];
}[] = [
  {
    heading: '一、你是谁？',
    paragraphs: [
      '你是一名刚入职施工单位的新人，将在工地项目部从基层做起。根据你选择的岗位（技术岗/施工岗/商务岗），一步步从见习员工晋升到项目经理甚至更高。',
    ],
  },
  {
    heading: '二、怎么玩？',
    bullets: [
      '每个季度你有' + em(S, String(ACTIONS_PER_QUARTER) + '次行动机会') + '，用来学习、工作、社交等。行动用完后，点击「进入下季度」推进时间。',
      '每个项目大约持续2年（8个季度），完成后会进入' + em(S, '转场期') + '，你可以选择继续做下一个项目，也可以选择跳槽、考公、转行等人生道路。',
      '在转场期达到条件时会触发' + em(S, '晋升考核') + '，通过后职级提升，解锁新的行动和更高的工资。',
    ],
  },
  {
    heading: '三、怎么会输？',
    bullets: [
      em(S, '心态、体力、精力') + '任意一项归零 → 身心崩溃，被迫离场。',
      em(S, '安全风险') + '过高 → 触发安全事故，项目停工。',
      em(S, '行业口碑') + '跌至谷底 → 业内混不下去了。',
      '安全培训长期不达标 → 被项目部清退。',
    ],
  },
  {
    heading: '四、核心指标说明',
    bullets: [
      em(S, '心态/体力/精力') + '：你的生存资源。工作会消耗它们，散步、休息可以恢复。',
      em(S, '工资/物资') + '：工资用于社交和考证消费，物资影响施工效率。每季度会自动进账。',
      em(S, '安全风险') + '：越高越危险。巡检、培训能降低风险，抢工赶进度则会增加风险。',
      em(S, '行业口碑') + '：影响晋升、跳槽和各种人生选择的成功率。',
      em(S, '经验值/人脉值') + '：新增的成长属性，经验值影响晋升条件，人脉值影响跳槽和创业选项。',
      em(S, '上级信任度') + '：每个项目的领导都不同，维护好关系会影响项目评价。',
    ],
  },
  {
    heading: '五、界面分区',
    bullets: [
      em(S, '档案（左栏）') + '：查看你的各项属性和状态，也可以在这里散步、休息来恢复状态。',
      em(S, '主页（中栏）') + '：核心操作区。「首页」看个人信息；「学习」考证和自我提升；「工作」执行本岗位任务；「团队」与领导和同事互动；「资产」管理你的装备。',
      em(S, '动态（右栏）') + '：查看施工日志、工友圈动态、已获荣誉。',
    ],
  },
  {
    heading: '六、小贴士',
    bullets: [
      '刚入职时不要急着赶进度，先跟师傅学习、参加培训打好基础。',
      '每季度记得和领导互动一次，长期不互动信任度会下降。',
      '安全培训不要跳过，前期合规检查不达标会被清退。',
      '攒够条件后转场期会出现晋升和人生选择，不要错过。',
      '右上角「？」可随时重新查看本须知或启动分步导览。',
    ],
  },
];

export const TUTORIAL_STEPS: TutorialStep[] = [
  {
    id: 'welcome',
    title: '欢迎进场',
    body: '这是快速导览，帮你了解界面各个区域。可随时跳过，需要时点右上角「？」重新开始。',
  },
  {
    id: 'header',
    title: '顶栏信息',
    body:
      '顶栏显示你当前的' +
      em(T, '项目名称、职级、项目阶段和天气') +
      '。右上角的' +
      em(T, '？') +
      '可以打开进场须知和导览。',
    highlightId: 'onb-header',
    layoutZone: 'MAIN',
    activeTab: 'HOME',
  },
  {
    id: 'stats',
    title: '档案 · 个人状态',
    body:
      '这里显示你的' +
      em(T, '心态、体力、精力') +
      '三条生存线，以及' +
      em(T, '安全风险、工资、物资') +
      '等关键数值。任何一条生存线归零游戏就结束了，注意保持。',
    highlightId: 'onb-stats-card',
    layoutZone: 'ARCHIVE',
  },
  {
    id: 'self',
    title: '档案 · 自我调节',
    body:
      '工作压力大时，可以通过' +
      em(T, '工间散步、板房躺平、外出放风') +
      '来恢复心态和体力。合理安排休息是长期生存的关键。',
    highlightId: 'onb-self-reg',
    layoutZone: 'ARCHIVE',
  },
  {
    id: 'tabs',
    title: '主页 · 功能标签',
    body:
      '中间区域分为五个标签：' +
      em(T, '首页') +
      '看个人信息；' +
      em(T, '学习') +
      '考证和自我提升；' +
      em(T, '工作') +
      '做本岗位日常任务；' +
      em(T, '团队') +
      '与领导同事互动；' +
      em(T, '资产') +
      '管理装备。',
    highlightId: 'onb-tab-bar',
    layoutZone: 'MAIN',
    activeTab: 'HOME',
  },
  {
    id: 'home',
    title: '首页 · 个人卡片',
    body: '展示你当前的职级、所在项目和进度概况。随时回来看看自己的成长轨迹。',
    highlightId: 'onb-home-card',
    layoutZone: 'MAIN',
    activeTab: 'HOME',
  },
  {
    id: 'daily',
    title: '学习页',
    body:
      '这里是' +
      em(T, '自我提升') +
      '的地方：安全培训、考取资格证书、研究行业知识等。每季最多 ' +
      em(T, String(ACTIONS_PER_QUARTER)) +
      ' 次行动，学习和工作共享次数。',
    highlightId: 'onb-main-body',
    layoutZone: 'MAIN',
    activeTab: 'DAILY',
  },
  {
    id: 'construction',
    title: '工作页',
    body:
      '这里是' +
      em(T, '本岗位日常工作') +
      '：盯施工、写方案、图纸会审、甲方汇报等。注意' +
      em(T, '物资和工资') +
      '消耗，合理安排行动。',
    highlightId: 'onb-main-body',
    layoutZone: 'MAIN',
    activeTab: 'CONSTRUCTION',
  },
  {
    id: 'boss',
    title: '团队 · 领导与同事',
    body:
      '在团队页可以和' +
      em(T, '项目经理') +
      '汇报互动，也可以和' +
      em(T, '工友') +
      '社交。每季至少和领导互动一次，维持信任度。',
    highlightId: 'onb-team-advisor-card',
    layoutZone: 'MAIN',
    activeTab: 'TEAM',
  },
  {
    id: 'assets',
    title: '资产',
    body: '已购装备在此陈列，每季初可能有流动供货商上门推销装备，装备可以提供每季度的工资或物资加成。',
    highlightId: 'onb-main-body',
    layoutZone: 'MAIN',
    activeTab: 'ASSETS',
  },
  {
    id: 'logs',
    title: '动态 · 施工日志',
    body: '按季度记录所有重要事件，回顾你的成长历程。',
    highlightId: 'onb-feed-panel',
    layoutZone: 'FEED',
    rightTab: 'LOGS',
  },
  {
    id: 'moments',
    title: '动态 · 工友圈',
    body:
      '工友们会发布动态，有' + em(T, '红点') + '提示新内容。点赞互动可以回复少量心态。',
    highlightId: 'onb-feed-panel',
    layoutZone: 'FEED',
    rightTab: 'MOMENTS',
  },
  {
    id: 'honors_feed',
    title: '动态 · 荣誉称号',
    body: '达成特定条件会解锁荣誉称号，在这里查看已获得的所有称号。',
    highlightId: 'onb-feed-panel',
    layoutZone: 'FEED',
    rightTab: 'HONORS',
  },
  {
    id: 'done',
    title: '导览结束',
    body: '祝你在项目部平安成长、步步高升！需要时点右上角「？」可以重新查看。',
  },
];
