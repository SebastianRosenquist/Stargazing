import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming, type SharedValue } from 'react-native-reanimated';

// Ported from JS/message.js's displayMessages()/makeStarDisappear(): shows
// the default prompt, then "Relax and watch your thought", then cycles the
// message list every 4700ms with a 500ms fade-out/fade-in.
const DEFAULT_PROMPT = 'Put a stressful thought in the star';
const RELAX_MESSAGE = 'Relax and watch your thought';
const ROTATE_INTERVAL_MS = 4700;
const FADE_DURATION = 500;

type Props = {
  active: boolean;
  messages: string[];
  containerOpacity: SharedValue<number>;
};

export function MessageRotator({ active, messages, containerOpacity }: Props) {
  const [text, setText] = useState(DEFAULT_PROMPT);
  const textOpacity = useSharedValue(1);
  const indexRef = useRef(0);

  useEffect(() => {
    if (!active) {
      setText(DEFAULT_PROMPT);
      indexRef.current = 0;
      return;
    }
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
  },
});
