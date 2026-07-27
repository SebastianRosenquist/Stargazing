import { stressPerspective } from './stress-perspective';
import { selfCompassion } from './self-compassion';
import { anxietyGrounding } from './anxiety-grounding';
import { overthinkingStream } from './overthinking-stream';
import { gratitudeKeep } from './gratitude-keep';
import type { Theme, ThemeId } from './types';

// Picker display order (self-compassion featured first, per the design
// handoff) — independent of DEFAULT_THEME_ID below, which is the fallback for
// paths that skip the picker entirely (deep-linked custom meditations).
export const THEMES: Theme[] = [selfCompassion, stressPerspective, anxietyGrounding, overthinkingStream, gratitudeKeep];

export function getTheme(id: ThemeId): Theme {
  const theme = THEMES.find((t) => t.id === id);
  if (!theme) throw new Error(`Unknown theme id: ${id}`);
  return theme;
}

export const DEFAULT_THEME_ID: ThemeId = 'stress-perspective';

export type { Theme, ThemeId, ReleaseStyle, ThemePalette, BackgroundAssetId, ThemeTiming } from './types';
export { getThemeTiming, DEFAULT_TIMING } from './types';
