import React from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';

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
  useAmbientAudio();

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
  } = useStarLifecycle();

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
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
            thoughtText={thoughtText}
            thoughtTextOpacity={thoughtTextOpacity}
          />
          <MessageRotator active={rotateMessages} messages={messages} containerOpacity={messageOpacity} />
        </>
      ) : null}

      {phase === 'awaitingThought' ? (
        <ThoughtInput opacity={inputOpacity} onSubmit={submitThought} />
      ) : null}

      {phase === 'done' ? <ThankYouOverlay /> : null}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#090a0f',
  },
});
