import React, { useEffect, useState } from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, Pressable, StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { withTiming } from 'react-native-reanimated';

import { Starfield } from '../components/Starfield';
import { TitleScreen } from '../components/TitleScreen';
import { MainStar } from '../components/MainStar';
import { MessageRotator } from '../components/MessageRotator';
import { ThoughtInput } from '../components/ThoughtInput';
import { ThankYouOverlay } from '../components/ThankYouOverlay';
import { useStarLifecycle } from '../hooks/useStarLifecycle';
import { useAmbientAudio } from '../hooks/useAmbientAudio';
import { useActiveTheme } from '../themes/ThemeProvider';
import { SunsetScene } from '../components/sunset/SunsetScene';

type Props = {
  authorName: string | null;
};

export function RitualScreen({ authorName }: Props) {
  const { theme } = useActiveTheme();
  const { play: playAmbientAudio } = useAmbientAudio(theme.ambientTrackId);
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
  } = useStarLifecycle({ releaseStyle: theme.releaseStyle, pacingMultiplier: theme.pacingMultiplier });

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

      {theme.backgroundAsset === 'sunset' ? (
        <SunsetScene
          key={cycleKey}
          phase={phase}
          palette={theme.palette}
          pacingMultiplier={theme.pacingMultiplier}
          thoughtText={displayedThought}
          thoughtTextOpacity={thoughtTextOpacity}
          messages={theme.messages}
          rotateMessages={rotateMessages}
          messageOpacity={messageOpacity}
        />
      ) : (
        <Starfield />
      )}

      {titleVisible ? (
        <TitleScreen title={theme.title} subtitle={theme.subtitle} opacity={titleOpacity} authorName={authorName} />
      ) : null}

      {theme.backgroundAsset !== 'sunset' && phase !== 'done' ? (
        <>
          <MainStar
            palette={theme.palette}
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
            messages={theme.messages}
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
            <ThoughtInput
              prompt={theme.prompt}
              opacity={inputOpacity}
              onSubmit={handleSubmitThought}
              onDraftChange={setDraftText}
            />
          </KeyboardAvoidingView>
        </>
      ) : null}

      {phase === 'done' ? <ThankYouOverlay closingMessage={theme.closingMessage} onRestart={handleRestart} /> : null}
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
