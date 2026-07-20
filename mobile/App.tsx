import React, { useEffect, useState } from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, Pressable, StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { withTiming } from 'react-native-reanimated';

import { Starfield } from './src/components/Starfield';
import { TitleScreen } from './src/components/TitleScreen';
import { MainStar } from './src/components/MainStar';
import { MessageRotator } from './src/components/MessageRotator';
import { ThoughtInput } from './src/components/ThoughtInput';
import { ThankYouOverlay } from './src/components/ThankYouOverlay';
import { useStarLifecycle } from './src/hooks/useStarLifecycle';
import { useAmbientAudio } from './src/hooks/useAmbientAudio';
import { useCustomMeditation } from './src/hooks/useCustomMeditation';

export default function App() {
  const { messages, authorName } = useCustomMeditation();
  const { play: playAmbientAudio } = useAmbientAudio();
  const [draftText, setDraftText] = useState('');

  const {
    phase,
    titleVisible,
    titleOpacity,
    starOpacity,
    inputOpacity,
    messageOpacity,
    thoughtText,
    thoughtTextOpacity,
    starTranslateX,
    starTranslateY,
    starScale,
    rotateMessages,
    submitThought,
    restart,
    cycleKey,
  } = useStarLifecycle();

  // Mirror what's being typed onto the star in real time, so people can see
  // their thought forming there instead of only in the (keyboard-adjacent)
  // input box.
  useEffect(() => {
    if (phase !== 'awaitingThought') return;
    thoughtTextOpacity.value = withTiming(draftText.trim() ? 1 : 0, { duration: 200 });
  }, [draftText, phase, thoughtTextOpacity]);

  const handleSubmitThought = (text: string) => {
    playAmbientAudio();
    submitThought(text);
  };

  const handleRestart = () => {
    setDraftText('');
    restart();
  };

  const displayedThought = phase === 'awaitingThought' ? draftText : thoughtText;

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <Starfield />

      {titleVisible ? <TitleScreen opacity={titleOpacity} authorName={authorName} /> : null}

      {phase !== 'done' ? (
        <>
          <MainStar
            starOpacity={starOpacity}
            starScale={starScale}
            starTranslateX={starTranslateX}
            starTranslateY={starTranslateY}
            thoughtText={displayedThought}
            thoughtTextOpacity={thoughtTextOpacity}
          />
          <MessageRotator
            key={cycleKey}
            active={rotateMessages}
            messages={messages}
            containerOpacity={messageOpacity}
          />
        </>
      ) : null}

      {phase === 'awaitingThought' ? (
        <>
          {/* Sits above the Skia canvases (which can otherwise swallow
              touches natively before they reach a wrapping
              TouchableWithoutFeedback) so tapping anywhere outside the
              input reliably dismisses the keyboard without submitting.
              Rendered outside the KeyboardAvoidingView below so it covers
              the whole (static, never-shifting) screen. */}
          <Pressable style={StyleSheet.absoluteFill} onPress={Keyboard.dismiss} />
          {/* Only this bottom-anchored box grows when the keyboard opens —
              the star and everything above stays put. */}
          <KeyboardAvoidingView
            style={styles.inputAvoider}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            pointerEvents="box-none"
          >
            <ThoughtInput opacity={inputOpacity} onSubmit={handleSubmitThought} onDraftChange={setDraftText} />
          </KeyboardAvoidingView>
        </>
      ) : null}

      {phase === 'done' ? <ThankYouOverlay onRestart={handleRestart} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#090a0f',
  },
  inputAvoider: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
});
