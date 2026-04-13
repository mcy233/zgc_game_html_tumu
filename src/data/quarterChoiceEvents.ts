import type { PendingQuarterChoice, ProjectPhase } from '../types/index';

/** 四类通用季度抉择（与施工阶段无关，全期可抽中） */
export const QUARTER_CHOICE_SCENARIOS: PendingQuarterChoice[] = [
  {
    title: '材料进场质检问题',
    description:
      '一车钢筋进场，质保单齐全，但抽检发现表面锈蚀与直径游标卡尺读数「暧昧」。监理皱眉，供货商拍胸，你夹在中间像人形夹心饼干。',
    options: [
      {
        id: 'steel_reject',
        label: '坚决退场，要求换货复检',
        hint: '安全口碑拉满，工期与班组情绪承压',
        outcomeText:
          '你签字「退场」两字时手没抖，心里在抖。供货商路上骂你，班组骂供货商，至少晚上睡得着——相对。',
        deltas: { safetyRisk: -8, progress: -6, bossApproval: 4, materials: -120 },
      },
      {
        id: 'steel_conditional',
        label: '见证取样加急送检，现场让步使用',
        hint: '赌报告合格，项目经理与你共担心跳',
        outcomeText:
          '试拉试弯一阵折腾，报告出来「合格」两个字像彩票。你多了几根白发，但少了一堆整改单。',
        deltas: { salary: -400, energy: -15, morale: -6, progress: 4, reputation: 2 },
      },
      {
        id: 'steel_smooth',
        label: '默许先卸货，事后补「情况说明」',
        hint: '进度保住，隐患与口碑埋雷',
        outcomeText:
          '供货商当场给你递烟，你摆手拒绝，心里知道拒绝不了的是以后验收台上的那一问。资料员默默新建文件夹：补录。',
        deltas: { progress: 8, safetyRisk: 12, reputation: -5, bossApproval: -6 },
      },
    ],
  },
  {
    title: '甲方突然变更设计',
    description:
      '群里甩来新版 PDF：「按此执行」。打开一看，已浇完的梁像笑话，模板工像预言家——他们昨天刚说「这活还得返」。',
    options: [
      {
        id: 'change_formal',
        label: '走正式变更指令，停工算量',
        hint: '程序正义，现金与工期都疼',
        outcomeText:
          '联系单、签证、影像链一条龙，预算员看你像看财神，财神手里没元宝。至少锅不会单独扣你一人头上。',
        deltas: { progress: -10, bossApproval: 8, morale: 4, materials: -200, reputation: 3 },
      },
      {
        id: 'change_guerrilla',
        label: '先口头答应，私下让班组「微调」',
        hint: '快，但容易被监理甲方混合双打',
        outcomeText:
          '班组连夜改，现场像战地。监理巡检时眼神飘忽，你陪笑递水，水是真的，笑是租的。',
        deltas: { energy: -22, stamina: -10, progress: 6, safetyRisk: 8, reviews: -4 },
      },
      {
        id: 'change_pushback',
        label: '拉上项目经理一起怼回不合理点',
        hint: '可能赢一口气，也可能赢一张罚单',
        outcomeText:
          '会议桌上三方拉扯，最后「优化」成折中方案——土木界永恒真理：没有不能改的图，只有不能停的施工。',
        deltas: { morale: -8, energy: -12, bossApproval: 5, reputation: 4, planProgress: 5 },
      },
    ],
  },
  {
    title: '包工头求情减少工序',
    description:
      '分包老板递烟又递茶：「这道收口少一道没事，以前都这么干。」他眼神真诚，你想起规范条文也真诚。',
    options: [
      {
        id: 'proc_strict',
        label: '按图按规范，一道不能少',
        hint: '安全与原则满分，人情欠条也满分',
        outcomeText:
          '包工头叹气收烟，转身嘟囔。你知道背后骂你「读书读傻了」，但你更怕背后骂你「进去踩缝纫机了」。',
        deltas: { safetyRisk: -6, progress: -4, reviews: 5, morale: -5 },
      },
      {
        id: 'proc_trade',
        label: '让他加人加班把损失抢回来',
        hint: '进度回血，钱包与体力出血',
        outcomeText:
          '夜班灯亮起，混凝土和你一样困。班组多拿钱，你多掉头发，公平。',
        deltas: { salary: -600, energy: -18, progress: 7, stamina: -8 },
      },
      {
        id: 'proc_wink',
        label: '睁一只眼闭一只眼',
        hint: '当下省事，检查季可能爆炸',
        outcomeText:
          '他拍你肩说「够意思」，你心里把「够意思」翻译成「够你喝一壶」。资料照片多拍几张，算心理保险。',
        deltas: { progress: 5, safetyRisk: 14, reputation: -8, bossApproval: -4 },
      },
    ],
  },
  {
    title: '暴雨预警赶工抉择',
    description:
      '气象台蓝黄橙轮流上热搜，基坑还在敞着口。经理问：「今晚浇不浇？」雨水在等答案，混凝土也在等。',
    options: [
      {
        id: 'rain_stop',
        label: '果断覆盖停工，加固排水',
        hint: '稳，但节点像悬在头顶的塔吊钩',
        outcomeText:
          '雨夜里塑料薄膜哗啦啦，像给工地盖被子。你站在棚下觉得自己是守护神，也是背锅预备役。',
        deltas: { morale: 6, safetyRisk: -10, progress: -8, materials: -80 },
      },
      {
        id: 'rain_rush',
        label: '抢在暴雨前抢浇一段',
        hint: '赌天公给面子，输了全场复盘你',
        outcomeText:
          '泵车轰鸣盖过雷声，最后一车打完，雨点才砸下来——这一刻你信玄学。明天会不会裂，那是明天的你。',
        deltas: { energy: -25, stamina: -12, progress: 10, safetyRisk: 6, morale: -6 },
      },
      {
        id: 'rain_half',
        label: '减半作业面，留人值守巡查',
        hint: '折中艺术，三方都不满意但都能签字',
        outcomeText:
          '会议记录写「动态调整」，翻译：谁也没赢，但谁也没法单独甩锅。你学会了土木高阶技能：和稀泥。',
        deltas: { progress: 2, bossApproval: 3, morale: -4, salary: -200 },
      },
    ],
  },
];

/** 按项目阶段分组的专属事件（仅用于智能抽取；键为 ProjectPhase） */
const QUARTER_CHOICE_BY_PHASE: Record<ProjectPhase, PendingQuarterChoice[]> = {
  PREP: [
    {
      title: '临时用电被突击检查',
      description:
        '安监站的人像从地缝里冒出来：二级箱接地像摆设，电缆拖地像面条，「一机一闸一漏保」在你现场像绕口令。项目经理在群里疯狂@你，手机震得比漏电保护器还灵敏。',
      options: [
        {
          id: 'prep_power_shutdown',
          label: '立刻拉闸停工，连夜整改配电与标识',
          hint: '节点肉疼，但检查表上能写「态度端正」',
          outcomeText:
            '你亲手给每个箱子贴上「禁止想象接地」的玩笑式警示——笑完还是得打螺丝。班组骂你折腾，你知道不折腾明天上通报的就是你。',
          deltas: { progress: -6, safetyRisk: -12, energy: -18, materials: -150, bossApproval: 6 },
        },
        {
          id: 'prep_power_paper',
          label: '先补台账、摆灭火器，现场「看起来合规」',
          hint: '短期糊弄学硕士，长期心跳加速器',
          outcomeText:
            '照片拍得像安全宣传片，实际隐患还在角落里冷笑。监理点头的那一秒，你听见未来整改单在远方吹口哨。',
          deltas: { energy: -14, reputation: -4, safetyRisk: 8, progress: 4, bossApproval: -3 },
        },
        {
          id: 'prep_power_delegate',
          label: '甩给电工班长签字，你只盯混凝土',
          hint: '甩锅一时爽，追责火葬场',
          outcomeText:
            '班长嘴上答应，心里给你记账。第二天安监复查，签字栏上你的名字还是跑不掉——土木第一课：电的事，谁也别想装失踪。',
          deltas: { morale: -8, bossApproval: -6, safetyRisk: 10, networkValue: -5, experience: 4 },
        },
      ],
    },
    {
      title: '围挡广告被投诉要连夜整改',
      description:
        '城管电话比甲方还急：灯箱超高了、字体艳俗了、或者「影响市容」——翻译：有人看你不爽。甲方品牌部在群里发语音，每条六十秒，没有一句能落地。',
      options: [
        {
          id: 'prep_fence_comply',
          label: '照单全拆重装，尺寸色值按规范来',
          hint: '钱和时间飞走，投诉熄火',
          outcomeText:
            '吊车半夜进场，城市睡了，工地醒着。你站在路边看新围挡升起，觉得自己像在给城市敷面膜——贵，且未必有人夸。',
          deltas: { salary: -500, progress: -5, ownerSatisfaction: 5, reputation: 3, energy: -16 },
        },
        {
          id: 'prep_fence_delay',
          label: '让甲方出函协调，争取三天缓冲',
          hint: '把球踢给出钱的人，踢不好一起挨骂',
          outcomeText:
            '函件来回像乒乓球，你当网。第三天城管还是来了，但至少锅从「全你」变成了「分摊」，土木人的胜利。',
          deltas: { energy: -12, bossApproval: 4, ownerSatisfaction: -4, morale: -4, planProgress: 4 },
        },
        {
          id: 'prep_fence_dim',
          label: '先关一半灯、缩字号，赌对方不再路过',
          hint: '低成本侥幸心理，抽查季再开奖',
          outcomeText:
            '夜色里围挡低调得像做错事的小孩。你知道这是拖延术，不是解决术——但今晚你能回家洗澡，已经算赢。',
          deltas: { progress: 3, salary: -120, reputation: -6, safetyRisk: 4, ownerSatisfaction: -3 },
        },
      ],
    },
    {
      title: '隔壁项目来借设备/人手',
      description:
        '隔壁标段经理笑得像多年失散兄弟：「就两天，泵车借一下，钢筋工匀五个。」你心里有本账：借出去是人情，借出去也可能是节点自杀。',
      options: [
        {
          id: 'prep_lend_refuse',
          label: '婉拒：合同节点写明，自家都掐表',
          hint: '保住进度，隔壁朋友圈对你静音',
          outcomeText:
            '他转身时肩膀一沉，你也一沉——你知道下次你缺人，他不会回消息。但至少本季考核表上，你不会写「因借人延误」。',
          deltas: { progress: 2, bossApproval: 4, networkValue: -8, morale: -5, reputation: 2 },
        },
        {
          id: 'prep_lend_yes',
          label: '借！换个人情，以后互相擦背',
          hint: '江湖义气充值，自家风险分期付款',
          outcomeText:
            '泵车开过去那刻你像嫁女儿。两天后车回来了，油表空了，司机脸色像欠他八个夜班。人情债利息，从来不写在合同里。',
          deltas: { networkValue: 10, progress: -7, materials: -100, energy: -14, morale: 4 },
        },
        {
          id: 'prep_lend_rent',
          label: '可以，按市场价签短期租赁单',
          hint: '把人情变现，对方可能觉得你抠',
          outcomeText:
            '他愣了一秒说「行」，签字时笔迹比混凝土还硬。钱到账你松口气——这年头，谈钱不伤感情，谈感情才伤钱包。',
          deltas: { salary: 400, reputation: -3, ownerSatisfaction: 2, progress: -3, bossApproval: 3 },
        },
      ],
    },
    {
      title: '扬尘噪声在线监测「离线」',
      description:
        '智慧工地平台弹红字：设备离线。环保局电话比闹钟准时。项目经理盯着你，眼神翻译：要么上线，要么上线（物理）。',
      options: [
        {
          id: 'prep_iot_fix',
          label: '立刻派人爬杆换 SIM、重启上传',
          hint: '老实人路线，今晚别睡',
          outcomeText:
            '你在塔吊下仰望维修工，像仰望互联网之神。信号恢复那一刻，平台绿了，你也绿了——累的。',
          deltas: { energy: -16, salary: -250, safetyRisk: -4, reputation: 3, bossApproval: 5 },
        },
        {
          id: 'prep_iot_explain',
          label: '写情况说明：雷击/运营商割接/不可抗力三连',
          hint: '文笔救场，看审核员信不信',
          outcomeText:
            '说明里每个词都经过法务灵魂按摩。对方回「收悉」，你懂：这局暂时平，下一局再说。',
          deltas: { planProgress: 5, energy: -10, ownerSatisfaction: -2, experience: 6 },
        },
        {
          id: 'prep_iot_nudge',
          label: '先手动喷淋降尘，数据后面「对齐」',
          hint: '现场好看，合规像薛定谔的猫',
          outcomeText:
            '水雾里的工地像仙境，监测曲线像心电图。你知道有人在看后台，你也在看良心——后者通常没有仪表盘。',
          deltas: { materials: -60, safetyRisk: 6, morale: -4, progress: 3, reputation: -5 },
        },
      ],
    },
  ],
  FOUNDATION: [
    {
      title: '地下管线冲突，与设计不符',
      description:
        '挖掘机一齿下去，世界安静了——下面躺着一根谁也没画过的管子。设计、勘察、甲方群同时「正在输入」，输入的是你的人生倒计时。',
      options: [
        {
          id: 'found_pipe_stop',
          label: '立即停工，联系单+探挖+会议纪要一条龙',
          hint: '程序拉满，工期哭给你看',
          outcomeText:
            '探坑像考古现场，每挖一层多一个祖宗。至少责任链清晰：以后甩锅按座次，你不是第一排。',
          deltas: { progress: -9, bossApproval: 7, ownerSatisfaction: 4, planProgress: 6, energy: -14 },
        },
        {
          id: 'found_pipe_detour',
          label: '现场改绕行支架，边干边等正式变更',
          hint: '快，但可能被监理记小本本',
          outcomeText:
            '临时支架立得像现代艺术，监理拍照时你微笑。你知道「临时」两个字在土木界有时等于「永久直到出事」。',
          deltas: { progress: 4, safetyRisk: 8, salary: -350, reputation: -3, materials: -120 },
        },
        {
          id: 'found_pipe_whisper',
          label: '让班组小范围「处理」后悄悄掩埋',
          hint: '进度保住了，良心与风险一起埋',
          outcomeText:
            '覆土那一刻土是凉的，你后背也是。资料员问影像呢，你说「雨天没拍清」——经典土木谎言榜前十。',
          deltas: { progress: 8, safetyRisk: 16, reputation: -10, certificates: -1, bossApproval: -8 },
        },
      ],
    },
    {
      title: '试桩/地基检测结果不理想',
      description:
        '报告上的曲线比你的人生还跌宕。设计院电话那头沉默三秒，说「再研究」。翻译：要加钱、要加桩、或者要加你的血压。',
      options: [
        {
          id: 'found_pile_formal',
          label: '上报公司+设计院，走补勘与方案变更',
          hint: '正规军打法，账上数字也正规地疼',
          outcomeText:
            '变更图下来那天，预算员看你的眼神像看移动 ATM。你安慰自己：贵是贵，至少楼不会歪成行为艺术。',
          deltas: { progress: -7, materials: -280, ownerSatisfaction: 5, bossApproval: 6, experience: 8 },
        },
        {
          id: 'found_pile_extra',
          label: '加试桩、灌浆、堆载预压，砸钱换指标',
          hint: '物理说服大地，钱包说服会计',
          outcomeText:
            '机器轰鸣里你听见人民币燃烧的声音。指标终于过了，你多了几根白发，大地多了几根桩——公平交易。',
          deltas: { salary: -700, progress: 3, safetyRisk: -4, morale: -6, reputation: 2 },
        },
        {
          id: 'found_pile_debate',
          label: '拉着检测单位扯采样、仪器、工况',
          hint: '可能翻盘，也可能把关系扯裂',
          outcomeText:
            '会议室里术语横飞，像在法庭又像在菜市场。最后「复检」两个字落地，你知道这只是中场休息。',
          deltas: { energy: -20, networkValue: -6, planProgress: -4, morale: -8, bossApproval: 3 },
        },
      ],
    },
    {
      title: '监理突击检查旁站记录',
      description:
        '他翻开本子，空白页比你周报还干净。「旁站呢？」他笑。你想起昨晚混凝土来了三次，你来了零次——人在现场，魂在宿舍。',
      options: [
        {
          id: 'found_log_rebuild',
          label: '通宵补记录、对齐时间轴与照片 EXIF',
          hint: '资料员与你共赴黄泉路',
          outcomeText:
            '打印机冒烟，咖啡当水喝。天亮时本子厚了一倍，厚度与心虚成正比。监理签字那刻，你学会了什么叫「形式主义的安全感」。',
          deltas: { energy: -22, stamina: -10, reputation: 2, bossApproval: 4, morale: -8 },
        },
        {
          id: 'found_log_honest',
          label: '承认缺失，立整改：以后关键工序双人旁站',
          hint: '当场丢脸，长期口碑回血',
          outcomeText:
            '监理愣了一下，居然没继续刁难——有时候诚实比圆谎便宜。班组背后说你「轴」，你说轴比进去强。',
          deltas: { morale: 4, progress: -4, experience: 10, ownerSatisfaction: 2, safetyRisk: -5 },
        },
        {
          id: 'found_log_smooth',
          label: '请总监「喝茶」，旁站本下周统一「完善」',
          hint: '江湖规矩，合规灰色地带',
          outcomeText:
            '茶过三巡，话过三圈，本子神奇地丰满了。你知道这笔人情以后要还，还的时候通常带利息。',
          deltas: { salary: -400, networkValue: 6, reputation: -5, bossApproval: -4, energy: -12 },
        },
      ],
    },
  ],
  MAIN: [
    {
      title: '塔吊/吊车故障停机',
      description:
        '对讲机里司机嗓子劈了：「刹车不对劲！」塔吊像巨兽打了个嗝，全场抬头。进度表在脑子里自己撕了一页。',
      options: [
        {
          id: 'main_crane_rent',
          label: '紧急外租汽车吊+调整流水节拍',
          hint: '烧钱换时间，会计在远方咳嗽',
          outcomeText:
            '汽车吊进场像救火车，账单像火灾现场。你看着吊装恢复，心里给塔吊师傅发锦旗：「谢谢坏得不是时候」。',
          deltas: { salary: -650, progress: 2, energy: -16, bossApproval: 5, materials: -90 },
        },
        {
          id: 'main_crane_wait',
          label: '等原厂配件，全线让路给非吊装工序',
          hint: '省钱，节点可能表演跳水',
          outcomeText:
            '配件在路上的天数，比异地恋还难盼。班组在别的面干活，骂声像白噪音——你假装听不见。',
          deltas: { progress: -8, morale: -6, ownerSatisfaction: -5, safetyRisk: -6, stamina: -6 },
        },
        {
          id: 'main_crane_push',
          label: '施压维保「先顶一顶」，小幅超载抢吊',
          hint: '赌赢了抢回进度，赌输了上新闻',
          outcomeText:
            '钢梁离地那刻你屏住呼吸，比看恐怖片还刺激。事后你发誓再也不赌——下次节点紧时你会再考虑发誓的有效性。',
          deltas: { progress: 9, safetyRisk: 14, reputation: -7, bossApproval: -5, morale: -10 },
        },
      ],
    },
    {
      title: '混凝土供应商突然涨价',
      description:
        '搅拌站老板发来新价目表，涨幅像股市涨停。合同里写着「随行就市」，当时你觉得是套话，现在发现是套你。',
      options: [
        {
          id: 'main_conc_absorb',
          label: '项目部先扛差价，后面再谈补充协议',
          hint: '当期利润蒸发，关系暂时稳住',
          outcomeText:
            '财务问你为什么本月这么红，你说红的是账不是行情。供货商请你吃饭，你心想这顿饭也是你请的。',
          deltas: { salary: -550, progress: 5, ownerSatisfaction: 3, morale: -5, networkValue: 4 },
        },
        {
          id: 'main_conc_owner',
          label: '联合项目经理找甲方要调差',
          hint: '可能批下来，也可能收获已读不回',
          outcomeText:
            '会议桌上甲方微笑：「理解。」会后三天无下文。第四天来一句「按合同执行」——土木经典结局之一。',
          deltas: { energy: -18, ownerSatisfaction: -6, bossApproval: 6, reputation: 3, planProgress: 4 },
        },
        {
          id: 'main_conc_switch',
          label: '换一家小站，单价低但离规范边缘近',
          hint: '省钱玄学，质量像盲盒',
          outcomeText:
            '第一车灰和易性像奶茶，你沉默。试块七天强度出来那天，你决定以后少换供应商，多换降压药。',
          deltas: { materials: -200, safetyRisk: 10, progress: 6, reputation: -6, experience: 5 },
        },
      ],
    },
    {
      title: '上级领导来检查，全员突击整理现场',
      description:
        '红头通知提前二十四小时：领导「视察」。项目部瞬间变剧组：洒水、盖绿网、工人穿新反光衣，连狗都得拴整齐。',
      options: [
        {
          id: 'main_visit_show',
          label: '停工大扫除+布置观摩路线，全员背台词',
          hint: '面子工程拉满，里子进度欠费',
          outcomeText:
            '领导点头那刻，项目经理握你手像奥斯卡颁奖。你知道明天垃圾还是会堆回来——但今天先活在宣传片里。',
          deltas: { progress: -6, bossApproval: 8, ownerSatisfaction: 6, energy: -20, morale: -4 },
        },
        {
          id: 'main_visit_real',
          label: '正常施工，只加强通道与标识，实话实说',
          hint: '真实可能扣分，也可能赢得「踏实」评价',
          outcomeText:
            '领导鞋上沾了泥，居然没发火，问了几句工艺。你事后想：也许他们看多了假的，偶尔见真的反而不困。',
          deltas: { reputation: 6, experience: 8, bossApproval: 3, ownerSatisfaction: 2, stamina: -8 },
        },
        {
          id: 'main_visit_decoy',
          label: '主作业面藏后面，前面摆「样板区」演戏',
          hint: '导演系土木分舵，穿帮风险自负',
          outcomeText:
            '样板区光鲜得像售楼处，后面浇筑还在吼。领导没往里走——你不知道是运气还是对方也懂行规。',
          deltas: { energy: -16, reputation: -4, progress: 2, safetyRisk: 5, networkValue: 3 },
        },
      ],
    },
  ],
  FINISHING: [
    {
      title: '消防验收不过，需要整改',
      description:
        '消火栓箱门一开，里面躺着工人留下的泡面调料包。验收人员表情管理失败。你知道这不是消防问题，这是「态度问题」的放大器。',
      options: [
        {
          id: 'fin_fire_full',
          label: '全面返工：按图复位管线、标识、联动',
          hint: '慢、贵、但能睡整觉',
          outcomeText:
            '整改单长度像长篇小说，你逐条划勾像通关。复检通过那刻，你想给消火栓鞠躬——它比你更懂坚持。',
          deltas: { progress: -8, salary: -600, ownerSatisfaction: 8, safetyRisk: -10, bossApproval: 7 },
        },
        {
          id: 'fin_fire_target',
          label: '只改抽检不合格点，其余「后续移交消缺」',
          hint: '快，但甲方物业可能记仇',
          outcomeText:
            '会上大家握手，会后群里继续撕。你知道「消缺」两个字是土木界的「下次一定」。',
          deltas: { progress: 3, reputation: -5, ownerSatisfaction: -4, materials: -140, energy: -14 },
        },
        {
          id: 'fin_fire_smooth',
          label: '暗示「协调费」，求专家笔下留情',
          hint: '高风险捷径，剧情可能转向法制频道',
          outcomeText:
            '对方眼神冷下来，你立刻改口「加强学习」。走出会议室你腿软——有些门敲了，就再也关不上。',
          deltas: { reputation: -12, certificates: -2, salary: -300, bossApproval: -10, networkValue: -8 },
        },
      ],
    },
    {
      title: '业主/物业提前介入要求',
      description:
        '还没竣工，业主代表已经带着卷尺和审美来了：「这里要加个插座」「那里颜色不对」。设计变更在口头完成，预算在沉默中爆炸。',
      options: [
        {
          id: 'fin_owner_coop',
          label: '逐项出签证与变更，程序走满',
          hint: '规矩，但甲方可能嫌你「不灵活」',
          outcomeText:
            '联系单像雪花，签字像拔河。最后甲方说「效率太低」——你心想效率低是因为你们要得太多。',
          deltas: { ownerSatisfaction: 4, progress: -5, planProgress: 6, energy: -16, bossApproval: 5 },
        },
        {
          id: 'fin_owner_pm',
          label: '推项目经理+设计对外，你做记录与抄送',
          hint: '生存智慧，存在感下降',
          outcomeText:
            '会议桌上炮火对准经理，你在角落记笔记。笔记最后一行写：「活着真好。」',
          deltas: { morale: 4, reputation: 2, bossApproval: 2, ownerSatisfaction: -3, experience: 5 },
        },
        {
          id: 'fin_owner_yesman',
          label: '口头全答应，现场「尽量配合」再说',
          hint: '当下和气，结算时算总账',
          outcomeText:
            '业主满意离开，分包老板堵你门口。你知道所有「先答应」最后都会变成「你当初说的」。',
          deltas: { ownerSatisfaction: 7, progress: 4, salary: -450, morale: -10, planProgress: -5 },
        },
      ],
    },
    {
      title: '分包结算纠纷',
      description:
        '分包老板拍桌子：「量差这么多，你们审计是拿显微镜还是拿算盘？」审计冷笑：「按合同。」你在中间，像人形缓冲垫，两面都硌。',
      options: [
        {
          id: 'fin_sub_contract',
          label: '坚持按合同工程量规则，邀请第三方对量',
          hint: '硬刚，关系结冰，但公司站你',
          outcomeText:
            '对量那天像辩论赛，钢筋直径都能吵成哲学问题。数字终于落地，友情也落地——碎的那种。',
          deltas: { reputation: 4, bossApproval: 6, networkValue: -10, energy: -18, morale: -6 },
        },
        {
          id: 'fin_sub_mediate',
          label: '酒桌和稀泥：各退一步，签补充结算',
          hint: '江湖救急，原则打折',
          outcomeText:
            '三杯下肚，数字好谈很多。你醒来头痛，账上痛，但现场暂时不闹——土木止痛片，酒精版。',
          deltas: { salary: -400, networkValue: 8, morale: 3, reputation: -3, ownerSatisfaction: 2 },
        },
        {
          id: 'fin_sub_stall',
          label: '暂停付款流程，吊着他等证据补齐',
          hint: '拖字诀，可能激化也可能逼他服软',
          outcomeText:
            '他天天来办公室「喝茶」，你天天说「在走流程」。流程是世界上最长的路，你们一起走。',
          deltas: { progress: -4, morale: -8, bossApproval: -4, stamina: -8, experience: 6 },
        },
      ],
    },
  ],
};

const ALL_QUARTER_CHOICE_SCENARIOS: PendingQuarterChoice[] = [
  ...QUARTER_CHOICE_SCENARIOS,
  ...QUARTER_CHOICE_BY_PHASE.PREP,
  ...QUARTER_CHOICE_BY_PHASE.FOUNDATION,
  ...QUARTER_CHOICE_BY_PHASE.MAIN,
  ...QUARTER_CHOICE_BY_PHASE.FINISHING,
];

/**
 * 抽取一条季度随机抉择。
 * - 未传 phase：从「通用 + 各阶段专属」全部事件中均匀随机（兼容旧调用）。
 * - 传入 phase：60% 抽该阶段专属，40% 抽通用。
 */
export function pickRandomQuarterChoice(projectPhase?: ProjectPhase): PendingQuarterChoice {
  if (projectPhase == null) {
    const i = Math.floor(Math.random() * ALL_QUARTER_CHOICE_SCENARIOS.length);
    return ALL_QUARTER_CHOICE_SCENARIOS[i]!;
  }
  const phasePool = QUARTER_CHOICE_BY_PHASE[projectPhase];
  if (Math.random() < 0.6) {
    const j = Math.floor(Math.random() * phasePool.length);
    return phasePool[j]!;
  }
  const k = Math.floor(Math.random() * QUARTER_CHOICE_SCENARIOS.length);
  return QUARTER_CHOICE_SCENARIOS[k]!;
}
