import React from 'react';
import { StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, type SharedValue } from 'react-native-reanimated';
import { useMessageRotation } from '../hooks/useMessageRotation';

type Props = {
  active: boolean;
  messages: string[];
  containerOpacity: SharedValue<number>;
  defaultPrompt: string;
  rotateInterval: number;
  fadeDuration: number;
};

export function MessageRotator({ active, messages, containerOpacity, defaultPrompt, rotateInterval, fadeDuration }: Props) {
  const { text, textOpacity } = useMessageRotation(messages, active, defaultPrompt, rotateInterval, fadeDuration);

  const containerStyle = useAnimatedStyle(() => ({ opacity: containerOpacity.value }));
  const textStyle = useAnimatedStyle(() => ({ opacity: textOpacity.value }));

  return (
    <Animated.View style={[styles.container, containerStyle]} pointerEvents="none">
      <Animated.Text style={[styles.text, textStyle]}>{text}</Animated.Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: '20%',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  text: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 30,
    maxWidth: 320,
    fontFamily: 'Quicksand_400Regular',
  },
});
