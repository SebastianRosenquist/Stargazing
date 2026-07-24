# Theme: Gratitude — Keep, Don't Release

Status: proposed, not built
Depends on: [[00-theme-architecture]] (Theme data model, new `stay-and-collect` `releaseStyle`)
Theme id: `gratitude-keep`

## Goal

Every existing/planned theme so far is about *releasing* something hard. This theme flips the
mechanic's valence: you put a good moment into a star, and instead of it shrinking and drifting
away, it stays and becomes part of a small personal constellation you build over repeat visits.
Gratitude practice's evidence base (well-being research going back to Emmons & McCullough's gratitude
journaling studies) depends on repetition over time, so this is the one theme in this batch that
should intentionally encourage a return visit rather than being a single self-contained session.

## Why this is a different theme, not a reskin

Every other theme ends with the thought disappearing — that's the point (release, defusion,
settling). Gratitude is the opposite: the thing you name is worth keeping, and seeing it accumulate
is itself the reward. This needs a new release style (`stay-and-collect`) rather than reusing
`drift-away`.

## Ritual / mechanic changes

`releaseStyle: 'stay-and-collect'`:
- Star appears, user types a good moment/thing they're grateful for.
- Instead of shrinking, the star gently rises to join a small cluster of past stars already placed
  in the sky (visually: previous entries shown as small dim points, already-placed, that the new one
  flies up to join and then joins as one of them, slightly brighter briefly, then settling to match
  the others).
- No "make the thought small" messaging — this is additive, not something to defuse.

Input prompt: `"What's one good thing about today?"`

## Data implications (new — flag explicitly)

This is the first theme that needs to *persist* something between sessions (the growing
constellation), whereas every other theme and the current app are stateless per-visit. That's a
meaningfully different scope than the other two briefs in this batch:
- Minimum viable version: store just a count and rough position/brightness seeds locally on-device
  (e.g. `expo-secure-store` or a simple local JSON file), not the actual text — consistent with the
  app's existing privacy posture (thoughts aren't stored anywhere today, per `JS/message.js`'s old
  server-post behavior having no analog in the current mobile app).
- Whether to ever store the *text* of what someone was grateful for (so they could look back at past
  entries, not just see dots) is a product decision with privacy weight — flag to Sebastian rather
  than deciding. Recommend starting without stored text (dots only) since it's simpler and lower-risk,
  and adding a "see your past entries" feature later only if wanted.

## Message script (draft)

1. "What's one good thing about today? Big or small."
2. "Let it sit there for a moment."
3. "This one gets to stay."
4. *(as the star rises to join the others)* "Look — it's not the only one."

Much shorter than the other themes' scripts — gratitude doesn't need extended dwelling the way
releasing a hard thought does; the visual (joining the cluster) carries most of the meaning.

## Visual / palette

Warm and soft — could reuse the default theme's warm tones, but slightly gentler (less "burning
star," more "warm light"). The cluster of past entries should be visually distinct as small,
steady, dim points so the new entry (bright, then settling) reads clearly against them.

## Audio

Reuse default ambient track for v1.

## Closing message

"You've placed {N} good moments so far. Come back tomorrow and add another."
(Requires the count from the persisted data above — simplest version can hard-code "you've placed
a moment worth keeping" if persistence is deferred to a later pass.)

## Content guardrails

- No language of smallness, insignificance, or release anywhere in this theme's copy — that's the
  opposite of the point.
- Don't make the prompt feel like a performance review of the day ("was today good enough") — "big
  or small" in the prompt matters, keep it.

## Open questions for Sebastian (flag, don't decide silently)

- Is on-device persistence (even just a count + dots, no text) in scope for a first version, or
  should v1 ship stateless (each visit shows just one new star, no accumulating cluster) and
  persistence come as a fast-follow once the ritual itself feels right?
- Long-term: any interest in ever showing past entries as text, or intentionally keeping this
  "look, don't reread" (matches the app's current no-storage philosophy)?

## Acceptance criteria

- Selecting this theme changes: input prompt, message script, and release motion (rises and joins
  a cluster instead of shrinking away) — plus, if persistence is in scope, a stored count/positions
  surviving app restarts.
- The default theme's behavior is unchanged.
