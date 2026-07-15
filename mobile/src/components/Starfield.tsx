import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, useWindowDimensions } from 'react-native';
import { Canvas, Circle, Group, Rect, RadialGradient, vec } from '@shopify/react-native-skia';

// Ported from JS/stars.js — same star counts, intervals, and speed formula
// as the original D3-driven starfield, replacing DOM divs with a Skia canvas.
type Star = {
  id: number;
  x: number;
  y: number;
  speed: number;
};

const NUMBER_OF_STARS = 100;
const MOVE_INTERVAL_MS = 25;
const ADD_INTERVAL_MS = 100;

let nextStarId = 0;

export function Starfield() {
  const { width, height } = useWindowDimensions();
  const [stars, setStars] = useState<Star[]>([]);
  const starsRef = useRef<Star[]>([]);

  useEffect(() => {
    const getRandomX = () => Math.max(0, Math.random() * width - 10);
    const getRandomY = () => Math.max(0, Math.random() * height - 10);
    const getRandomSpeed = () => Math.ceil((13 * Math.random()) / 4);

    starsRef.current = Array.from({ length: NUMBER_OF_STARS }, () => ({
      id: nextStarId++,
      x: getRandomX(),
      y: getRandomY(),
      speed: getRandomSpeed(),
    }));
    setStars(starsRef.current);

    const moveInterval = setInterval(() => {
      starsRef.current = starsRef.current
        .map((star) => ({ ...star, y: star.y - star.speed }))
        .filter((star) => star.y >= 0);
      setStars(starsRef.current);
    }, MOVE_INTERVAL_MS);

    const addInterval = setInterval(() => {
      starsRef.current = [
        ...starsRef.current,
        {
          id: nextStarId++,
          x: getRandomX(),
          y: height + 100,
          speed: getRandomSpeed(),
        },
      ];
    }, ADD_INTERVAL_MS);

    return () => {
      clearInterval(moveInterval);
      clearInterval(addInterval);
    };
  }, [width, height]);

  return (
    <Canvas style={StyleSheet.absoluteFill}>
      <Rect x={0} y={0} width={width} height={height}>
        <RadialGradient
          c={vec(width / 2, height)}
          r={Math.max(width, height)}
          colors={['#1b2735', '#090a0f']}
        />
      </Rect>
      <Group>
        {stars.map((star) => (
          <Circle key={star.id} cx={star.x} cy={star.y} r={Math.max(star.speed / 2, 0.5)} color="white" />
        ))}
      </Group>
    </Canvas>
  );
}
