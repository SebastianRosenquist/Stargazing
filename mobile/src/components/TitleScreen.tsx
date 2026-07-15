import React from 'react';
import { StyleSheet, Text } from 'react-native';
import Animated, { useAnimatedStyle, type SharedValue } from 'react-native-reanimated';

// Ported from `.mainTitle` / `.title` / `.sub-title` / `.custom-message-username`.
type Props = {
  opacity: SharedValue<number>;
  authorName: string | null;
};

export function TitleScreen({ opacity, authorName }: Props) {
  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View style={[styles.container, animatedStyle]} pointerEvents="none">
      <Text style={styles.title}>Stargazing</Text>
      <Text style={styles.subtitle}>A small star to help clear your mind</Text>
      {authorName ? <Text style={styles.subtitle}>Meditation Created By: {authorName}</Text> : null}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    alignItems: 'center',
    transform: [{ translateY: -120 }],
  },
  title: {
    color: '#fff',
    fontSize: 80,
    textAlign: 'center',
  },
  subtitle: {
    color: '#fff',
    fontSize: 25,
    textAlign: 'center',
    marginTop: 8,
  },
});
