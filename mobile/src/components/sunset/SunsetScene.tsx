import React, { useEffect } from 'react';
import { StyleSheet, Text, useWindowDimensions } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withDelay, withTiming, type SharedValue } from 'react-native-reanimated';
import type { LifecyclePhase } from '../../hooks/useStarLifecycle';
import { useMessageRotation } from '../../hooks/useMessageRotation';
import type { ThemePalette, ThemeTiming } from '../../themes/types';
import { SunsetLandscape } from './SunsetLandscape';
import { SunsetSun } from './SunsetSun';
import { vmin } from './palette';

type Props = {
  phase: LifecyclePhase;
  palette: ThemePalette;
  timing: ThemeTiming;
  thoughtText: string;
  thoughtTextOpacity: SharedValue<number>;
  messages: string[];
  defaultPrompt: string;
  rotateMessages: boolean;
  messageOpacity: SharedValue<number>;
};

// CSS default `ease` is cubic-bezier(0.25, 0.1, 0.25, 1); the reverse of
// cubic-bezier(x1,y1,x2,y2) is cubic-bezier(1-x2,1-y2,1-x1,1-y1) — this is
// that reversed curve, used to play the `rise` keyframe's shape backward.
const REVERSED_EASE = Easing.bezier(0.75, 0, 0.75, 0.9);

export function SunsetScene({
  phase,
  palette,
  timing,
  thoughtText,
  thoughtTextOpacity,
  messages,
  defaultPrompt,
  rotateMessages,
  messageOpacity,
}: Props) {
  const { width, height } = useWindowDimensions();
  const horizonY = height / 2;
  const sunCenterX = width * 0.6;
  const diameter = vmin(20, width, height);
  const glowPadding = vmin(6, width, height);
  const canvasSize = diameter + glowPadding * 2;

  const restCenterY = horizonY * 0.4;
  const setCenterY = horizonY + canvasSize;

  const sunCenterY = useSharedValue(restCenterY);
  const sunScale = useSharedValue(1);

  // One-shot descent, gated on submission — never starts while the user is
  // still typing, and runs across the same release window every other theme
  // uses for its shrink/drift, so pacing stays consistent (and this theme's
  // own exact timing lives in self-compassion.ts's `timing` field).
  useEffect(() => {
    if (phase !== 'submitted') return;
    const delay = timing.afterSubmitDelay + timing.beforeShrinkDelay;
    const duration = timing.shrinkDuration + timing.driftDuration;
    sunCenterY.value = withDelay(delay, withTiming(setCenterY, { duration, easing: REVERSED_EASE }));
    sunScale.value = withDelay(delay, withTiming(0.7, { duration }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  // Note: restart() reset is handled by RitualScreen remounting this whole
  // component via `key={cycleKey}` — that also clears useMessageRotation's
  // internal refs below, which a same-instance value reset couldn't reach.

  const { text: waterMessage, textOpacity: waterMessageOpacity } = useMessageRotation(
    messages,
    rotateMessages,
    defaultPrompt,
    timing.messageRotateInterval,
    timing.messageFadeDuration
  );
  const waterMessageStyle = useAnimatedStyle(() => ({ opacity: waterMessageOpacity.value * messageOpacity.value }));

  return (
    <>
      <SunsetLandscape sunCenterY={sunCenterY} sunCenterX={sunCenterX} />
      {phase !== 'done' ? (
        <SunsetSun
          palette={palette}
          sunCenterX={sunCenterX}
          sunCenterY={sunCenterY}
          sunScale={sunScale}
          horizonY={horizonY}
          diameter={diameter}
          glowPadding={glowPadding}
          thoughtText={thoughtText}
          thoughtTextOpacity={thoughtTextOpacity}
        />
      ) : null}
      {phase !== 'done' ? (
        <Animated.View style={[styles.waterMessage, { top: horizonY + vmin(14, width, height) }, waterMessageStyle]} pointerEvents="none">
          <Text style={styles.waterMessageText}>{waterMessage}</Text>
        </Animated.View>
      ) : null}
    </>
  );
}

const styles = StyleSheet.create({
  waterMessage: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  waterMessageText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 22,
    maxWidth: 300,
    fontFamily: 'Quicksand_400Regular',
    textShadowColor: 'rgba(0,0,0,0.4)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 6,
  },
});
