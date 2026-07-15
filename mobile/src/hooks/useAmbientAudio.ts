import { useEffect } from 'react';
import { useAudioPlayer } from 'expo-audio';

const AMBIENT_TRACK = require('../../assets/media/small-memory.mp3');

// Ported from the original's single <audio class="audio" loop> element
// (media/Small Memory.mp3 is the only track actually wired into the page).
export function useAmbientAudio() {
  const player = useAudioPlayer(AMBIENT_TRACK);

  useEffect(() => {
    player.loop = true;
    try {
      player.play();
    } catch (err) {
      console.log('Ambient audio failed to start', err);
    }
  }, [player]);
}
