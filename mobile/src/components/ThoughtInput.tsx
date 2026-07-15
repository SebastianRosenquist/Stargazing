import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput } from 'react-native';
import Animated, { useAnimatedStyle, type SharedValue } from 'react-native-reanimated';

// Ported from `.typeHere` / `.submit` (input placeholder "What's bothering
// you?..." + a "Done" button; Enter/return submits, matching the original's
// keyCode === 13 handler).
type Props = {
  opacity: SharedValue<number>;
  onSubmit: (text: string) => void;
};

export function ThoughtInput({ opacity, onSubmit }: Props) {
  const [value, setValue] = useState('');

  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  const handleSubmit = () => {
    if (!value.trim()) return;
    onSubmit(value);
    setValue('');
  };

  return (
    <Animated.View style={[styles.container, animatedStyle]} pointerEvents="box-none">
      <TextInput
        value={value}
        onChangeText={setValue}
        placeholder="What's bothering you?..."
        placeholderTextColor="#888"
        style={styles.input}
        returnKeyType="done"
        onSubmitEditing={handleSubmit}
      />
      <Pressable style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Done</Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: '10%',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 15,
    paddingVertical: 12,
    paddingHorizontal: 20,
    width: 300,
    fontSize: 16,
    color: '#000',
  },
  button: {
    marginTop: 16,
    backgroundColor: '#a7582c',
    borderRadius: 15,
    paddingVertical: 12,
    paddingHorizontal: 40,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '300',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
});
