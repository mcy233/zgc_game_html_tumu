export type CoworkerInteractionEffect = Partial<{
  morale: number;
  stamina: number;
  energy: number;
  coworkerApproval: number;
  materials: number;
  planProgress: number;
  progress: number;
  reputation: number;
  salary: number;
  certificates: number;
  safetyRisk: number;
  reviews: number;
  bossApproval: number;
}>;

export interface CoworkerInteraction {
  id: string;
  label: string;
  description: string;
  texts: [string, string, string];
  effect: CoworkerInteractionEffect;
}

export const COWORKER_INTERACTIONS: CoworkerInteraction[] = [
  {
    id: 'cw_site_basketball',
    label: '工地篮球',
    description: '利用午休在临时球场投几个三分，把对甲方的怨气砸在篮板上。',
    texts: [
      '汗流浃背之后，你发现「混凝土养护」和「自己补水」一样重要。',
      '防守你的人是钢筋工，卡位比规范条文还硬，你输得心服口服。',
      '进了一个漂亮上篮，全场起哄，这一刻你觉得自己不是牛马，是球星（限时版）。',
    ],
    effect: { stamina: 10, morale: 5, energy: -15 },
  },
  {
    id: 'cw_qty_takeoff',
    label: '帮忙算工程量',
    description: '请前辈帮你核对土方与混凝土量，Excel 拉满，怀疑人生也拉满。',
    texts: [
      '他一眼看出你漏乘了系数，三天算白费的绝望与解脱同时抵达。',
      '你们把模型对完，发现差在「是否含坡道」，土木世界尽头是扣减规则。',
      '他教你快捷键三连，你顿悟：算量员的终极武器是手速与信仰。',
    ],
    effect: { progress: 6, coworkerApproval: 10, energy: -10 },
  },
  {
    id: 'cw_site_bbq',
    label: '工地烧烤',
    description: '收工后路边摊，孜然味混合柴油味，才是正宗项目部夜宵。',
    texts: [
      '烤串上的油滴进土里，你开玩笑：这叫就地回填，压实度未知。',
      '吐槽甲方变更，火力比炭火还旺，情绪价值直接拉满。',
      '买单时大家抢二维码，最后总是工资最高的那个输——你默默收起手机。',
    ],
    effect: { morale: 15, energy: 10, salary: -150, coworkerApproval: 15 },
  },
  {
    id: 'cw_code_standards',
    label: '一起研究规范',
    description: '对着 GB 条文和图集页码，争论「到底谁理解得对」。',
    texts: [
      '你看到附录里的小字脚注，像挖到宝藏；对方沉默三秒，承认「你狠」。',
      '争到嗓子哑，最后一致决定：发邮件问设计院——甩锅也要讲流程。',
      '规范翻烂了角，友谊翻出了包浆，这就是技术宅的浪漫。',
    ],
    effect: { progress: 6, morale: 5, energy: -10 },
  },
  {
    id: 'cw_shed_doudizhu',
    label: '工棚斗地主',
    description: '雨夜无法出工，扑克牌替代 KPI，炸弹比塔吊还响。',
    texts: [
      '连赢三把，你膨胀了；连输三把，你悟了：人生起落比工期还快。',
      '地主上家是你师傅，出牌狠辣，你怀疑他在现场也是这样指挥的。',
      '散场时谁输了谁买水，经济内循环在工棚完成闭环。',
    ],
    effect: { morale: 20, energy: -10, coworkerApproval: 10 },
  },
  {
    id: 'cw_break_chat',
    label: '工间休息吹牛',
    description: '保温杯里泡枸杞，话题从监理脾气聊到哪家猪脚饭好吃。',
    texts: [
      '听说下个标段要招标，你们眼神发光，仿佛听到金币掉落声。',
      '有人讲鬼故事，结尾永远是「资料还没签完」，全场冷场一秒爆笑。',
      '十分钟休息结束，各自戴回安全帽，像战士重新上战场。',
    ],
    effect: { morale: 8, reputation: 1, energy: 5 },
  },
  {
    id: 'cw_exam_prep',
    label: '帮忙准备考证',
    description: '互相抽问一建实务知识点，错题本比施工日志还厚。',
    texts: [
      '他画的网络图比你情书还工整，你突然理解什么叫「考证改变命运」。',
      '模拟题错一半，你们互相安慰：「考场发挥通常比模考高。」自我催眠也是技能。',
      '约定考过请吃饭，饭桌已经虚拟预订到明年春节。',
    ],
    effect: { reputation: 5, progress: 3, energy: -15, coworkerApproval: 6 },
  },
  {
    id: 'cw_docs_together',
    label: '一起整理资料',
    description: '检验批、试验报告、影像资料分盒归档，流水线作业。',
    texts: [
      '人多力量大，原本一周的盒，一天码齐——虽然腰也齐刷刷报废。',
      '你们发明「编号口诀」，念起来像邪教仪式，但真好用。',
      '监理抽查前夜，灯火通明的资料室像期末自习室，土木人的青春啊。',
    ],
    effect: { progress: 9, coworkerApproval: 5, energy: -20 },
  },
  {
    id: 'cw_arm_wrestle',
    label: '掰手腕比赛',
    description: '用原始力量解决「谁去叫商混站补方」的哲学命题。',
    texts: [
      '你输给安装师傅，心服口服：人家天天拧螺栓，你天天拧心态。',
      '裁判喊「肘不能抬」，你心想工地规矩比掰手腕还多。',
      '赢的人请客冰棍，输的人心甘情愿——这才是公平贸易。',
    ],
    effect: { stamina: 12, morale: 10, energy: -15 },
  },
  {
    id: 'cw_site_cleanup',
    label: '清理施工现场',
    description: '文明施工大检查前，全员捡烟头、扫木屑、遮盖裸土。',
    texts: [
      '环境整洁后，连监理拍照都温柔了几分，滤镜叫「迎检灰」。',
      '你们在废料堆翻出半箱完好的扣件，像捡到红包。',
      '打扫完冲水，尘土下去，良心上来——短暂。',
    ],
    effect: { morale: 5, materials: 100, energy: -10 },
  },
  {
    id: 'cw_master_teach',
    label: '老师傅传授经验',
    description: '听老师傅讲三十年前的故事，技术不多，人生哲理管够。',
    texts: [
      '他说「混凝土会骗人，试块不会」，你记在小本本上，比规范还郑重。',
      '茶缸里茶叶比图纸还浓，每一句话都带着烟嗓混响。',
      '临走他送你一把卷尺：「量别人前先量自己。」你愣住，以为在讲禅。',
    ],
    effect: { progress: 6, morale: 6, energy: -12, coworkerApproval: 8 },
  },
  {
    id: 'cw_rooftop_drink',
    label: '宿舍楼顶喝酒',
    description: '仰望塔吊星空，俯瞰板房人间，啤酒泡沫里都是未完工的节点。',
    texts: [
      '有人哼跑调的歌，楼板共鸣，你突然觉得这就是项目部 Live House。',
      '聊起老家对象，全场安静三秒，然后集体「都在酒里」。',
      '风一吹酒醒一半，明天早班会还要继续演成年人。',
    ],
    effect: { morale: 18, stamina: 6, energy: 8, salary: -120, coworkerApproval: 12 },
  },
  {
    id: 'cw_hard_problem',
    label: '讨论施工难题',
    description: '白板笔画满节点大样，从「能不能做」吵到「做了谁背锅」。',
    texts: [
      '你们把规范、图集、厂家技术说明摊一桌，像办案。',
      '争到关键点，同时掏出手机拍照发各自领导——同步率 400%。',
      '最后结论：先按图做，留好影像——土木版「程序正义」。',
    ],
    effect: { progress: 9, planProgress: 3, energy: -14, coworkerApproval: 10 },
  },
  {
    id: 'cw_morning_exercise',
    label: '晨跑锻炼',
    description: '六点天没亮，你被工友拉出被窝绕工地跑三圈。',
    texts: [
      '跑完你气喘吁吁，他一脸嫌弃：「才三圈就这样？钢筋工都比你能跑。」',
      '清晨的工地意外安静，只有鸟叫和你的喘息声——片刻的平静，很珍贵。',
      '你发誓明天还来，但闹钟响的时候你按了静音——真香定律在工地也适用。',
    ],
    effect: { stamina: 15, morale: 8, energy: -8, coworkerApproval: 5 },
  },
  {
    id: 'cw_phone_repair',
    label: '帮忙修手机',
    description: '工友的手机掉进搅拌桶溅了泥浆，你被当成IT专家。',
    texts: [
      '你拿纸巾擦了十分钟，重启后居然能用了。工友看你的眼神像看神仙。',
      '「你是学土木的还是学修手机的？」你说都不是，你是学百度的。',
      '修好之后他非要请你喝奶茶，你觉得这可能是工地上性价比最高的社交投资。',
    ],
    effect: { morale: 6, coworkerApproval: 12, energy: -5 },
  },
  {
    id: 'cw_teach_bim',
    label: '教工友用软件',
    description: '你教他用BIM出图、用WPS做表，他教你看现场。公平交易。',
    texts: [
      '他学Excel用了三小时，学会的第一个函数是SUM。你说够了，这比很多领导强。',
      '教完Revit基本操作后他问：「这个能打游戏吗？」你沉默三秒：「理论上……」',
      '他很快超过你预期：不到一周就会自己出截面图了。你的教学成就感比发论文还强。',
    ],
    effect: { progress: 4, reputation: 3, coworkerApproval: 10, energy: -12 },
  },
  {
    id: 'cw_night_market',
    label: '逛夜市',
    description: '下班后骑电动车去附近夜市，油炸味混着方言吆喝，是打工人的充电站。',
    texts: [
      '你买了一份炒粉，他买了一份卤味，坐马路牙子上吃得很认真——这叫工地米其林路边分店。',
      '夜市老板问你们「是不是那个工地的」，你点头。他多给了一串烤肉：「辛苦了。」',
      '逛完回去路过工地，塔吊的灯还亮着。你说「看，那就是我们盖的楼」，语气里有一点骄傲。',
    ],
    effect: { morale: 15, stamina: 5, salary: -80, coworkerApproval: 8, energy: -5 },
  },
  {
    id: 'cw_complain_session',
    label: '集体吐槽大会',
    description: '几个人围坐板房吐槽甲方、监理、天气、食堂，把负能量转化为战斗力。',
    texts: [
      '有人说甲方变更像呼吸一样自然，你补一句「而且同样无法拒绝」，笑声快掀翻屋顶。',
      '吐槽完食堂的菜，所有人达成共识：最难吃的是周四的回锅肉。这是项目部唯一的全票通过。',
      '骂完之后大家精神抖擞去上工了——负能量排毒，效果不亚于spa。',
    ],
    effect: { morale: 12, energy: 5, coworkerApproval: 6 },
  },
  {
    id: 'cw_photo_session',
    label: '帮忙拍工程照',
    description: '隐蔽验收前需要影像资料，你被拉去当摄影师。',
    texts: [
      '你蹲着拍了三十张钢筋绑扎照，姿势比婚纱摄影师还专业——不同的是背景是泥。',
      '他说「拍清楚点，监理要看」，你默默开了HDR：这是对规范条文的尊重。',
      '拍完他检查照片，指着一张说「这个角度不错」。你觉得，土木摄影也算一门艺术吧。',
    ],
    effect: { progress: 3, coworkerApproval: 8, energy: -8, morale: 3 },
  },
  {
    id: 'cw_birthday_surprise',
    label: '给工友过生日',
    description: '项目部唯一的仪式感——蛋糕、蜡烛、安全帽生日歌。',
    texts: [
      '蛋糕是路边店买的，蜡烛是从食堂偷的，但唱歌的时候所有人都很认真。',
      '寿星许愿：「希望今年项目不延期。」你们鼓掌——这比「世界和平」实际多了。',
      '吃完蛋糕还有半小时就上工，你们用安全帽当碗分蛋糕，监理看到估计要写整改。',
    ],
    effect: { morale: 18, salary: -200, coworkerApproval: 15, energy: -5 },
  },
];
