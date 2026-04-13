/** 工资 / 进场物资不足时点击行动的弹窗吐槽（工地土木风） */

const SALARY_BLOCKS: { title: string; body: string }[] = [
  {
    title: '工资条在发抖',
    body: '你打开网银又默默关掉——这点余额连这次请客吃饭都不够，更别说甲方例会前的「形象管理费」。先把资料员补贴、季度奖金或神秘推销变现攒一攒，有钱了再硬气。',
  },
  {
    title: '现金流比试块还脆',
    body: '账户数字比养护室湿度还让人揪心，再点这一下就得透支尊严。财务不会替你垫资，班组也不会接受「感情支付」，先搞钱再搞事。',
  },
  {
    title: '钱包拒绝配合演出',
    body: '你对着余额叹了口气：钢筋可以赊，人情可以欠，但系统里的数字不会陪你演戏。等手头宽裕了再点，土木人可以穷，但不能穷得没仪式感。',
  },
];

const MATERIALS_BLOCKS: { title: string; body: string }[] = [
  {
    title: '物资计划落空',
    body: '材料员摊手：「库里就剩这点。」你想盯施工、补工序，得先有钢筋模板混凝土——现场不是魔法阵，不能意念浇筑。先去凑进场物资或等调拨，别让泵车空跑。',
  },
  {
    title: '商混站不认画饼',
    body: '调度在对讲机里笑得很礼貌：「方量可以报，款到排队。」你手里的「下周一定」抵不过系统里的应付余额。物资不够就别硬开工，否则验收台上全是故事会。',
  },
  {
    title: '现场等米下锅',
    body: '班组已经站在基坑边玩手机，眼神逐渐不善。你知道这不是怠工，是「没料怎么干」的哲学命题。把材料凑齐再点，别让塔吊在天上围观你的尴尬。',
  },
];

export function pickInsufficientSalaryBlock(): { title: string; body: string } {
  return SALARY_BLOCKS[Math.floor(Math.random() * SALARY_BLOCKS.length)]!;
}

export function pickInsufficientMaterialsBlock(): { title: string; body: string } {
  return MATERIALS_BLOCKS[Math.floor(Math.random() * MATERIALS_BLOCKS.length)]!;
}
