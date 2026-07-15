import { useEffect, useState } from 'react';
import * as Linking from 'expo-linking';
import { decode } from 'base-64';
import { DEFAULT_MESSAGES } from '../constants/messages';

// Ported from JS/message.js's loadLink(): a shared meditation is passed as
// `?m=<base64 JSON array>` (last array entry is the author name) via a deep
// link into the app instead of the original's `#m=` URL hash.
export function useCustomMeditation() {
  const [messages, setMessages] = useState<string[]>(DEFAULT_MESSAGES);
  const [authorName, setAuthorName] = useState<string | null>(null);

  useEffect(() => {
    const applyLink = (url: string | null) => {
      if (!url) return;
      const encoded = Linking.parse(url).queryParams?.m;
      if (typeof encoded !== 'string') return;
      try {
        const payload = JSON.parse(decode(encoded)) as string[];
        const custom = [...payload];
        const name = custom.pop();
        if (custom.length > 0) {
          setMessages(custom);
          setAuthorName(name ?? null);
        }
      } catch (err) {
        console.log('Invalid meditation link', err);
      }
    };

    Linking.getInitialURL().then(applyLink);
    const subscription = Linking.addEventListener('url', (event) => applyLink(event.url));
    return () => subscription.remove();
  }, []);

  return { messages, authorName };
}
