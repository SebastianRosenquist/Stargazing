import { useEffect, useRef, useState } from 'react';
import { useSharedValue, withTiming } from 'react-native-reanimated';

// Extracted from MessageRotator.tsx (ported from JS/message.js's
// displayMessages()/makeStarDisappear()) so a second, differently-positioned
// consumer (the sunset scene's water-positioned messages) can reuse the exact
// same rotation/fade behavior instead of duplicating it.
const DEFAULT_PROMPT = 'Put a stressful thought in the star';
const RELAX_MESSAGE = 'Relax and watch your thought';
const ROTATE_INTERVAL_MS = 4700;
const FADE_DURATION = 500;

export function useMessageRotation(messages: string[], active: boolean) {
  const [text, setText] = useState(DEFAULT_PROMPT);
  const textOpacity = useSharedValue(1);
  const indexRef = useRef(0);
  const hasStartedRef = useRef(false);

  useEffect(() => {
    if (!active) {
      // Only reset to the default prompt before rotation has ever started.
      // Once it has run, leave the last message visible instead of
      // snapping back to the prompt when rotation stops at the end.
      if (!hasStartedRef.current) {
        setText(DEFAULT_PROMPT);
        indexRef.current = 0;
      }
      return;
    }
    hasStartedRef.current = true;
    setText(RELAX_MESSAGE);
    indexRef.current = 0;

    const interval = setInterval(() => {
      textOpacity.value = withTiming(0, { duration: FADE_DURATION });
      setTimeout(() => {
        const next = messages[indexRef.current % messages.length];
        indexRef.current += 1;
        setText(next);
        textOpacity.value = withTiming(1, { duration: FADE_DURATION });
      }, FADE_DURATION);
    }, ROTATE_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [active, messages, textOpacity]);

  return { text, textOpacity };
}
