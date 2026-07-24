import { useEffect, useState } from 'react';
import * as Linking from 'expo-linking';
import { decode } from 'base-64';
import { getTheme } from '../themes';
import type { Theme } from '../themes/types';

// Ported from JS/message.js's loadLink(): a shared meditation is passed as
// `?m=<base64 JSON array>` (last array entry is the author name) via a deep
// link into the app instead of the original's `#m=` URL hash.
//
// `status` exists so the app can wait for the (async) initial-URL check
// before deciding whether to show the theme picker — without it there'd be a
// visible picker-flash on deep-link opens. `customTheme` is an ad-hoc Theme
// (not one of the picker's THEMES) built from the shared messages, so the
// ritual screen has a single "read the active theme" code path regardless of
// how it was chosen.
export type CustomMeditationStatus = 'pending' | 'default' | 'custom';

export function useCustomMeditation() {
  const [status, setStatus] = useState<CustomMeditationStatus>('pending');
  const [authorName, setAuthorName] = useState<string | null>(null);
  const [customTheme, setCustomTheme] = useState<Theme | null>(null);

  useEffect(() => {
    const resolveNoLink = () => setStatus((current) => (current === 'pending' ? 'default' : current));

    const applyLink = (url: string | null) => {
      if (!url) {
        resolveNoLink();
        return;
      }
      const encoded = Linking.parse(url).queryParams?.m;
      if (typeof encoded !== 'string') {
        resolveNoLink();
        return;
      }
      try {
        const payload = JSON.parse(decode(encoded)) as string[];
        const custom = [...payload];
        const name = custom.pop();
        if (custom.length > 0) {
          setAuthorName(name ?? null);
          setCustomTheme({ ...getTheme('stress-perspective'), messages: custom });
          setStatus('custom');
          return;
        }
      } catch (err) {
        console.log('Invalid meditation link', err);
      }
      resolveNoLink();
    };

    Linking.getInitialURL().then(applyLink);
    const subscription = Linking.addEventListener('url', (event) => applyLink(event.url));
    return () => subscription.remove();
  }, []);

  return { status, authorName, customTheme };
}
