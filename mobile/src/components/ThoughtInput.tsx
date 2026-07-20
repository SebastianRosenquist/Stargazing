import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput } from 'react-native';
import Animated, { useAnimatedStyle, type SharedValue } from 'react-native-reanimated';

// Ported from `.typeHere` / `.submit` (input placeholder "What's bothering
// you?..." + a "Done" button). Unlike the original's keyCode === 13 handler,
// Enter no longer submits here — the input is multiline so Enter just adds a
// newline, and "Done" is the only way to submit. This also lets people
// dismiss the keyboard (tap outside, or the OS back/dismiss gesture) without
// accidentally triggering the star animation.
type Props = {
  opacity: SharedValue<number>;
  onSubmit: (text: string) => void;
  onDraftChange: (text: string) => void;
};

export function ThoughtInput({ opacity, onSubmit, onDraftChange }: Props) {
  const [value, setValue] = useState('');

  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  const handleChangeText = (text: string) => {
    setValue(text);
    onDraftChange(text);
  };

  const handleSubmit = () => {
    if (!value.trim()) return;
    onSubmit(value);
    setValue('');
    onDraftChange('');
  };

  return (
    <Animated.View style={[styles.container, animatedStyle]} pointerEvents="box-none">
      <TextInput
        value={value}
        onChangeText={handleChangeText}
        placeholder="What's bothering you?..."
        placeholderTextColor="#888"
        style={styles.input}
        multiline
        numberOfLines={3}
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
    bottom: 24,
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
    minHeight: 48,
    maxHeight: 90,
    fontSize: 16,
    color: '#000',
    textAlignVertical: 'top',
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
