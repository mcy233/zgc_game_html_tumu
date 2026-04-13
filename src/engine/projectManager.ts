import type { GameState, ProjectState, ProjectType, ProjectPhase, CareerEvent } from '../types/index';
import { PROJECT_TEMPLATES, generateProjectName, rollProjectQuarters, getProjectPhase, rollBossType, phaseLabel } from '../data/projectTemplates';
import { getStageDefinition } from '../data/careerPaths';
import { rollSeasonWeather } from './weatherSystem';
import { SEASONS } from '../config/gameConfig';

const PM_NAMES = ['周铁军', '吴立柱', '郑标高', '王节点', '冯浇筑', '陈验筋', '赵放线', '钱标段'];

function pickBossName(): string {
  return PM_NAMES[Math.floor(Math.random() * PM_NAMES.length)]!;
}

/** Seed initial coworkers for a new project */
function seedProjectCoworkers(totalQuarter: number): ProjectState['coworkers'] {
  const surnames = ['砼', '梁', '柱', '筋', '焊', '泵', '灰', '模', '架', '测'];
  const givens = ['大力', '稳当', '标高', '放线', '养护', '收面', '堵漏', '签证', '节点', '验筋'];
  const pick = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)]!;

  return [
    {
      id: `cw_${Date.now()}_a`,
      name: `${pick(surnames)}${pick(givens)}`,
      role: '老师傅' as const,
      year: 3,
      status: '在绑扎钢筋，手套磨出洞',
      favor: 50,
      lastInteractedQuarter: totalQuarter,
    },
    {
      id: `cw_${Date.now()}_b`,
      name: `${pick(surnames)}${pick(givens)}`,
      role: '前辈' as const,
      year: 2,
      status: '被监理追着要回复单',
      favor: 48,
      lastInteractedQuarter: totalQuarter,
    },
  ];
}

/** Generate a fresh ProjectState for a given project type */
export function generateProject(type: ProjectType, totalQuarter: number): ProjectState {
  const totalQ = rollProjectQuarters(type);
  return {
    type,
    name: generateProjectName(type),
    phase: 'PREP',
    quarterInProject: 0,
    totalQuarters: totalQ,
    progress: 0,
    ownerSatisfaction: 50,
    bossApproval: 45,
    coworkers: seedProjectCoworkers(totalQuarter),
    bossName: pickBossName(),
    bossType: rollBossType(),
    materials: 800 + Math.floor(Math.random() * 400),
    planProgress: 0,
    submittedSections: 0,
    completedSections: 0,
    weather: rollSeasonWeather(SEASONS[totalQuarter % 4]!),
    safetyActivityCount: [],
    bossLastInteractedQuarter: totalQuarter,
    drawingReviewByQuarter: [],
    safetyCarryoverDeficit: 0,
    safetyComplianceStrikes: 0,
  };
}

/** Generate the very first project (always RESIDENTIAL for new players) */
export function generateFirstProject(totalQuarter: number): ProjectState {
  return generateProject('RESIDENTIAL', totalQuarter);
}

/** Update the project phase based on current quarter position */
export function updateProjectPhase(project: ProjectState): { project: ProjectState; phaseChanged: boolean; oldPhase: ProjectPhase } {
  const oldPhase = project.phase;
  const newPhase = getProjectPhase(project.type, project.quarterInProject, project.totalQuarters);
  if (newPhase === oldPhase) {
    return { project, phaseChanged: false, oldPhase };
  }
  return {
    project: {
      ...project,
      phase: newPhase,
      progress: 0, // reset progress when entering new phase
    },
    phaseChanged: true,
    oldPhase,
  };
}

/** Check if the project has reached its end (all quarters used) */
export function isProjectComplete(project: ProjectState): boolean {
  return project.quarterInProject >= project.totalQuarters;
}

/** Evaluate project completion and return a score summary */
export interface ProjectScore {
  progressScore: number; // 0-100 based on final progress
  safetyScore: number; // 0-100 based on safety risk (inverse)
  ownerScore: number; // direct owner satisfaction
  bossScore: number; // direct boss approval
  completedSections: number;
  overallGrade: 'S' | 'A' | 'B' | 'C' | 'D';
  narrativeLines: string[];
}

export function evaluateProject(state: GameState): ProjectScore {
  const p = state.project;
  const progressScore = Math.min(100, p.progress + p.completedSections * 5);
  const safetyScore = Math.max(0, 100 - state.safetyRisk);
  const ownerScore = p.ownerSatisfaction;
  const bossScore = p.bossApproval;

  const avg = (progressScore + safetyScore + ownerScore + bossScore) / 4;
  let overallGrade: ProjectScore['overallGrade'];
  if (avg >= 85) overallGrade = 'S';
  else if (avg >= 70) overallGrade = 'A';
  else if (avg >= 55) overallGrade = 'B';
  else if (avg >= 40) overallGrade = 'C';
  else overallGrade = 'D';

  const narrativeLines: string[] = [];

  if (overallGrade === 'S') {
    narrativeLines.push(`${p.name} 项目圆满收官！甲方满意度拉满，安全零事故，你在项目竣工照上站 C 位。`);
  } else if (overallGrade === 'A') {
    narrativeLines.push(`${p.name} 项目顺利完工。虽有小波折，但整体评价优良，公司给你记了一笔功。`);
  } else if (overallGrade === 'B') {
    narrativeLines.push(`${p.name} 项目按时交付。中规中矩，没有大功也没有大过——工地老手的标准操作。`);
  } else if (overallGrade === 'C') {
    narrativeLines.push(`${p.name} 项目勉强完工。整改单堆了不少，甲方的脸色比天气还难看。`);
  } else {
    narrativeLines.push(`${p.name} 项目惨淡收场。亏损、整改、追责三件套，你只想赶紧翻篇。`);
  }

  return { progressScore, safetyScore, ownerScore, bossScore, completedSections: p.completedSections, overallGrade, narrativeLines };
}

/** Calculate experience and reputation gain from project completion */
export function projectCompletionRewards(
  score: ProjectScore,
  projectType: ProjectType,
  careerStage: number
): {
  experienceGain: number;
  reputationGain: number;
  salaryBonus: number;
  networkGain: number;
} {
  const tmpl = PROJECT_TEMPLATES[projectType];
  const gradeMult = { S: 1.5, A: 1.2, B: 1.0, C: 0.7, D: 0.4 }[score.overallGrade];
  const stageMult = 1 + careerStage * 0.3;

  return {
    experienceGain: Math.round(60 * tmpl.difficultyMultiplier * gradeMult * stageMult),
    reputationGain: Math.round(8 * tmpl.reputationMultiplier * gradeMult),
    salaryBonus: Math.round(5000 * gradeMult * tmpl.difficultyMultiplier),
    networkGain: Math.round(5 * gradeMult + careerStage * 2),
  };
}

/** Enter transfer period - called when a project is complete */
export function enterTransferPeriod(prev: GameState): GameState {
  const score = evaluateProject(prev);
  const rewards = projectCompletionRewards(score, prev.project.type, prev.careerStage);

  const event: CareerEvent = {
    totalQuarter: prev.totalQuarters,
    type: 'PROJECT_END',
    description: `完成项目：${prev.project.name}（评级 ${score.overallGrade}）`,
  };

  return {
    ...prev,
    gamePhase: 'TRANSFER',
    experience: prev.experience + rewards.experienceGain,
    reputation: Math.min(100, prev.reputation + rewards.reputationGain),
    salary: prev.salary + rewards.salaryBonus,
    lifetimeEarnings: prev.lifetimeEarnings + rewards.salaryBonus,
    networkValue: prev.networkValue + rewards.networkGain,
    totalProjectsCompleted: prev.totalProjectsCompleted + 1,
    safetyRisk: Math.max(0, prev.safetyRisk - 10), // partial safety reset between projects
    careerHistory: [...prev.careerHistory, event],
  };
}

/** Start a new project after transfer period */
export function startNewProject(prev: GameState, projectType: ProjectType): GameState {
  const newProject = generateProject(projectType, prev.totalQuarters);

  // Some coworkers may carry over (favor > 65)
  const carryOver = prev.project.coworkers
    .filter((c) => c.favor >= 65 && Math.random() < 0.3)
    .map((c) => ({ ...c, lastInteractedQuarter: prev.totalQuarters }));

  if (carryOver.length > 0) {
    newProject.coworkers = [...carryOver, ...newProject.coworkers].slice(0, 4);
  }

  const event: CareerEvent = {
    totalQuarter: prev.totalQuarters,
    type: 'PROJECT_START',
    description: `入驻新项目：${newProject.name}`,
  };

  // Stage definition determines salary
  const stageDef = getStageDefinition(prev.careerStage);

  return {
    ...prev,
    gamePhase: 'PLAYING',
    currentProjectIndex: prev.currentProjectIndex + 1,
    project: newProject,
    actionsThisQuarter: 0,
    walksThisQuarter: 0,
    interactionsThisQuarter: [],
    lowDrawingWorkClickCount: 0,
    careerHistory: [...prev.careerHistory, event],
    // refresh energy/stamina partially
    energy: Math.min(100, prev.energy + 30),
    stamina: Math.min(100, prev.stamina + 20),
    morale: Math.min(100, prev.morale + 15),
  };
}
