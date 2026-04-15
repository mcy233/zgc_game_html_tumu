/**
 * Action Scenarios — when a player clicks an action, instead of immediately computing
 * a flat result, one of these scenarios may trigger, presenting 2-3 narrative choices.
 * Each choice applies a modifier to the base action effect.
 */

export interface ScenarioChoice {
  label: string;
  hint: string;
  narrative: string;
  modifiers: Partial<Record<string, number>>;
}

export interface ActionScenario {
  actionId: string;
  scene: string;
  choices: ScenarioChoice[];
}

const SCENARIOS: ActionScenario[] = [
  // ═══════════════ 现场巡检 ═══════════════
  {
    actionId: 'site_inspection',
    scene: '巡检途中，你发现脚手架有一处扣件松动，班组正在上方作业。',
    choices: [
      { label: '立即喊停，要求整改', hint: '🛡 安全优先，进度可能受影响', narrative: '你果断叫停施工。班组虽然抱怨耽误工期，但安全隐患被及时消除。', modifiers: { safetyRiskChange: -3, approvalGain: 3, moraleCost: -5 } },
      { label: '拍照存档，事后发整改单', hint: '📋 保留证据，不影响当前进度', narrative: '你默默拍照记录，回办公室后发了整改通知。隐患暂留，但不影响当前进度。', modifiers: { progressGain: 2, experienceGain: 1 } },
      { label: '找老师傅帮忙当场加固', hint: '🤝 团队协作，兼顾安全与效率', narrative: '你找来经验丰富的老师傅，十分钟搞定加固。既没停工，又化解了风险。', modifiers: { safetyRiskChange: -2, coworkerApprovalGain: 5, experienceGain: 2 } },
    ],
  },
  {
    actionId: 'site_inspection',
    scene: '路过塔吊指挥区，你听到对讲机里有人在用不规范手势信号。',
    choices: [
      { label: '跑过去当场纠正', hint: '⚡ 直接干预，降低安全风险但可能得罪人', narrative: '你冲过去纠正信号规范，塔吊司机虽然不高兴，但确实避免了一次潜在事故。', modifiers: { safetyRiskChange: -4, moraleCost: 3 } },
      { label: '记录下来，回去培训时统一讲', hint: '📝 温和处理，积累培训经验', narrative: '你把问题记在本子上，打算下次安全培训时统一培训。既不得罪人，也算做了工作。', modifiers: { experienceGain: 2, certificateGain: 1 } },
    ],
  },
  {
    actionId: 'site_inspection',
    scene: '一楼转角发现配电箱门没关，里面电线裸露，旁边还放着一桶水。',
    choices: [
      { label: '立刻断电，找电工来处理', hint: '🛡 安全第一，大幅降低隐患', narrative: '你第一时间拉下总闸，打电话叫来电工。虽然半个区域停工了二十分钟，但你可能刚救了一条命。', modifiers: { safetyRiskChange: -6, progressGain: -1, approvalGain: 4 } },
      { label: '先把水桶移走，关上配电箱门', hint: '⚡ 快速应急，不影响施工但隐患未根除', narrative: '你快速挪开水桶关上箱门，暂时消除了最危险的组合。但线路老化问题还在。', modifiers: { safetyRiskChange: -2, experienceGain: 1 } },
    ],
  },

  // ═══════════════ 安全培训 ═══════════════
  {
    actionId: 'safety_training',
    scene: '培训考试遇到一道争议题：高处作业安全带的正确挂点位置。你和旁边的人答案不一样。',
    choices: [
      { label: '坚持自己的答案', hint: '🎯 相信直觉，答对大幅加分', narrative: '你坚持选了"高挂低用"，交卷后查规范——答对了！自信心+1。', modifiers: { certificateGain: 3, moraleCost: -3 } },
      { label: '改成对方的答案', hint: '😬 动摇了，可能改错、也可能改对', narrative: '你犹豫了一下改了答案，结果改错了。教训：考试时相信自己的第一直觉。', modifiers: { certificateGain: -1, experienceGain: 1 } },
    ],
  },
  {
    actionId: 'safety_training',
    scene: '安全培训现场，讲师让你上台做心肺复苏演示。全项目部都在看。',
    choices: [
      { label: '大方上台，按流程操作', hint: '💪 锻炼胆量 + 领导印象加分', narrative: '你走上台按急救流程操作了一遍。虽然手法还有点生硬，但讲师说"要领都对了"。领导在台下点头。', modifiers: { approvalGain: 4, experienceGain: 3, moraleCost: -5 } },
      { label: '说自己不舒服，让别人上', hint: '😌 避免出丑，但错过表现机会', narrative: '同事替你上了台。你松了口气，但也隐隐觉得错过了一个在领导面前露脸的机会。', modifiers: { moraleCost: -2 } },
    ],
  },
  {
    actionId: 'safety_training',
    scene: '培训结束后，安全员让大家签培训记录。你发现有三个人没来但名字已经签上了。',
    choices: [
      { label: '向安全员反映，要求核实', hint: '🛡 维护制度，降低安全隐患但可能得罪人', narrative: '安全员脸色不太好看，但还是把名字划掉了。事后那三个人被要求补训。你做了对的事。', modifiers: { safetyRiskChange: -3, approvalGain: 3, coworkerApprovalGain: -2 } },
      { label: '装作没看见，签完就走', hint: '😶 多一事不如少一事', narrative: '你默默签了名走了。但心里总觉得不太对——万一出事了，这份记录就是假的。', modifiers: { moraleCost: 3, safetyRiskChange: 1 } },
    ],
  },

  // ═══════════════ 赶工加班 ═══════════════
  {
    actionId: 'overtime_rush',
    scene: '夜间浇筑到一半，泵车突然堵管了。工长望向你等你拿主意。',
    choices: [
      { label: '换备用泵车，继续浇筑', hint: '💰 花钱保质量，进度不中断', narrative: '你果断调来备用泵车，虽然多花了一小时，浇筑连续性没有断。混凝土质量有保障。', modifiers: { progressGain: 3, salaryCost: 500, experienceGain: 3 } },
      { label: '现场疏通，等它恢复', hint: '⏱ 省钱但有冷缝风险', narrative: '你指挥工人疏通泵管，半小时后恢复作业。虽然有一段冷缝风险，但省了钱。', modifiers: { safetyRiskChange: 2, moraleCost: -3 } },
      { label: '申请停工，明天继续', hint: '😴 保体力保心态，但耽误进度', narrative: '你决定停工，让大家回去休息。第二天精力充沛重新来过，但工期耽误了。', modifiers: { progressGain: -4, moraleCost: -10, staminaCost: -5 } },
    ],
  },
  {
    actionId: 'overtime_rush',
    scene: '晚上十一点，混凝土车排着队等着浇筑，但工人已经明显疲惫了。',
    choices: [
      { label: '咬牙继续，一鼓作气', hint: '🔥 大幅冲进度，但消耗极大', narrative: '你买了一箱红牛分给大家，凌晨三点终于浇完。进度很猛，但你看到有人偷偷打哈欠。', modifiers: { progressGain: 4, moraleCost: 5, staminaCost: 3 } },
      { label: '分两班，明早继续', hint: '🛡 安全管理加分，进度稍慢', narrative: '你跟工长商量分成夜班和早班，虽然进度慢了点，但所有人都保持了清醒。监理第二天特意夸了安全管理。', modifiers: { moraleCost: -5, progressGain: -2, staminaCost: -2 } },
    ],
  },
  {
    actionId: 'overtime_rush',
    scene: '赶工到凌晨，突然下起小雨。工长问要不要继续浇筑。',
    choices: [
      { label: '搭防雨棚继续浇', hint: '📈 抢进度，但成本增加', narrative: '你紧急调来几块彩条布搭了临时棚。虽然多花了钱和人工，但这一段浇完了。', modifiers: { progressGain: 3, salaryCost: 300, experienceGain: 2 } },
      { label: '收工，等天晴再说', hint: '😌 保质量保安全，心态恢复', narrative: '你果断喊停。第二天一看，旁边那个没停的标段因为雨水冲刷被监理开了整改单。你暗自庆幸。', modifiers: { moraleCost: -6, safetyRiskChange: -2, experienceGain: 2 } },
    ],
  },

  // ═══════════════ 盯施工 ═══════════════
  {
    actionId: 'do_construction',
    scene: '浇筑板面时，你发现混凝土坍落度明显比配合比偏大。搅拌站说"没问题的"。',
    choices: [
      { label: '坚持退货，要求重新拌合', hint: '🛡 质量第一，耽误进度但赢得信任', narrative: '你态度强硬拒收这车料。搅拌站重新发车，多等了40分钟但质量有保障。', modifiers: { safetyRiskChange: -3, approvalGain: 3, progressGain: -2 } },
      { label: '现场加减水剂调整', hint: '⚡ 灵活应变，有风险但保进度', narrative: '你让试验员现场加减水剂调整坍落度，虽然不算标准操作，但赶上了进度。', modifiers: { progressGain: 2, experienceGain: 2, safetyRiskChange: 1 } },
      { label: '收下但做好记录留痕', hint: '📋 中庸策略，留证据保底', narrative: '你签收了这车混凝土但在施工日志里详细记录。万一出问题，至少有据可查。', modifiers: { progressGain: 1, experienceGain: 1 } },
    ],
  },
  {
    actionId: 'do_construction',
    scene: '钢筋绑扎验收时，你数了一下箍筋间距，发现比图纸要求多了2cm。',
    choices: [
      { label: '严格按图，要求拆除重绑', hint: '🛡 严格质量，耽误半天但一次过验收', narrative: '班组骂骂咧咧拆了重来。虽然多花了半天，但这段钢筋验收一次过。', modifiers: { safetyRiskChange: -2, progressGain: -1, approvalGain: 4 } },
      { label: '跟监理商量，看能否签认', hint: '🤝 走人情路线，省时间但欠人情', narrative: '监理犹豫了一下，最终让你补一份说明就给签了。省事但欠了人情。', modifiers: { approvalGain: -2, networkGain: 1, progressGain: 2 } },
    ],
  },

  // ═══════════════ 写施工方案 ═══════════════
  {
    actionId: 'write_plan',
    scene: '深夜写方案，你发现上一个类似项目的模板可以直接套用，但有几处参数不太适用。',
    choices: [
      { label: '仔细核算每个参数，重新推导', hint: '📐 耗时但高质量，提升经验和信任', narrative: '你花了三个小时逐条核对计算书，改了七八处。方案质量很高，通过审查概率大增。', modifiers: { experienceGain: 4, approvalGain: 3, moraleCost: 5 } },
      { label: '改改关键数据就交', hint: '⚡ 快速交差，但可能留下隐患', narrative: '你快速改了项目名和几个关键参数就提交了。速度快，但心里有点虚。', modifiers: { progressGain: 3, safetyRiskChange: 2 } },
      { label: '请教老总工帮忙把关', hint: '🧑‍🏫 向高人请教，经验大涨', narrative: '你拿着方案去找总工请教，他帮你指出了三处计算错误。虽然挨了批评，但学到了东西。', modifiers: { experienceGain: 5, approvalGain: 2, networkGain: 1 } },
    ],
  },
  {
    actionId: 'write_plan',
    scene: '方案写到一半，你发现规范条文有更新，之前的计算依据可能要改。',
    choices: [
      { label: '按新规范全部重算', hint: '📐 严谨但耗时，方案更可靠', narrative: '你下载了最新规范逐条对照，改了两处关键参数。虽然多花了一天，但专家评审时零意见通过。', modifiers: { experienceGain: 5, moraleCost: 4, approvalGain: 4 } },
      { label: '跟总工确认是否影响本项目', hint: '🤝 借力判断，节省时间', narrative: '总工看了一眼说这个更新跟本项目无关，让你继续按原来的做。你松了一口气。', modifiers: { experienceGain: 2, moraleCost: -3 } },
    ],
  },

  // ═══════════════ 材料验收 ═══════════════
  {
    actionId: 'material_check',
    scene: '一批钢筋到场，合格证齐全，但你目测锈蚀程度偏重。供货商说"表面锈，不影响"。',
    choices: [
      { label: '坚持送检，等报告再用', hint: '🛡 安全可靠，但耽误两天进度', narrative: '你把样品送去试验室检测。两天后报告回来：合格。虽然耽误了时间，但心里踏实。', modifiers: { safetyRiskChange: -2, progressGain: -1, experienceGain: 2 } },
      { label: '先收下，标记待检', hint: '⚡ 不耽误进度，但需要持续盯防', narrative: '你在入库单上注明"待检"并单独堆放。进度没受影响，但你得盯着别让人误用。', modifiers: { progressGain: 2, safetyRiskChange: 1 } },
      { label: '直接退货换批次', hint: '💪 态度强硬，树立验收标准', narrative: '你直接让供货商拉走换一批。对方很不高兴，但你的验收标准立住了。', modifiers: { approvalGain: 3, safetyRiskChange: -1, salaryCost: 200 } },
    ],
  },
  {
    actionId: 'material_check',
    scene: '模板到货数量差了20块，供货商说"路上掉了几块，下批补齐"。',
    choices: [
      { label: '按实际数量签收，差额扣款', hint: '📋 按规矩办事，避免后续纠纷', narrative: '你在验收单上写明实到数量，要求按差额扣款。供货商不高兴但也没办法。', modifiers: { experienceGain: 2, approvalGain: 2 } },
      { label: '先全签，相信下批补齐', hint: '🤝 给面子但有风险——万一不补呢？', narrative: '你签了全额收货单。结果下一批确实补了，但多等了一周才到。这次算运气好。', modifiers: { moraleCost: 2, progressGain: 1 } },
    ],
  },

  // ═══════════════ 请客吃饭 ═══════════════
  {
    actionId: 'team_dinner',
    scene: '烧烤摊上气氛正好，工长借着酒劲开始吐槽项目管理的问题。你该怎么接话？',
    choices: [
      { label: '认真听，记下来反馈给领导', hint: '📋 获取情报→领导加分，但可能被工长知道后翻脸', narrative: '你默默记下了几个有价值的建议。第二天整理成邮件发给了项目经理，得到了表扬。', modifiers: { approvalGain: 5, networkGain: 2, coworkerApprovalGain: -3 } },
      { label: '附和他，拉近关系', hint: '🤝 大幅提升工友好感', narrative: '你顺着工长的话头聊了一晚。第二天他主动帮你协调了一个难搞的班组。', modifiers: { coworkerApprovalGain: 8, moraleCost: -5 } },
      { label: '转移话题，聊点轻松的', hint: '😌 大幅恢复心态，轻松氛围', narrative: '你巧妙岔开话题聊起了世界杯。气氛更轻松了，大家都很开心。', modifiers: { moraleCost: -8, coworkerApprovalGain: 3 } },
    ],
  },
  {
    actionId: 'team_dinner',
    scene: '散伙时有人提议AA制，但你是发起人。',
    choices: [
      { label: '坚持请客，全额买单', hint: '💰 多花钱，但好感度拉满', narrative: '你拍桌子说"今天我请！"大家感动得不行，回去路上有人说"跟着某工干没亏吃过"。', modifiers: { salaryCost: 500, coworkerApprovalGain: 6, moraleCost: -8 } },
      { label: 'AA就AA，大家公平', hint: '💳 省钱，好感正常', narrative: '你说"那就AA吧"。气氛虽然没那么热烈，但也没人不高兴。钱包表示感谢。', modifiers: { moraleCost: -5, coworkerApprovalGain: 2 } },
    ],
  },

  // ═══════════════ 找领导汇报 ═══════════════
  {
    actionId: 'visit_boss',
    scene: '你带着本周汇报材料去找领导，但发现他正在和甲方代表谈事情，脸色不太好。',
    choices: [
      { label: '在门口等，等他谈完再进去', hint: '⏱ 花时间等待，但领导会很感动', narrative: '你等了半小时。领导出来看到你很感动："有心了。"汇报很顺利。', modifiers: { approvalGain: 5, moraleCost: 2 } },
      { label: '先回去，等领导心情好了再来', hint: '😌 省心态但信任提升较少', narrative: '你明智地选择改天再来。过两天领导主动找你聊，氛围比预期好很多。', modifiers: { approvalGain: 2, moraleCost: -3 } },
      { label: '趁甲方在，把好消息一起汇报', hint: '🎲 高风险高回报：成功则双倍加分', narrative: '你抓住时机汇报了一个进度超前的好消息，甲方当场表示满意。领导很高兴。', modifiers: { approvalGain: 8, networkGain: 3, progressGain: 2 } },
    ],
  },
  {
    actionId: 'visit_boss',
    scene: '汇报途中领导突然问你："你觉得现在团队最大的问题是什么？"',
    choices: [
      { label: '如实说出你观察到的问题', hint: '💬 坦诚 → 高信任，但说错可能扣分', narrative: '你鼓起勇气说了班组协调和物资周转的问题。领导沉默了几秒说"看来你有在思考"。', modifiers: { approvalGain: 6, experienceGain: 3, moraleCost: 2 } },
      { label: '"团队还不错，就是进度压力大"', hint: '😌 安全回答，不出错也不出彩', narrative: '领导点点头没再追问。你感觉这次汇报不算亮眼，但至少没说错话。', modifiers: { approvalGain: 2, moraleCost: -2 } },
    ],
  },

  // ═══════════════ 研读图纸 ═══════════════
  {
    actionId: 'study_drawings',
    scene: '翻图纸时你发现建筑图和结构图有一处标高矛盾，差了5cm。',
    choices: [
      { label: '发设计联系单要求澄清', hint: '📋 正式流程，赢得信任+推进进度', narrative: '你正式发文要求设计院澄清。三天后回复：以结构图为准。你的严谨被领导肯定。', modifiers: { approvalGain: 4, experienceGain: 3, progressGain: 1 } },
      { label: '先问总工意见', hint: '🧑‍🏫 借前辈经验快速判断', narrative: '总工看了后说他早就知道，按结构图做就行。你暗暗记下了这个经验。', modifiers: { experienceGain: 4, networkGain: 1 } },
    ],
  },
  {
    actionId: 'study_drawings',
    scene: '看到一处异形结构节点，你完全看不懂设计意图。',
    choices: [
      { label: '查图集和规范，自己钻研', hint: '📚 独立解决，经验大幅提升', narrative: '你翻了三本图集终于搞懂了——原来是型钢混凝土组合节点。你的技术理解又上了一个台阶。', modifiers: { experienceGain: 5, moraleCost: 3 } },
      { label: '直接打电话问设计院', hint: '📞 高效但学到的少', narrative: '设计院五分钟就解释清楚了。省时间，但你总觉得自己该先试试。', modifiers: { experienceGain: 2, moraleCost: -2, progressGain: 1 } },
      { label: '问问工地老师傅怎么做', hint: '🤝 实战经验+好感度', narrative: '老师傅看了一眼说"这种我做过"，给你画了个草图。理论和实操差距就在这种时候体现。', modifiers: { experienceGain: 3, coworkerApprovalGain: 5, moraleCost: -3 } },
    ],
  },

  // ═══════════════ 考证复习 ═══════════════
  {
    actionId: 'cert_study',
    scene: '刷题到深夜，室友突然拿出一套"押题密卷"说去年命中率80%。',
    choices: [
      { label: '谢谢，但还是按自己的计划来', hint: '📚 稳扎稳打，备考积累更扎实', narrative: '你坚持系统复习。考试那天发现押题卷只中了两道，但你的基础功扎实，稳稳通过。', modifiers: { certificateGain: 4, experienceGain: 2 } },
      { label: '拿来看看，重点章节对照学', hint: '⚡ 效率提高 + 心态放松', narrative: '你把押题卷当参考，对照着重点章节加强突击。效率确实高了不少。', modifiers: { certificateGain: 3, moraleCost: -3 } },
      { label: '全力背押题卷', hint: '🎲 赌一把：可能大赢也可能大输', narrative: '你赌了一把全背押题。考试结果：要么大赢要么大输……', modifiers: { certificateGain: 6, safetyRiskChange: 1 } },
    ],
  },
  {
    actionId: 'cert_study',
    scene: '复习到关键章节，你发现自己怎么都记不住那几条公式。',
    choices: [
      { label: '做思维导图，理解原理', hint: '🧠 慢但扎实，经验收益高', narrative: '你花了两小时画了一份思维导图，把原理和公式串成了一条逻辑链。从此再也没忘过。', modifiers: { certificateGain: 4, experienceGain: 3, moraleCost: 4 } },
      { label: '抄写十遍，硬记', hint: '✍️ 简单粗暴，备考积累适中', narrative: '你抄了十遍，手都酸了。考试时果然记住了七八成——肌肉记忆果然不骗人。', modifiers: { certificateGain: 3, staminaCost: 2 } },
      { label: '找视频课讲解，换个方式学', hint: '📱 轻松有趣，但容易分心', narrative: '你找到一个讲得很好的网课，轻松多了。不过看着看着你点开了推荐视频……嗯，还是有效果的。', modifiers: { certificateGain: 2, moraleCost: -4 } },
    ],
  },

  // ═══════════════ 甲方汇报 ═══════════════
  {
    actionId: 'owner_meeting',
    scene: '例会上甲方突然问："上周的那个质量问题整改到什么程度了？"你没准备这个议题。',
    choices: [
      { label: '坦诚说没准备，回去确认后书面答复', hint: '📋 坦诚可靠，但甲方可能不满', narrative: '甲方虽然不太满意，但你的坦诚赢得了一些尊重。下午你加急写了回复。', modifiers: { approvalGain: 2, experienceGain: 3 } },
      { label: '凭记忆临场应答', hint: '🎲 冒险但如果说对了收益很大', narrative: '你硬着头皮说了大概情况。幸运的是基本对了，甲方点头说"行，你再发个函确认"。', modifiers: { approvalGain: 5, networkGain: 2, safetyRiskChange: 1 } },
      { label: '示意项目经理帮忙接话', hint: '🤝 安全但显得能力不足', narrative: '你给领导使了个眼色，领导帮你圆了场。事后领导说下次要准备充分。', modifiers: { approvalGain: -2, networkGain: 1, experienceGain: 1 } },
    ],
  },
  {
    actionId: 'owner_meeting',
    scene: '甲方代表在会上提出要加快进度，但预算不加。你负责回应。',
    choices: [
      { label: '据理力争，给出成本分析', hint: '💰 专业回应 → 经验+人脉，但可能惹恼甲方', narrative: '你打开Excel展示了赶工成本测算，甲方沉默了。最终同意增加一笔措施费。你的专业度让人印象深刻。', modifiers: { experienceGain: 4, networkGain: 3, approvalGain: -1 } },
      { label: '先答应，回来再想办法', hint: '😌 甲方满意度高，但给自己挖坑', narrative: '甲方很满意你的态度。但回到项目部，你看着工期计划发呆：怎么赶？', modifiers: { approvalGain: 4, moraleCost: 6, progressGain: 2 } },
    ],
  },

  // ═══════════════ 考公刷题 ═══════════════
  {
    actionId: 'civil_exam_prep',
    scene: '午休时间你正偷偷刷行测题，突然同事凑过来问你在干嘛。',
    choices: [
      { label: '"在看安全规范条文"', hint: '🫣 掩饰过关，但心态受影响', narrative: '你迅速切换页面。同事半信半疑走了。以后刷题得更小心了。', modifiers: { moraleCost: 2 } },
      { label: '大方承认在备考公务员', hint: '💬 坦诚 → 意外结盟+人脉', narrative: '同事惊讶地看着你，然后小声说他也在考……你们约定互相分享资料。', modifiers: { networkGain: 1, moraleCost: -5, experienceGain: 1 } },
    ],
  },
  {
    actionId: 'civil_exam_prep',
    scene: '你报名了一个线上申论批改班，第一次作业被批得体无完肤。',
    choices: [
      { label: '认真修改，按老师意见重写', hint: '📐 辛苦但申论水平大幅提升', narrative: '你花了一整晚重写了这篇申论。第二次交上去，老师批注："进步很大。"', modifiers: { experienceGain: 3, moraleCost: 4, staminaCost: 2 } },
      { label: '看看别人的高分作业学习思路', hint: '📖 取巧学习法，轻松有效', narrative: '你下载了三篇高分范文对比分析，总结了一套自己的答题框架。效率很高。', modifiers: { experienceGain: 2, moraleCost: -3 } },
    ],
  },

  // ═══════════════ 编程自学 ═══════════════
  {
    actionId: 'self_learn_coding',
    scene: '你正在板房里跟着教程写代码，突然遇到一个bug怎么也调不通。',
    choices: [
      { label: '死磕到底，不信邪', hint: '🔧 debug能力大涨，但耗时耗力', narrative: '你花了两小时终于找到原因：少写了一个分号。虽然崩溃，但 debug 能力涨了。', modifiers: { experienceGain: 3, moraleCost: 3, staminaCost: 2 } },
      { label: '上网搜答案', hint: '⚡ 高效解决，轻松愉快', narrative: '你在 Stack Overflow 找到了解决方案。复制粘贴大法好，效率就是正义。', modifiers: { experienceGain: 2, moraleCost: -2 } },
      { label: '先跳过，学下一章', hint: '😌 保持学习节奏，不卡在一处', narrative: '你决定先往后学，等学完回头再看。有时候退一步海阔天空。', modifiers: { moraleCost: -3 } },
    ],
  },

  // ═══════════════ 捞外快 ═══════════════
  {
    actionId: 'side_hustle',
    scene: '隔壁标段的商务找到你，想让你周末帮忙核一批工程量清单，开价不低。',
    choices: [
      { label: '接活，周末加个班', hint: '💰 高收入，但消耗体力心态', narrative: '你花了一整个周末埋头算量，红包到账的同时，体力也见底了。', modifiers: { salaryGain: 800, staminaCost: 4, moraleCost: 5 } },
      { label: '婉拒，太累了不值得', hint: '😌 保存体力心态，无收入', narrative: '你礼貌地说最近太忙了。对方表示理解，但你隐隐觉得错过了什么。', modifiers: { moraleCost: -5, staminaCost: -2 } },
    ],
  },
  {
    actionId: 'side_hustle',
    scene: '一个做预算软件的公司找到你，想让你录一套施工员培训视频，每集¥500。',
    choices: [
      { label: '接！利用午休和晚上录', hint: '💰 多赚一笔，但几天都休息不好', narrative: '你录了四集，讲得比自己工地上的师傅还细致。钱到手了，但连续几天中午没休息。', modifiers: { salaryGain: 500, moraleCost: 4, staminaCost: 3 } },
      { label: '只录两集，别太贪', hint: '⚖️ 平衡收入和休息', narrative: '你只录了自己最擅长的两期，质量很高。对方很满意，说以后还找你。', modifiers: { salaryGain: 200, moraleCost: -3 } },
    ],
  },

  // ═══════════════ 协调设计变更 ═══════════════
  {
    actionId: 'coordinate_design',
    scene: '设计院说这处变更"不能改"，但甲方坚持"必须改"。',
    choices: [
      { label: '组织三方会议面对面沟通', hint: '🤝 各方共赢但消耗心态', narrative: '你安排了三方坐下来谈。经过两小时激烈讨论，找到了一个折中方案。', modifiers: { networkGain: 3, approvalGain: 4, experienceGain: 3, moraleCost: 3 } },
      { label: '先站甲方立场，给设计院施压', hint: '📈 甲方满意但得罪设计院', narrative: '你明确表态支持甲方诉求。设计院最终妥协了，但以后合作关系可能紧张。', modifiers: { approvalGain: 6, networkGain: -1, progressGain: 3 } },
      { label: '找一个技术替代方案绕过去', hint: '🧠 最优解但需要花时间钻研', narrative: '你翻了一晚上规范，找到一个两全其美的方案。两边都很满意。', modifiers: { experienceGain: 5, networkGain: 4, approvalGain: 3 } },
    ],
  },
  {
    actionId: 'coordinate_design',
    scene: '设计院发来变更通知，结构配筋全改了，现场钢筋已经加工了一半。',
    choices: [
      { label: '立刻组织三方会议', hint: '⚡ 快速协调，消耗心态但推进事情', narrative: '你拉上监理、设计和分包开了紧急碰头会，两小时后达成妥协方案。', modifiers: { approvalGain: 5, moraleCost: 5, experienceGain: 3 } },
      { label: '先发函确认，留好证据', hint: '📋 保护自己，但事情解决得慢', narrative: '你连夜写了一份工作联系单，把责任界面说清楚。进度受影响，但后续有底牌。', modifiers: { experienceGain: 4, moraleCost: 3 } },
    ],
  },

  // ═══════════════ 带新人 ═══════════════
  {
    actionId: 'mentor_newbie',
    scene: '新人第一次独立旁站浇筑，紧张得不停问你各种问题。',
    choices: [
      { label: '手把手陪他盯完全程', hint: '🤝 好感大涨，但消耗你的体力', narrative: '你耐心陪了一整天。新人虽然还是犯了些小错，但核心流程记住了。他很感激你。', modifiers: { coworkerApprovalGain: 8, experienceGain: 2, staminaCost: 3 } },
      { label: '给他写个清单，让他照着做', hint: '📋 高效教学法，你也轻松', narrative: '你花半小时写了一份旁站要点清单。新人拿着清单干得有模有样。', modifiers: { experienceGain: 3, coworkerApprovalGain: 4, moraleCost: -3 } },
    ],
  },
  {
    actionId: 'mentor_newbie',
    scene: '新人在验收现场犯了一个低级错误，监理正在发火。',
    choices: [
      { label: '站出来替他扛', hint: '🛡 你背锅，新人感激涕零', narrative: '你走过去说"这是我安排的，责任在我"。监理冲你吼了几句就走了。新人眼眶红了。', modifiers: { coworkerApprovalGain: 10, moraleCost: 5, approvalGain: -2 } },
      { label: '让新人自己面对，事后帮他复盘', hint: '📖 成长型教育，新人学到更多', narrative: '你站在一边没说话。新人挨了批但之后认真复盘，再也没犯过同样的错。', modifiers: { experienceGain: 3, coworkerApprovalGain: 3 } },
    ],
  },

  // ═══════════════ 跟师傅学 ═══════════════
  {
    actionId: 'follow_mentor',
    scene: '师傅今天心情不错，说要带你看一个"教科书级"的节点施工。',
    choices: [
      { label: '全程跟紧，边看边记', hint: '📸 经验大涨，师傅高评价', narrative: '你拿着手机拍了二十多张照片，记了三页笔记。师傅说"孺子可教"。', modifiers: { experienceGain: 4, moraleCost: -5, staminaCost: 2 } },
      { label: '大胆提问，不懂就问', hint: '💬 深入理解，经验更多', narrative: '你连问了五个问题，师傅解释完后说"问得好"。你学到了课本上没有的细节。', modifiers: { experienceGain: 5, moraleCost: -3 } },
    ],
  },
  {
    actionId: 'follow_mentor',
    scene: '师傅教你一种"土办法"处理钢筋连接，效率很高但不太符合规范。',
    choices: [
      { label: '学了但坚持按规范做', hint: '📐 安全合规，师傅可能不高兴', narrative: '你委婉地说"我还是按规范来吧"。师傅有点不高兴但也理解。你的工作记录干净得很。', modifiers: { experienceGain: 3, safetyRiskChange: -2, coworkerApprovalGain: -2 } },
      { label: '学了就用，效率优先', hint: '⚡ 效率高但有隐患风险', narrative: '你照做了，确实快很多。但晚上看规范时发现有强条约束，心里有点发虚。', modifiers: { experienceGain: 2, progressGain: 2, safetyRiskChange: 2 } },
    ],
  },

  // ═══════════════ 跟商务对量 ═══════════════
  {
    actionId: 'shadow_estimator',
    scene: '商务员指着一堆工程量清单，让你帮他核对一下上个月的签证。',
    choices: [
      { label: '认真核对，逐项比对图纸', hint: '📐 耗时但发现问题→赚外快', narrative: '你花了两个小时逐项核对，发现三处错误。商务员感激不尽。', modifiers: { experienceGain: 4, salaryGain: 300, staminaCost: 2 } },
      { label: '快速浏览，大致过一遍', hint: '⚡ 省时间但可能漏掉问题', narrative: '你快速浏览了一遍，没发现明显问题。效率高但心里没底。', modifiers: { experienceGain: 2, moraleCost: 2 } },
    ],
  },

  // ═══════════════ 测量放线 ═══════════════
  {
    actionId: 'survey_line',
    scene: '今天要放基础轴线，工长催得急，说"放完了才能支模板"。',
    choices: [
      { label: '仔细复核，宁慢勿错', hint: '📐 精确但耗时间和体力', narrative: '你把每个点都复核了两遍。工长虽然急，但看到数据都对，给了一个难得的点头。', modifiers: { progressGain: 3, experienceGain: 3, staminaCost: 3, moraleCost: 2 } },
      { label: '抓紧时间，速度优先', hint: '⚡ 快速完成但心里没底', narrative: '你用最快速度放完线。但晚上躺在床上总担心有没有放偏……', modifiers: { progressGain: 2, moraleCost: 5, experienceGain: 1 } },
    ],
  },

  // ═══════════════ 专家论证 ═══════════════
  {
    actionId: 'expert_review',
    scene: '深基坑专项方案要过专家论证，五位专家坐在投影幕前等你汇报。',
    choices: [
      { label: '按部就班汇报，严谨为主', hint: '📋 稳妥通过，经验适中', narrative: '你一页页认真讲完，专家提了六条意见，但整体给予认可。', modifiers: { experienceGain: 5, moraleCost: 3, approvalGain: 3 } },
      { label: '重点突出，主动预判问题', hint: '🧠 高难度但信任大幅提升', narrative: '你主动提出三个风险点和应对措施，专家们眼前一亮。最终只提了两条补充意见。', modifiers: { experienceGain: 6, approvalGain: 6, moraleCost: 5 } },
    ],
  },

  // ═══════════════ 技术创新 ═══════════════
  {
    actionId: 'tech_innovation',
    scene: '你发现一种新的模板支撑体系可能比传统做法省30%人工。',
    choices: [
      { label: '写技术论证，申请试点', hint: '📊 正式流程 → 高曝光+大收益', narrative: '你花了一周做方案对比，经理拍板先试。最后确实省了人工，你的名字出现在了项目月报上。', modifiers: { experienceGain: 5, approvalGain: 5, progressGain: 3, moraleCost: 3 } },
      { label: '先跟师傅商量，低调验证', hint: '🔬 低风险试验，结果不确定', narrative: '师傅说"可以试"，你们在一个小区段偷偷试了一下——效果不错，但还需要改进。', modifiers: { experienceGain: 4, moraleCost: -3 } },
    ],
  },

  // ═══════════════ 行业交流 ═══════════════
  {
    actionId: 'industry_exchange',
    scene: '隔壁央企的项目邀请你们参观他们的智慧工地系统。',
    choices: [
      { label: '认真参观，多拍多记', hint: '📸 全面学习 → 经验+信任', narrative: '你一边拍照一边问了二十个问题。回来后你写了一份三千字的参观报告。', modifiers: { experienceGain: 4, moraleCost: -5, approvalGain: 3 } },
      { label: '重点看看他们的管理模式', hint: '🧠 深度交流 → 心态大幅恢复', narrative: '你跟他们的项目经理聊了半小时管理经验。回来后你觉得差距不在硬件，在理念。', modifiers: { experienceGain: 3, moraleCost: -8 } },
    ],
  },

  // ═══════════════ 试验曲线描摹 ═══════════════
  {
    actionId: 'lab_curve_trace',
    scene: '试验室的回弹仪数据跳得很厉害，有两个点明显偏离曲线。',
    choices: [
      { label: '重新检测那两个点', hint: '📐 严谨处理 → 数据可靠，耗时', narrative: '你重新取了两个点检测，果然之前那两个是误操作。数据曲线完美了。', modifiers: { experienceGain: 4, moraleCost: 2, staminaCost: 2 } },
      { label: '标注异常，按其余数据出报告', hint: '⚡ 快速出报告，但数据有瑕疵', narrative: '你在报告里标注了异常值并说明原因。效率很高，但总觉得差了点什么。', modifiers: { experienceGain: 2, progressGain: 1 } },
    ],
  },
  {
    actionId: 'lab_curve_trace',
    scene: '混凝土试块28天强度刚好踩线，比设计值高了0.1MPa。',
    choices: [
      { label: '如实出报告，标注刚过线', hint: '📋 如实汇报，安全但领导可能多问', narrative: '你写了一份详实的报告，标注强度刚好达标。监理签字时多看了你一眼说"继续盯着"。', modifiers: { experienceGain: 3, approvalGain: 2 } },
      { label: '建议增做一组平行试验确认', hint: '🛡 多做一步确认 → 更可靠但耗时', narrative: '你多做了一组平行试验，结果强度余量足够。心里彻底踏实了，报告也更有说服力。', modifiers: { experienceGain: 4, safetyRiskChange: -2, moraleCost: 3 } },
    ],
  },

  // ═══════════════ 审查下属方案 ═══════════════
  {
    actionId: 'review_subordinate_plan',
    scene: '下属交来的施工方案里有一处计算错误，但他已经提交给了监理。',
    choices: [
      { label: '马上通知监理撤回修改', hint: '🛡 及时纠错 → 信任提升但下属难堪', narrative: '你第一时间联系监理撤回了方案。下属虽然脸上挂不住，但避免了一次大隐患。', modifiers: { approvalGain: 5, safetyRiskChange: -3, coworkerApprovalGain: -2 } },
      { label: '私下让下属改好后重新提交', hint: '🤝 保全面子 → 好感度保住但有时间差风险', narrative: '你叫他过来指出错误，让他今晚改好明早重交。下属感激涕零，但中间这段时间你心里一直悬着。', modifiers: { coworkerApprovalGain: 5, experienceGain: 2, safetyRiskChange: 1 } },
    ],
  },
  {
    actionId: 'review_subordinate_plan',
    scene: '审查方案时发现下属引用了一个已废止的规范条文。',
    choices: [
      { label: '批注标红，要求对照最新规范全面复查', hint: '📐 严格要求 → 下属成长快', narrative: '下属拿回去改了一天，改完后方案质量提升了一个档次。你的严格是最好的教育。', modifiers: { approvalGain: 3, experienceGain: 3, coworkerApprovalGain: -1 } },
      { label: '自己顺手改了', hint: '⚡ 省时间但下属学不到东西', narrative: '你五分钟改完了。方案过了，但下属下次大概率还会犯同样的错。', modifiers: { moraleCost: 2, progressGain: 1 } },
    ],
  },

  // ═══════════════ 评奖申报 ═══════════════
  {
    actionId: 'award_application',
    scene: '公司要求推荐一个项目参加省级QC成果评审，你负责准备材料。',
    choices: [
      { label: '从头整理数据，做一份精品材料', hint: '📊 高投入 → 获奖概率大，经验人脉双丰收', narrative: '你花了一周收集数据、做图表、写报告。最终拿了一等奖，项目部的名声打出去了。', modifiers: { experienceGain: 5, approvalGain: 6, networkGain: 3, moraleCost: 5 } },
      { label: '改改上次的模板凑个数', hint: '⚡ 省事但获奖可能性低', narrative: '你花了两天改了改去年的模板。结果只拿了个优秀奖，领导没说什么。', modifiers: { experienceGain: 2, approvalGain: 1 } },
    ],
  },

  // ═══════════════ 战略决策 ═══════════════
  {
    actionId: 'strategic_decision',
    scene: '两个分包队伍报价差距很大，便宜的那家口碑一般。作为负责人你需要拍板。',
    choices: [
      { label: '选便宜的，严格过程管控', hint: '💰 省成本但需要投入更多精力管理', narrative: '你选了低价队伍，但随后加大了巡检频次。最终质量合格，成本省下了一大笔。', modifiers: { salaryGain: 500, moraleCost: 4, experienceGain: 4, staminaCost: 3 } },
      { label: '选贵的，省心', hint: '🛡 多花钱但管理轻松，质量有保障', narrative: '你选了口碑好的队伍。他们果然不需要怎么盯，交出来的活很漂亮。你有更多时间做别的事。', modifiers: { salaryCost: 300, moraleCost: -5, approvalGain: 3 } },
    ],
  },

  // ═══════════════ 考研复习 ═══════════════
  {
    actionId: 'grad_exam_prep',
    scene: '考研数学真题做到一半，你被一道高数证明题卡住了整整一小时。',
    choices: [
      { label: '死磕到底，一定要自己想出来', hint: '🧠 极难但突破后理解更深', narrative: '两个小时后你终于想通了。那一刻的成就感无以言表，你甚至把推导过程拍照留念。', modifiers: { experienceGain: 4, moraleCost: 5, staminaCost: 3 } },
      { label: '看答案理解思路，然后做类似题巩固', hint: '📖 高效学习法，节省时间', narrative: '你看了答案恍然大悟，然后找了三道同类型题目巩固。效率很高。', modifiers: { experienceGain: 3, moraleCost: -2 } },
    ],
  },
  {
    actionId: 'grad_exam_prep',
    scene: '你买的考研英语网课老师突然换人了，新老师讲课风格完全不同。',
    choices: [
      { label: '适应新老师，继续跟课', hint: '⚡ 不中断进度，但需要调整', narrative: '你花了两天适应新风格。虽然不如之前的老师，但课程内容还是有价值的。', modifiers: { experienceGain: 2, moraleCost: 2 } },
      { label: '退掉，换一家机构的课', hint: '💰 花钱换更好的体验', narrative: '你果断退课换了一家好评更多的。新老师讲得确实好，但钱也多花了不少。', modifiers: { salaryCost: 300, moraleCost: -4, experienceGain: 3 } },
    ],
  },

  // ═══════════════ MBA夜校 ═══════════════
  {
    actionId: 'mba_night_school',
    scene: '今晚的MBA课程是小组讨论，你被分到一个案例分析组。',
    choices: [
      { label: '积极发言，争取做小组代表汇报', hint: '💬 曝光度高 → 人脉大涨', narrative: '你主动请缨做了汇报人。虽然紧张，但教授点评说"有实战经验的发言就是不一样"。', modifiers: { experienceGain: 4, networkGain: 3, moraleCost: 3 } },
      { label: '做好笔记，低调学习', hint: '📝 轻松学习，不出风头', narrative: '你安静地听完讨论，记了满满三页笔记。没有出风头，但学到的东西沉甸甸的。', modifiers: { experienceGain: 3, moraleCost: -3 } },
    ],
  },

  // ═══════════════ 公司战略 ═══════════════
  {
    actionId: 'company_strategy',
    scene: '集团会议上领导让你发言谈谈对明年市场的看法。',
    choices: [
      { label: '结合数据大胆预判', hint: '🎯 高风险高回报：说准了一战成名', narrative: '你引用了行业报告和公司数据做了一番分析。领导频频点头，会后单独找你聊了十分钟。', modifiers: { approvalGain: 8, networkGain: 5, experienceGain: 5, moraleCost: 5 } },
      { label: '保守发言，跟随主流意见', hint: '😌 安全不出错', narrative: '你说了几句中规中矩的话。没人记住你说了什么，但也没人挑毛病。', modifiers: { approvalGain: 2, moraleCost: -2 } },
    ],
  },

  // ═══════════════ 对外授课 ═══════════════
  {
    actionId: 'external_lecture',
    scene: '你被邀请去高校给土木系学生做职业分享，台下坐了一百多人。',
    choices: [
      { label: '讲真实的工地故事，接地气', hint: '🎤 生动有趣 → 学生反响好，人脉+', narrative: '你讲了三个工地上的真实故事，学生们笑声不断。分享结束后有十几个人加了你微信。', modifiers: { networkGain: 4, moraleCost: -6, experienceGain: 3 } },
      { label: '按PPT讲专业内容，正式一些', hint: '📊 专业严谨，但可能不够吸引学生', narrative: '你按准备好的PPT讲完了。老师觉得内容很好，但学生们似乎更想听故事。', modifiers: { experienceGain: 4, approvalGain: 3, moraleCost: 2 } },
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
