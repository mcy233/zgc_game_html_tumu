/**
 * Action Scenarios — when a player clicks an action, instead of immediately computing
 * a flat result, one of these scenarios may trigger, presenting 2-3 narrative choices.
 * Each choice applies a modifier to the base action effect.
 */

export interface ScenarioChoice {
  label: string;
  narrative: string;
  modifiers: Partial<Record<string, number>>;
}

export interface ActionScenario {
  actionId: string;
  scene: string;
  choices: ScenarioChoice[];
}

const SCENARIOS: ActionScenario[] = [
  // ─── 现场巡检 ───
  {
    actionId: 'site_inspection',
    scene: '巡检途中，你发现脚手架有一处扣件松动，班组正在上方作业。',
    choices: [
      {
        label: '立即喊停，要求整改',
        narrative: '你果断叫停施工。班组虽然抱怨耽误工期，但安全隐患被及时消除。',
        modifiers: { safetyRiskChange: -3, approvalGain: 3, moraleCost: -5 },
      },
      {
        label: '拍照存档，事后发整改单',
        narrative: '你默默拍照记录，回办公室后发了整改通知。隐患暂留，但不影响当前进度。',
        modifiers: { progressGain: 2, experienceGain: 1 },
      },
      {
        label: '找老师傅帮忙当场加固',
        narrative: '你找来经验丰富的老师傅，十分钟搞定加固。既没停工，又化解了风险。',
        modifiers: { safetyRiskChange: -2, coworkerApprovalGain: 5, experienceGain: 2 },
      },
    ],
  },
  {
    actionId: 'site_inspection',
    scene: '路过塔吊指挥区，你听到对讲机里有人在用不规范手势信号。',
    choices: [
      {
        label: '跑过去当场纠正',
        narrative: '你冲过去纠正信号规范，塔吊司机虽然不高兴，但确实避免了一次潜在事故。',
        modifiers: { safetyRiskChange: -4, moraleCost: 3 },
      },
      {
        label: '记录下来，回去培训时统一讲',
        narrative: '你把问题记在本子上，打算下次安全培训时统一培训。既不得罪人，也算做了工作。',
        modifiers: { experienceGain: 2, certificateGain: 1 },
      },
    ],
  },

  // ─── 赶工加班 ───
  {
    actionId: 'overtime_rush',
    scene: '夜间浇筑到一半，泵车突然堵管了。工长望向你等你拿主意。',
    choices: [
      {
        label: '换备用泵车，继续浇筑',
        narrative: '你果断调来备用泵车，虽然多花了一小时，浇筑连续性没有断。混凝土质量有保障。',
        modifiers: { progressGain: 3, salaryCost: 500, experienceGain: 3 },
      },
      {
        label: '现场疏通，等它恢复',
        narrative: '你指挥工人疏通泵管，半小时后恢复作业。虽然有一段冷缝风险，但省了钱。',
        modifiers: { safetyRiskChange: 2, moraleCost: -3 },
      },
      {
        label: '申请停工，明天继续',
        narrative: '你决定停工，让大家回去休息。第二天精力充沛重新来过，但工期耽误了。',
        modifiers: { progressGain: -4, moraleCost: -10, staminaCost: -5 },
      },
    ],
  },

  // ─── 盯施工 ───
  {
    actionId: 'do_construction',
    scene: '浇筑板面时，你发现混凝土坍落度明显比配合比偏大。搅拌站说"没问题的"。',
    choices: [
      {
        label: '坚持退货，要求重新拌合',
        narrative: '你态度强硬拒收这车料。搅拌站重新发车，多等了40分钟但质量有保障。',
        modifiers: { safetyRiskChange: -3, approvalGain: 3, progressGain: -2 },
      },
      {
        label: '现场加减水剂调整',
        narrative: '你让试验员现场加减水剂调整坍落度，虽然不算标准操作，但赶上了进度。',
        modifiers: { progressGain: 2, experienceGain: 2, safetyRiskChange: 1 },
      },
      {
        label: '收下但做好记录留痕',
        narrative: '你签收了这车混凝土但在施工日志里详细记录。万一出问题，至少有据可查。',
        modifiers: { progressGain: 1, experienceGain: 1 },
      },
    ],
  },
  {
    actionId: 'do_construction',
    scene: '钢筋绑扎验收时，你数了一下箍筋间距，发现比图纸要求多了2cm。',
    choices: [
      {
        label: '严格按图，要求拆除重绑',
        narrative: '班组骂骂咧咧拆了重来。虽然多花了半天，但这段钢筋验收一次过。',
        modifiers: { safetyRiskChange: -2, progressGain: -1, approvalGain: 4 },
      },
      {
        label: '跟监理商量，看能否签认',
        narrative: '监理犹豫了一下，最终让你补一份说明就给签了。省事但欠了人情。',
        modifiers: { approvalGain: -2, networkGain: 1, progressGain: 2 },
      },
    ],
  },

  // ─── 写施工方案 ───
  {
    actionId: 'write_plan',
    scene: '深夜写方案，你发现上一个类似项目的模板可以直接套用，但有几处参数不太适用。',
    choices: [
      {
        label: '仔细核算每个参数，重新推导',
        narrative: '你花了三个小时逐条核对计算书，改了七八处。方案质量很高，通过审查概率大增。',
        modifiers: { experienceGain: 4, approvalGain: 3, moraleCost: 5 },
      },
      {
        label: '改改关键数据就交',
        narrative: '你快速改了项目名和几个关键参数就提交了。速度快，但心里有点虚。',
        modifiers: { progressGain: 3, safetyRiskChange: 2 },
      },
      {
        label: '请教老总工帮忙把关',
        narrative: '你拿着方案去找总工请教，他帮你指出了三处计算错误。虽然挨了批评，但学到了东西。',
        modifiers: { experienceGain: 5, approvalGain: 2, networkGain: 1 },
      },
    ],
  },

  // ─── 安全培训 ───
  {
    actionId: 'safety_training',
    scene: '培训考试遇到一道争议题：高处作业安全带的正确挂点位置。你和旁边的人答案不一样。',
    choices: [
      {
        label: '坚持自己的答案',
        narrative: '你坚持选了"高挂低用"，交卷后查规范——答对了！自信心+1。',
        modifiers: { certificateGain: 3, moraleCost: -3 },
      },
      {
        label: '改成对方的答案',
        narrative: '你犹豫了一下改了答案，结果改错了。教训：考试时相信自己的第一直觉。',
        modifiers: { certificateGain: -1, experienceGain: 1 },
      },
    ],
  },

  // ─── 材料验收 ───
  {
    actionId: 'material_check',
    scene: '一批钢筋到场，合格证齐全，但你目测锈蚀程度偏重。供货商说"表面锈，不影响"。',
    choices: [
      {
        label: '坚持送检，等报告再用',
        narrative: '你把样品送去试验室检测。两天后报告回来：合格。虽然耽误了时间，但心里踏实。',
        modifiers: { safetyRiskChange: -2, progressGain: -1, experienceGain: 2 },
      },
      {
        label: '先收下，标记待检，不影响进度',
        narrative: '你在入库单上注明"待检"并单独堆放。进度没受影响，但你得盯着别让人误用。',
        modifiers: { progressGain: 2, safetyRiskChange: 1 },
      },
      {
        label: '直接退货换批次',
        narrative: '你直接让供货商拉走换一批。对方很不高兴，但你的验收标准立住了。',
        modifiers: { approvalGain: 3, safetyRiskChange: -1, salaryCost: 200 },
      },
    ],
  },

  // ─── 请客吃饭 ───
  {
    actionId: 'team_dinner',
    scene: '烧烤摊上气氛正好，工长借着酒劲开始吐槽项目管理的问题。你该怎么接话？',
    choices: [
      {
        label: '认真听，记下来反馈给领导',
        narrative: '你默默记下了几个有价值的建议。第二天整理成邮件发给了项目经理，得到了表扬。',
        modifiers: { approvalGain: 5, networkGain: 2, coworkerApprovalGain: -3 },
      },
      {
        label: '附和他，拉近关系',
        narrative: '你顺着工长的话头聊了一晚。第二天他主动帮你协调了一个难搞的班组。',
        modifiers: { coworkerApprovalGain: 8, moraleCost: -5 },
      },
      {
        label: '转移话题，聊点轻松的',
        narrative: '你巧妙岔开话题聊起了世界杯。气氛更轻松了，大家都很开心。',
        modifiers: { moraleCost: -8, coworkerApprovalGain: 3 },
      },
    ],
  },

  // ─── 找领导汇报 ───
  {
    actionId: 'visit_boss',
    scene: '你带着本周汇报材料去找领导，但发现他正在和甲方代表谈事情，脸色不太好。',
    choices: [
      {
        label: '在门口等，等他谈完再进去',
        narrative: '你等了半小时。领导出来看到你很感动："有心了。"汇报很顺利。',
        modifiers: { approvalGain: 5, moraleCost: 2 },
      },
      {
        label: '先回去，等领导心情好了再来',
        narrative: '你明智地选择改天再来。过两天领导主动找你聊，氛围比预期好很多。',
        modifiers: { approvalGain: 2, moraleCost: -3 },
      },
      {
        label: '趁甲方在，把好消息一起汇报',
        narrative: '你抓住时机汇报了一个进度超前的好消息，甲方当场表示满意。领导很高兴。',
        modifiers: { approvalGain: 8, networkGain: 3, progressGain: 2 },
      },
    ],
  },

  // ─── 研读图纸 ───
  {
    actionId: 'study_drawings',
    scene: '翻图纸时你发现建筑图和结构图有一处标高矛盾，差了5cm。',
    choices: [
      {
        label: '发设计联系单要求澄清',
        narrative: '你正式发文要求设计院澄清。三天后回复：以结构图为准。你的严谨被领导肯定。',
        modifiers: { approvalGain: 4, experienceGain: 3, progressGain: 1 },
      },
      {
        label: '先问总工意见',
        narrative: '总工看了后说他早就知道，按结构图做就行。你暗暗记下了这个经验。',
        modifiers: { experienceGain: 4, networkGain: 1 },
      },
    ],
  },

  // ─── 考证复习 ───
  {
    actionId: 'cert_study',
    scene: '刷题到深夜，室友突然拿出一套"押题密卷"说去年命中率80%。',
    choices: [
      {
        label: '谢谢，但还是按自己的计划来',
        narrative: '你坚持系统复习。考试那天发现押题卷只中了两道，但你的基础功扎实，稳稳通过。',
        modifiers: { certificateGain: 4, experienceGain: 2 },
      },
      {
        label: '拿来看看，重点章节对照学',
        narrative: '你把押题卷当参考，对照着重点章节加强突击。效率确实高了不少。',
        modifiers: { certificateGain: 3, moraleCost: -3 },
      },
      {
        label: '全力背押题卷',
        narrative: '你赌了一把全背押题。考试结果：要么大赢要么大输……',
        modifiers: { certificateGain: 6, safetyRiskChange: 1 },
      },
    ],
  },

  // ─── 甲方汇报 ───
  {
    actionId: 'owner_meeting',
    scene: '例会上甲方突然问："上周的那个质量问题整改到什么程度了？"你没准备这个议题。',
    choices: [
      {
        label: '坦诚说没准备，回去确认后书面答复',
        narrative: '甲方虽然不太满意，但你的坦诚赢得了一些尊重。下午你加急写了回复，第二天一早发过去。',
        modifiers: { approvalGain: 2, experienceGain: 3 },
      },
      {
        label: '凭记忆临场应答',
        narrative: '你硬着头皮说了大概情况。幸运的是基本对了，甲方点头说"行，你再发个函确认"。',
        modifiers: { approvalGain: 5, networkGain: 2, safetyRiskChange: 1 },
      },
      {
        label: '示意项目经理帮忙接话',
        narrative: '你给领导使了个眼色，领导帮你圆了场。事后领导说下次要准备充分。',
        modifiers: { approvalGain: -2, networkGain: 1, experienceGain: 1 },
      },
    ],
  },

  // ─── 考公刷题 ───
  {
    actionId: 'civil_exam_prep',
    scene: '午休时间你正偷偷刷行测题，突然同事凑过来问你在干嘛。',
    choices: [
      {
        label: '"在看安全规范条文"',
        narrative: '你迅速切换页面。同事半信半疑走了。以后刷题得更小心了。',
        modifiers: { moraleCost: 2 },
      },
      {
        label: '大方承认在备考公务员',
        narrative: '同事惊讶地看着你，然后小声说他也在考……你们约定互相分享资料。',
        modifiers: { networkGain: 1, moraleCost: -5, experienceGain: 1 },
      },
    ],
  },

  // ─── 编程自学 ───
  {
    actionId: 'self_learn_coding',
    scene: '你正在板房里跟着教程写代码，突然遇到一个bug怎么也调不通。',
    choices: [
      {
        label: '死磕到底，不信邪',
        narrative: '你花了两小时终于找到原因：少写了一个分号。虽然崩溃，但 debug 能力涨了。',
        modifiers: { experienceGain: 3, moraleCost: 3, staminaCost: 2 },
      },
      {
        label: '上网搜答案',
        narrative: '你在 Stack Overflow 找到了解决方案。复制粘贴大法好，效率就是正义。',
        modifiers: { experienceGain: 2, moraleCost: -2 },
      },
      {
        label: '先跳过，学下一章',
        narrative: '你决定先往后学，等学完回头再看。有时候退一步海阔天空。',
        modifiers: { moraleCost: -3 },
      },
    ],
  },

  // ─── 当资料员 ───
  {
    actionId: 'be_assistant',
    scene: '监理要求你两小时内补齐上个月的检验批签字表，总共17份。',
    choices: [
      {
        label: '加班硬赶，保证按时交',
        narrative: '你像打印机一样疯狂输出，两小时零三分全部搞定。监理满意地收走了。',
        modifiers: { approvalGain: 3, moraleCost: 5, staminaCost: 3, salaryGain: 300 },
      },
      {
        label: '跟监理商量宽限到明天',
        narrative: '你礼貌地解释情况，监理同意延期到明天中午。你有充足时间仔细做。',
        modifiers: { experienceGain: 2, moraleCost: -3 },
      },
    ],
  },

  // ─── 协调设计变更 ───
  {
    actionId: 'coordinate_design',
    scene: '设计院说这处变更"不能改"，但甲方坚持"必须改"，两边都很强硬。',
    choices: [
      {
        label: '组织三方会议面对面沟通',
        narrative: '你安排了三方坐下来谈。经过两小时激烈讨论，找到了一个折中方案。',
        modifiers: { networkGain: 3, approvalGain: 4, experienceGain: 3, moraleCost: 3 },
      },
      {
        label: '先站甲方立场，给设计院施压',
        narrative: '你明确表态支持甲方诉求。设计院最终妥协了，但以后合作关系可能紧张。',
        modifiers: { approvalGain: 6, networkGain: -1, progressGain: 3 },
      },
      {
        label: '找一个技术替代方案绕过去',
        narrative: '你翻了一晚上规范，找到一个既满足甲方需求又不需要设计院大改的方案。两边都很满意。',
        modifiers: { experienceGain: 5, networkGain: 4, approvalGain: 3 },
      },
    ],
  },

  // ─── 带新人 ───
  {
    actionId: 'mentor_newbie',
    scene: '新人第一次独立旁站浇筑，紧张得不停问你各种问题。',
    choices: [
      {
        label: '手把手陪他盯完全程',
        narrative: '你耐心陪了一整天。新人虽然还是犯了些小错，但核心流程记住了。他很感激你。',
        modifiers: { coworkerApprovalGain: 8, experienceGain: 2, staminaCost: 3 },
      },
      {
        label: '给他写个清单，让他照着做',
        narrative: '你花半小时写了一份旁站要点清单。新人拿着清单干得有模有样。',
        modifiers: { experienceGain: 3, coworkerApprovalGain: 4, moraleCost: -3 },
      },
    ],
  },
];

const scenarioMap = new Map<string, ActionScenario[]>();
for (const s of SCENARIOS) {
  const list = scenarioMap.get(s.actionId) ?? [];
  list.push(s);
  scenarioMap.set(s.actionId, list);
}

export function pickActionScenario(actionId: string): ActionScenario | null {
  const pool = scenarioMap.get(actionId);
  if (!pool || pool.length === 0) return null;
  if (Math.random() > 0.65) return null;
  return pool[Math.floor(Math.random() * pool.length)]!;
}
