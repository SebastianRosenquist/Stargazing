import { DEFAULT_MESSAGES } from '../constants/messages';
import type { Theme } from './types';

// The existing, original ritual — ported verbatim from TitleScreen.tsx,
// ThoughtInput.tsx, MainStar.tsx, and ThankYouOverlay.tsx's current hardcoded
// values. This theme's behavior must stay byte-for-byte identical to the app
// pre-theming.
export const stressPerspective: Theme = {
  id: 'stress-perspective',
  title: 'Stargazing',
  subtitle: 'A small star to help clear your mind',
  prompt: "What's bothering you?...",
  messages: DEFAULT_MESSAGES,
  closingMessage: 'I hope you feel a little less stressed,\na little more connected,\nand just more at peace.',
  releaseStyle: 'drift-away',
  palette: {
    glowOuter: 'tomato',
    glowInner: 'orange',
    core: '#dddddd',
    background: '#090a0f',
  },
  built: true,
  badge: 'Original',
};
