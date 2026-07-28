# Theme: Self-Compassion

Status: proposed, not built
Depends on: [[00-theme-architecture]] (Theme data model, `releaseStyle` extension point)
Theme id: `self-compassion`

## Goal

A ritual for self-critical thoughts ("I'm so stupid," "I always mess this up") based on Kristin
Neff's self-compassion break, which has three components: mindfulness (noticing the pain without
exaggerating or suppressing it), common humanity (recognizing that struggling and being imperfect
is part of being human, not a personal failing), and self-kindness (responding to yourself the way
you would a friend). This theme should gently reframe a self-critical thought rather than shrink it
away or defuse from it — it needs a warmer, more nurturing register than any of the other themes
drafted so far.

## Why this is a different theme, not a reskin

The default theme's "this thought does not matter" framing and the overthinking theme's "just
watch it pass without engaging" framing are both wrong here — a self-critical thought usually
*does* deserve a response, just a kinder one than the person is giving themselves. This theme is the
only one in the set that actively talks back to the thought (gently), rather than shrinking it,
watching it drift, or sinking past it.

## Ritual / mechanic changes

Input prompt: `"What did you just tell yourself?"`

## Message script

1. "That's a hard thing to say to yourself."
2. "Let's just be with that for a second, instead of rushing past it."
3. "Notice how that feels, without making it bigger or smaller than it is."
4. "This is a moment of difficulty, and difficulty is part of every life — including yours."
5. "You're not the only person who's ever felt this way about themselves."
6. "Somewhere right now, someone else is being just as hard on themselves."
7. "Struggling like this doesn't make you a failure — it makes you human."
8. "If a friend told you they felt this way, what would you say to them?"
9. "Maybe something like: 'that sounds really hard' or 'you're doing better than you think.'"
10. "Try saying that to yourself now."
11. "You deserve the same kindness you'd give someone you love."
12. "Put a hand over your heart, if that helps it land."
13. "You can be imperfect and still be worthy of your own patience."
14. "This feeling will pass. You don't have to fix it right now — just be kind while it's here."

(Expanded from an original 8-line draft to 14 on 2026-07-28 — the extra beats add a mindfulness
opener, a second common-humanity line, a concrete example of what "talking to yourself like a
friend" sounds like, and the hand-over-heart gesture from Neff's self-compassion break. At 14
messages and the implemented `messageRotateInterval` of 6000ms, the script runs almost exactly once
through without looping back to the start before the release motion ends — a nice side effect of
landing at the top of the requested range instead of the bottom.)

## Visual / palette

`backgroundAsset: 'sunset'` (see `resources/sunset/`) — a warm dusk landscape: mountains, a low
sun reflected in still water, and lotus flowers. The lotus imagery is a natural fit for this theme
specifically — a classic symbol for blooming through difficulty rather than despite it. Palette
should lean into the resource's existing warm violets/pinks/golds (`#be91c6`, `#fea798`, `#ff846e`)
rather than the cooler tones used in the anxiety or overthinking themes, reinforcing that this is
the "gentlest" theme in the set.

Note for implementation: the source CSS names the loop `rise` (sun continuously rising and looping),
not literally setting — that's fine for an ambient background loop (it's not meant to be watched as
a single sunset), but if a one-directional "settling" read is wanted instead, the animation can be
adjusted to drift downward rather than upward. Not a blocking decision — either reads fine as ambient
motion.

## Audio

Reuse default ambient track for v1.

## Closing message

"You spoke to yourself with more patience than usual. That's worth noticing — and worth doing
again."

## Content guardrails

- Never validate the self-critical thought's content ("you're right that...") — validate the
  *feeling* of struggling, not the criticism itself.
- Avoid toxic-positivity phrasing ("just love yourself!") — the script should model a specific,
  concrete act of kindness (what you'd say to a friend), not just assert self-love as a fact.
- Don't turn step 5–6 into a demand — if someone doesn't have an answer, the ritual should still
  feel complete; this is a prompt to consider, not a task to fail.

## Acceptance criteria

- Selecting this theme changes: input prompt, message script, palette/background (`sunset`), pacing
  (20% slower ascent), and closing message.
- The default theme's behavior is unchanged.
