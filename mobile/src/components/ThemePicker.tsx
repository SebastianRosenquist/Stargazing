import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { BlurView } from 'expo-blur';
import { Canvas, Circle, Group, Rect, LinearGradient, RadialGradient, BlurMask, vec } from '@shopify/react-native-skia';
import { THEMES } from '../themes';
import type { Theme, ThemeId } from '../themes/types';

// Reproduces design_handoff_theme_picker's swipe-to-choose ritual menu:
// full-bleed cards, 55px commit threshold, .45s cubic-bezier(.4,0,.2,1) snap,
// rebuilt with Reanimated + Skia rather than the prototype's CSS/DOM.
const SWIPE_THRESHOLD = 55;
const SNAP_DURATION = 450;
const SNAP_EASING = Easing.bezier(0.4, 0, 0.2, 1);
const DOT_MORPH_DURATION = 350;

// Themes whose card background reads visually light — controls scrim/badge/text contrast.
const LIGHT_THEME_IDS = new Set<ThemeId>(['overthinking-stream']);

type CardGradient = { type: 'linear' | 'radial'; colors: string[]; positions?: number[] };

// Per-theme card background gradients, matching the design handoff's literal
// CSS gradient stops (design-fidelity reference, not derived from
// Theme.palette which only describes the star glow, not the card backdrop).
const CARD_GRADIENTS: Record<ThemeId, CardGradient> = {
  'self-compassion': {
    type: 'linear',
    colors: ['#be91c6', '#c58fb0', '#fea798', '#ffbf97'],
    positions: [0, 0.34, 0.66, 1],
  },
  'stress-perspective': { type: 'radial', colors: ['#1b2735', '#0b0d16'] },
  'anxiety-grounding': { type: 'linear', colors: ['#0a1523', '#153049', '#2f6690'] },
  'overthinking-stream': { type: 'linear', colors: ['#5a9fd0', '#9cc9e8', '#dceffa'] },
  'gratitude-keep': { type: 'linear', colors: ['#241328', '#5e3550', '#b5705f'] },
};

type Props = {
  onBegin: (theme: Theme) => void;
};

export function ThemePicker({ onBegin }: Props) {
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const trackX = useSharedValue(0);
  const dragStartX = useSharedValue(0);
  const activeIndex = useSharedValue(0);

  useEffect(() => {
    activeIndex.value = index;
  }, [index, activeIndex]);

  const goTo = (nextIndex: number) => {
    const clamped = Math.max(0, Math.min(THEMES.length - 1, nextIndex));
    setIndex(clamped);
    trackX.value = withTiming(-clamped * screenWidth, { duration: SNAP_DURATION, easing: SNAP_EASING });
  };

  const pan = Gesture.Pan()
    .onStart(() => {
      dragStartX.value = trackX.value;
    })
    .onUpdate((event) => {
      // 1:1 follow while dragging — no transition, matches the handoff spec.
      trackX.value = dragStartX.value + event.translationX;
    })
    .onEnd((event) => {
      const offset = event.translationX;
      let nextIndex = index;
      if (offset < -SWIPE_THRESHOLD) nextIndex += 1;
      else if (offset > SWIPE_THRESHOLD) nextIndex -= 1;
      runOnJS(goTo)(nextIndex);
    });

  const trackStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: trackX.value }],
  }));

  const currentTheme = THEMES[index];

  return (
    <View style={styles.root}>
      <GestureDetector gesture={pan}>
        <Animated.View style={[styles.track, { width: THEMES.length * screenWidth }, trackStyle]}>
          {THEMES.map((theme) => (
            <ThemeCard key={theme.id} theme={theme} width={screenWidth} height={screenHeight} />
          ))}
        </Animated.View>
      </GestureDetector>

      <Text style={styles.topLabel} pointerEvents="none">
        CHOOSE A RITUAL
      </Text>

      <Pressable
        style={styles.ctaWrapper}
        disabled={!currentTheme.built}
        onPress={() => currentTheme.built && onBegin(currentTheme)}
      >
        <BlurView intensity={30} tint="light" style={styles.cta}>
          <Text style={[styles.ctaText, !currentTheme.built && styles.ctaTextDisabled]}>
            {currentTheme.built ? 'Begin' : 'Coming soon'}
          </Text>
        </BlurView>
      </Pressable>

      <View style={styles.controlsRow} pointerEvents="box-none">
        <Pressable style={[styles.arrow, index === 0 && styles.arrowDisabled]} onPress={() => goTo(index - 1)}>
          <Text style={styles.arrowGlyph}>{'‹'}</Text>
        </Pressable>
        <View style={styles.dots}>
          {THEMES.map((theme, i) => (
            <Dot key={theme.id} myIndex={i} activeIndex={activeIndex} />
          ))}
        </View>
        <Pressable
          style={[styles.arrow, index === THEMES.length - 1 && styles.arrowDisabled]}
          onPress={() => goTo(index + 1)}
        >
          <Text style={styles.arrowGlyph}>{'›'}</Text>
        </Pressable>
      </View>
    </View>
  );
}

function ThemeCard({ theme, width, height }: { theme: Theme; width: number; height: number }) {
  const isLight = LIGHT_THEME_IDS.has(theme.id);
  const gradient = CARD_GRADIENTS[theme.id];
  const heroTop = height * 0.2;
  const scrimTop = height * 0.45;
  const glowOpacity = theme.built ? 1 : 0.6;

  return (
    <View style={{ width, height }}>
      <Canvas style={StyleSheet.absoluteFill}>
        <Rect x={0} y={0} width={width} height={height}>
          {gradient.type === 'radial' ? (
            <RadialGradient c={vec(width / 2, height)} r={height * 1.3} colors={gradient.colors} positions={gradient.positions} />
          ) : (
            <LinearGradient start={vec(0, 0)} end={vec(0, height)} colors={gradient.colors} positions={gradient.positions} />
          )}
        </Rect>

        <Group opacity={glowOpacity}>
          <Circle cx={width / 2} cy={heroTop} r={150} color={theme.palette.glowOuter} opacity={0.55}>
            <BlurMask blur={40} style="normal" />
          </Circle>
          <Circle cx={width / 2} cy={heroTop} r={100} color={theme.palette.glowInner} opacity={0.5}>
            <BlurMask blur={24} style="normal" />
          </Circle>
        </Group>

        <Rect x={0} y={scrimTop} width={width} height={height - scrimTop}>
          <LinearGradient
            start={vec(0, scrimTop)}
            end={vec(0, height)}
            colors={isLight ? ['rgba(60,20,60,0)', 'rgba(60,20,60,0.18)'] : ['rgba(0,0,0,0)', 'rgba(0,0,0,0.35)']}
          />
        </Rect>
      </Canvas>

      <View style={styles.textBlock} pointerEvents="none">
        <View style={styles.badgeWrap}>
          <View style={[styles.badge, { borderColor: isLight ? 'rgba(0,0,0,0.25)' : 'rgba(255,255,255,0.3)' }]}>
            <Text style={[styles.badgeText, { color: isLight ? '#2a2a2a' : '#fff' }]}>{theme.badge}</Text>
          </View>
        </View>
        <Text style={[styles.name, { color: isLight ? '#1a1a1a' : '#fff' }]}>{theme.title}</Text>
        <Text style={[styles.subtitle, { color: isLight ? 'rgba(20,20,20,0.75)' : 'rgba(255,255,255,0.8)' }]}>
          {theme.subtitle}
        </Text>
      </View>
    </View>
  );
}

function Dot({ myIndex, activeIndex }: { myIndex: number; activeIndex: SharedValue<number> }) {
  const style = useAnimatedStyle(() => {
    const isActive = activeIndex.value === myIndex;
    return {
      width: withTiming(isActive ? 22 : 7, { duration: DOT_MORPH_DURATION }),
      backgroundColor: withTiming(isActive ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.35)', {
        duration: DOT_MORPH_DURATION,
      }),
    };
  });
  return <Animated.View style={[styles.dot, style]} />;
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#000',
  },
  track: {
    flexDirection: 'row',
    ...StyleSheet.absoluteFillObject,
  },
  topLabel: {
    position: 'absolute',
    top: 64,
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '500',
    letterSpacing: 3,
    textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.55)',
    fontFamily: 'Quicksand_500Medium',
  },
  textBlock: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 182,
    paddingHorizontal: 34,
    alignItems: 'center',
  },
  badgeWrap: {
    marginBottom: 12,
  },
  badge: {
    paddingVertical: 5,
    paddingHorizontal: 13,
    borderRadius: 999,
    borderWidth: 1,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    fontFamily: 'Quicksand_600SemiBold',
  },
  name: {
    fontSize: 38,
    fontWeight: '500',
    lineHeight: 42,
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.25)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 8,
    fontFamily: 'Quicksand_500Medium',
  },
  subtitle: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 23,
    width: 270,
    textAlign: 'center',
    fontFamily: 'Quicksand_400Regular',
  },
  ctaWrapper: {
    position: 'absolute',
    bottom: 96,
    alignSelf: 'center',
    borderRadius: 999,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  cta: {
    paddingVertical: 15,
    paddingHorizontal: 46,
  },
  ctaText: {
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: '#fff',
    fontFamily: 'Quicksand_600SemiBold',
  },
  ctaTextDisabled: {
    opacity: 0.75,
  },
  controlsRow: {
    position: 'absolute',
    bottom: 54,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 18,
  },
  arrow: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.22)',
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowDisabled: {
    opacity: 0.3,
  },
  arrowGlyph: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 18,
    lineHeight: 20,
  },
  dots: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
  },
  dot: {
    height: 7,
    borderRadius: 999,
  },
});
