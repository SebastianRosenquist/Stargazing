import { useCallback } from 'react';
import { useAudioPlayer } from 'expo-audio';

const AMBIENT_TRACK = require('../../assets/media/small-memory.mp3');

// Plays once per "Done" press (not looped, not replayed until the next
// submission), starting from the beginning each time in case a previous
// play is still mid-track.
export function useAmbientAudio() {
  const player = useAudioPlayer(AMBIENT_TRACK);

  const play = useCallback(async () => {
    player.loop = false;
    try {
      await player.seekTo(0);
      player.play();
    } catch (err) {
      console.log('Ambient audio failed to start', err);
    }
  }, [player]);

  return { play };
}
