/**
 * Central feature toggles for gradual rollouts and A/B style switches.
 */
export const FEATURE_FLAGS = {
  /** Dynamic SVG construction-worker avatar on the home tab */
  characterAvatar: true,
  enableAnimatedBars: true,
  enableDangerPulse: true,
  enableFloatingNumbers: true,
  /** Procedural UI / game feedback sounds (Web Audio API) */
  enableAudio: true,
  /** Ambient CSS weather overlay on the playfield */
  enableWeatherParticles: true,
  /** Full-screen motion transition when advancing quarter */
  enableQuarterTransition: true,
  /** Optional skill minigames before certain actions (UI-layer bonus only) */
  enableMinigames: true,
} as const;

export type FeatureFlagKey = keyof typeof FEATURE_FLAGS;

export function isFeatureEnabled(key: FeatureFlagKey): boolean {
  return FEATURE_FLAGS[key];
}

export function isCharacterAvatarEnabled(): boolean {
  return FEATURE_FLAGS.characterAvatar;
}
