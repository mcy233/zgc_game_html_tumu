export type BossInteractionEffect = Partial<{
  morale: number;
  stamina: number;
  energy: number;
  bossApproval: number;
  materials: number;
  planProgress: number;
  progress: number;
  reputation: number;
  salary: number;
  certificates: number;
  safetyRisk: number;
  reviews: number;
}>;

export interface BossInteraction {
  id: string;
  label: string;
  description: string;
  texts: [string, string, string];
  effect: BossInteractionEffect;
}

export const BOSS_INTERACTIONS: BossInteraction[] = [
  {
    id: 'boss_log_report',
    label: '施工日志汇报',
    description: '把本周旁站、验收、协调事项装订成「人类可读版」，递给项目经理过目。',
    texts: [
      '经理指着日志里「天气：晴」说：「心情也要晴。」你点头，心想晴天和心情在工地是两种气候带。',
      '他夸你影像资料齐，你暗自庆幸昨天没手滑删文件夹——土木人的运气，全在备份里。',
      '汇报末尾他让你「再提炼三条风险」，你明白：PPT 灵魂三问，工地版。',
    ],
    effect: { morale: 5, progress: 6, energy: -10 },
  },
  {
    id: 'boss_progress_align',
    label: '工程进度对齐',
    description: '主动摊开横道图，把滞后原因、纠偏措施、资源需求一次性讲清楚。',
    texts: [
      '经理帮你把关键线路捋直了，你脑子里纠缠一周的工序终于不再打结。',
      '他怼完分包又回头安慰你：「问题暴露早是好事。」你突然有点感动，又有点想哭。',
      '对齐结束，白板上的箭头比爱心还密——那是工期，也是你的发际线预警图。',
    ],
    effect: { progress: 9, bossApproval: 5, energy: -15 },
  },
  {
    id: 'boss_career_talk',
    label: '职业规划谈心',
    description: '请教「考证、转岗、驻场还要几年」等灵魂问题，顺便试探领导口风。',
    texts: [
      '他讲起自己当年住板房的故事，语气平淡，你听得像励志鸡汤兑了水泥。',
      '「现场蹲得深，以后说话才硬。」你琢磨这话是鼓励还是预告。',
      '散场前他拍拍你：「先把这栋楼封顶再说。」你把「楼」听成了「人生」。',
    ],
    effect: { morale: 15, reputation: 2, energy: -5 },
  },
  {
    id: 'boss_plan_review',
    label: '方案审核指导',
    description: '请经理把关专项方案里的计算书与工艺流程，准备接受「红笔洗礼」。',
    texts: [
      '他一圈批注下来，你的文档从「能报专家」变成「还能再抢救一下」。',
      '有一处荷载取值被质疑，你当场翻规范，翻出了读书考试的 PTSD。',
      '改完第三遍，他说「这版像样了」，你差点给 Word 磕头谢恩。',
    ],
    effect: { planProgress: 5, bossApproval: 2, energy: -20 },
  },
  {
    id: 'boss_canteen_treat',
    label: '工地食堂请客',
    description: '非正式场合，打两份荤菜加紫菜蛋花汤，在塑料凳上聊现场与人情。',
    texts: [
      '他透露哪个班组「好沟通」，哪个监理「爱挑刺」，情报价值堪比隐蔽工程验收单。',
      '你抢着刷卡，他笑：「下次进度抢回来。」你心想这饭钱算不算前期投入。',
      '食堂电视放新闻联播，背景音里你们聊完了三个工序争议，烟火气满分。',
    ],
    effect: { morale: 10, bossApproval: 10, energy: -5, salary: -100 },
  },
  {
    id: 'boss_site_meeting_speech',
    label: '项目部例会发言',
    description: '周例会上轮到你讲质量与安全，下面坐着分包、监理和喝茶的项目班子。',
    texts: [
      '你开口「本周亮点三则」，心里默念：只要不停顿，尴尬就追不上我。',
      '经理适时补刀总结，把你的汇报升维成「项目部意志」，你既感激又惶恐。',
      '散会后被问「PPT 谁做的」，你微笑不语——模板是去年的，灵魂是凑合的。',
    ],
    effect: { progress: 6, reputation: 3, energy: -18, morale: -5 },
  },
  {
    id: 'boss_material_request',
    label: '申请物资调拨',
    description: '拿着材料计划与现场照片，申请增补钢筋模板或应急机具。',
    texts: [
      '你把损耗率、周转次数列成表，经理看完沉默两秒：「行，先紧着你这栋楼。」',
      '他让你写承诺「下周形象进度到位」，你签字时感觉自己签了军令状附赠卖身契。',
      '调拨单批下来的瞬间，你看审批流比看对象回消息还激动——这就是成年人的浪漫。',
    ],
    effect: { materials: 400, bossApproval: 3, energy: -12, progress: 6 },
  },
  {
    id: 'boss_safety_drill',
    label: '安全演练汇报',
    description: '消防演练、高空坠落应急……经理要求你负责脚本和现场组织。',
    texts: [
      '你写的演练脚本被夸「比电影还紧凑」，你心想：因为预算只够拍一条。',
      '灭火器过期被监理逮住，你和经理互看一眼——默契就是此刻一起背锅。',
      '演练结束全员集合，经理让你总结三句话，你张口就来：「快、准、稳」，其实心里想的是「累、饿、困」。',
    ],
    effect: { safetyRisk: -5, reputation: 3, bossApproval: 4, energy: -15 },
  },
  {
    id: 'boss_night_inspection',
    label: '陪经理夜间巡查',
    description: '深夜巡工地是项目经理的保留节目，你被钦点随行。',
    texts: [
      '手电筒照到一处钢筋没绑好，经理只说了一个字：「拍。」语气比夜风还冷。',
      '巡完三栋楼，你的步数破两万，膝盖说它也想辞职。',
      '他路过泵车时随口讲了一段质量事故案例，你听得后背发凉——比鬼故事管用。',
    ],
    effect: { progress: 4, safetyRisk: -3, bossApproval: 6, energy: -18, stamina: -5 },
  },
  {
    id: 'boss_subcontractor_mediate',
    label: '协调分包纠纷',
    description: '两个分包队为工序搭接争得面红耳赤，经理派你先去灭火。',
    texts: [
      '你两边各倒一杯茶，讲了二十分钟道理，最后他们握手——其实是在比谁手劲大。',
      '经理在远处看你调解，散场后说：「行，以后这种事你先顶。」你不确定这是表扬还是加活。',
      '分包老板塞给你一条烟表示感谢，你婉拒了——不是因为不抽，是怕被记进台账。',
    ],
    effect: { morale: -5, reputation: 4, bossApproval: 8, progress: 3, energy: -12 },
  },
  {
    id: 'boss_budget_review',
    label: '成本分析汇报',
    description: '季度成本超支预警，经理要看明细。你带着Excel和勇气去了。',
    texts: [
      '他指着超支那行说「解释」，你解释完他又指下一行——原来是连续剧。',
      '汇报末尾你提了一个节约方案，经理眼睛亮了一下：「试试。」这两个字值千金。',
      '走出办公室，你松了口气：过关了。转身看到待办里还有六项成本纠偏——放心得太早。',
    ],
    effect: { salary: 500, bossApproval: 5, morale: -8, energy: -14 },
  },
  {
    id: 'boss_owner_complaint',
    label: '甲方投诉善后',
    description: '甲方代表打了经理电话投诉施工噪音，经理让你写情况说明。',
    texts: [
      '你在Word里反复斟酌措辞，把「施工需要」写成「已最大限度降低」，文字功底全用在甩锅上了。',
      '经理看完你的回复函说：「措辞可以，态度不够诚恳。」你加了三句「深表歉意」。',
      '甲方最后接受了道歉，经理拍你肩：「以后这种事你直接处理。」你又双叒升级了（被动）。',
    ],
    effect: { morale: -6, bossApproval: 7, reputation: 2, energy: -10 },
  },
];
