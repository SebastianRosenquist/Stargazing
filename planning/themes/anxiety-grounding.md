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

### Pacing note (open question for implementation)

The breath-count lines (2–4, 12–13) ideally sync to actual elapsed seconds rather than the fixed
`MESSAGE_READ_DELAY` (4700ms) used for the default theme's rotation. Two options for Claude Code to
choose between:
- (a) simplest: keep fixed-interval rotation but tune interval to ~4–6s and accept it's an
  approximation of the breath count, not literally timed
- (b) more correct: give `MessageRotator` an optional per-message duration array so breath-count
  lines can be timed to match "four seconds," "six seconds" exactly

Recommendation: ship (a) first, leave (b) as a fast-follow if it doesn't feel convincing in testing.

## Visual / palette

Cooler and dimmer than the warm orange/tomato default — suggest deep blue/teal glow
(`glowOuter: '#1e3a5f'`, `glowInner: '#2f6690'`, `core: '#e8f1f5'`) to read as "calm water" rather
than "warm star."

`backgroundAsset: 'waterdrop'` — background is `resources/waterdrop/` (a single drop falling and
rippling on impact, on repeat) instead of the default starfield. The ripple-then-fade loop is a
near-literal match for paced breathing, and should ideally sync to the same breath count as the
message script (see Pacing note above) — e.g. one ripple per breath cycle — rather than looping on
its own independent timer. If syncing the two turns out to be more implementation effort than it's
worth for v1, ship them on independent loops first; the visual metaphor still reads fine unsynced.

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
