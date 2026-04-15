import { ConcreteTapper } from './ConcreteTapper';
import { CraneOperator } from './CraneOperator';
import { DocumentRush } from './DocumentRush';
import { NumberCruncher } from './NumberCruncher';
import { PPTPresenter } from './PPTPresenter';
import { QuizChallenge } from './QuizChallenge';
import { SafetySpotter } from './SafetySpotter';
import { SurveyAim } from './SurveyAim';
import type { MinigameConfig } from './types';

export const MINIGAME_REGISTRY: MinigameConfig[] = [
  // ─── 安全培训 ───
  { id: 'safety_spotter',        triggerAction: 'safety_training',   triggerChance: 0.5,  component: SafetySpotter },
  { id: 'quiz_safety',           triggerAction: 'safety_training',   triggerChance: 0.35, component: QuizChallenge },

  // ─── 盯施工 ───
  { id: 'concrete_tapper',       triggerAction: 'do_construction',   triggerChance: 0.4,  component: ConcreteTapper },
  { id: 'crane_construction',    triggerAction: 'do_construction',   triggerChance: 0.35, component: CraneOperator },

  // ─── 赶工加班 ───
  { id: 'concrete_overtime',     triggerAction: 'overtime_rush',     triggerChance: 0.35, component: ConcreteTapper },
  { id: 'crane_overtime',        triggerAction: 'overtime_rush',     triggerChance: 0.35, component: CraneOperator },

  // ─── 测量 & 巡检 ───
  { id: 'survey_aim',            triggerAction: 'survey_line',       triggerChance: 0.55, component: SurveyAim },
  { id: 'survey_inspection',     triggerAction: 'site_inspection',   triggerChance: 0.3,  component: SurveyAim },

  // ─── 汇报演讲类 ───
  { id: 'ppt_owner',             triggerAction: 'owner_meeting',     triggerChance: 0.5,  component: PPTPresenter },
  { id: 'ppt_boss',              triggerAction: 'visit_boss',        triggerChance: 0.35, component: PPTPresenter },
  { id: 'ppt_expert',            triggerAction: 'expert_review',     triggerChance: 0.4,  component: PPTPresenter },
  { id: 'ppt_exchange',          triggerAction: 'industry_exchange', triggerChance: 0.35, component: PPTPresenter },

  // ─── 学习考证 ───
  { id: 'quiz_cert',             triggerAction: 'cert_study',        triggerChance: 0.5,  component: QuizChallenge },
  { id: 'quiz_civil',            triggerAction: 'civil_exam_prep',   triggerChance: 0.45, component: QuizChallenge },
  { id: 'quiz_grad',             triggerAction: 'grad_exam_prep',    triggerChance: 0.45, component: QuizChallenge },
  { id: 'quiz_lab',              triggerAction: 'lab_curve_trace',   triggerChance: 0.35, component: QuizChallenge },

  // ─── 材料验收 ───
  { id: 'safety_material',       triggerAction: 'material_check',    triggerChance: 0.3,  component: SafetySpotter },
  { id: 'number_material',       triggerAction: 'material_check',    triggerChance: 0.35, component: NumberCruncher },

  // ─── 写方案 ───
  { id: 'number_plan',           triggerAction: 'write_plan',        triggerChance: 0.35, component: NumberCruncher },
  { id: 'doc_plan',              triggerAction: 'write_plan',        triggerChance: 0.3,  component: DocumentRush },

  // ─── 捞外快 ───
  { id: 'number_hustle',         triggerAction: 'side_hustle',       triggerChance: 0.4,  component: NumberCruncher },

  // ─── 协调设计变更 ───
  { id: 'doc_change',            triggerAction: 'coordinate_design', triggerChance: 0.35, component: DocumentRush },

  // ─── 带新人 ───
  { id: 'quiz_mentor',           triggerAction: 'mentor_newbie',     triggerChance: 0.35, component: QuizChallenge },
];

export function getMinigameForAction(actionId: string): MinigameConfig | null {
  const matches = MINIGAME_REGISTRY.filter((m) => m.triggerAction === actionId);
  if (matches.length === 0) return null;
  const chosen = matches[Math.floor(Math.random() * matches.length)]!;
  if (Math.random() > chosen.triggerChance) return null;
  return chosen;
}
