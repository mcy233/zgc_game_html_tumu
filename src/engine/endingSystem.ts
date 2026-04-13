import type { GameState, EndingGrade } from '../types/index';
import { getCareerTitle } from '../data/careerPaths';

/** Compute ending grade based on lifetime achievements */
export function computeEndingGrade(state: GameState): EndingGrade {
  const { totalProjectsCompleted: proj, reputation: rep, experience: exp, careerStage: stage } = state;
  if (stage >= 4 && rep >= 85 && exp >= 1000) return 'MYTHIC';
  if (stage >= 3 && rep >= 75 && exp >= 600) return 'LEGEND';
  if (stage >= 2 && rep >= 60) return 'STAR';
  if (stage >= 1 && proj >= 2) return 'MERIT';
  if (proj <= 1 && rep < 40) return 'SCRAPE';
  return 'PASS';
}

/** Generate ending narrative for different ending types */
export function getEndingNarrative(state: GameState): { title: string; body: string; accent: string } {
  const endType = state.endingType;
  const title = getCareerTitle(state.careerTrack, state.careerStage);
  const grade = state.endingGrade ?? computeEndingGrade(state);
  const stats = `你以「${title}」的身份，完成了 ${state.totalProjectsCompleted} 个项目，累计经验 ${state.experience}，行业口碑 ${state.reputation}。`;

  if (endType === 'BURNOUT') {
    return { title: '提桶跑路', body: stats + '心态或体力彻底见底，工地大门在身后缓缓关上。', accent: 'text-orange-600' };
  }
  if (endType === 'SAFETY_ACCIDENT') {
    return { title: '安全事故停工', body: stats + '重大安全事故改变了一切。调查通报下来，现场再也回不去了。', accent: 'text-red-600' };
  }
  if (endType === 'SAFETY_NONCOMPLIANCE') {
    return { title: '安全培训不达标', body: stats + '安全教育未达标，按规定清退出场。', accent: 'text-red-500' };
  }
  if (endType === 'CIVIL_SERVANT') {
    return { title: '考公上岸', body: stats + '笔试面试一路过关，从此朝九晚五，再也不用看天气预报决定能不能浇筑了。', accent: 'text-blue-600' };
  }
  if (endType === 'TECH_INDUSTRY') {
    return { title: '转行互联网', body: stats + '从工地转码，996 换了个形式继续。不过至少加班有空调了。', accent: 'text-purple-600' };
  }
  if (endType === 'HQ_MANAGEMENT') {
    return { title: '回总部管理', body: stats + '离开了扬尘和噪音，换成了PPT和会议室。权力游戏，工地特供版。', accent: 'text-indigo-600' };
  }
  if (endType === 'ENTREPRENEUR') {
    return { title: '分包创业', body: stats + '自己当了老板。风险和收益一样大，但至少签字的笔握在自己手里。', accent: 'text-amber-600' };
  }
  if (endType === 'GRAD_SCHOOL') {
    return { title: '考研深造', body: stats + '重新回到校园，这次是带着工地经验来的。理论联系实际，终于不是空话了。', accent: 'text-teal-600' };
  }
  if (endType === 'JUMP_SHIP') {
    return { title: '跳槽高就', body: stats + '带着口碑和人脉跳到了新公司，工资翻了一番。', accent: 'text-emerald-600' };
  }

  // Default: career retirement
  const gradeAccent = { MYTHIC: 'text-violet-500', LEGEND: 'text-amber-500', STAR: 'text-emerald-500', MERIT: 'text-teal-600', PASS: 'text-slate-600', SCRAPE: 'text-orange-600' }[grade] ?? 'text-slate-600';
  const gradeTitle = { MYTHIC: '传奇工程人', LEGEND: '行业标杆', STAR: '优秀建造者', MERIT: '称职工程师', PASS: '平凡的螺丝钉', SCRAPE: '惊险毕业' }[grade] ?? '工程人';

  return { title: gradeTitle, body: stats, accent: gradeAccent };
}

/** Failure ending copy */
export function failureGameOverCopy(endingType?: string): { title: string; body: string } {
  switch (endingType) {
    case 'SAFETY_ACCIDENT':
      return { title: '安全事故停工', body: '重大安全隐患与违规操作被坐实，红色停工令贴上门卫室。' };
    case 'BURNOUT':
      return { title: '提桶跑路', body: '心态、体力或精力彻底见底，板房再也撑不住你了。' };
    case 'SAFETY_NONCOMPLIANCE':
      return { title: '安全培训不达标', body: '安全教育活动参与再次未达标，按规定办理清退。' };
    default:
      return { title: '离场', body: '工地大门在身后缓缓关上，扬尘里混着未尽的节点与未签的字。' };
  }
}
