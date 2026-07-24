import React from 'react';
import { StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, type SharedValue } from 'react-native-reanimated';
import { Canvas, Circle, BlurMask } from '@shopify/react-native-skia';
import type { ThemePalette } from '../themes/types';

// Ported from CSS `.mainStar` (300x300 circle, background #ddd, layered
// box-shadow glow) and `.thought`/`.thoughtText` (the typed text shown on the
// star). The original used html2canvas to snapshot the text onto the star;
// RN just layers a <Text> over the Skia-drawn glow directly, no snapshot needed.
const STAR_SIZE = 300;
// The outer glow ring (radius STAR_SIZE/2 + 10) plus its 30px blur needs
// extra canvas room on every side, or the blur gets hard-clipped at the
// Canvas bounds and reads as a visible square around the star.
const GLOW_PADDING = 80;
const CANVAS_SIZE = STAR_SIZE + GLOW_PADDING * 2;

type Props = {
  palette: ThemePalette;
  starOpacity: SharedValue<number>;
  starScale: SharedValue<number>;
  starTranslateX: SharedValue<number>;
  starTranslateY: SharedValue<number>;
  thoughtText: string;
  thoughtTextOpacity: SharedValue<number>;
};

export function MainStar({
  palette,
  starOpacity,
  starScale,
  starTranslateX,
  starTranslateY,
  thoughtText,
  thoughtTextOpacity,
}: Props) {
  const wrapperStyle = useAnimatedStyle(() => ({
    opacity: starOpacity.value,
    transform: [
      { translateX: starTranslateX.value },
      { translateY: starTranslateY.value },
      { scale: starScale.value },
    ],
  }));

  const textStyle = useAnimatedStyle(() => ({
    opacity: thoughtTextOpacity.value,
  }));

  return (
    <Animated.View style={[styles.wrapper, wrapperStyle]} pointerEvents="none">
      <Canvas style={StyleSheet.absoluteFill}>
        <Circle cx={CANVAS_SIZE / 2} cy={CANVAS_SIZE / 2} r={STAR_SIZE / 2 + 10} color={palette.glowOuter} opacity={0.55}>
          <BlurMask blur={30} style="normal" />
        </Circle>
        <Circle cx={CANVAS_SIZE / 2} cy={CANVAS_SIZE / 2} r={STAR_SIZE / 2} color={palette.glowInner} opacity={0.5}>
          <BlurMask blur={18} style="normal" />
        </Circle>
        <Circle cx={CANVAS_SIZE / 2} cy={CANVAS_SIZE / 2} r={STAR_SIZE / 2 - 10} color={palette.core} />
      </Canvas>
      <Animated.Text style={[styles.thoughtText, textStyle]} numberOfLines={5}>
        {thoughtText}
      </Animated.Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: CANVAS_SIZE,
    height: CANVAS_SIZE,
    marginLeft: -CANVAS_SIZE / 2,
    marginTop: -CANVAS_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  thoughtText: {
    color: '#000',
    textAlign: 'center',
    paddingHorizontal: 28,
    fontSize: 18,
    fontFamily: 'Quicksand_400Regular',
  },
});
