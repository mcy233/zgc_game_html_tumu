import type { BossProfile, BossType } from '../types/index';

export const BOSS_PROFILES: Record<BossType, BossProfile> = {
  MICROMANAGER: {
    label: '事无巨细型',
    description:
      '连脚手架扣件扭矩都要过问的项目经理。进度像打了鸡血，签字栏却像冷冻柜——你写的施工日志他逐行批注，仿佛在玩「大家来找语病」。好处是出事有人扛细节，坏处是微信步数没他多你都不好意思下班。',
    progressMultiplier: 1.5,
    approvalMultiplier: 0.5,
    approvalGainRate: 0.8,
    requirements: { reputation: 30 },
  },
  GHOST: {
    label: '甩手掌柜型',
    description:
      '群里常年「收到」，现场偶尔「在开会」。你以为他是佛系，其实他在别的标段当主角。跟这种领导混，证书得自己卷，锅得自己背，但自由也是真的——毕竟连影子都难追踪，何况 KPI。',
    progressMultiplier: 0.8,
    approvalMultiplier: 0.2,
    approvalGainRate: 0.5,
    requirements: { certificates: 12 },
  },
  SUPPORTIVE: {
    label: '老大哥型',
    description:
      '嘴上骂你「咋又熬夜」，转头给你批调休；现场骂完班组，回头请你喝瓶冰红茶。进度不快不慢，签字不卡不拖，属于土木职场传说生物——遇见了请珍惜，调走了请烧纸（不是）。',
    progressMultiplier: 1.0,
    approvalMultiplier: 1.0,
    approvalGainRate: 1.2,
    requirements: { reputation: 10 },
  },
  CELEBRITY: {
    label: '行业大佬型',
    description:
      '名片上头衔比脚手架层数还多，甲方见他都客气三分。跟他干，曝光度高、资源多、背锅半径也大。你以为是镀金，其实是高强度抛光——磨掉棱角，留下履历里一行亮瞎眼的项目经历。',
    progressMultiplier: 1.2,
    approvalMultiplier: 1.5,
    approvalGainRate: 0.6,
    requirements: { reputation: 50, projects: 1 },
  },
};
