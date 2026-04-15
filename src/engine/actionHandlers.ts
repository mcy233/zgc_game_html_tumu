import type { GameState, Action, CareerTrack } from '../types/index';
import { BOSS_PROFILES } from '../data/bossProfiles';
import { getWeatherProgressModifier, getWeatherStaminaModifier, weatherEffectNote } from './weatherSystem';
import { getActionsPerQuarter } from './promotionSystem';
import { applyCertStudyPoints, countCompletedCerts, CERT_BY_ID } from '../data/certificateRegistry';

export interface ActionResult {
  newState: GameState;
  eventTitle: string;
  eventEffect: Record<string, number>;
  logs: string[];
  planCompletedLog?: string;
}

function clamp(n: number, min = 0, max = 100): number {
  return Math.min(max, Math.max(min, n));
}

function roundEffectRecord(effect: Record<string, number>): Record<string, number> {
  const out: Record<string, number> = {};
  for (const [k, v] of Object.entries(effect)) {
    if (typeof v === 'number' && !Number.isNaN(v) && v !== 0) out[k] = Math.round(v);
  }
  return out;
}

/** Check if an action is available for current career track and stage */
export function isActionAvailable(
  action: Action,
  track: CareerTrack,
  stage: number,
  projectIndex: number
): boolean {
  if (action.requiredTrack && action.requiredTrack !== track) return false;
  if (action.requiredStageMin !== undefined && stage < action.requiredStageMin) return false;
  if (action.requiredStageMax !== undefined && stage > action.requiredStageMax) return false;
  if (action.unlockedByProject !== undefined && projectIndex < action.unlockedByProject) return false;
  return true;
}

/** Get all available actions for current state */
export function getAvailableActions(actions: Action[], state: GameState): Action[] {
  return actions.filter((a) =>
    isActionAvailable(a, state.careerTrack, state.careerStage, state.currentProjectIndex)
  );
}

/** Check if action can be executed given current resources */
export function canExecuteAction(state: GameState, action: Action): { ok: boolean; reason?: string } {
  const maxActions = getActionsPerQuarter(state.careerStage);
  if (state.actionsThisQuarter >= maxActions) {
    return { ok: false, reason: `本季度行动次数已达上限（${maxActions} 次），请进入下一季度。` };
  }
  if (action.salaryCost > 0 && state.salary < action.salaryCost) {
    return { ok: false, reason: '工资余额不足。' };
  }
  if (action.materialsCost > 0 && state.project.materials < action.materialsCost) {
    return { ok: false, reason: '项目物资不够。' };
  }
  if (action.energyCost > 0 && state.energy < action.energyCost) {
    return { ok: false, reason: '精力见底，先休息或等下季度。' };
  }
  return { ok: true };
}

function pickActionNarrative(action: Action): string {
  const pool = action.descriptions?.length ? action.descriptions : [action.description];
  return pool[Math.floor(Math.random() * pool.length)]!;
}

const WRITE_PLAN_SAFETY_LINES = [
  '专项方案荷载取值"参考同类工程"——翻译：抄了模板还没核对。',
  '计算书附录少了两页工况，你赌审查专家翻不到那么深。',
  '养护天数在横道图上被压缩成"理想状态"。',
  '隐蔽照片用了上周同角度补拍，资料闭环靠摄影技术。',
  '风险清单把"夜间浇筑"标成一般风险，心里知道那是自欺欺人。',
];

/** Compute the full effect of executing an action */
export function computeActionEffect(state: GameState, action: Action): ActionResult {
  const logs: string[] = [];
  const eventEffect: Record<string, number> = {};
  const profile = BOSS_PROFILES[state.project.bossType];
  const progressMult = profile.progressMultiplier;

  let moraleCostMod = 1;
  let staminaCostMod = 1;
  let progressGainMod = 1;
  for (const asset of state.assets) {
    if (asset.effect.moraleCostMultiplier) moraleCostMod *= asset.effect.moraleCostMultiplier;
    if (asset.effect.staminaCostMultiplier) staminaCostMod *= asset.effect.staminaCostMultiplier;
    if (asset.effect.progressGainMultiplier) progressGainMod *= asset.effect.progressGainMultiplier;
  }
  if (state.project.bossApproval > 80) moraleCostMod *= 0.7;

  const weatherProgMod =
    action.category === 'CONSTRUCTION' ? getWeatherProgressModifier(state.project.weather) : 1;
  const outdoorAction = action.id === 'do_construction' || action.id === 'site_inspection';
  const weatherStamMod = outdoorAction ? getWeatherStaminaModifier(state.project.weather) : 1;

  const moraleDrain = action.moraleCost * moraleCostMod;
  const staminaDrain = action.staminaCost * staminaCostMod * weatherStamMod;

  const writePlanSafetyHit = action.id === 'write_plan' && Math.random() < 0.25;
  const writePlanSafetyDelta = writePlanSafetyHit ? 3 + Math.floor(Math.random() * 5) : 0;

  let newProject = { ...state.project };
  let newState: GameState = { ...state, project: newProject };

  newState.energy = Math.max(0, state.energy - action.energyCost);
  newState.morale = clamp(state.morale - moraleDrain);
  newState.stamina = clamp(state.stamina - staminaDrain);
  newState.salary = Math.max(0, state.salary - action.salaryCost + action.salaryGain);
  newProject.materials = Math.max(0, newProject.materials - action.materialsCost);
  newState.actionsThisQuarter = state.actionsThisQuarter + 1;

  const totalProgGain = action.progressGain * progressMult * progressGainMod * weatherProgMod;
  newProject.progress = clamp(newProject.progress + totalProgGain);

  if (action.approvalGain) {
    newProject.bossApproval = clamp(newProject.bossApproval + action.approvalGain * profile.approvalMultiplier);
  }

  let certCompletedNames: string[] = [];
  if (action.certificateGain) {
    const certResult = applyCertStudyPoints(
      action.id,
      action.certificateGain,
      newState.certProgress ?? {},
      newState.careerStage,
    );
    newState.certProgress = certResult.newProgress;
    newState.certificates = countCompletedCerts(certResult.newProgress);
    certCompletedNames = certResult.newlyCompleted.map(id => CERT_BY_ID[id]?.name ?? id);
  }
  if (action.safetyRiskChange) newState.safetyRisk = clamp(newState.safetyRisk + action.safetyRiskChange);

  if (action.experienceGain) newState.experience += action.experienceGain;
  if (action.networkGain) newState.networkValue += action.networkGain;

  if (action.coworkerApprovalGain) {
    newProject.coworkers = newProject.coworkers.map((c) => ({
      ...c,
      favor: Math.min(100, c.favor + (action.coworkerApprovalGain ?? 0)),
    }));
  }

  if (action.id === 'safety_training') {
    const qi = newProject.quarterInProject;
    const arr = [...newProject.safetyActivityCount];
    while (arr.length <= qi) arr.push(0);
    arr[qi] = (arr[qi] ?? 0) + 1;
    newProject.safetyActivityCount = arr;
    newState.reputation = clamp(newState.reputation + 2);
  }

  if (action.id === 'study_drawings') {
    const qi = newProject.quarterInProject;
    const arr = [...newProject.drawingReviewByQuarter];
    while (arr.length <= qi) arr.push(0);
    arr[qi] = (arr[qi] ?? 0) + 1;
    newProject.drawingReviewByQuarter = arr;
  }

  if (action.id === 'visit_boss' || action.id === 'team_dinner' || action.id === 'overtime_rush') {
    newProject.bossLastInteractedQuarter = state.totalQuarters;
  }
  if (action.id === 'team_dinner' || action.id === 'overtime_rush') {
    newProject.coworkers = newProject.coworkers.map((c) => ({
      ...c,
      lastInteractedQuarter: state.totalQuarters,
    }));
  }

  let planCompletedLog: string | undefined;
  if (action.id === 'write_plan') {
    const writingGain = 20 * progressGainMod * weatherProgMod;
    newProject.planProgress = clamp(newProject.planProgress + writingGain);
    if (writePlanSafetyHit && writePlanSafetyDelta > 0) {
      newState.safetyRisk = clamp(newState.safetyRisk + writePlanSafetyDelta);
      logs.push(
        `${WRITE_PLAN_SAFETY_LINES[Math.floor(Math.random() * WRITE_PLAN_SAFETY_LINES.length)]} 安全隐患 +${writePlanSafetyDelta}。`
      );
    }
    if (newProject.planProgress >= 100) {
      newProject.submittedSections += 1;
      newProject.planProgress = 0;
      planCompletedLog = '施工方案定稿！资料已打包送审，下季度将公布验收结果。';
    }
  }

  if (action.id === 'do_construction') {
    const sitePlanDelta = Math.max(3, Math.round(5 + (Math.random() - 0.5) * 4)) * weatherProgMod;
    newProject.planProgress = clamp(newProject.planProgress + sitePlanDelta);
    if (newProject.planProgress >= 100) {
      newProject.submittedSections += 1;
      newProject.planProgress = 0;
      planCompletedLog = '施工方案定稿！资料已打包送审。';
    }
    newState.reputation = clamp(newState.reputation + 1);
  }

  if (action.id === 'owner_meeting') {
    newState.reputation = clamp(newState.reputation + 8);
    newState.networkValue += 2;
  }

  if (action.id === 'civil_exam_prep') {
    newState.civilExamPrep += 3;
    eventEffect.civilExamPrep = 3;
  } else if (action.id === 'grad_exam_prep') {
    newState.gradExamPrep += 4;
    eventEffect.gradExamPrep = 4;
  } else if (action.id === 'self_learn_coding') {
    newState.codingSkill += 3;
    eventEffect.codingSkill = 3;
  } else if (action.id === 'mba_night_school') {
    newState.managementSkill += 4;
    eventEffect.managementSkill = 4;
  } else if (action.id === 'cert_study') {
    newState.civilExamPrep += 1;
    eventEffect.civilExamPrep = 1;
  }

  newState.project = newProject;

  if (action.energyCost) eventEffect.energy = -Math.round(action.energyCost);
  if (moraleDrain) eventEffect.morale = -Math.round(moraleDrain);
  if (staminaDrain) eventEffect.stamina = -Math.round(staminaDrain);
  if (action.salaryCost) eventEffect.salary = -Math.round(action.salaryCost);
  if (action.materialsCost) eventEffect.materials = -Math.round(action.materialsCost);
  if (totalProgGain) eventEffect.progress = Math.round(totalProgGain);
  if (action.approvalGain) eventEffect.bossApproval = Math.round(action.approvalGain * profile.approvalMultiplier);
  if (action.salaryGain) eventEffect.salary = (eventEffect.salary || 0) + Math.round(action.salaryGain);
  if (action.certificateGain) eventEffect.studyPoints = Math.round(action.certificateGain);
  if (action.experienceGain) eventEffect.experience = Math.round(action.experienceGain);
  if (action.networkGain) eventEffect.networkValue = Math.round(action.networkGain);
  let safetyDisplay = 0;
  if (action.safetyRiskChange) safetyDisplay += Math.round(action.safetyRiskChange);
  if (writePlanSafetyHit) safetyDisplay += writePlanSafetyDelta;
  if (safetyDisplay !== 0) eventEffect.safetyRisk = safetyDisplay;

  if (certCompletedNames.length > 0) {
    for (const name of certCompletedNames) {
      logs.push(`恭喜！你成功考取了【${name}】！`);
    }
  }

  const narrative = pickActionNarrative(action);

  const weatherNote = weatherEffectNote(
    state.project.weather,
    outdoorAction,
    action.category === 'CONSTRUCTION'
  );
  const fullNarrative = weatherNote ? `${narrative}\n\n${weatherNote}` : narrative;
  logs.unshift(fullNarrative);

  return { newState, eventTitle: action.label, eventEffect: roundEffectRecord(eventEffect), logs, planCompletedLog };
}
