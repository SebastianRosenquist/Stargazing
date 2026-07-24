import { useCallback, useEffect, useRef, useState } from 'react';
import { Easing, useSharedValue, withTiming } from 'react-native-reanimated';
import type { ReleaseStyle } from '../themes/types';

// Timings and margin deltas ported directly from JS/message.js's showStar(),
// disappearTitle(), initializeDisappear(), makeStarDisappear(), and resizeStar().
// Scaled by the active theme's `pacingMultiplier` (default 1, i.e. unchanged).
const STAR_REVEAL_DELAY = 7000;
const TITLE_FADE_START = 5000;
const TITLE_FADE_DURATION = 4000;
const TITLE_REMOVE_DELAY = 9000;
const AFTER_SUBMIT_DELAY = 4000; // initializeDisappear -> makeStarDisappear
const BEFORE_SHRINK_DELAY = 3000; // makeStarDisappear -> resizeStar
const SHRINK_DURATION = 60000;
const DRIFT_DURATION = 26000;
const MESSAGE_READ_DELAY = 4700; // let the final message stay fully visible before it fades
const OVERLAY_DELAY = 1000;

// 'drift-away' (the default): star shrinks straight down in the center (as if
// drifting away from the viewer), then drifts upward off-screen at the end.
const STAR_SIZE = 300;
const SHRINK_TRANSLATE_Y = -25;
const DRIFT_TRANSLATE_Y = -825;
const SHRINK_SCALE = 4 / STAR_SIZE;

// 'sink-down' (anxiety-grounding): star sinks gently downward and dims,
// instead of drifting up and away.
const SINK_TRANSLATE_Y = 60;
const SINK_FURTHER_TRANSLATE_Y = 260;

// 'float-downstream' (overthinking-stream): star drifts horizontally off one
// edge of the screen, carrying the thought with it.
const DOWNSTREAM_TRANSLATE_X = -900;

// 'stay-and-collect' (gratitude-keep): star rises slightly to "join a
// cluster" rather than disappearing — doesn't shrink away or fade out.
const STAY_RISE_TRANSLATE_Y = -40;

export type LifecyclePhase = 'intro' | 'awaitingThought' | 'submitted' | 'done';

type Options = {
  releaseStyle?: ReleaseStyle;
  pacingMultiplier?: number;
};

export function useStarLifecycle({ releaseStyle = 'drift-away', pacingMultiplier = 1 }: Options = {}) {
  const [phase, setPhase] = useState<LifecyclePhase>('intro');
  const [titleVisible, setTitleVisible] = useState(true);
  const [rotateMessages, setRotateMessages] = useState(false);
  const [thoughtText, setThoughtText] = useState('');
  const [cycleKey, setCycleKey] = useState(0);

  const titleOpacity = useSharedValue(1);
  const starOpacity = useSharedValue(0);
  const inputOpacity = useSharedValue(0);
  const messageOpacity = useSharedValue(0);
  const thoughtTextOpacity = useSharedValue(0);
  const starTranslateX = useSharedValue(0);
  const starTranslateY = useSharedValue(0);
  const starScale = useSharedValue(1);

  const timeouts = useRef<ReturnType<typeof setTimeout>[]>([]);
  const schedule = useCallback((fn: () => void, delay: number) => {
    const id = setTimeout(fn, delay);
    timeouts.current.push(id);
  }, []);

  const scaled = useCallback((ms: number) => ms * pacingMultiplier, [pacingMultiplier]);

  useEffect(() => {
    schedule(() => {
      titleOpacity.value = withTiming(0, { duration: TITLE_FADE_DURATION });
    }, TITLE_FADE_START);
    schedule(() => setTitleVisible(false), TITLE_REMOVE_DELAY);

    schedule(() => {
      setPhase('awaitingThought');
      starOpacity.value = withTiming(1, { duration: 3000 });
      inputOpacity.value = withTiming(1, { duration: 3000 });
      messageOpacity.value = withTiming(0.5, { duration: 3000 });
    }, STAR_REVEAL_DELAY);

    return () => {
      timeouts.current.forEach(clearTimeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const submitThought = useCallback(
    (text: string) => {
      if (phase !== 'awaitingThought') return;
      setPhase('submitted');
      setThoughtText(text);
      thoughtTextOpacity.value = withTiming(1, { duration: 500 });
      inputOpacity.value = withTiming(0, { duration: 500 });

      schedule(() => {
        setRotateMessages(true);

        schedule(() => {
          if (releaseStyle === 'sink-down') {
            starScale.value = withTiming(SHRINK_SCALE, { duration: scaled(SHRINK_DURATION), easing: Easing.linear });
            starTranslateY.value = withTiming(SINK_TRANSLATE_Y, { duration: scaled(SHRINK_DURATION), easing: Easing.linear });
          } else if (releaseStyle === 'float-downstream') {
            starScale.value = withTiming(SHRINK_SCALE, { duration: scaled(SHRINK_DURATION), easing: Easing.linear });
          } else if (releaseStyle === 'stay-and-collect') {
            starTranslateY.value = withTiming(STAY_RISE_TRANSLATE_Y, { duration: scaled(SHRINK_DURATION), easing: Easing.linear });
          } else {
            starScale.value = withTiming(SHRINK_SCALE, { duration: scaled(SHRINK_DURATION), easing: Easing.linear });
            starTranslateY.value = withTiming(SHRINK_TRANSLATE_Y, { duration: scaled(SHRINK_DURATION), easing: Easing.linear });
          }

          schedule(() => {
            if (releaseStyle === 'sink-down') {
              starTranslateY.value = withTiming(SINK_FURTHER_TRANSLATE_Y, { duration: scaled(DRIFT_DURATION), easing: Easing.linear });
              starOpacity.value = withTiming(0, { duration: scaled(DRIFT_DURATION), easing: Easing.linear });
            } else if (releaseStyle === 'float-downstream') {
              starTranslateX.value = withTiming(DOWNSTREAM_TRANSLATE_X, { duration: scaled(DRIFT_DURATION), easing: Easing.linear });
            } else if (releaseStyle === 'stay-and-collect') {
              // Star holds in place, joining the (not-yet-persisted) cluster — no further motion.
            } else {
              starTranslateY.value = withTiming(SHRINK_TRANSLATE_Y + DRIFT_TRANSLATE_Y, {
                duration: scaled(DRIFT_DURATION),
                easing: Easing.linear,
              });
            }

            schedule(() => {
              setRotateMessages(false);

              schedule(() => {
                messageOpacity.value = withTiming(0, { duration: 1000 });
                schedule(() => setPhase('done'), OVERLAY_DELAY);
              }, MESSAGE_READ_DELAY);
            }, scaled(DRIFT_DURATION));
          }, scaled(SHRINK_DURATION));
        }, scaled(BEFORE_SHRINK_DELAY));
      }, scaled(AFTER_SUBMIT_DELAY));
    },
    [phase, schedule, scaled, releaseStyle, starScale, starTranslateX, starTranslateY, starOpacity, messageOpacity, thoughtTextOpacity, inputOpacity]
  );

  const restart = useCallback(() => {
    timeouts.current.forEach(clearTimeout);
    timeouts.current = [];

    setThoughtText('');
    setRotateMessages(false);
    setCycleKey((key) => key + 1);

    starTranslateX.value = 0;
    starTranslateY.value = 0;
    starScale.value = 1;
    thoughtTextOpacity.value = 0;
    messageOpacity.value = 0;
    inputOpacity.value = withTiming(1, { duration: 800 });
    starOpacity.value = withTiming(1, { duration: 800 });

    setPhase('awaitingThought');
  }, [starOpacity, starScale, starTranslateX, starTranslateY, messageOpacity, thoughtTextOpacity, inputOpacity]);

  return {
    phase,
    titleVisible,
    titleOpacity,
    starOpacity,
    inputOpacity,
    messageOpacity,
    thoughtText,
    thoughtTextOpacity,
    starTranslateX,
    starTranslateY,
    starScale,
    rotateMessages,
    submitThought,
    restart,
    cycleKey,
  };
}
