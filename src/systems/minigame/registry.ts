import { ConcreteTapper } from './ConcreteTapper';
import { PPTPresenter } from './PPTPresenter';
import { QuizChallenge } from './QuizChallenge';
import { SafetySpotter } from './SafetySpotter';
import { SurveyAim } from './SurveyAim';
import type { MinigameConfig } from './types';

export const MINIGAME_REGISTRY: MinigameConfig[] = [
  {
    id: 'safety_spotter',
    triggerAction: 'safety_training',
    triggerChance: 0.4,
    component: SafetySpotter,
  },
  {
    id: 'ppt_presenter',
    triggerAction: 'owner_meeting',
    triggerChance: 0.35,
    component: PPTPresenter,
  },
  {
    id: 'concrete_tapper',
    triggerAction: 'do_construction',
    triggerChance: 0.3,
    component: ConcreteTapper,
  },
  {
    id: 'quiz_challenge',
    triggerAction: 'cert_study',
    triggerChance: 0.35,
    component: QuizChallenge,
  },
  {
    id: 'quiz_challenge_safety',
    triggerAction: 'safety_training',
    triggerChance: 0.25,
    component: QuizChallenge,
  },
  {
    id: 'survey_aim',
    triggerAction: 'survey_line',
    triggerChance: 0.4,
    component: SurveyAim,
  },
];

export function getMinigameForAction(actionId: string): MinigameConfig | null {
  const matches = MINIGAME_REGISTRY.filter((m) => m.triggerAction === actionId);
  if (matches.length === 0) return null;
  const chosen = matches[Math.floor(Math.random() * matches.length)]!;
  if (Math.random() > chosen.triggerChance) return null;
  return chosen;
}
