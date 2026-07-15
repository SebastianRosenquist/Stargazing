import React from 'react';
import { StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, type SharedValue } from 'react-native-reanimated';
import { Canvas, Circle, BlurMask } from '@shopify/react-native-skia';

// Ported from CSS `.mainStar` (300x300 circle, background #ddd, layered
// box-shadow glow) and `.thought`/`.thoughtText` (the typed text shown on the
// star). The original used html2canvas to snapshot the text onto the star;
// RN just layers a <Text> over the Skia-drawn glow directly, no snapshot needed.
const STAR_SIZE = 300;
// CSS: top:50%, left:50%, margin-left:-170px, margin-top:-150px — a 20px
// leftward offset from true center that the original design also has.
const REST_OFFSET_X = -20;

type Props = {
  starOpacity: SharedValue<number>;
  starScale: SharedValue<number>;
  starTranslateX: SharedValue<number>;
  starTranslateY: SharedValue<number>;
  thoughtText: string;
  thoughtTextOpacity: SharedValue<number>;
};

export function MainStar({
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
      { translateX: REST_OFFSET_X + starTranslateX.value },
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
        <Circle cx={STAR_SIZE / 2} cy={STAR_SIZE / 2} r={STAR_SIZE / 2 + 10} color="tomato" opacity={0.55}>
          <BlurMask blur={30} style="normal" />
        </Circle>
        <Circle cx={STAR_SIZE / 2} cy={STAR_SIZE / 2} r={STAR_SIZE / 2} color="orange" opacity={0.5}>
          <BlurMask blur={18} style="normal" />
        </Circle>
        <Circle cx={STAR_SIZE / 2} cy={STAR_SIZE / 2} r={STAR_SIZE / 2 - 10} color="#dddddd" />
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
    width: STAR_SIZE,
    height: STAR_SIZE,
    marginLeft: -STAR_SIZE / 2,
    marginTop: -STAR_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  thoughtText: {
    color: '#000',
    textAlign: 'center',
    paddingHorizontal: 28,
    fontSize: 18,
  },
});
