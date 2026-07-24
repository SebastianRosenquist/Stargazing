import React, { useEffect } from 'react';
import { StyleSheet, useWindowDimensions } from 'react-native';
import {
  Canvas,
  Rect,
  Path,
  Oval,
  RoundedRect,
  Circle,
  Group,
  LinearGradient,
  RadialGradient,
  SweepGradient,
  BlurMask,
  vec,
} from '@shopify/react-native-skia';
import {
  Easing,
  useDerivedValue,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';
import { V1, V2, V3, V4, S1, S2, vmin } from './palette';

// CSS .light/.light-1..7's relative vertical offset below the horizon and bar
// width — the "sun glitter path" fan.
const LIGHT_STREAK_OFFSETS = [
  { offset: 1, width: 20 },
  { offset: 2, width: 20 },
  { offset: 3, width: 18 },
  { offset: 4, width: 18 },
  { offset: 5, width: 16 },
  { offset: 8, width: 14 },
  { offset: 9, width: 10 },
];

// A faithful-but-hand-tuned recreation of resources/sunset/sunset.scss's
// landscape (everything except the sun itself, which lives in SunsetSun.tsx
// so it can be independently phase-gated). This component is ambient and
// phase-independent — mounted for the ritual's whole lifetime, matching
// Starfield.tsx's role for every other theme.
//
// There's no Skia equivalent of CSS's asymmetric `border-radius` dome or its
// box-shadow-based element duplication, so hills and reed clusters are
// hand-authored Path/shape compositions rather than literal geometry ports —
// matching the resource's composition and palette, not its exact CSS math.

function hillPath(left: number, width: number, height: number, bottom: number) {
  const top = bottom - height;
  const peakX = left + width * 0.55;
  return (
    `M ${left} ${bottom} ` +
    `C ${left} ${bottom - height * 0.75}, ${left + width * 0.1} ${top}, ${peakX} ${top} ` +
    `C ${left + width * 0.8} ${top}, ${left + width} ${bottom - height * 0.4}, ${left + width} ${bottom} Z`
  );
}

type HillConfig = {
  left: number;
  width: number;
  height: number;
  colors: string[];
};

function Hill({ config, horizonY, blur }: { config: HillConfig; horizonY: number; blur: number }) {
  const path = hillPath(config.left, config.width, config.height, horizonY);
  const cx = config.left + config.width / 2;

  return (
    <>
      {/* Blurred, vertically-flipped mirror of the hill itself — the CSS's
          cheap "reflection" trick, ported directly. */}
      <Group transform={[{ scaleY: -0.6 }]} origin={vec(cx, horizonY)} opacity={0.85}>
        <Path path={path} color="black">
          <LinearGradient start={vec(0, horizonY - config.height)} end={vec(0, horizonY)} colors={config.colors} />
          <BlurMask blur={blur} style="normal" />
        </Path>
      </Group>
      <Path path={path} color="black">
        <LinearGradient start={vec(0, horizonY - config.height)} end={vec(0, horizonY)} colors={config.colors} />
      </Path>
    </>
  );
}

function DriftingCloud({
  startX,
  y,
  width,
  height,
  opacity,
  blur,
  duration,
  delay,
}: {
  startX: number;
  y: number;
  width: number;
  height: number;
  opacity: number;
  blur: number;
  duration: number;
  delay: number;
}) {
  const drift = useSharedValue(0);

  useEffect(() => {
    drift.value = withDelay(delay, withRepeat(withTiming(width * 1.8, { duration, easing: Easing.linear }), -1, true));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const transform = useDerivedValue(() => [{ translateX: drift.value }], [drift]);

  return (
    <Group transform={transform}>
      <RoundedRect x={startX} y={y} width={width} height={height} r={height / 2} color={S1} opacity={opacity}>
        <BlurMask blur={blur} style="normal" />
      </RoundedRect>
    </Group>
  );
}

type LotusConfig = {
  cx: number;
  cy: number;
  width: number;
  height: number;
  opacity: number;
  rotate?: number;
  blendMode?: 'multiply';
};

function Lotus({ config }: { config: LotusConfig }) {
  const { cx, cy, width, height, opacity, rotate = 0, blendMode } = config;
  return (
    <Group transform={[{ rotate }]} origin={vec(cx, cy)} opacity={opacity} blendMode={blendMode}>
      <Oval x={cx - width / 2} y={cy - height / 2} width={width} height={height}>
        <SweepGradient
          c={vec(cx, cy)}
          colors={[V3, V3, 'transparent', 'transparent', V3, V3]}
          positions={[0, 40 / 360, 50 / 360, 70 / 360, 80 / 360, 1]}
        />
      </Oval>
    </Group>
  );
}

function SplashRing({ cx, cy, width, height, delay }: { cx: number; cy: number; width: number; height: number; delay: number }) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withDelay(
      delay,
      withRepeat(withSequence(withTiming(1, { duration: 4500, easing: Easing.out(Easing.quad) }), withTiming(1, { duration: 4500 })), -1)
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const transform = useDerivedValue(() => [{ scale: progress.value }], [progress]);
  const opacity = useDerivedValue(() => 1 - progress.value, [progress]);

  return (
    <Group transform={transform} origin={vec(cx, cy)} opacity={opacity}>
      <Oval x={cx - width / 2} y={cy - height / 2} width={width} height={height} style="stroke" strokeWidth={2} color={S1}>
        <BlurMask blur={1} style="normal" />
      </Oval>
    </Group>
  );
}

type ReedStem = {
  x: number;
  height: number;
  angle: number;
  color: string;
  headColor?: string;
};

function Reed({ stem, bottom }: { stem: ReedStem; bottom: number }) {
  const sway = useSharedValue(stem.angle);

  useEffect(() => {
    sway.value = withRepeat(
      withSequence(
        withTiming(stem.angle, { duration: 2000 }),
        withTiming(0, { duration: 4000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 8000 }),
        withTiming(stem.angle, { duration: 0 })
      ),
      -1
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const transform = useDerivedValue(() => [{ rotate: (sway.value * Math.PI) / 180 }], [sway]);
  const stemWidth = 3;
  const top = bottom - stem.height;

  return (
    <Group transform={transform} origin={vec(stem.x, bottom)}>
      <RoundedRect x={stem.x - stemWidth / 2} y={top} width={stemWidth} height={stem.height} r={stemWidth / 2} color={stem.color} />
      {stem.headColor ? (
        <RoundedRect x={stem.x - stemWidth} y={top} width={stemWidth * 2} height={stem.height * 0.16} r={stemWidth} color={stem.headColor} />
      ) : null}
    </Group>
  );
}

// The sun's blurred reflection, mirrored across the horizon. Position mirrors
// the sun live; visibility is driven by the shared `proximity` value (see
// `useHorizonProximity` below) instead of an independent timer.
function SunReflection({ cx, sunCenterY, horizonY, radius, waterBottom, proximity }: {
  cx: number;
  sunCenterY: SharedValue<number>;
  horizonY: number;
  radius: number;
  waterBottom: number;
  proximity: SharedValue<number>;
}) {
  const cy = useDerivedValue(() => {
    const mirrored = horizonY + (horizonY - sunCenterY.value) * 0.35;
    return Math.min(mirrored, waterBottom - radius * 0.4);
  }, [sunCenterY]);

  return (
    <Circle cx={cx} cy={cy} r={radius} color="white" opacity={proximity}>
      <BlurMask blur={radius * 0.5} style="normal" />
    </Circle>
  );
}

// A warm color-burn wash over the sky, centered at the horizon below the
// sun — ports the CSS's `.sun-container-1:after` radial-gradient. There, it's
// timed to the same 20s loop as the sun's rise so it happens to peak near the
// horizon; here it's driven directly by the sun's actual proximity to the
// horizon, so the sky visibly warms as the sun sets.
function SkyGlow({ cx, width, horizonY, radius, proximity }: {
  cx: number;
  width: number;
  horizonY: number;
  radius: number;
  proximity: SharedValue<number>;
}) {
  return (
    <Rect x={0} y={0} width={width} height={horizonY} opacity={proximity} blendMode="colorBurn">
      <RadialGradient c={vec(cx, horizonY)} r={radius} colors={[S2, 'transparent']} />
    </Rect>
  );
}

// One bar of the "sun glitter path" fan on the water. Visible only when the
// sun is near the horizon — driven by the same shared `proximity` value as
// the reflection and sky glow, rather than the CSS's independent 20s timer.
function LightStreak({ cx, cy, width: barWidth, proximity }: { cx: number; cy: number; width: number; proximity: SharedValue<number> }) {
  const transform = useDerivedValue(() => [{ scaleX: 0.1 + proximity.value * 0.9 }], [proximity]);
  const height = 2;

  return (
    <Group transform={transform} origin={vec(cx, cy)} opacity={proximity}>
      <RoundedRect x={cx - barWidth / 2} y={cy - height / 2} width={barWidth} height={height} r={height / 2} color="white">
        <BlurMask blur={1} style="normal" />
      </RoundedRect>
    </Group>
  );
}

type Props = {
  sunCenterY: SharedValue<number>;
  sunCenterX: number;
};

export function SunsetLandscape({ sunCenterY, sunCenterX }: Props) {
  const { width, height } = useWindowDimensions();
  const horizonY = height / 2;
  const hillBlur = vmin(1.2, width, height);
  // Same sun size SunsetScene/SunsetSun compute — used here only as a natural
  // distance scale for the horizon-proximity falloff below, so it reaches 0
  // well before the sun's fully-set resting position (~1.6x this, just below
  // the horizon), rather than plateauing partway.
  const sunDiameter = vmin(20, width, height);

  // Shared across the sky glow, sun reflection, and light streaks: 1 when the
  // sun is right at the horizon, falling off to 0 within about one sun-width
  // of it in either direction — so they're gone well before the sun settles
  // below the horizon, matching the reference (there, the reflection/light
  // keyframes explicitly hold at opacity 0 once past their brief window).
  const horizonProximity = useDerivedValue(() => {
    const distance = Math.abs(sunCenterY.value - horizonY);
    return Math.max(0, 1 - distance / (sunDiameter * 1.3));
  }, [sunCenterY, sunDiameter]);

  const hills: HillConfig[] = [
    { left: -vmin(10, width, height), width: vmin(40, width, height), height: vmin(30, width, height), colors: [V1, V2, V3] },
    { left: vmin(5, width, height), width: vmin(40, width, height), height: vmin(15, width, height), colors: [V3, V4] },
    { left: width - vmin(15, width, height), width: vmin(100, width, height), height: vmin(12, width, height), colors: [S1, V4] },
  ];

  const lotuses: LotusConfig[] = [
    { cx: width - vmin(15, width, height), cy: height - vmin(10, width, height), width: vmin(20, width, height), height: vmin(5, width, height), opacity: 1 },
    {
      cx: width - vmin(22, width, height),
      cy: height - vmin(20, width, height),
      width: vmin(10, width, height),
      height: vmin(3, width, height),
      opacity: 0.5,
      blendMode: 'multiply',
    },
    {
      cx: width - vmin(42, width, height),
      cy: height - vmin(10, width, height),
      width: vmin(15, width, height),
      height: vmin(4, width, height),
      opacity: 0.8,
      rotate: Math.PI,
    },
  ];

  const splashes = [
    { cx: width * 0.72, cy: height - vmin(5, width, height), width: vmin(8, width, height), height: vmin(3, width, height), delay: 1000 },
    { cx: width * 0.05, cy: height - vmin(15, width, height), width: vmin(20, width, height), height: vmin(7, width, height), delay: 2000 },
    { cx: width * 0.9, cy: height - vmin(15, width, height), width: vmin(20, width, height), height: vmin(7, width, height), delay: 3000 },
    { cx: width * 0.95, cy: height - vmin(5, width, height), width: vmin(8, width, height), height: vmin(3, width, height), delay: 4000 },
  ];

  const leftReeds: ReedStem[] = [
    { x: vmin(6, width, height), height: vmin(40, width, height), angle: 4, color: V4 },
    { x: vmin(11, width, height), height: vmin(50, width, height), angle: -2, color: V4, headColor: S2 },
    { x: vmin(16, width, height), height: vmin(35, width, height), angle: 3, color: V3 },
  ];
  const rightReeds: ReedStem[] = [
    { x: width - vmin(6, width, height), height: vmin(45, width, height), angle: -3, color: V4, headColor: S1 },
    { x: width - vmin(12, width, height), height: vmin(38, width, height), angle: 2, color: V3 },
    { x: width - vmin(18, width, height), height: vmin(50, width, height), angle: -4, color: V4, headColor: S1 },
  ];

  return (
    <Canvas style={StyleSheet.absoluteFill}>
      {/* Sky */}
      <Rect x={0} y={0} width={width} height={height}>
        <LinearGradient start={vec(0, 0)} end={vec(0, height)} colors={[V1, S1, V1]} positions={[0, 0.5, 1]} />
      </Rect>

      {/* Hills + their own reflections, back-to-front */}
      {hills.map((hill, i) => (
        <Hill key={i} config={hill} horizonY={horizonY} blur={hillBlur} />
      ))}

      {/* Warm color-burn wash that intensifies as the sun nears the horizon */}
      <SkyGlow cx={sunCenterX} width={width} horizonY={horizonY} radius={vmin(70, width, height)} proximity={horizonProximity} />

      {/* Clouds */}
      <DriftingCloud
        startX={vmin(20, width, height)}
        y={vmin(24, width, height)}
        width={vmin(80, width, height)}
        height={vmin(6, width, height)}
        opacity={0.3}
        blur={vmin(0.5, width, height)}
        duration={115000}
        delay={0}
      />
      <DriftingCloud
        startX={vmin(60, width, height)}
        y={vmin(15, width, height)}
        width={vmin(60, width, height)}
        height={vmin(4, width, height)}
        opacity={0.2}
        blur={vmin(1, width, height)}
        duration={100000}
        delay={8000}
      />

      {/* Sun's reflection + the 7-bar light-streak fan on the water */}
      <SunReflection
        cx={sunCenterX}
        sunCenterY={sunCenterY}
        horizonY={horizonY}
        radius={vmin(9, width, height)}
        waterBottom={height}
        proximity={horizonProximity}
      />
      {LIGHT_STREAK_OFFSETS.map((streak, i) => (
        <LightStreak
          key={i}
          cx={sunCenterX}
          cy={horizonY + vmin(streak.offset, width, height)}
          width={vmin(streak.width, width, height)}
          proximity={horizonProximity}
        />
      ))}

      {/* Water */}
      <Rect x={0} y={horizonY} width={width} height={height - horizonY}>
        <LinearGradient start={vec(0, horizonY)} end={vec(0, height)} colors={['#fea79855', V2]} />
      </Rect>

      {/* Splashes */}
      {splashes.map((s, i) => (
        <SplashRing key={i} {...s} />
      ))}

      {/* Lotus flowers */}
      {lotuses.map((l, i) => (
        <Lotus key={i} config={l} />
      ))}

      {/* Foreground: stone + reed clusters */}
      <RoundedRect
        x={-vmin(10, width, height)}
        y={height - vmin(15, width, height)}
        width={vmin(40, width, height)}
        height={vmin(25, width, height)}
        r={vmin(18, width, height)}
        color={V4}
      />
      <Group transform={[{ scaleX: 1.2 }, { skewX: 0.15 }]} origin={vec(vmin(10, width, height), height)}>
        <RoundedRect
          x={-vmin(8, width, height)}
          y={height - vmin(13, width, height)}
          width={vmin(34, width, height)}
          height={vmin(22, width, height)}
          r={vmin(16, width, height)}
          color={V3}
          opacity={0.85}
        />
      </Group>

      {leftReeds.map((r, i) => (
        <Reed key={`l${i}`} stem={r} bottom={height} />
      ))}
      {rightReeds.map((r, i) => (
        <Reed key={`r${i}`} stem={r} bottom={height} />
      ))}
    </Canvas>
  );
}
