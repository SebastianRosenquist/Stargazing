import { useCallback } from 'react';
import { useAudioPlayer } from 'expo-audio';

const AMBIENT_TRACK = require('../../assets/media/small-memory.mp3');

// Every theme so far reuses this one track (see each theme's brief) — a
// per-theme `ambientTrackId` -> asset map can be added here once a theme
// actually specifies a different track.
const DEFAULT_TRACK = AMBIENT_TRACK;

// Plays once per "Done" press (not looped, not replayed until the next
// submission), starting from the beginning each time in case a previous
// play is still mid-track.
export function useAmbientAudio(trackId?: string) {
  const player = useAudioPlayer(DEFAULT_TRACK);

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
