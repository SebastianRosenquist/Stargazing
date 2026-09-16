import { useEffect, useRef, useState } from 'react';
import { useSharedValue, withTiming } from 'react-native-reanimated';

// Extracted from MessageRotator.tsx (ported from JS/message.js's
// displayMessages()/makeStarDisappear()) so a second, differently-positioned
// consumer (the sunset scene's water-positioned messages) can reuse the exact
// same rotation/fade behavior instead of duplicating it.
const RELAX_MESSAGE = 'Relax and watch your thought';

// Defaults match every theme's current behavior — callers pass a theme's
// resolved `timing.messageRotateInterval`/`messageFadeDuration` explicitly;
// these only cover call sites that don't.
export function useMessageRotation(
  messages: string[],
  active: boolean,
  defaultPrompt: string,
  rotateIntervalMs = 4700,
  fadeDurationMs = 500,
  // Optional per-message duration overrides (ms), same length/order as
  // `messages` — e.g. paced-breathing scripts where "hold for four" needs to
  // actually last 4s rather than the theme's generic rotation interval.
  // Falls back to `rotateIntervalMs` for any message without one (including
  // every caller that omits this param entirely).
  durations?: number[]
) {
  const [text, setText] = useState(defaultPrompt);
  const textOpacity = useSharedValue(1);
  const indexRef = useRef(0);
  const hasStartedRef = useRef(false);

  useEffect(() => {
    if (!active) {
      // Only reset to the default prompt before rotation has ever started.
      // Once it has run, leave the last message visible instead of
      // snapping back to the prompt when rotation stops at the end.
      if (!hasStartedRef.current) {
        setText(defaultPrompt);
        indexRef.current = 0;
      }
      return;
    }
    hasStartedRef.current = true;
    setText(RELAX_MESSAGE);
    indexRef.current = 0;

    // A self-rescheduling timeout chain (rather than a fixed setInterval) so
    // each message can hold the screen for its own duration when `durations`
    // is provided; with no `durations`, this collapses to the same fixed
    // cadence the old setInterval produced.
    let timeoutId: ReturnType<typeof setTimeout>;

    const tick = () => {
      const currentDuration = durations?.[indexRef.current % durations.length] ?? rotateIntervalMs;

      timeoutId = setTimeout(() => {
        textOpacity.value = withTiming(0, { duration: fadeDurationMs });
        setTimeout(() => {
          const next = messages[indexRef.current % messages.length];
          indexRef.current += 1;
          setText(next);
          textOpacity.value = withTiming(1, { duration: fadeDurationMs });
          tick();
        }, fadeDurationMs);
      }, currentDuration);
    };

    tick();

    return () => clearTimeout(timeoutId);
  }, [active, messages, textOpacity, rotateIntervalMs, fadeDurationMs, defaultPrompt, durations]);

  return { text, textOpacity };
}
