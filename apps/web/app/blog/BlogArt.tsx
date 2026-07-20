'use client';

import React from 'react';

export type ArtVariant = 'search' | 'ratio' | 'lock' | 'split' | 'ghost' | 'bell';

const ACCENTS: Record<ArtVariant, string> = {
  search: '#5fc4c8',
  ratio: '#c8a96e',
  lock: '#d4735a',
  split: '#5fc4c8',
  ghost: '#9aa6a0',
  bell: '#5fc4c8',
};

// Stroke line-art glyph per variant, drawn around the right third of the banner.
function Glyph({ variant, accent }: { variant: ArtVariant; accent: string }) {
  const common = {
    fill: 'none',
    stroke: accent,
    strokeWidth: 9,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };
  switch (variant) {
    case 'search':
      return (
        <g {...common} opacity={0.92}>
          <circle cx={835} cy={205} r={56} />
          <line x1={876} y1={246} x2={930} y2={300} />
        </g>
      );
    case 'ratio':
      return (
        <g {...common} opacity={0.92}>
          <line x1={770} y1={300} x2={950} y2={300} />
          <rect x={788} y={232} width={34} height={68} rx={6} />
          <rect x={846} y={188} width={34} height={112} rx={6} />
          <rect x={904} y={150} width={34} height={150} rx={6} />
        </g>
      );
    case 'lock':
      return (
        <g {...common} opacity={0.92}>
          <rect x={788} y={210} width={108} height={90} rx={14} />
          <path d="M810 210 v-18 a32 32 0 0 1 64 0 v18" />
          <circle cx={842} cy={252} r={9} fill={accent} stroke="none" />
          <line x1={842} y1={258} x2={842} y2={278} />
        </g>
      );
    case 'split':
      return (
        <g {...common} opacity={0.92}>
          <circle cx={790} cy={225} r={26} />
          <circle cx={930} cy={225} r={26} />
          <path d="M820 235 q40 28 80 0" strokeDasharray="2 18" />
          <line x1={848} y1={284} x2={872} y2={196} opacity={0.7} />
        </g>
      );
    case 'ghost':
      return (
        <g {...common} opacity={0.85}>
          <circle cx={835} cy={235} r={58} strokeDasharray="4 20" />
          <circle cx={835} cy={235} r={10} fill={accent} stroke="none" opacity={0.6} />
        </g>
      );
    case 'bell':
      return (
        <g {...common} opacity={0.92}>
          <path d="M790 270 q0 -80 50 -86 q50 6 50 86 z" />
          <line x1={772} y1={270} x2={908} y2={270} />
          <path d="M826 292 a14 14 0 0 0 28 0" />
          <line x1={840} y1={170} x2={840} y2={184} />
        </g>
      );
  }
}

export function BlogArt({
  variant,
  alt,
  rounded = 0,
  style,
}: {
  variant: ArtVariant;
  alt: string;
  rounded?: number;
  style?: React.CSSProperties | undefined;
}) {
  const accent = ACCENTS[variant];
  const uid = React.useId().replace(/:/g, '');

  return (
    <svg
      role="img"
      aria-label={alt}
      viewBox="0 0 1200 480"
      preserveAspectRatio="xMidYMid slice"
      width="100%"
      height="100%"
      style={{ display: 'block', ...style }}
    >
      <title>{alt}</title>
      <defs>
        <linearGradient id={`bg${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#0d2b2e" />
          <stop offset="1" stopColor="#081c1e" />
        </linearGradient>
        <radialGradient id={`glow${uid}`} cx="0.72" cy="0.4" r="0.6">
          <stop offset="0" stopColor={accent} stopOpacity="0.28" />
          <stop offset="1" stopColor={accent} stopOpacity="0" />
        </radialGradient>
        <pattern id={`dots${uid}`} width="34" height="34" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1.6" fill="#ffffff" opacity="0.06" />
        </pattern>
        {rounded > 0 && (
          <clipPath id={`clip${uid}`}>
            <rect width="1200" height="480" rx={rounded} />
          </clipPath>
        )}
      </defs>

      <g clipPath={rounded > 0 ? `url(#clip${uid})` : undefined}>
        <rect width="1200" height="480" fill={`url(#bg${uid})`} />
        <rect width="1200" height="480" fill={`url(#dots${uid})`} />
        <rect width="1200" height="480" fill={`url(#glow${uid})`} />

        {/* Radar rings emanating from the focal point */}
        {[70, 140, 220, 310].map((r) => (
          <circle
            key={r}
            cx={835}
            cy={235}
            r={r}
            fill="none"
            stroke={accent}
            strokeOpacity={0.12}
            strokeWidth={2}
          />
        ))}

        {/* Sparse node field with a couple of connections */}
        {[
          [150, 120],
          [250, 320],
          [120, 380],
          [380, 200],
          [470, 360],
          [560, 110],
        ].map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r={i % 3 === 0 ? 6 : 4} fill={accent} opacity={0.5} />
        ))}
        <line x1={150} y1={120} x2={380} y2={200} stroke={accent} strokeOpacity={0.2} strokeWidth={2} />
        <line x1={380} y1={200} x2={250} y2={320} stroke={accent} strokeOpacity={0.2} strokeWidth={2} />
        <line x1={560} y1={110} x2={380} y2={200} stroke={accent} strokeOpacity={0.2} strokeWidth={2} />

        <Glyph variant={variant} accent={accent} />

        {/* Wordmark */}
        <text
          x={64}
          y={440}
          fill="#ffffff"
          fillOpacity={0.32}
          fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
          fontSize={18}
          letterSpacing={4}
        >
          WHOUNFOLLOWED
        </text>
      </g>
    </svg>
  );
}

// Cover for a post: a real photo when `image` is set (self-hosted in /public/blog),
// otherwise the abstract SVG art. Lets us mix photo-led and illustrated posts
// without touching every render site.
export function BlogCover({
  image,
  art,
  alt,
  rounded = 0,
  style,
  priority = false,
}: {
  image?: string | undefined;
  art: ArtVariant;
  alt: string;
  rounded?: number;
  style?: React.CSSProperties;
  // Set on the above-the-fold hero cover so the LCP image loads eagerly.
  // Thumbnails and below-the-fold covers leave this false to lazy-load.
  priority?: boolean;
}) {
  if (image) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={image}
        alt={alt}
        width={1200}
        height={480}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'auto'}
        style={{ display: 'block', width: '100%', height: '100%', objectFit: 'cover', ...style }}
      />
    );
  }
  return <BlogArt variant={art} alt={alt} rounded={rounded} style={style} />;
}
