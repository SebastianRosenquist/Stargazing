import type { Theme } from './types';

// From planning/themes/self-compassion.md. Subtitle is implementer-synthesized
// from the brief's Goal section (no literal one-line subtitle exists there) —
// flagged for a copy pass later.
export const selfCompassion: Theme = {
  id: 'self-compassion',
  title: 'Self-Compassion',
  subtitle: 'A gentler way to talk back to a hard thought',
  prompt: 'What did you just tell yourself?',
  messages: [
    "That's a hard thing to say to yourself.",
    "Let's just be with that for a second, instead of rushing past it.",
    'Notice how that feels, without making it bigger or smaller than it is.',
    'This is a moment of difficulty, and difficulty is part of every life — including yours.',
    "You're not the only person who's ever felt this way about themselves.",
    'Somewhere right now, someone else is being just as hard on themselves.',
    "Struggling like this doesn't make you a failure — it makes you human.",
    'If a friend told you they felt this way, what would you say to them?',
    "Maybe something like: 'that sounds really hard' or 'you're doing better than you think.'",
    'Try saying that to yourself now.',
    "You deserve the same kindness you'd give someone you love.",
    'Put a hand over your heart, if that helps it land.',
    'You can be imperfect and still be worthy of your own patience.',
    "This feeling will pass. You don't have to fix it right now — just be kind while it's here.",
  ],
  closingMessage: "You spoke to yourself with more patience than usual. That's worth noticing — and worth doing again.",
  releaseStyle: 'set-behind-horizon',
  ambientTrackId: 'terrible-times-reprise',
  // Sized so the post-submit sequence (message rotation through the closing
  // overlay) totals ~98.17s — the exact length of
  // assets/media/terrible-times-reprise.mp3 — so the song finishes right as
  // the ritual ends, instead of being cut off or leaving dead air.
  // Proportions are otherwise the same ~20%-slower-than-default shape as
  // before; edit any field directly to retune this theme's pacing (and adjust
  // the total to match if the track ever changes).
  timing: {
    afterSubmitDelay: 3978,
    beforeShrinkDelay: 2984,
    shrinkDuration: 59677,
    driftDuration: 25860,
    messageReadDelay: 4675,
    overlayDelay: 995,
    messageRotateInterval: 6000
  },
  palette: {
    glowOuter: '#be91c6',
    glowInner: '#fea798',
    core: '#fff3e8',
    background: '#2a1a33',
  },
  // Renders via SunsetScene (mobile/src/components/sunset/) instead of the
  // generic Starfield/MainStar — see RitualScreen's backgroundAsset branch.
  backgroundAsset: 'sunset',
  built: true,
  badge: 'The gentlest',
};
