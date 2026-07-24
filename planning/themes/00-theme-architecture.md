# Theme System Architecture

Status: proposed, not built
Depends on: nothing (this is the foundation the other theme briefs assume exists)
Audience: Claude Code, implementing in `mobile/`

## Goal

Turn "Stargazing" from a single hard-coded ritual (stress → cosmic perspective → star drifts away)
into a small library of selectable rituals ("themes"), each addressing a different emotional need,
while reusing one shared animation/timing engine. A theme should be data, not a new screen or a
forked copy of the app.

## Why this is possible with minimal rework

The app already has 80% of a theme system by accident:

- `useCustomMeditation.ts` already loads an arbitrary `messages: string[]` array (plus an author
  name) from a deep link and feeds it into the same ritual. That proves the ritual doesn't actually
  depend on the specific wording in `constants/messages.ts` — it just needs *some* ordered list of
  strings.
- `useStarLifecycle.ts` already isolates all timing/animation as generic phases
  (`intro → awaitingThought → submitted → done`) driven by shared values, independent of message
  content.
- `MainStar.tsx` draws the glowing orb procedurally (Skia `Circle` + `BlurMask`), so its colors and
  size are just props, not baked-in assets.

What's missing is a named, selectable layer above this: a `Theme` object, a place to pick one, and
a couple of extension points (tone-appropriate ending, non-default visual metaphor, per-theme
pacing/audio) that the current code hard-codes as "the stress theme."

## Data model

New file: `mobile/src/themes/types.ts`

```ts
export type ThemeId = 'stress-perspective' | 'anxiety-grounding' | 'overthinking-stream' | 'gratitude-keep' | ...;

export type ReleaseStyle = 'drift-away' | 'sink-down' | 'float-downstream' | 'stay-and-collect';

export type Theme = {
  id: ThemeId;
  title: string;               // e.g. "Stargazing"
  subtitle: string;             // e.g. "A small star to help clear your mind"
  prompt: string;               // input placeholder, e.g. "What's bothering you?..."
  messages: string[];           // the rotating script — see per-theme .md for content
  closingMessage: string;       // replaces the hard-coded ThankYouOverlay text
  releaseStyle: ReleaseStyle;   // which animation path useStarLifecycle should run
  palette: { glowInner: string; glowOuter: string; core: string; background: string };
  backgroundAsset?: BackgroundAssetId; // which ambient background animation to run behind the ritual; omit to keep the default Starfield
  ambientTrackId?: string;      // key into a small audio asset map; falls back to a shared default
  pacingMultiplier?: number;    // e.g. 1.4 for Sleep = 40% slower than baseline timings
};

export type BackgroundAssetId = 'starfield' | 'waterdrop' | 'clouds' | 'snowfall' | 'rain' | 'sunset' | 'fireflies';
```

Each theme brief in this folder should be read as "fill in this object, plus flag any
`releaseStyle` that doesn't exist yet."

## Background assets

Sebastian dropped six candidate background designs into `resources/` at the project root
(`clouds`, `fireflies`, `rain`, `snowfall`, `sunset`, `waterdrop`). They're web prototypes
(HTML + Sass/Stylus/Pug/CSS from CodePen-style sources), **not** already in the RN/Skia stack the
app runs on — implementing one means re-authoring the animation with Skia primitives (`Canvas`,
`Circle`, etc., as `MainStar.tsx` already does) and Reanimated shared values, not copying the CSS
in directly. Treat each as a reference for the *visual idea and motion*, not literal code to port.

Assignments decided so far (see each theme's own brief for the reasoning):

- `starfield` (existing `Starfield.tsx`, unchanged) — Stress & Perspective, and Gratitude (which
  reuses it as-is: gratitude's mechanic is "stars that stay," not a different backdrop)
- `waterdrop` — Anxiety & Grounding (the ripple-on-impact loop doubles as a breathing-pace visual)
- `clouds` — Overthinking (thoughts drifting past like clouds; replaces the literal leaf/stream
  concept — see that theme's brief)
- `sunset` — Self-Compassion (lotus imagery + warm golden light)
- `snowfall` (background gradient already matches the app's existing night palette) — reserved for
  a future Sleep / Wind-down brief, not yet written
- `rain` — reserved for a future Grief & Loss brief, not yet written
- `fireflies` — reserved for a future Connection / Loneliness brief, not yet written
- None of the six fit an Anger & Frustration theme (flame/embers) — that one would need new art if
  pursued.

## Where themes live

New folder: `mobile/src/themes/`
- `types.ts` — the shape above
- `stress-perspective.ts` — the existing default, ported verbatim from `constants/messages.ts` +
  `ThankYouOverlay.tsx`'s current copy, `releaseStyle: 'drift-away'`
- one file per new theme (`anxiety-grounding.ts`, `overthinking-stream.ts`, `gratitude-keep.ts`, ...)
- `index.ts` — exports `THEMES: Theme[]` and a `getTheme(id)` lookup

`constants/messages.ts` becomes the seed for `themes/stress-perspective.ts` and can eventually be
deleted (not yet — per project rule, nothing gets deleted without being asked).

## New UI: theme picker

Add a screen/step before `TitleScreen` (or as a modal reachable from it) listing theme title +
one-line subtitle. Selecting a theme sets it as the active theme for the session; everything
downstream (`useStarLifecycle`, `MainStar`, `MessageRotator`, `ThankYouOverlay`) reads from the
active `Theme` object instead of imported constants.

Suggested approach: a `useActiveTheme()` hook (or React context) holding the selected `Theme`,
defaulting to `stress-perspective` so the app's current behavior is unchanged if no picker
interaction happens (e.g. deep-linked custom meditations skip the picker entirely, same as today).

## Extension points needed in existing files

- `useStarLifecycle.ts`: the shrink/drift math (`SHRINK_TRANSLATE_Y`, `DRIFT_TRANSLATE_Y`,
  durations) is currently one fixed path. It needs to branch on `releaseStyle` — at minimum
  `drift-away` (current), `sink-down` (anxiety), `float-downstream` (overthinking), and
  `stay-and-collect` (gratitude, star doesn't disappear — see that theme's brief). Timings should
  scale by `pacingMultiplier`.
- `MainStar.tsx`: accept `palette` instead of hard-coded `"tomato"/"orange"/"#dddddd"`.
- `ThankYouOverlay.tsx`: accept `closingMessage` instead of the hard-coded stress-specific copy
  ("I hope you feel a little less stressed...").
- `useAmbientAudio.ts`: accept an optional track id; keep `small-memory.mp3` as the default so
  themes that don't specify a track behave exactly as today.
- `useCustomMeditation.ts`: unaffected in behavior, but conceptually it becomes "load an ad-hoc,
  unsaved Theme from a link" rather than a special case — worth a comment update, no functional
  change required.

## Non-goals for this doc

- No visual design of the picker (spacing/animation) — leave that to implementation judgment or a
  follow-up design pass.
- No backend/analytics for which themes get used — out of scope until asked for.
- No decision yet on whether themes are a paid/unlockable tier — that's a product question for
  Sebastian, not an engineering one; flag it rather than deciding it.

## Acceptance criteria

- Existing behavior (default stress-perspective ritual, custom shared-link meditations) is
  unchanged for anyone who doesn't interact with a new picker.
- Adding a new theme is "add one file to `mobile/src/themes/`, fill in the `Theme` fields," not a
  multi-file surgery — if it isn't, the extension points above weren't cut in the right place.
- Each per-theme brief in this folder can be implemented by filling in a `Theme` object and, at
  most, adding one new `releaseStyle` case to `useStarLifecycle.ts`.
