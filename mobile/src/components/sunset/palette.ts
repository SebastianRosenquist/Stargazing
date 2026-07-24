// Shared with SunsetLandscape.tsx and SunsetSun.tsx. Named to match
// resources/sunset/sunset.scss's CSS custom properties (--v1..--v4, --s1/--s2)
// so the two stay easy to cross-reference.
export const V1 = '#be91c6';
export const V2 = '#8a65cc';
export const V3 = '#5e30d9';
export const V4 = '#3b1895';
export const S1 = '#fea798';
export const S2 = '#ff846e';

// CSS `vmin` unit equivalent: a percentage of the smaller viewport dimension.
export function vmin(pct: number, width: number, height: number) {
  return (Math.min(width, height) * pct) / 100;
}
