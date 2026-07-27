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
    'Notice how that feels, without making it bigger or smaller than it is.',
    "You're not the only person who's ever felt this way about themselves.",
    "Struggling like this doesn't make you a failure — it makes you human.",
    'If a friend told you they felt this way, what would you say to them?',
    'Try saying that to yourself now.',
    "You deserve the same kindness you'd give someone you love.",
    'You can be imperfect and still be worthy of your own patience.',
  ],
  closingMessage: "You spoke to yourself with more patience than usual. That's worth noticing — and worth doing again.",
  releaseStyle: 'set-behind-horizon',
  // ~20% slower release than the default, so the sun's descent reads as an
  // unhurried "rising into gentler light" rather than a quick fade. Edit any
  // of these directly to retune this theme's pacing.
  timing: {
    afterSubmitDelay: 4800,
    beforeShrinkDelay: 3600,
    shrinkDuration: 72000,
    driftDuration: 31200,
    messageReadDelay: 5640,
    overlayDelay: 1200,
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
