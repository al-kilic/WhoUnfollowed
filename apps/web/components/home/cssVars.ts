import type { CSSProperties } from 'react';

// Inline CSS custom properties (e.g. the animation delay --d), typed for JSX.
export const cv = (o: Record<string, string | number>): CSSProperties => o as CSSProperties;
