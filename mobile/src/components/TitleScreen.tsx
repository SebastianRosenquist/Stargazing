import React from 'react';
import { StyleSheet, Text } from 'react-native';
import Animated, { useAnimatedStyle, type SharedValue } from 'react-native-reanimated';

// Ported from `.mainTitle` / `.title` / `.sub-title` / `.custom-message-username`.
type Props = {
  title: string;
  subtitle: string;
  opacity: SharedValue<number>;
  authorName: string | null;
};

export function TitleScreen({ title, subtitle, opacity, authorName }: Props) {
  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View style={[styles.container, animatedStyle]} pointerEvents="none">
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
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
    fontFamily: 'Quicksand_500Medium',
  },
  subtitle: {
    color: '#fff',
    fontSize: 25,
    textAlign: 'center',
    marginTop: 8,
    fontFamily: 'Quicksand_400Regular',
  },
});
