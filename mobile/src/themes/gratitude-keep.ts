import type { Theme } from './types';

// From planning/themes/gratitude-keep-dont-release.md. Not built yet — shown
// as a disabled "Coming soon" card in the picker. The brief's persistence
// question (whether to store a growing constellation across sessions) is
// unresolved, so the closing message uses the brief's stated no-persistence
// fallback rather than the {N}-count version.
export const gratitudeKeep: Theme = {
  id: 'gratitude-keep',
  title: 'Gratitude',
  subtitle: 'Keep a good moment instead of letting it go',
  prompt: "What's one good thing about today?",
  messages: [
    "What's one good thing about today? Big or small.",
    'Let it sit there for a moment.',
    'This one gets to stay.',
    "Look — it's not the only one.",
  ],
  closingMessage: "You've placed a moment worth keeping.",
  releaseStyle: 'stay-and-collect',
  palette: {
    glowOuter: '#b5705f',
    glowInner: '#e6b8a2',
    core: '#fff6ee',
    background: '#241328',
  },
  backgroundAsset: 'starfield',
  built: false,
  badge: 'Coming soon',
};
