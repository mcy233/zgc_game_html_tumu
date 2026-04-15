import type { GameState, Coworker } from '../types/index';

const SITE_STATUSES = [
  '在绑扎钢筋，手套磨出洞',
  '被监理追着要回复单',
  '在板房里改方案到脱发',
  '号称去验筋，实际在避雨',
  '被甲方叫去"对齐颗粒度"',
  '在基坑边怀疑人生',
  '刚打完灰，鞋里还能倒出水',
];

function isSeniorCoworker(m: Coworker): boolean {
  return m.role === '老师傅' || m.role === '前辈';
}

const SURNAMES = ['砼', '梁', '柱', '筋', '焊', '泵', '灰', '模', '架', '测', '勘', '标'];
const GIVEN = ['大力', '稳当', '浇筑', '标高', '放线', '对拉', '养护', '收面', '堵漏', '签证', '节点', '验筋'];

export function processQuarterlyStaffChanges(state: GameState): {
  updatedCoworkers: Coworker[];
  newCoworker?: Coworker;
  graduates: Coworker[];
  storyLines: string[];
  effects: Record<string, number>;
  assetGifts: { assetId: string }[];
  infoLogs: { message: string; type: 'INFO' | 'SUCCESS' }[];
} {
  const storyLines: string[] = [];
  const effects: Record<string, number> = {};
  const assetGiftIds: string[] = [];
  const infoLogs: { message: string; type: 'INFO' | 'SUCCESS' }[] = [];

  const q = state.totalQuarters;
  const isAutumn = (q - 1) % 4 === 2;

  const updatedCoworkers = state.project.coworkers.map(mate => {
    let newYear = mate.year;
    let newStatus = mate.status;
    if (isAutumn) newYear += 1;
    if (Math.random() < 0.3) {
      newStatus = SITE_STATUSES[Math.floor(Math.random() * SITE_STATUSES.length)]!;
    }
    return { ...mate, year: newYear, status: newStatus };
  });

  const graduates = updatedCoworkers.filter(m => m.year > 4);

  if (isAutumn) {
    for (const g of graduates) {
      infoLogs.push({ message: `${g.name}（${g.role}）退场竣工。`, type: 'INFO' });
      storyLines.push(`【退场】${g.role}${g.name}干满年限，退场了。`);
      if (isSeniorCoworker(g) && g.favor >= 65 && Math.random() < 0.72) {
        const v = 800 + Math.floor(Math.random() * 2000);
        effects.salary = (effects.salary ?? 0) + v;
        storyLines.push(`【赠礼】${g.name}私下转你 ¥${v}。`);
      }
    }
  }

  let remaining = updatedCoworkers.filter(m => m.year <= 4);
  let newCoworker: Coworker | undefined;

  if (isAutumn) {
    const surname = SURNAMES[Math.floor(Math.random() * SURNAMES.length)]!;
    const given = GIVEN[Math.floor(Math.random() * GIVEN.length)]!;
    newCoworker = {
      id: Math.random().toString(36).slice(2, 11),
      name: `${surname}${given}`,
      position: '实习生',
      role: '新来的',
      year: 1,
      status: '刚进场，帽带系得比安全带还紧',
      favor: 50,
      lastInteractedQuarter: q,
    };
    remaining = [...remaining, newCoworker];
    infoLogs.push({ message: `新面孔：${newCoworker.name}（${newCoworker.role}）已到岗。`, type: 'SUCCESS' });
    storyLines.push(`【进场】${newCoworker.name}扛着仪器进工地，自我介绍时紧张到把项目经理叫成总监。`);
  }

  return {
    updatedCoworkers: remaining,
    newCoworker,
    graduates,
    storyLines,
    effects,
    assetGifts: assetGiftIds.map(assetId => ({ assetId })),
    infoLogs,
  };
}
