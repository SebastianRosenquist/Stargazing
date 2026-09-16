import React, { useEffect } from 'react';
import { StyleSheet, useWindowDimensions } from 'react-native';
import { Canvas, Circle, Group, Oval, Path, Rect, LinearGradient, BlurMask, vec } from '@shopify/react-native-skia';
import { Easing, useDerivedValue, useSharedValue, withRepeat, withSequence, withTiming } from 'react-native-reanimated';
import { vmin } from '../sunset/palette';
import type { ThemePalette } from '../../themes/types';

// Ported from resources/waterdrop/waterdrop.css: a drop falls (accelerating,
// cubic-bezier(1,0,.91,.19)), lands, and a ripple expands and fades — looping
// forever. Ambient background for anxiety-grounding, mounted for the ritual's
// whole lifetime, matching Starfield.tsx's role for the default theme.
const FALL_DURATION = 2000;

// Zero-indexed positions in anxiety-grounding.ts's `messages`/`messageDurations`
// that are the paced-breathing lines — see planning/themes/anxiety-grounding.md.
const BREATHE_IN = [1, 11];
const HOLD = [2];
const BREATHE_OUT = [3, 12];

type Props = {
  active: boolean;
  messageDurations?: number[];
  palette: ThemePalette;
};

export function WaterdropBackground({ active, messageDurations, palette }: Props) {
  const { width, height } = useWindowDimensions();
  const waterY = height * 0.55;
  const dropX = width / 2;

  // Ambient drop: falls continuously regardless of ritual phase, same as the
  // CSS reference's unconditional infinite loop.
  const dropFall = useSharedValue(0);
  useEffect(() => {
    dropFall.value = withRepeat(withTiming(1, { duration: FALL_DURATION, easing: Easing.bezier(1, 0, 0.91, 0.19) }), -1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const dropStartY = waterY - vmin(28, width, height);
  const dropY = useDerivedValue(() => dropStartY + dropFall.value * (waterY - dropStartY), [dropFall, dropStartY, waterY]);
  const dropOpacity = useDerivedValue(() => (dropFall.value > 0.92 ? 0 : 1), [dropFall]);

  // Ambient ripple: a small, unsynced ring that plays right after each fall —
  // gives the background life while nothing is being timed to it (idle,
  // typing, or once release has finished rotating messages).
  const ambientRipple = useSharedValue(0);
  useEffect(() => {
    ambientRipple.value = withRepeat(
      withSequence(withTiming(0, { duration: FALL_DURATION }), withTiming(1, { duration: FALL_DURATION, easing: Easing.out(Easing.quad) })),
      -1
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const ambientRippleScale = useDerivedValue(() => 0.1 + ambientRipple.value * 0.9, [ambientRipple]);
  const ambientRippleOpacity = useDerivedValue(() => (active ? 0 : 1 - ambientRipple.value), [ambientRipple, active]);

  // Breath-synced ripple: expands through "breathe in", holds through "hold",
  // and grows further while fading through "and out" — so the water motion
  // and the breathing cue are the same signal, not two unrelated loops. Runs
  // for as long as the message script is rotating (`active`), looping back to
  // message 1 exactly like the text does.
  const breathRipple = useSharedValue(0);
  const breathOpacity = useSharedValue(0);

  useEffect(() => {
    if (!active || !messageDurations || messageDurations.length === 0) {
      breathRipple.value = 0;
      breathOpacity.value = 0;
      return;
    }

    const scaleSteps = messageDurations.map((duration, i) => {
      if (BREATHE_IN.includes(i)) return withTiming(0.45, { duration, easing: Easing.out(Easing.quad) });
      if (HOLD.includes(i)) return withTiming(0.45, { duration });
      if (BREATHE_OUT.includes(i)) return withTiming(1, { duration, easing: Easing.in(Easing.quad) });
      return withTiming(0, { duration });
    });
    const opacitySteps = messageDurations.map((duration, i) => {
      if (BREATHE_IN.includes(i)) return withTiming(0.9, { duration, easing: Easing.out(Easing.quad) });
      if (HOLD.includes(i)) return withTiming(0.9, { duration });
      if (BREATHE_OUT.includes(i)) return withTiming(0, { duration, easing: Easing.in(Easing.quad) });
      return withTiming(0, { duration });
    });

    breathRipple.value = withRepeat(withSequence(...scaleSteps), -1);
    breathOpacity.value = withRepeat(withSequence(...opacitySteps), -1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, messageDurations]);

  // vmin() is a plain (non-worklet) JS function — it must be called here, on
  // the JS thread, not from inside the useDerivedValue worklet below. Calling
  // a non-worklet import from a worklet is a no-op on web (where Reanimated
  // has no real thread split) but throws/crashes on native, where the
  // worklet genuinely runs on a separate UI-thread runtime — this is why the
  // bug didn't show up in browser testing.
  const breathRippleMinWidth = vmin(6, width, height);
  const breathRippleMaxGrowth = vmin(70, width, height);
  const breathRippleWidth = useDerivedValue(
    () => breathRippleMinWidth + breathRipple.value * breathRippleMaxGrowth,
    [breathRipple, breathRippleMinWidth, breathRippleMaxGrowth]
  );
  const breathRippleHeight = useDerivedValue(() => breathRippleWidth.value * 0.4, [breathRippleWidth]);
  const breathRippleX = useDerivedValue(() => dropX - breathRippleWidth.value / 2, [breathRippleWidth, dropX]);
  const breathRippleY = useDerivedValue(() => waterY - breathRippleHeight.value / 2, [breathRippleHeight, waterY]);
  const ambientRippleTransform = useDerivedValue(() => [{ scale: ambientRippleScale.value }], [ambientRippleScale]);

  return (
    <Canvas style={StyleSheet.absoluteFill}>
      <Rect x={0} y={0} width={width} height={height}>
        <LinearGradient start={vec(0, 0)} end={vec(0, height)} colors={[palette.background, palette.glowOuter]} />
      </Rect>

      {/* Falling drop + teardrop tail */}
      <Circle cx={dropX} cy={dropY} r={vmin(1.6, width, height)} color={palette.core} opacity={dropOpacity}>
        <BlurMask blur={1} style="normal" />
      </Circle>
      <Path
        path={`M ${dropX - vmin(1.6, width, height)} ${waterY - vmin(28, width, height)} L ${dropX + vmin(1.6, width, height)} ${
          waterY - vmin(28, width, height)
        } L ${dropX} ${waterY - vmin(31, width, height)} Z`}
        color={palette.core}
        opacity={dropOpacity}
      />

      {/* Ambient (unsynced) ripple */}
      <Group transform={ambientRippleTransform} origin={vec(dropX, waterY)} opacity={ambientRippleOpacity}>
        <Oval
          x={dropX - vmin(30, width, height) / 2}
          y={waterY - vmin(12, width, height) / 2}
          width={vmin(30, width, height)}
          height={vmin(12, width, height)}
          style="stroke"
          strokeWidth={2}
          color={palette.glowInner}
        >
          <BlurMask blur={1} style="normal" />
        </Oval>
      </Group>

      {/* Breath-synced ripple */}
      <Oval
        x={breathRippleX}
        y={breathRippleY}
        width={breathRippleWidth}
        height={breathRippleHeight}
        style="stroke"
        strokeWidth={2}
        color={palette.glowInner}
        opacity={breathOpacity}
      >
        <BlurMask blur={2} style="normal" />
      </Oval>
    </Canvas>
  );
}
