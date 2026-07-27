// Data model for the theme system. See planning/themes/00-theme-architecture.md
// for the full rationale. `built`/`badge` aren't in that doc — they're what the
// theme picker needs to render a "Coming soon" card for themes that only have a
// content brief so far, distinct from any future paid/unlockable-tier flag.
export type ThemeId =
  | 'stress-perspective'
  | 'self-compassion'
  | 'anxiety-grounding'
  | 'overthinking-stream'
  | 'gratitude-keep';

export type ReleaseStyle = 'drift-away' | 'sink-down' | 'float-downstream' | 'stay-and-collect' | 'set-behind-horizon';

export type BackgroundAssetId =
  | 'starfield'
  | 'waterdrop'
  | 'clouds'
  | 'snowfall'
  | 'rain'
  | 'sunset'
  | 'fireflies';

export type ThemePalette = {
  glowOuter: string;
  glowInner: string;
  core: string;
  background: string;
};

// Every duration/delay in the ritual's phase timeline, in milliseconds.
// Themes that want a different pace set explicit values for whichever fields
// they care about via `Theme.timing` (a partial override merged over
// DEFAULT_TIMING below) rather than a single global multiplier — so each
// theme's exact timing is visible and editable in its own file.
export type ThemeTiming = {
  /** intro: delay before the star/orb fades in and typing becomes possible. */
  starRevealDelay: number;
  /** intro: delay before the title starts fading out. */
  titleFadeStart: number;
  /** intro: how long the title fade-out takes. */
  titleFadeDuration: number;
  /** intro: delay before the title is removed from the tree entirely. */
  titleRemoveDelay: number;
  /** release: delay after submitting before the message script starts rotating. */
  afterSubmitDelay: number;
  /** release: delay after rotation starts before the release motion begins. */
  beforeShrinkDelay: number;
  /** release: duration of the release motion's first phase (shrink/equivalent). */
  shrinkDuration: number;
  /** release: duration of the release motion's second phase (drift/equivalent). */
  driftDuration: number;
  /** release: how long the final message stays fully visible before it fades. */
  messageReadDelay: number;
  /** release: delay between the message fading out and the closing overlay showing. */
  overlayDelay: number;
};

export const DEFAULT_TIMING: ThemeTiming = {
  starRevealDelay: 7000,
  titleFadeStart: 5000,
  titleFadeDuration: 4000,
  titleRemoveDelay: 9000,
  afterSubmitDelay: 4000,
  beforeShrinkDelay: 3000,
  shrinkDuration: 60000,
  driftDuration: 26000,
  messageReadDelay: 4700,
  overlayDelay: 1000,
};

export type Theme = {
  id: ThemeId;
  title: string;
  subtitle: string;
  prompt: string;
  messages: string[];
  closingMessage: string;
  releaseStyle: ReleaseStyle;
  palette: ThemePalette;
  backgroundAsset?: BackgroundAssetId;
  ambientTrackId?: string;
  /** Per-field overrides of DEFAULT_TIMING — omit to use the defaults unchanged. */
  timing?: Partial<ThemeTiming>;
  /** Whether this theme is fully implemented. Unbuilt themes show as a disabled "Coming soon" card in the picker. */
  built: boolean;
  /** Short label shown on the picker card's badge pill, e.g. "Original", "The gentlest", "Coming soon". */
  badge: string;
};

export function getThemeTiming(theme: Theme): ThemeTiming {
  return { ...DEFAULT_TIMING, ...theme.timing };
}
