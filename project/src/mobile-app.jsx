// Tution Media — full-screen mobile app entry. Replaces the design canvas
// when the app is opened on a phone or as a PWA. Routes across tutor and
// guardian flows. Bottom tab adapts to role.

// ─── Mobile router ─────────────────────────────────────────────
// Route params let us pass eg job id between screens.
function MobileApp({ palette = 'midnight' }) {
  // Signal to legacy screens (via the Phone primitive) that we're in mobile
  // shell mode — they should suppress their internal status bar / tab bar.
  // Set synchronously so first render is correct.
  window.__TM_MOBILE_SHELL__ = true;

  const s = useStore();
  const role = s.profile.role;

  // Decide initial route based on whether user has onboarded.
  const initialRoute = role === 'tutor' ? 'feed'
                     : role === 'guardian' ? 'g-home'
                     : 'welcome';

  const [route, setRoute] = React.useState(initialRoute);
  const [params, setParams] = React.useState({});
  const [history, setHistory] = React.useState([initialRoute]);

  // Derive the route to actually display. If the stored route no longer fits
  // the current role (e.g. role was just switched, or onboarding completed),
  // fall back to that role's home. Computing this during render — rather than
  // in an effect — guarantees the screen is always consistent with the role.
  const fitsRole = (r) => {
    if (!role) return r === 'welcome';
    if (role === 'tutor') return r !== 'welcome' && !r.startsWith('g-');
    if (role === 'guardian') return r !== 'welcome' && !TUTOR_ONLY.has(r);
    return true;
  };
  const homeRoute = !role ? 'welcome' : role === 'tutor' ? 'feed' : 'g-home';
  const displayRoute = fitsRole(route) ? route : homeRoute;

  // Keep the route state in sync with the derived route so navigation/back
  // operate from the correct base after a role change.
  React.useEffect(() => {
    if (displayRoute !== route) {
      setRoute(displayRoute);
      setHistory([displayRoute]);
      setParams({});
    }
  }, [displayRoute]);

  const go = (r, p = {}) => {
    setRoute(r);
    setParams(p);
    setHistory(h => [...h, r]);
  };
  const back = () => {
    setHistory(h => {
      if (h.length <= 1) return h;
      const next = h.slice(0, -1);
      setRoute(next[next.length - 1]);
      setParams({});
      return next;
    });
  };
  const replace = (r, p = {}) => {
    setRoute(r);
    setParams(p);
    setHistory([r]);
  };

  const ctx = React.useMemo(() => ({ route: displayRoute, go, back, replace, params }), [displayRoute, params]);

  const Comp = ALL_SCREENS[displayRoute] || ScreenWelcome;
  const showTabs = TAB_ROUTES.has(displayRoute) && role;

  const vars = tmVars(palette);
  const paletteObj = TM_PALETTES[palette] || TM_PALETTES.midnight;

  return (
    <RouterCtx.Provider value={ctx}>
      <div style={{
        ...vars,
        width: '100%', height: '100dvh',
        background: 'var(--tm-paper)',
        display: 'flex', flexDirection: 'column',
        WebkitFontSmoothing: 'antialiased',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
          <Comp/>
        </div>
        {showTabs && <MobileTabBar role={role} active={ROUTE_TO_TAB[displayRoute]} onPick={(r) => replace(r)}/>}
      </div>
    </RouterCtx.Provider>
  );
}

// ─── Mobile-aware bottom tab bar ───────────────────────────────
// Lives in the app shell, outside the Phone. Adapts to role.
function MobileTabBar({ role, active, onPick }) {
  const tutorTabs = [
    { id: 'feed', icon: 'feed', label: 'Jobs' },
    { id: 'heatmap', icon: 'map', label: 'Demand' },
    { id: 'schedule', icon: 'calendar', label: 'Schedule' },
    { id: 'chat', icon: 'inbox', label: 'Inbox' },
    { id: 'reputation', icon: 'user', label: 'Profile' },
  ];
  const guardianTabs = [
    { id: 'g-home', icon: 'feed', label: 'Home' },
    { id: 'g-listings', icon: 'map', label: 'Listings' },
    { id: 'chat', icon: 'inbox', label: 'Inbox' },
    { id: 'settings', icon: 'user', label: 'Settings' },
  ];
  const tabs = role === 'tutor' ? tutorTabs : guardianTabs;

  return (
    <div style={{
      borderTop: '1px solid var(--tm-line)',
      background: 'var(--tm-surface)',
      padding: '8px 6px calc(6px + env(safe-area-inset-bottom))',
      display: 'flex', justifyContent: 'space-between',
      flexShrink: 0,
    }}>
      {tabs.map(t => {
        const on = t.id === active;
        return (
          <button key={t.id} onClick={() => onPick(t.id)} style={{
            flex: 1, background: 'transparent', border: 0, padding: '6px 0 4px',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
            color: on ? 'var(--tm-primary)' : 'var(--tm-ink-muted)',
            fontFamily: 'var(--tm-font-ui)', fontSize: 11, fontWeight: 500,
            cursor: 'pointer',
          }}>
            <Icon name={t.icon} size={22} stroke={on ? 1.8 : 1.6}/>
            <span>{t.label}</span>
          </button>
        );
      })}
    </div>
  );
}

// ─── Route registry ────────────────────────────────────────────
// Routes that are valid tabs and which tab they map to.
const ROUTE_TO_TAB = {
  'feed': 'feed',
  'heatmap': 'heatmap',
  'schedule': 'schedule',
  'chat': 'chat',
  'reputation': 'reputation',
  'g-home': 'g-home',
  'g-listings': 'g-listings',
  'settings': 'settings',
};
const TAB_ROUTES = new Set(Object.keys(ROUTE_TO_TAB));
const TUTOR_ONLY = new Set(['feed', 'heatmap', 'schedule', 'reputation', 'apply', 'verify', 'location', 'job']);

const ALL_SCREENS = {
  // pre-onboarding
  welcome: ScreenWelcome,
  // tutor flows
  feed: ScreenFeed,
  apply: ScreenApply,
  job: ScreenJobDetail,
  heatmap: ScreenHeatmap,
  schedule: ScreenSchedule,
  chat: ScreenChat,
  reputation: ScreenReputation,
  verify: ScreenVerify,
  location: ScreenLocation,
  profile: ScreenProfile,
  // guardian flows
  'g-home': GuardianHome,
  'g-listings': ScreenGuardianListings,
  'g-new': ScreenListingNew,
  'g-applicants': GuardianApplicants,
  'g-tutor': GuardianTutorDetail,
  'g-hire': GuardianHire,
  // common
  settings: ScreenSettings,
};

// ─── Mobile detection ──────────────────────────────────────────
// We want the mobile app when: viewport is small, or standalone PWA mode,
// or installed home-screen launch on iOS.
function isMobileApp() {
  if (typeof window === 'undefined') return false;
  // Standalone (Add to Home Screen) → always mobile mode
  if (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) return true;
  if (window.navigator.standalone === true) return true; // iOS Safari
  // Small viewport (phone) → mobile mode
  if (window.matchMedia && window.matchMedia('(max-width: 768px)').matches) return true;
  // Touch-only device (tablet w/o keyboard) → mobile mode
  if (window.matchMedia && window.matchMedia('(hover: none) and (pointer: coarse)').matches) return true;
  // ?mobile=1 query string for testing
  if (location.search.includes('mobile=1')) return true;
  return false;
}

Object.assign(window, { MobileApp, MobileTabBar, isMobileApp });
