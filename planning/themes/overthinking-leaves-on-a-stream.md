# Theme: Overthinking — Leaves on a Stream

Status: proposed, not built
Depends on: [[00-theme-architecture]] (Theme data model, `releaseStyle` extension point)
Theme id: `overthinking-stream`

## Goal

A ritual for looping/repetitive thoughts (the "I can't stop thinking about..." spiral), based on
the Acceptance and Commitment Therapy (ACT) defusion exercise "Leaves on a Stream": you place a
thought onto a leaf and watch it float past, practicing observing a thought without engaging,
arguing with, or being carried by it. The core skill this theme teaches is different from the
default theme's — it's not "this thought is small," it's "you are not your thoughts; you can watch
one pass without following it downstream."

## Why this is a different theme, not a reskin

The default theme's mechanic (type it in, watch it shrink into space over ~90 seconds) is a single
release moment. Overthinking is repetitive by nature — the useful skill is watching *several*
thoughts pass in a row without chasing any one of them, which the default one-shot ritual doesn't
practice. This theme should let the user feed in more than one thought per session if the same loop
keeps recurring.

## Ritual / mechanic changes

`releaseStyle: 'float-downstream'` — the visual metaphor is a cloud (rather than a literal leaf on
water) that enters from one side of the screen, carries the typed text, and drifts horizontally
across and off the other side. This resolves the scope question this brief originally raised
(full stream/leaf art vs. reusing the starfield): `backgroundAsset: 'clouds'` — see
`resources/clouds/` — gives a daytime sky of slowly drifting clouds without needing to build a new
water/stream scene, and "watching your thoughts pass like clouds" is an equally established
mindfulness defusion metaphor to leaves-on-a-stream, just easier to build. The thought rides on one
of the clouds instead of a leaf; message copy below has been adjusted to match (sky/clouds instead
of stream/leaves). Title/technique name stays "Leaves on a Stream" since that's the named ACT
exercise this theme is teaching — only the visual dressing changed.

After a thought-cloud drifts off-screen, the input reappears immediately (rather than going to the
closing screen) so another thought can be entered — up to a cap (suggest 3) before moving to the
closing screen, so the exercise doesn't feel endless.

Input prompt: `"What thought keeps circling back?"`

## Message script (draft — shown once, not per-cloud, so it doesn't repeat if the user enters multiple thoughts)

1. "Picture a wide, open sky, and clouds drifting across it."
2. "Put the thought on a cloud."
3. "Watch it drift. You don't need to push it or pull it back."
4. "You're not arguing with the thought. You're just watching it pass."
5. "If your mind follows it across the sky, that's okay — just notice, and come back to watching."
6. "The sky keeps moving whether you follow the thought or not."
7. "You can let this one drift on by."

## Visual / palette

`backgroundAsset: 'clouds'` (see `resources/clouds/`) — a bright daytime sky rather than the
default's night starfield, a deliberate contrast so this theme reads as distinct at a glance. Palette
can otherwise stay soft and natural-toned (light blues, off-white clouds) rather than either the
default's warm orange or the anxiety theme's blue-teal.

## Audio

Reuse default ambient track for v1.

## Closing message

"You watched a few thoughts pass without chasing them. That's the whole skill — you can do it again
any time one starts circling."

## Content guardrails

- Never argue with or resolve the thought in the copy — the point is non-engagement, not counter-
  argument. Avoid any message that sounds like "here's why that thought is wrong."
- Don't frame repeated intrusive thoughts as a flaw ("why do you keep thinking this") — frame
  recurrence as normal and expected.

## Open questions for Sebastian (flag, don't decide silently)

- Whether the multi-thought loop (cap at 3) is in scope for v1 or whether a single thought per
  session is fine to start, matching the other themes' structure more closely.

## Acceptance criteria

- Selecting this theme changes: input prompt, message script (shown once), release motion
  (horizontal drift, not shrink-and-ascend), and closing message.
- If the multi-thought loop is included: after each release, input reappears up to 3 times before
  the closing screen shows.
- The default theme's behavior is unchanged.
