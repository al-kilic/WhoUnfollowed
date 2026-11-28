export const T = {
  // Backgrounds
  bg:        'var(--t-bg)',
  bgPanel:   'var(--t-bgPanel)',
  bgCard:    'var(--t-bgCard)',
  bgDeep:    'var(--t-bgDeep)',

  // Text
  ink:       'var(--t-ink)',
  inkDim:    'var(--t-inkDim)',
  inkMute:   'var(--t-inkMute)',

  // Brand colours
  teal:      'var(--t-teal)',
  tealMid:   'var(--t-tealMid)',
  tealLight: 'var(--t-tealLight)',
  tealGlow:  'var(--t-tealGlow)',
  terra:     'var(--t-terra)',
  terraText: 'var(--t-terraText)',
  cream:     'var(--t-cream)',
  // Text on a teal or terra fill: cream in light, near-black in dark.
  onTeal:    'var(--t-onTeal)',

  // Derived surface / border
  navBg:     'var(--t-navBg)',
  border1:   'var(--t-border1)',
  border2:   'var(--t-border2)',
  border3:   'var(--t-border3)',
  surface1:  'var(--t-surface1)',
  surface2:  'var(--t-surface2)',
  overlay:   'var(--t-overlay)',
  overlayBorder: 'var(--t-overlayBorder)',

  // Toggle active pill
  toggleActiveBg:   'var(--t-toggleActiveBg)',
  toggleActiveText: 'var(--t-toggleActiveText)',

  // Fonts. CSS variables with the site's fonts as fallback, so Studio (/app)
  // can switch shared components to its own font (see app/[locale]/app/studio.css).
  serif: "var(--t-font-serif, 'Instrument Serif', Georgia, serif)",
  sans:  "var(--t-font-sans, 'DM Sans', system-ui, sans-serif)",
  mono:  "var(--t-font-mono, 'DM Mono', 'Fira Mono', monospace)",
} as const;
