// Tution Media — shared UI primitives for the tutor app prototype.
// Custom phone chrome (own status bar / nav / tab bar) — we don't use the
// android-frame starter's M3 styling because the brand is paper-and-clay,
// not Material. We do mount inside the AndroidDevice frame so the bezel
// reads "Android-first".

const RouterCtx = React.createContext({ go: () => {}, route: 'feed', back: () => {} });

// ─── Icon set ────────────────────────────────────────────────
// Single-thickness, rounded line icons. All stroke="currentColor".
const Icon = ({ name, size = 20, stroke = 1.6, fill }) => {
  const paths = {
    home:        <><path d="M4 11L12 4l8 7"/><path d="M6 10v9a1 1 0 001 1h3v-6h4v6h3a1 1 0 001-1v-9"/></>,
    feed:        <><path d="M4 6h16"/><path d="M4 12h16"/><path d="M4 18h10"/></>,
    map:         <><path d="M4 6l5-2 6 2 5-2v14l-5 2-6-2-5 2z"/><path d="M9 4v16"/><path d="M15 6v16"/></>,
    inbox:       <><path d="M3 12l3-7h12l3 7v6a1 1 0 01-1 1H4a1 1 0 01-1-1z"/><path d="M3 12h5l1 2h6l1-2h5"/></>,
    user:        <><circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/></>,
    bell:        <><path d="M6 16V11a6 6 0 1112 0v5l1.5 2H4.5z"/><path d="M10 20a2 2 0 004 0"/></>,
    search:      <><circle cx="11" cy="11" r="6"/><path d="M16 16l4 4"/></>,
    filter:      <><path d="M4 5h16"/><path d="M7 12h10"/><path d="M10 19h4"/></>,
    chevR:       <path d="M9 5l7 7-7 7"/>,
    chevL:       <path d="M15 5l-7 7 7 7"/>,
    chevD:       <path d="M5 9l7 7 7-7"/>,
    plus:        <><path d="M12 5v14"/><path d="M5 12h14"/></>,
    check:       <path d="M5 12l5 5L20 6"/>,
    checkCircle: <><circle cx="12" cy="12" r="9"/><path d="M8 12l3 3 5-6"/></>,
    lock:        <><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 018 0v4"/></>,
    pin:         <><path d="M12 22s7-6.5 7-12a7 7 0 10-14 0c0 5.5 7 12 7 12z"/><circle cx="12" cy="10" r="2.5"/></>,
    nav:         <><path d="M12 2l9 19-9-5-9 5z"/></>,
    clock:       <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
    calendar:    <><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18"/><path d="M8 3v4M16 3v4"/></>,
    cash:        <><rect x="3" y="6" width="18" height="12" rx="2"/><circle cx="12" cy="12" r="2.5"/><path d="M6 9v.01M18 15v.01"/></>,
    bolt:        <path d="M13 2L4 14h6l-1 8 9-12h-6z"/>,
    spark:       <><path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5L18 18M6 18l2.5-2.5M15.5 8.5L18 6"/></>,
    star:        <path d="M12 3l2.7 6.1 6.6.6-5 4.5 1.5 6.5L12 17.4 6.2 20.7l1.5-6.5-5-4.5 6.6-.6z"/>,
    shield:      <path d="M12 3l8 3v6c0 5-3.5 8.5-8 9-4.5-.5-8-4-8-9V6z"/>,
    shieldCheck: <><path d="M12 3l8 3v6c0 5-3.5 8.5-8 9-4.5-.5-8-4-8-9V6z"/><path d="M8.5 12l2.5 2.5L16 9.5"/></>,
    mic:         <><rect x="9" y="3" width="6" height="12" rx="3"/><path d="M5 11a7 7 0 0014 0"/><path d="M12 18v3"/></>,
    send:        <path d="M4 20l16-8L4 4l3 8z"/>,
    paperclip:   <path d="M20 11l-8.5 8.5a5 5 0 11-7-7L13 4a3.5 3.5 0 015 5L9.5 17.5a2 2 0 11-3-3L14 7"/>,
    phone:       <path d="M4 5c0 9 6 15 15 15l2-4-5-2-2 2c-3-1-5-3-6-6l2-2-2-5z"/>,
    camera:      <><rect x="3" y="7" width="18" height="13" rx="2"/><circle cx="12" cy="13.5" r="3.5"/><path d="M9 7l1.5-3h3L15 7"/></>,
    upload:      <><path d="M12 16V4"/><path d="M7 9l5-5 5 5"/><path d="M4 20h16"/></>,
    id:          <><rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="12" r="2.5"/><path d="M14 10h5M14 14h3"/></>,
    book:        <><path d="M4 5v14a1 1 0 001 1h14V6a1 1 0 00-1-1H7a3 3 0 00-3 3z"/><path d="M4 19a3 3 0 013-3h12"/></>,
    flame:       <path d="M12 3c2 4-2 5 0 9 0-2 2-3 2-3s4 2 4 6a6 6 0 11-12 0c0-4 4-5 4-9 0-1 1-2 2-3z"/>,
    arrR:        <><path d="M5 12h14"/><path d="M14 6l6 6-6 6"/></>,
    arrL:        <><path d="M19 12H5"/><path d="M10 18l-6-6 6-6"/></>,
    dot:         <circle cx="12" cy="12" r="3"/>,
    refresh:     <><path d="M4 12a8 8 0 0114-5l2 2"/><path d="M20 4v5h-5"/><path d="M20 12a8 8 0 01-14 5l-2-2"/><path d="M4 20v-5h5"/></>,
    eye:         <><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/></>,
    eyeOff:      <><path d="M3 3l18 18"/><path d="M10.6 6.3A10 10 0 0112 6c6 0 10 6 10 6a18 18 0 01-3 3.5"/><path d="M6 8.5A18 18 0 002 12s4 7 10 7c1.6 0 3-.3 4.4-.9"/><circle cx="12" cy="12" r="2.5"/></>,
    pen:         <><path d="M4 20l4-1 11-11-3-3L5 16z"/><path d="M14 6l3 3"/></>,
    settings:    <><circle cx="12" cy="12" r="3.2"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2"/></>,
    sparkles:    <><path d="M5 5l1.5 3.5L10 10l-3.5 1.5L5 15l-1.5-3.5L0 10l3.5-1.5z" transform="translate(2 2)"/><path d="M18 13l1 2.5L21.5 17l-2.5 1L18 21l-1-2.5L14.5 17l2.5-1z"/></>,
    chart:       <><path d="M4 20V8"/><path d="M10 20V4"/><path d="M16 20v-8"/><path d="M22 20H2"/></>,
    award:       <><circle cx="12" cy="9" r="6"/><path d="M8 14l-2 8 6-3 6 3-2-8"/></>,
    play:        <path d="M7 4l13 8-13 8z"/>,
    moon:        <path d="M20 14a8 8 0 11-10-10 7 7 0 0010 10z"/>,
    x:           <><path d="M6 6l12 12"/><path d="M18 6L6 18"/></>,
    download:    <><path d="M12 4v12"/><path d="M7 11l5 5 5-5"/><path d="M4 20h16"/></>,
    layers:      <><path d="M12 3l9 5-9 5-9-5z"/><path d="M3 13l9 5 9-5"/><path d="M3 17l9 5 9-5"/></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill || "none"}
      stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round"
      style={{ display: 'block', flexShrink: 0 }}>
      {paths[name] || <circle cx="12" cy="12" r="3"/>}
    </svg>
  );
};

// ─── Status bar (paper, branded) ─────────────────────────────
const StatusBar = ({ dark = false }) => {
  const c = dark ? 'rgba(255,255,255,0.92)' : 'var(--tm-ink)';
  return (
    <div style={{
      height: 36, padding: '0 22px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      fontFamily: 'var(--tm-font-mono)', fontSize: 13, color: c,
      flexShrink: 0, position: 'relative',
    }}>
      <span style={{ fontVariantNumeric: 'tabular-nums', letterSpacing: '0.02em' }}>9:30</span>
      <div style={{
        position: 'absolute', left: '50%', top: 8, transform: 'translateX(-50%)',
        width: 18, height: 18, borderRadius: 9, background: '#1a1410',
      }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <svg width="14" height="10" viewBox="0 0 14 10" fill={c}><path d="M0 6h2v4H0zM4 4h2v6H4zM8 2h2v8H8zM12 0h2v10h-2z"/></svg>
        <svg width="14" height="10" viewBox="0 0 14 10" fill="none" stroke={c} strokeWidth="1.4">
          <path d="M1 4a8 8 0 0112 0M3 6a5 5 0 018 0M6 8a1.5 1.5 0 011 0" strokeLinecap="round"/>
        </svg>
        <div style={{
          width: 22, height: 10, border: `1.2px solid ${c}`, borderRadius: 2.5, position: 'relative',
        }}>
          <div style={{ position: 'absolute', inset: 1.5, width: '78%', background: c, borderRadius: 1 }} />
          <div style={{ position: 'absolute', right: -3, top: 3, width: 2, height: 4, background: c, borderRadius: 1 }} />
        </div>
      </div>
    </div>
  );
};

// ─── Bottom tab nav ──────────────────────────────────────────
const TabBar = ({ active = 'feed' }) => {
  const { go } = React.useContext(RouterCtx);
  const tabs = [
    { id: 'feed',  icon: 'feed',  label: 'Jobs' },
    { id: 'heatmap', icon: 'map', label: 'Demand' },
    { id: 'schedule', icon: 'calendar', label: 'Schedule' },
    { id: 'chat',  icon: 'inbox', label: 'Inbox' },
    { id: 'reputation', icon: 'user', label: 'Profile' },
  ];
  return (
    <div style={{
      borderTop: '1px solid var(--tm-line)',
      background: 'var(--tm-surface)',
      padding: '8px 6px 6px',
      display: 'flex', justifyContent: 'space-between',
      flexShrink: 0,
    }}>
      {tabs.map(t => {
        const on = t.id === active;
        return (
          <button key={t.id} onClick={() => go(t.id)} style={{
            flex: 1, background: 'transparent', border: 0, padding: '6px 0 4px',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
            color: on ? 'var(--tm-primary)' : 'var(--tm-ink-muted)',
            fontFamily: 'var(--tm-font-ui)', fontSize: 11, fontWeight: 500,
            letterSpacing: '0.01em', cursor: 'pointer',
          }}>
            <Icon name={t.icon} size={22} stroke={on ? 1.8 : 1.6}/>
            <span>{t.label}</span>
          </button>
        );
      })}
    </div>
  );
};

// ─── Header (in-screen, custom) ──────────────────────────────
const ScreenHeader = ({ title, back, right, sub, large = false }) => {
  const { back: routerBack } = React.useContext(RouterCtx);
  return (
    <div style={{
      padding: large ? '20px 22px 8px' : '16px 22px 12px',
      display: 'flex', alignItems: large ? 'flex-end' : 'center', gap: 12,
      background: 'var(--tm-paper)',
    }}>
      {back && (
        <button onClick={routerBack} style={{
          background: 'var(--tm-surface)', border: '1px solid var(--tm-line)',
          width: 36, height: 36, borderRadius: 18, color: 'var(--tm-ink)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', padding: 0, flexShrink: 0,
        }}>
          <Icon name="chevL" size={18} />
        </button>
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        {sub && (
          <div style={{
            fontFamily: 'var(--tm-font-mono)', fontSize: 10, letterSpacing: '0.14em',
            color: 'var(--tm-ink-muted)', textTransform: 'uppercase', marginBottom: 4,
          }}>{sub}</div>
        )}
        <div style={{
          fontFamily: large ? 'var(--tm-font-display)' : 'var(--tm-font-ui)',
          fontWeight: large ? 400 : 600, fontSize: large ? 30 : 18,
          color: 'var(--tm-ink)', letterSpacing: large ? '-0.01em' : '-0.005em',
          lineHeight: 1.1,
        }}>{title}</div>
      </div>
      {right}
    </div>
  );
};

// ─── Buttons ─────────────────────────────────────────────────
const Button = ({ children, variant = 'primary', size = 'md', icon, onClick, full, style = {} }) => {
  const sizes = {
    sm: { padY: 8, padX: 14, fs: 13, gap: 6, ih: 30 },
    md: { padY: 12, padX: 18, fs: 15, gap: 8, ih: 44 },
    lg: { padY: 16, padX: 22, fs: 16, gap: 10, ih: 52 },
  };
  const s = sizes[size];
  const variants = {
    primary:  { bg: 'var(--tm-primary)', fg: 'var(--tm-primary-ink)', bd: 'transparent' },
    secondary:{ bg: 'var(--tm-surface)', fg: 'var(--tm-ink)', bd: 'var(--tm-line)' },
    ghost:    { bg: 'transparent', fg: 'var(--tm-ink)', bd: 'transparent' },
    dark:     { bg: 'var(--tm-ink)', fg: 'var(--tm-paper)', bd: 'transparent' },
  };
  const v = variants[variant];
  return (
    <button onClick={onClick} style={{
      background: v.bg, color: v.fg, border: `1px solid ${v.bd}`,
      borderRadius: 999, padding: `${s.padY}px ${s.padX}px`,
      fontFamily: 'var(--tm-font-ui)', fontWeight: 600, fontSize: s.fs, letterSpacing: '0.005em',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: s.gap,
      cursor: 'pointer', width: full ? '100%' : 'auto', minHeight: s.ih,
      ...style,
    }}>
      {icon && <Icon name={icon} size={s.fs + 3} />}
      {children}
    </button>
  );
};

// ─── Cards / surfaces ────────────────────────────────────────
const Card = ({ children, pad = 16, style = {}, onClick }) => (
  <div onClick={onClick} style={{
    background: 'var(--tm-surface)',
    border: '1px solid var(--tm-line)',
    borderRadius: 22,
    padding: pad,
    boxShadow: 'var(--tm-card-shadow)',
    cursor: onClick ? 'pointer' : 'default',
    ...style,
  }}>
    {children}
  </div>
);

// ─── Chips & badges ──────────────────────────────────────────
const Chip = ({ children, tone = 'neutral', size = 'md', icon }) => {
  const tones = {
    neutral: { bg: 'var(--tm-paper-deep)', fg: 'var(--tm-ink-soft)' },
    primary: { bg: 'var(--tm-primary-soft)', fg: 'var(--tm-primary-deep)' },
    accent:  { bg: 'var(--tm-accent-soft)', fg: 'var(--tm-accent)' },
    warn:    { bg: 'var(--tm-warn-soft)', fg: 'var(--tm-warn)' },
    ink:     { bg: 'var(--tm-ink)', fg: 'var(--tm-paper)' },
    line:    { bg: 'transparent', fg: 'var(--tm-ink-soft)', bd: 'var(--tm-line)' },
  };
  const t = tones[tone];
  const sizes = { sm: { fs: 11, padY: 3, padX: 8, gap: 4, is: 12 }, md: { fs: 12, padY: 5, padX: 10, gap: 5, is: 14 } };
  const s = sizes[size];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: s.gap,
      background: t.bg, color: t.fg, padding: `${s.padY}px ${s.padX}px`,
      borderRadius: 999, fontFamily: 'var(--tm-font-ui)', fontWeight: 500, fontSize: s.fs,
      letterSpacing: '0.005em', border: t.bd ? `1px solid ${t.bd}` : 'none', whiteSpace: 'nowrap',
    }}>
      {icon && <Icon name={icon} size={s.is} stroke={1.8}/>}
      {children}
    </span>
  );
};

const Tag = ({ children }) => (
  <span style={{
    display: 'inline-flex', alignItems: 'center',
    padding: '4px 9px', borderRadius: 6,
    background: 'var(--tm-paper-deep)', color: 'var(--tm-ink-soft)',
    fontFamily: 'var(--tm-font-mono)', fontSize: 10.5, letterSpacing: '0.04em',
    textTransform: 'uppercase',
  }}>{children}</span>
);

// ─── Verification badge (the trust object) ───────────────────
const VerifyBadge = ({ tier = 2, size = 'sm' }) => {
  // tier: 0 phone, 1 NID, 2 education, 3 reference
  const dots = [0,1,2,3].map(i => (
    <span key={i} style={{
      width: size === 'sm' ? 4 : 5, height: size === 'sm' ? 4 : 5, borderRadius: '50%',
      background: i <= tier ? 'var(--tm-accent)' : 'var(--tm-line)',
    }}/>
  ));
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: size === 'sm' ? '3px 8px 3px 6px' : '4px 10px 4px 7px',
      borderRadius: 999,
      background: tier >= 2 ? 'var(--tm-accent-soft)' : 'var(--tm-paper-deep)',
      color: tier >= 2 ? 'var(--tm-accent)' : 'var(--tm-ink-muted)',
      fontFamily: 'var(--tm-font-ui)', fontWeight: 600,
      fontSize: size === 'sm' ? 10.5 : 12, letterSpacing: '0.02em',
    }}>
      <Icon name={tier >= 2 ? 'shieldCheck' : 'shield'} size={size === 'sm' ? 12 : 14} stroke={1.9}/>
      <span style={{ display: 'inline-flex', gap: 2, alignItems: 'center' }}>{dots}</span>
    </span>
  );
};

// ─── Avatar (initials, no images) ────────────────────────────
const Avatar = ({ name, size = 40, tone }) => {
  const initials = name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
  // deterministic tone from initials
  const tones = ['#b8462a', '#3a5d4a', '#6b5b95', '#8e3520', '#4a6a3f', '#a9742a'];
  const bg = tone || tones[(initials.charCodeAt(0) || 0) % tones.length];
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: bg, color: '#fdfaf3',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'var(--tm-font-ui)', fontWeight: 600, fontSize: Math.round(size * 0.36),
      letterSpacing: '0.02em', flexShrink: 0,
    }}>{initials}</div>
  );
};

// ─── Section heading inside a screen ─────────────────────────
const SectionLabel = ({ children, right }) => (
  <div style={{
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '14px 22px 8px',
  }}>
    <div style={{
      fontFamily: 'var(--tm-font-mono)', fontSize: 10.5, letterSpacing: '0.16em',
      textTransform: 'uppercase', color: 'var(--tm-ink-muted)',
    }}>{children}</div>
    {right}
  </div>
);

// ─── Phone shell (the actual device-frame wrapper) ───────────
// Provides paper background, status bar, scrollable body, optional tab bar.
// Mounted inside <AndroidDevice> for the bezel.
const Phone = ({ children, tab, dark = false, noStatus = false, noTab = false, route }) => {
  // When running inside the real mobile shell, the shell renders its own
  // status bar / tab bar — suppress the chrome here so we don't double up.
  const inMobileShell = typeof window !== 'undefined' && window.__TM_MOBILE_SHELL__;
  const suppressStatus = noStatus || inMobileShell;
  const suppressTab    = noTab    || inMobileShell;
  const suppressPill   = inMobileShell;

  return (
    <div style={{
      width: '100%', height: '100%',
      background: dark ? 'var(--tm-ink)' : 'var(--tm-paper)',
      color: dark ? 'var(--tm-paper)' : 'var(--tm-ink)',
      fontFamily: 'var(--tm-font-ui)',
      display: 'flex', flexDirection: 'column',
      WebkitFontSmoothing: 'antialiased',
      overflow: 'hidden',
    }}>
      {!suppressStatus && <StatusBar dark={dark} />}
      <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', position: 'relative' }}>
        {children}
      </div>
      {!suppressTab && tab && <TabBar active={tab} />}
      {!suppressPill && (
        <div style={{
          height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: dark ? 'var(--tm-ink)' : 'var(--tm-paper)', flexShrink: 0,
        }}>
          <div style={{
            width: 108, height: 4, borderRadius: 2,
            background: dark ? 'rgba(255,255,255,0.4)' : 'rgba(35,29,24,0.35)',
          }}/>
        </div>
      )}
    </div>
  );
};

// ─── Stat unit (number + label) ──────────────────────────────
const Stat = ({ value, label, sub }) => (
  <div>
    <div style={{
      fontFamily: 'var(--tm-font-display)', fontSize: 28, fontWeight: 400,
      color: 'var(--tm-ink)', lineHeight: 1, letterSpacing: '-0.01em',
      fontVariantNumeric: 'tabular-nums',
    }}>{value}</div>
    <div style={{
      fontFamily: 'var(--tm-font-mono)', fontSize: 10, letterSpacing: '0.14em',
      textTransform: 'uppercase', color: 'var(--tm-ink-muted)', marginTop: 6,
    }}>{label}</div>
    {sub && (
      <div style={{ fontSize: 12, color: 'var(--tm-ink-soft)', marginTop: 3 }}>{sub}</div>
    )}
  </div>
);

// ─── Simple inline link ──────────────────────────────────────
const Link = ({ children, onClick }) => (
  <button onClick={onClick} style={{
    background: 'transparent', border: 0, color: 'var(--tm-primary-deep)',
    fontFamily: 'var(--tm-font-ui)', fontSize: 13, fontWeight: 600,
    textDecoration: 'underline', textUnderlineOffset: '3px',
    cursor: 'pointer', padding: 0,
  }}>{children}</button>
);

Object.assign(window, {
  RouterCtx, Icon, StatusBar, TabBar, ScreenHeader, Button, Card,
  Chip, Tag, VerifyBadge, Avatar, SectionLabel, Phone, Stat, Link,
});
