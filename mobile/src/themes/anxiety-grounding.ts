import type { Theme } from './types';

// From planning/themes/anxiety-grounding.md.
export const anxietyGrounding: Theme = {
  id: 'anxiety-grounding',
  title: 'Anxiety & Grounding',
  subtitle: 'Paced breathing and grounding for a racing mind',
  prompt: "What's making your chest feel tight?",
  messages: [
    "Let's slow down together.",
    'Breathe in for four...',
    '...hold for four...',
    '...and out for six.',
    'Notice five things you can see around you.',
    'Notice four things you can hear.',
    'Notice three things you can feel — the ground, your clothes, your breath.',
    'You are here.',
    'You are safe right now, in this moment.',
    'Your breathing is slowing.',
    "The feeling is still real. You're just not alone with it.",
    "Let's breathe in again, for four...",
    '...and out, for six.',
  ],
  // Per-message durations (ms), same order as `messages` — synced to the
  // actual breath count (4s in / 4s hold / 6s out) rather than the generic
  // rotation interval every other theme uses. See planning/themes/anxiety-grounding.md's
  // Pacing section.
  messageDurations: [4000, 4000, 4000, 6000, 6000, 5000, 6000, 3000, 4000, 4000, 5000, 4000, 6000],
  closingMessage: "Your breathing has slowed. The feeling may still be here, and that's okay — you're steadier than you were a few minutes ago.",
  releaseStyle: 'sink-down',
  // ~30% slower than the default — anxiety responds better to "settle down"
  // than a quick release. Edit any of these directly to retune this theme's
  // pacing.
  timing: {
    afterSubmitDelay: 5200,
    beforeShrinkDelay: 3900,
    shrinkDuration: 78000,
    driftDuration: 33800,
    messageReadDelay: 6110,
    overlayDelay: 1300,
  },
  palette: {
    glowOuter: '#1e3a5f',
    glowInner: '#2f6690',
    core: '#e8f1f5',
    background: '#0a1523',
  },
  backgroundAsset: 'waterdrop',
  built: true,
  badge: 'Grounding',
};
