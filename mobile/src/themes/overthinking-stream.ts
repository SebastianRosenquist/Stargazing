import type { Theme } from './types';

// From planning/themes/overthinking-leaves-on-a-stream.md. Not built yet —
// shown as a disabled "Coming soon" card in the picker. The multi-thought-loop
// mechanic (cap at 3) is an open question in the brief and is not implemented
// here; this carries the single-pass script only.
export const overthinkingStream: Theme = {
  id: 'overthinking-stream',
  title: 'Overthinking',
  subtitle: 'Watch a looping thought drift past, like a cloud',
  prompt: 'What thought keeps circling back?',
  messages: [
    'Picture a wide, open sky, and clouds drifting across it.',
    'Put the thought on a cloud.',
    "Watch it drift. You don't need to push it or pull it back.",
    "You're not arguing with the thought. You're just watching it pass.",
    "If your mind follows it across the sky, that's okay — just notice, and come back to watching.",
    'The sky keeps moving whether you follow the thought or not.',
    'You can let this one drift on by.',
  ],
  closingMessage: "You watched a few thoughts pass without chasing them. That's the whole skill — you can do it again any time one starts circling.",
  releaseStyle: 'float-downstream',
  palette: {
    glowOuter: '#5a9fd0',
    glowInner: '#9cc9e8',
    core: '#f5fbff',
    background: '#dceffa',
  },
  backgroundAsset: 'clouds',
  built: false,
  badge: 'Coming soon',
};
