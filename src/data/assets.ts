import type { Asset } from '../types/index';

export const ASSETS_LIBRARY: Asset[] = [
  {
    id: 'noise_ear_plugs',
    name: '降噪耳塞',
    description:
      '钻孔声、切割机、对讲机公放——工地交响乐一键静音。心态消耗降低，适合在「听觉工伤」边缘反复横跳的你。',
    price: 1500,
    sellPrice: 500,
    type: 'HARDWARE',
    effect: { moraleCostMultiplier: 0.82 },
  },
  {
    id: 'mega_thermos',
    name: '大号保温壶',
    description:
      '一壶顶半天，枸杞菊花随便泡。工地板房续命神器，领导看了以为你很养生，其实你只是懒得接第八次水。',
    price: 2000,
    sellPrice: 800,
    type: 'LIFESTYLE',
    effect: { energyGainMultiplier: 1.15 },
  },
  {
    id: 'gloves_pro',
    name: '劳保手套Pro',
    description:
      '加厚耐磨，搬钢筋不扎手，摸灰不烫心。体力消耗打折，适合把「手是第二张脸」当笑话听的土木人。',
    price: 800,
    sellPrice: 200,
    type: 'HARDWARE',
    effect: { staminaCostMultiplier: 0.75 },
  },
  {
    id: 'supplier_vip_card',
    name: '材料供应商VIP卡',
    description:
      '吃饭敬酒时对方塞的名片终于兑现成「优先发货、少扯皮」。每季度多一点点进场物资，像玄学，也像回扣的合法平替。',
    price: 3000,
    sellPrice: 0,
    type: 'SERVICE',
    effect: { materialsGainPerQuarter: 180 },
  },
  {
    id: 'doc_agency_service',
    name: '资料代办服务',
    description:
      '专业团队帮你跑签字、补扫描件、对齐目录。形象进度与方案撰写效率提升——钱能解决的资料问题，就别拿头发换。',
    price: 2500,
    sellPrice: 0,
    type: 'SERVICE',
    effect: { progressGainMultiplier: 1.18 },
  },
  {
    id: 'redbull_goji',
    name: '红牛+枸杞',
    description:
      '赛博养生组合拳：提神与心理安慰双频共振。加班盯灰时来一罐，感觉自己既能打灰又能修仙。',
    price: 600,
    sellPrice: 100,
    type: 'LIFESTYLE',
    effect: { moraleCostMultiplier: 0.9, energyGainMultiplier: 1.08 },
  },
  {
    id: 'site_radio',
    name: '工地收音机',
    description:
      'FM 里放新闻评书，背景音盖住一半骂娘声。小确幸设备，让你的板房生活多一点点九十年代怀旧滤镜。',
    price: 100,
    sellPrice: 10,
    type: 'LIFESTYLE',
    effect: { moraleCostMultiplier: 0.88 },
  },
  {
    id: 'smart_hard_hat',
    name: '智能安全帽',
    description:
      '定位、近电预警、还能记录步数——行政看了点赞，工人看了沉默。体力与心态双减耗，科技感换一点点「被重视」的幻觉。',
    price: 1800,
    sellPrice: 600,
    type: 'HARDWARE',
    effect: { staminaCostMultiplier: 0.88, reputationGainMultiplier: 1.05 },
  },
];

/** 每季度上门推销的随机身份（工地版「神秘商人」） */
export const ASSET_VENDOR_TITLES = [
  '总包库房清仓特派员',
  '戴白盔路过的「厂家技术指导」',
  '只会出现在季初的五金城流动摊贩',
  '声称和项目经理喝过酒的电缆中间商',
  '项目部后门蹲点的劳保用品批发商',
  '二维码收款名写着「诚信经营」的匿名供货商',
  '开着皮卡路过、车厢里啥都有的「老乡」',
  '安全月才被放出来的防护用品推广大使',
  '深夜群里@全员甩链接的拼单团长',
  '号称「内部价」的混凝土外加剂代理',
  '扛着仪器进场的「第三方检测友情客串」',
] as const;

export function pickRandomAssetVendorTitle(): string {
  const i = Math.floor(Math.random() * ASSET_VENDOR_TITLES.length);
  return ASSET_VENDOR_TITLES[i]!;
}

export function formatAssetEffectLines(asset: Asset): string[] {
  const e = asset.effect;
  const lines: string[] = [];
  if (e.moraleCostMultiplier != null && e.moraleCostMultiplier !== 1) {
    lines.push(`心态消耗 ×${Math.round(e.moraleCostMultiplier * 100)}%`);
  }
  if (e.staminaCostMultiplier != null && e.staminaCostMultiplier !== 1) {
    lines.push(`体力消耗 ×${Math.round(e.staminaCostMultiplier * 100)}%`);
  }
  if (e.energyGainMultiplier != null && e.energyGainMultiplier !== 1) {
    const pct = Math.round((e.energyGainMultiplier - 1) * 100);
    lines.push(pct > 0 ? `摸鱼/休息精力恢复 +${pct}%` : `精力恢复 ${pct}%`);
  }
  if (e.progressGainMultiplier != null && e.progressGainMultiplier !== 1) {
    lines.push(`现场形象进度获得 ×${Math.round(e.progressGainMultiplier * 100)}%`);
  }
  if (e.reputationGainMultiplier != null && e.reputationGainMultiplier !== 1) {
    lines.push(`行业口碑获得 ×${Math.round(e.reputationGainMultiplier * 100)}%`);
  }
  if (e.materialsGainPerQuarter != null && e.materialsGainPerQuarter > 0) {
    lines.push(`每季进场物资 +${e.materialsGainPerQuarter}`);
  }
  if (e.salaryGainPerQuarter != null && e.salaryGainPerQuarter > 0) {
    lines.push(`每季工资性收入 +${e.salaryGainPerQuarter}`);
  }
  return lines;
}
