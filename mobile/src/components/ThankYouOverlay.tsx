import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

// Ported from `.overlay` / `.title-done` / `.done2` (the newsletter signup
// and online-therapy affiliate CTA in the original are dead/commented-out
// code and are intentionally not ported here).
export function ThankYouOverlay() {
  return (
    <View style={styles.overlay}>
      <Text style={styles.message}>
        I hope you feel a little less stressed,{'\n'}a little more connected,{'\n'}and just more at peace.
      </Text>
      <Text style={styles.credit}>
        Made with <Text style={styles.heart}>{'<3'}</Text> by Sebsen
      </Text>
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
  },
  credit: {
    color: '#fff',
    opacity: 0.5,
    fontSize: 16,
    marginTop: 24,
  },
  heart: {
    color: 'red',
  },
});
