// Tution Media — main app component. Wraps the router, listens to auth +
// store, and routes between tutor and guardian flows.

import React from 'react';
import { useStore, bootstrap } from './store/store.js';
import { TM_PALETTES, tmVars } from './tokens.js';
import { RouterCtx, Icon } from './components/ui.jsx';

import { ScreenOnboarding, ScreenProfile, ScreenFeed, ScreenApply, JobCard } from './screens/tutor.jsx';
import { ScreenVerify, ScreenHeatmap, ScreenLocation } from './screens/trust.jsx';
import { ScreenSchedule, ScreenChat, ScreenReputation } from './screens/day.jsx';
import { GuardianHome, GuardianApplicants, GuardianTutorDetail, GuardianHire } from './screens/guardian.jsx';
import {
  ScreenWelcome, ScreenJobDetail, ScreenListingNew,
  ScreenGuardianListings, ScreenSettings, ScreenStudentCheckin, ScreenHandoff,
} from './screens/extra.jsx';
import { ScreenSignIn } from './screens/sign-in.jsx';

// Mark to the Phone primitive that we're in mobile-shell mode (suppress
// inner status bar / tab bar since the shell renders its own).
if (typeof window !== 'undefined') window.__TM_MOBILE_SHELL__ = true;

const ROUTE_TO_TAB = {
  feed: 'feed', heatmap: 'heatmap', schedule: 'schedule', chat: 'chat', reputation: 'reputation',
  'g-home': 'g-home', 'g-listings': 'g-listings', settings: 'settings',
};
const TAB_ROUTES = new Set(Object.keys(ROUTE_TO_TAB));
const TUTOR_ONLY = new Set(['feed', 'heatmap', 'schedule', 'reputation', 'apply', 'verify', 'location', 'job', 'handoff', 'checkin']);

const ALL_SCREENS = {
  signin: ScreenSignIn,
  welcome: ScreenWelcome,
  onboarding: ScreenOnboarding,
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
  handoff: ScreenHandoff,
  checkin: ScreenStudentCheckin,
  'g-home': GuardianHome,
  'g-listings': ScreenGuardianListings,
  'g-new': ScreenListingNew,
  'g-applicants': GuardianApplicants,
  'g-tutor': GuardianTutorDetail,
  'g-hire': GuardianHire,
  settings: ScreenSettings,
};

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
      display: 'flex', justifyContent: 'space-between', flexShrink: 0,
    }}>
      {tabs.map(t => {
        const on = t.id === active;
        return (
          <button key={t.id} onClick={() => onPick(t.id)} style={{
            flex: 1, background: 'transparent', border: 0, padding: '6px 0 4px',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
            color: on ? 'var(--tm-primary)' : 'var(--tm-ink-muted)',
            fontFamily: 'var(--tm-font-ui)', fontSize: 11, fontWeight: 500, cursor: 'pointer',
          }}>
            <Icon name={t.icon} size={22} stroke={on ? 1.8 : 1.6}/>
            <span>{t.label}</span>
          </button>
        );
      })}
    </div>
  );
}

export default function App({ palette = 'midnight' }) {
  // Bootstrap the store once on mount.
  React.useEffect(() => { bootstrap(); }, []);
  const s = useStore();

  // Decide the initial / current route based on auth + role.
  const route0 = !s.user ? 'signin'
                : !s.profile || !s.profile.role ? 'welcome'
                : s.profile.role === 'tutor' ? 'feed'
                : 'g-home';

  const [route, setRoute] = React.useState(route0);
  const [params, setParams] = React.useState({});
  const [history, setHistory] = React.useState([route0]);

  // If the natural home for the current auth state diverges from the stored
  // route, snap to it. This handles sign-in / sign-out and role switches.
  const role = s.profile?.role;
  const fitsRole = (r) => {
    if (!s.user) return r === 'signin';
    if (!role) return r === 'welcome';
    if (role === 'tutor') return r !== 'welcome' && r !== 'signin' && !r.startsWith('g-');
    if (role === 'guardian') return r !== 'welcome' && r !== 'signin' && !TUTOR_ONLY.has(r);
    return true;
  };
  const home = !s.user ? 'signin' : !role ? 'welcome' : role === 'tutor' ? 'feed' : 'g-home';
  const displayRoute = fitsRole(route) ? route : home;
  React.useEffect(() => {
    if (displayRoute !== route) { setRoute(displayRoute); setHistory([displayRoute]); setParams({}); }
  }, [displayRoute]);

  const go = (r, p = {}) => { setRoute(r); setParams(p); setHistory(h => [...h, r]); };
  const back = () => setHistory(h => {
    if (h.length <= 1) return h;
    const next = h.slice(0, -1);
    setRoute(next[next.length - 1]); setParams({});
    return next;
  });
  const replace = (r, p = {}) => { setRoute(r); setParams(p); setHistory([r]); };

  const ctx = React.useMemo(() => ({ route: displayRoute, go, back, replace, params }), [displayRoute, params]);
  const Comp = ALL_SCREENS[displayRoute] || ScreenSignIn;
  const showTabs = TAB_ROUTES.has(displayRoute) && role && s.user;

  const vars = tmVars(palette);

  return (
    <RouterCtx.Provider value={ctx}>
      <div style={{
        ...vars,
        width: '100%', height: '100dvh',
        background: 'var(--tm-paper)',
        display: 'flex', flexDirection: 'column',
        WebkitFontSmoothing: 'antialiased',
        position: 'relative', overflow: 'hidden',
      }}>
        {!s.ready ? (
          // Bootstrap-in-flight splash. Without this the user sees the
          // sign-in screen for a frame and then gets snapped to their home.
          <div style={{
            flex: 1, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: 18,
          }}>
            <div style={{
              width: 64, height: 64, borderRadius: 16,
              background: 'var(--tm-primary)', color: 'var(--tm-primary-ink)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'Georgia,serif', fontSize: 42, lineHeight: 1,
            }}>t</div>
          </div>
        ) : (
          <>
            <ErrorBoundary key={displayRoute}>
              <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
                <Comp/>
              </div>
            </ErrorBoundary>
            {showTabs && <MobileTabBar role={role} active={ROUTE_TO_TAB[displayRoute]} onPick={(r) => replace(r)}/>}
          </>
        )}
      </div>
    </RouterCtx.Provider>
  );
}

// Catch render exceptions per-screen so one broken screen doesn't take down
// the whole app. The key={displayRoute} above resets the boundary on every
// navigation, so a transient error doesn't permanently break the screen.
class ErrorBoundary extends React.Component {
  constructor(p) { super(p); this.state = { err: null }; }
  static getDerivedStateFromError(err) { return { err }; }
  componentDidCatch(err, info) { console.error('screen error', err, info); }
  render() {
    if (!this.state.err) return this.props.children;
    return (
      <div style={{
        flex: 1, padding: '40px 28px', display: 'flex', flexDirection: 'column',
        gap: 14, alignItems: 'flex-start', justifyContent: 'center',
      }}>
        <div style={{
          fontFamily: 'var(--tm-font-mono)', fontSize: 10.5, letterSpacing: '0.16em',
          textTransform: 'uppercase', color: 'var(--tm-ink-muted)',
        }}>Something went wrong</div>
        <div style={{
          fontFamily: 'var(--tm-font-display)', fontSize: 24, color: 'var(--tm-ink)', lineHeight: 1.1,
        }}>This screen hit an unexpected error.</div>
        <div style={{
          padding: '12px 14px', background: 'var(--tm-paper-deep)', borderRadius: 12,
          fontSize: 12, color: 'var(--tm-ink-soft)', fontFamily: 'var(--tm-font-mono)',
          whiteSpace: 'pre-wrap', maxHeight: 200, overflow: 'auto', alignSelf: 'stretch',
        }}>{this.state.err.message}</div>
        <button onClick={() => this.setState({ err: null })} style={{
          marginTop: 12, padding: '12px 22px', borderRadius: 999,
          background: 'var(--tm-primary)', color: 'var(--tm-primary-ink)',
          border: 0, fontWeight: 600, fontSize: 15, cursor: 'pointer',
        }}>Try again</button>
      </div>
    );
  }
}
