import { useCallback, useEffect, useRef, useState } from 'react';
import { Easing, useSharedValue, withTiming } from 'react-native-reanimated';

// Timings and margin deltas ported directly from JS/message.js's showStar(),
// disappearTitle(), initializeDisappear(), makeStarDisappear(), and resizeStar().
const STAR_REVEAL_DELAY = 7000;
const TITLE_FADE_START = 5000;
const TITLE_FADE_DURATION = 4000;
const TITLE_REMOVE_DELAY = 9000;
const AFTER_SUBMIT_DELAY = 4000; // initializeDisappear -> makeStarDisappear
const BEFORE_SHRINK_DELAY = 3000; // makeStarDisappear -> resizeStar
const SHRINK_DURATION = 60000;
const DRIFT_DURATION = 26000;
const OVERLAY_DELAY = 1000;

// CSS .mainStar: 300x300px, margin-left -170px/-25px, margin-top -150px/-175px/-1000px.
// Converted to translate deltas from the centered resting position.
const STAR_SIZE = 300;
const SHRINK_TRANSLATE_X = 145; // margin-left: -170 -> -25
const SHRINK_TRANSLATE_Y = -25; // margin-top: -150 -> -175
const DRIFT_TRANSLATE_Y = -825; // margin-top: -175 -> -1000
const SHRINK_SCALE = 4 / STAR_SIZE;

export type LifecyclePhase = 'intro' | 'awaitingThought' | 'submitted' | 'done';

export function useStarLifecycle() {
  const [phase, setPhase] = useState<LifecyclePhase>('intro');
  const [titleVisible, setTitleVisible] = useState(true);
  const [rotateMessages, setRotateMessages] = useState(false);
  const [thoughtText, setThoughtText] = useState('');

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
          starScale.value = withTiming(SHRINK_SCALE, { duration: SHRINK_DURATION, easing: Easing.linear });
          starTranslateX.value = withTiming(SHRINK_TRANSLATE_X, { duration: SHRINK_DURATION, easing: Easing.linear });
          starTranslateY.value = withTiming(SHRINK_TRANSLATE_Y, { duration: SHRINK_DURATION, easing: Easing.linear });

          schedule(() => {
            starTranslateY.value = withTiming(SHRINK_TRANSLATE_Y + DRIFT_TRANSLATE_Y, {
              duration: DRIFT_DURATION,
              easing: Easing.linear,
            });

            schedule(() => {
              setRotateMessages(false);
              messageOpacity.value = withTiming(0, { duration: 1000 });
              schedule(() => setPhase('done'), OVERLAY_DELAY);
            }, DRIFT_DURATION);
          }, SHRINK_DURATION);
        }, BEFORE_SHRINK_DELAY);
      }, AFTER_SUBMIT_DELAY);
    },
    [phase, schedule, starScale, starTranslateX, starTranslateY, messageOpacity, thoughtTextOpacity, inputOpacity]
  );

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
  };
}
