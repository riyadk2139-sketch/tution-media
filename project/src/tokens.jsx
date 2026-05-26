// Tution Media — design tokens & theme primitives
// Three palette variants exposed via Tweaks (Clay default, Sage, Marigold).
// Type system: Instrument Serif (display) + Geist (UI) + JetBrains Mono (meta).

const TM_PALETTES = {
  midnight: {
    name: 'Midnight',
    paper: '#0F0F0F',
    paperDeep: '#181818',
    surface: '#1E1E1E',
    ink: '#FFFFFF',
    inkSoft: '#C4C4C4',
    inkMuted: '#888888',
    line: 'rgba(255,255,255,0.07)',
    lineSoft: 'rgba(255,255,255,0.04)',
    primary: '#FFC83D',
    primaryDeep: '#FFB800',
    primarySoft: 'rgba(255,200,61,0.14)',
    primaryInk: '#0F0F0F',
    accent: '#7ED9A8',
    accentSoft: 'rgba(126,217,168,0.14)',
    warn: '#F5A623',
    warnSoft: 'rgba(245,166,35,0.14)',
    cardShadow:
      'inset 0 1px 0 rgba(255,255,255,0.04), 0 1px 2px rgba(0,0,0,0.5), 0 14px 36px rgba(0,0,0,0.35)',
    softShadow: '0 8px 24px rgba(0,0,0,0.25)',
    isDark: 1,
  },
  clay: {
    name: 'Clay',
    paper: '#f6f0e6',
    paperDeep: '#ede5d5',
    surface: '#fdfaf3',
    ink: '#231d18',
    inkSoft: '#5a4f43',
    inkMuted: '#8c7f6f',
    line: '#e0d6c3',
    lineSoft: '#ebe2d1',
    primary: '#b8462a',        // warm terracotta
    primaryDeep: '#8e3520',
    primarySoft: '#f3d9cd',
    primaryInk: '#fdfaf3',
    accent: '#3a5d4a',          // moss green for "verified" / positive
    accentSoft: '#cfe0d3',
    warn: '#c98a1d',
    warnSoft: '#f2e0bd',
    cardShadow: '0 1px 2px rgba(35,29,24,0.05), 0 4px 14px rgba(35,29,24,0.04)',
    softShadow: '0 6px 20px rgba(35,29,24,0.06)',
    isDark: 0,
  },
  sage: {
    name: 'Sage',
    paper: '#f1f1ea',
    paperDeep: '#e4e6db',
    surface: '#f9faf4',
    ink: '#1d231d',
    inkSoft: '#475247',
    inkMuted: '#7e8a7e',
    line: '#d8ddd0',
    lineSoft: '#e6eadf',
    primary: '#4d6b3f',         // warm sage
    primaryDeep: '#385029',
    primarySoft: '#d4e0c8',
    primaryInk: '#f9faf4',
    accent: '#b4502a',          // terracotta as accent here
    accentSoft: '#ebd3c4',
    warn: '#b88322',
    warnSoft: '#eedfbc',
    cardShadow: '0 1px 2px rgba(29,35,29,0.05), 0 4px 14px rgba(29,35,29,0.04)',
    softShadow: '0 6px 20px rgba(29,35,29,0.06)',
    isDark: 0,
  },
  marigold: {
    name: 'Marigold',
    paper: '#fbf4e4',
    paperDeep: '#f1e7cf',
    surface: '#fefaee',
    ink: '#28200f',
    inkSoft: '#5c4d2d',
    inkMuted: '#8f7e58',
    line: '#e6d8b6',
    lineSoft: '#eee0c0',
    primary: '#c47410',        // deep marigold/saffron
    primaryDeep: '#965507',
    primarySoft: '#f2d9a8',
    primaryInk: '#fefaee',
    accent: '#3c5d3f',
    accentSoft: '#cee0cf',
    warn: '#b5471f',
    warnSoft: '#f0c8b8',
    cardShadow: '0 1px 2px rgba(40,32,15,0.05), 0 4px 14px rgba(40,32,15,0.04)',
    softShadow: '0 6px 20px rgba(40,32,15,0.06)',
    isDark: 0,
  },
};

const TM_FONTS = {
  display: '"DM Sans", "Helvetica Neue", Helvetica, sans-serif',
  ui: '"DM Sans", "Helvetica Neue", Helvetica, sans-serif',
  mono: '"DM Mono", ui-monospace, "JetBrains Mono", monospace',
  bn: '"Hind Siliguri", "Noto Sans Bengali", "DM Sans", sans-serif',
};

// Build a CSS variable scope for a given palette key.
function tmVars(key) {
  const p = TM_PALETTES[key] || TM_PALETTES.clay;
  return {
    '--tm-paper': p.paper,
    '--tm-paper-deep': p.paperDeep,
    '--tm-surface': p.surface,
    '--tm-ink': p.ink,
    '--tm-ink-soft': p.inkSoft,
    '--tm-ink-muted': p.inkMuted,
    '--tm-line': p.line,
    '--tm-line-soft': p.lineSoft,
    '--tm-primary': p.primary,
    '--tm-primary-deep': p.primaryDeep,
    '--tm-primary-soft': p.primarySoft,
    '--tm-primary-ink': p.primaryInk,
    '--tm-accent': p.accent,
    '--tm-accent-soft': p.accentSoft,
    '--tm-warn': p.warn,
    '--tm-warn-soft': p.warnSoft,
    '--tm-card-shadow': p.cardShadow,
    '--tm-soft-shadow': p.softShadow,
    '--tm-is-dark': p.isDark,
    '--tm-font-display': TM_FONTS.display,
    '--tm-font-ui': TM_FONTS.ui,
    '--tm-font-mono': TM_FONTS.mono,
    '--tm-font-bn': TM_FONTS.bn,
  };
}

Object.assign(window, { TM_PALETTES, TM_FONTS, tmVars });
