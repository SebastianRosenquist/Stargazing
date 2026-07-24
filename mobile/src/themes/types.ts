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

export type ReleaseStyle = 'drift-away' | 'sink-down' | 'float-downstream' | 'stay-and-collect';

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
  pacingMultiplier?: number;
  /** Whether this theme is fully implemented. Unbuilt themes show as a disabled "Coming soon" card in the picker. */
  built: boolean;
  /** Short label shown on the picker card's badge pill, e.g. "Original", "The gentlest", "Coming soon". */
  badge: string;
};
