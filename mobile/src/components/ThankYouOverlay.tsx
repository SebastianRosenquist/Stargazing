import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

// Ported from `.overlay` / `.title-done` / `.done2` (the newsletter signup
// and online-therapy affiliate CTA in the original are dead/commented-out
// code and are intentionally not ported here).
type Props = {
  closingMessage: string;
  onRestart: () => void;
};

export function ThankYouOverlay({ closingMessage, onRestart }: Props) {
  return (
    <View style={styles.overlay}>
      <Text style={styles.message}>{closingMessage}</Text>
      <Text style={styles.credit}>
        Made with <Text style={styles.heart}>{'<3'}</Text> by Sebsen
      </Text>
      <Pressable style={styles.button} onPress={onRestart}>
        <Text style={styles.buttonText}>Enter a new thought</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: '50%',
    left: '10%',
    right: '10%',
    borderRadius: 20,
    padding: 32,
    backgroundColor: 'rgba(0,0,0,0.2)',
    transform: [{ translateY: -100 }],
    alignItems: 'center',
  },
  message: {
    color: '#fff',
    fontSize: 26,
    textAlign: 'center',
    lineHeight: 34,
    fontFamily: 'Quicksand_400Regular',
  },
  credit: {
    color: '#fff',
    opacity: 0.5,
    fontSize: 16,
    marginTop: 24,
    fontFamily: 'Quicksand_400Regular',
  },
  heart: {
    color: 'red',
  },
  button: {
    marginTop: 24,
    backgroundColor: '#a7582c',
    borderRadius: 15,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '300',
    letterSpacing: 1,
    textTransform: 'uppercase',
    fontFamily: 'Quicksand_300Light',
  },
});
