# Theme: Anxiety & Grounding

Status: proposed, not built
Depends on: [[00-theme-architecture]] (Theme data model, `releaseStyle` extension point)
Theme id: `anxiety-grounding`

## Goal

A ritual for acute anxiety / racing heart-rate moments, distinct from the existing "Stress &
Perspective" theme. Where the default theme works by making a worry feel small against cosmic
scale, this theme works by re-anchoring attention in the present physical moment — the two most
evidence-backed low-effort techniques for anxiety are grounding (engaging the senses to interrupt
spiraling thought) and paced breathing (lengthening the exhale to trigger the parasympathetic
response). This theme should feel slower and heavier than the default, not lighter — anxiety
responds better to "settle down" than "float away."

## Why this is a different theme, not a reskin

The default theme's message script explicitly minimizes the thought ("this thought does not
matter... it can easily disappear"). That framing is wrong for anxiety, where the person often
already feels like their concerns are being dismissed. This theme instead:
- never tells the user their worry doesn't matter
- gives the body something concrete to do (breathe, notice senses) rather than a perspective shift
- ends on regulation ("your breathing has slowed"), not insignificance

## Ritual / mechanic changes

`releaseStyle: 'sink-down'` — instead of shrinking and drifting up and off-screen (feels like
loss of control, appropriate for "let it go into the universe"), the star sinks gently downward and
dims, like a stone settling to the bottom of calm water. Slower than the default drift
(`pacingMultiplier: 1.3`, i.e. ~30% slower).

Input prompt: `"What's making your chest feel tight?"` (adjust wording — avoid clinical language;
should read as company, not diagnosis).

## Message script (draft — tune wording, keep the beat structure)

1. "Let's slow down together."
2. "Breathe in for four..." *(paced — see Pacing note below)*
3. "...hold for four..."
4. "...and out for six."
5. "Notice five things you can see around you."
6. "Notice four things you can hear."
7. "Notice three things you can feel — the ground, your clothes, your breath."
8. "You are here."
9. "You are safe right now, in this moment."
10. "Your breathing is slowing."
11. "The feeling is still real. You're just not alone with it."
12. "Let's breathe in again, for four..."
13. "...and out, for six."

### Pacing — decided: sync to the actual breath count

Resolved 2026-07-28 (was previously an open question): the message script should run on
per-message durations timed to the actual breath count, not the single fixed rotation interval the
other themes use. A generic "every ~5s" rotation undercuts the one thing this theme is supposed to
do differently from the rest — give the body something to actually follow.

Draft per-message durations (tune in testing, but this is the intended shape):

| # | Message | Duration |
|---|---|---|
| 1 | "Let's slow down together." | 4000ms |
| 2 | "Breathe in for four..." | 4000ms |
| 3 | "...hold for four..." | 4000ms |
| 4 | "...and out for six." | 6000ms |
| 5 | "Notice five things you can see around you." | 6000ms |
| 6 | "Notice four things you can hear." | 5000ms |
| 7 | "Notice three things you can feel — the ground, your clothes, your breath." | 6000ms |
| 8 | "You are here." | 3000ms |
| 9 | "You are safe right now, in this moment." | 4000ms |
| 10 | "Your breathing is slowing." | 4000ms |
| 11 | "The feeling is still real. You're just not alone with it." | 5000ms |
| 12 | "Let's breathe in again, for four..." | 4000ms |
| 13 | "...and out, for six." | 6000ms |

One pass through the script is ~61s; the theme's current `shrinkDuration` + `driftDuration`
(78000ms + 33800ms = 111.8s) is roughly 1.8x that. Recommend letting it loop back to message 1 and
run the breath cycle again rather than stretching the timing fields to force exactly one pass (the
way `self-compassion.ts` does for its audio track) — a paced-breathing exercise is meant to be
repeated for a couple of minutes, so a second partial pass reads as "keep breathing with me," not as
a mistake the way a repeated self-compassion script might. Flag to Sebastian if a single-pass, no-repeat
version is preferred instead.

**Implementation impact (new, not previously scoped):** the shared `useMessageRotation` hook
(`mobile/src/hooks/useMessageRotation.ts`) currently only accepts one `rotateIntervalMs` applied to
every message. Supporting per-message durations means either a new optional parallel array (e.g.
`messageDurations?: number[]` on `Theme`, same length as `messages`, consumed by
`useMessageRotation` in place of the fixed interval when present) or an equivalent mechanism —
`Theme`/`ThemeTiming` in `mobile/src/themes/types.ts` don't have a field for this yet. No other
built theme needs this today, so it's safe to add as an optional, backward-compatible field rather
than changing the existing single-interval behavior other themes rely on.

## Visual / palette

Cooler and dimmer than the warm orange/tomato default — suggest deep blue/teal glow
(`glowOuter: '#1e3a5f'`, `glowInner: '#2f6690'`, `core: '#e8f1f5'`) to read as "calm water" rather
than "warm star."

`backgroundAsset: 'waterdrop'` — background is `resources/waterdrop/` (a single drop falling and
rippling on impact, on repeat) instead of the default starfield. Per the Pacing decision above, the
ripple should be driven by the same per-message durations as the breath-count lines rather than
looping on its own independent timer — e.g. the ripple expands outward through "breathe in for
four," holds through "hold for four," and fades through "and out for six" (messages 2–4 and 12–13
in the table above), so the water motion and the breathing cue are the same signal instead of two
unrelated loops that happen to share a screen.

## Audio

No strong opinion — reuse the default ambient track unless a slower/lower track is available. Not
worth sourcing new audio just for this theme at first launch.

## Closing message (replaces `ThankYouOverlay` copy for this theme)

"Your breathing has slowed. The feeling may still be here, and that's okay — you're steadier than
you were a few minutes ago."

## Content guardrails

- Do not use "just," "simply," or "only" before the feeling (minimizes it).
- Do not promise the anxiety is gone — promise the person is more regulated, which is honest and
  achievable in ~2 minutes.
- Avoid clinical/DSM language ("panic attack," "disorder") — this is a calming tool, not a
  diagnostic one.

## Acceptance criteria

- Selecting this theme from the picker changes: input prompt, message script, star palette, release
  animation (sinks, doesn't drift upward), and closing message — nothing else in the app should
  need to change.
- The default "Stress & Perspective" theme's behavior is byte-for-byte unchanged.
