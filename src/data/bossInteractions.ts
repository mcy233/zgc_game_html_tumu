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
];
