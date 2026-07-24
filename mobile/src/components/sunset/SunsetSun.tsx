import React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, type SharedValue } from 'react-native-reanimated';
import { Canvas, Circle, BlurMask } from '@shopify/react-native-skia';
import type { ThemePalette } from '../../themes/types';

// The sun IS this theme's "star" — mirrors MainStar.tsx's glow technique
// (3 concentric Skia circles, blurred) and its exact wrapper-nesting pattern
// (the typed thought as a sibling Text inside the same transformed
// Animated.View), so the thought visually moves and fades with the sun as it
// sets. Solid white core (rather than palette.core) to match the reference's
// literal white sun.
type Props = {
  palette: ThemePalette;
  sunCenterX: number;
  sunCenterY: SharedValue<number>;
  sunScale: SharedValue<number>;
  horizonY: number;
  diameter: number;
  glowPadding: number;
  thoughtText: string;
  thoughtTextOpacity: SharedValue<number>;
};

export function SunsetSun({
  palette,
  sunCenterX,
  sunCenterY,
  sunScale,
  horizonY,
  diameter,
  glowPadding,
  thoughtText,
  thoughtTextOpacity,
}: Props) {
  const canvasSize = diameter + glowPadding * 2;

  const wrapperStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: sunCenterY.value - canvasSize / 2 }, { scale: sunScale.value }],
  }));

  const textStyle = useAnimatedStyle(() => ({ opacity: thoughtTextOpacity.value }));

  return (
    // Clips the sun out of view once it descends below the horizon — the
    // equivalent of the CSS's `.sun-container { height: 50%; overflow: hidden }`.
    <View style={[styles.skyClip, { height: horizonY }]} pointerEvents="none">
      <Animated.View
        style={[styles.wrapper, { left: sunCenterX - canvasSize / 2, width: canvasSize, height: canvasSize }, wrapperStyle]}
      >
        <Canvas style={StyleSheet.absoluteFill}>
          <Circle cx={canvasSize / 2} cy={canvasSize / 2} r={diameter / 2 + 10} color={palette.glowOuter} opacity={0.5}>
            <BlurMask blur={diameter * 0.15} style="normal" />
          </Circle>
          <Circle cx={canvasSize / 2} cy={canvasSize / 2} r={diameter / 2} color={palette.glowInner} opacity={0.45}>
            <BlurMask blur={diameter * 0.08} style="normal" />
          </Circle>
          <Circle cx={canvasSize / 2} cy={canvasSize / 2} r={diameter / 2 - diameter * 0.03} color="white" />
        </Canvas>
        <Animated.Text style={[styles.thoughtText, textStyle]} numberOfLines={5}>
          {thoughtText}
        </Animated.Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  skyClip: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    overflow: 'hidden',
  },
  wrapper: {
    position: 'absolute',
    top: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  thoughtText: {
    color: '#000',
    textAlign: 'center',
    paddingHorizontal: 28,
    fontSize: 16,
    fontFamily: 'Quicksand_400Regular',
  },
});
