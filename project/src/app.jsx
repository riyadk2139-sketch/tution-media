// Tution Media — main app: design canvas of Android frames, each containing
// a mini clickable router for the tutor side.

// ─── MiniApp: a router-driven phone instance ─────────────────
// Each artboard owns one MiniApp, with its own initial route + history.
// Tapping a link inside the screen swaps the active screen without
// touching other artboards.
function MiniApp({ initial = 'feed', palette = 'clay' }) {
  const [route, setRoute] = React.useState(initial);
  const [history, setHistory] = React.useState([initial]);

  const go = (r) => {
    setRoute(r);
    setHistory(h => [...h, r]);
  };
  const back = () => {
    setHistory(h => {
      if (h.length <= 1) return h;
      const next = h.slice(0, -1);
      setRoute(next[next.length - 1]);
      return next;
    });
  };

  const ctx = React.useMemo(() => ({ route, go, back }), [route]);

  const screens = {
    onboarding: ScreenOnboarding,
    profile: ScreenProfile,
    feed: ScreenFeed,
    apply: ScreenApply,
    verify: ScreenVerify,
    heatmap: ScreenHeatmap,
    location: ScreenLocation,
    schedule: ScreenSchedule,
    chat: ScreenChat,
    reputation: ScreenReputation,
  };

  const Comp = screens[route] || ScreenFeed;

  // We pass the palette via inline style on the AndroidDevice's child wrapper
  // so the CSS variables are set in scope.
  const vars = tmVars(palette);

  // Resolve the palette's paper color synchronously so AndroidDevice's own
  // bg matches the theme (CSS vars don't apply to the AndroidDevice itself
  // because the var declaration is on its child, not parent).
  const paletteObj = TM_PALETTES[palette] || TM_PALETTES.midnight;
  const paperColor = paletteObj.paper;

  return (
    <RouterCtx.Provider value={ctx}>
      <div style={{ ...vars, width: '100%', height: '100%', display: 'flex',
        background: paperColor }}>
        <AndroidDevice width={412} height={892} hideStatusBar hideNavBar bg={paperColor}>
          <div style={{
            width: '100%', height: '100%',
            background: 'var(--tm-paper)',
            display: 'flex', flexDirection: 'column',
          }}>
            <Comp/>
          </div>
        </AndroidDevice>
      </div>
    </RouterCtx.Provider>
  );
}

// ─── Tweaks: palette switcher + density ──────────────────────
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "palette": "midnight",
  "showTitles": true
}/*EDITMODE-END*/;

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  // Inject font links once
  React.useEffect(() => {
    if (document.getElementById('tm-fonts')) return;
    const l = document.createElement('link');
    l.id = 'tm-fonts';
    l.rel = 'stylesheet';
    l.href = 'https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700;9..40,800&family=DM+Mono:wght@400;500&display=swap';
    document.head.appendChild(l);
  }, []);

  const p = t.palette;

  return (
    <>
      <DesignCanvas minScale={0.15} maxScale={2}>
        <DCSection id="get-started" title="Get started"
          subtitle="Easy OTP signup. Browse before you verify — the spec's “value before friction” principle.">
          <DCArtboard id="onboarding" label="Signup · OTP" width={464} height={944}>
            <MiniApp initial="onboarding" palette={p}/>
          </DCArtboard>
          <DCArtboard id="profile" label="Profile builder" width={464} height={944}>
            <MiniApp initial="profile" palette={p}/>
          </DCArtboard>
        </DCSection>

        <DCSection id="find-work" title="Find work"
          subtitle="The spine. Live feed → one-tap apply → tracker → location reveal → trial.">
          <DCArtboard id="feed" label="Live job feed" width={464} height={944}>
            <MiniApp initial="feed" palette={p}/>
          </DCArtboard>
          <DCArtboard id="apply" label="Application tracker" width={464} height={944}>
            <MiniApp initial="apply" palette={p}/>
          </DCArtboard>
          <DCArtboard id="heatmap" label="Demand near you" width={464} height={944}>
            <MiniApp initial="heatmap" palette={p}/>
          </DCArtboard>
          <DCArtboard id="location" label="Location · request" width={464} height={944}>
            <MiniApp initial="location" palette={p}/>
          </DCArtboard>
        </DCSection>

        <DCSection id="trust" title="Trust & verification"
          subtitle="The moat. Verification is optional to start but gated before placement. Reputation accrues on-platform only.">
          <DCArtboard id="verify" label="Verification ladder" width={464} height={944}>
            <MiniApp initial="verify" palette={p}/>
          </DCArtboard>
          <DCArtboard id="reputation" label="Reputation · profile" width={464} height={944}>
            <MiniApp initial="reputation" palette={p}/>
          </DCArtboard>
        </DCSection>

        <DCSection id="day-to-day" title="Day to day"
          subtitle="The relationship engine. Attendance feeds payments, masked chat keeps the line in-app.">
          <DCArtboard id="schedule" label="Schedule + attendance" width={464} height={944}>
            <MiniApp initial="schedule" palette={p}/>
          </DCArtboard>
          <DCArtboard id="chat" label="Masked inbox" width={464} height={944}>
            <MiniApp initial="chat" palette={p}/>
          </DCArtboard>
        </DCSection>
      </DesignCanvas>

      <TweaksPanel title="Tution Media">
        <TweakSection label="Palette"/>
        <TweakColor label="Theme" value={t.palette}
          options={[
            ['#FFC83D', '#0F0F0F', '#1E1E1E'],   // midnight
            ['#b8462a', '#231d18', '#f6f0e6'],   // clay
            ['#4d6b3f', '#1d231d', '#f1f1ea'],   // sage
            ['#c47410', '#28200f', '#fbf4e4'],   // marigold
          ]}
          onChange={(v) => {
            const map = {
              '#FFC83D': 'midnight',
              '#b8462a': 'clay', '#4d6b3f': 'sage', '#c47410': 'marigold',
            };
            setTweak('palette', map[v[0]] || 'midnight');
          }}
        />
        <div style={{
          fontSize: 10.5, color: 'rgba(41,38,27,.6)', marginTop: -4, lineHeight: 1.5,
        }}>
          {t.palette === 'midnight' && <>Default · deep black + vibrant yellow. Neumorphic-lite depth.</>}
          {t.palette === 'clay' && <>Clay · warm terracotta on cream. Trustworthy + community.</>}
          {t.palette === 'sage' && <>Sage · understated, education-leaning.</>}
          {t.palette === 'marigold' && <>Marigold · vivid, festival-warm energy.</>}
        </div>
        <TweakSection label="Tip"/>
        <div style={{
          fontSize: 11, color: 'rgba(41,38,27,.7)', lineHeight: 1.5,
        }}>
          Click any artboard label to open it fullscreen. Inside any phone,
          tap cards and buttons — most key transitions are wired.
        </div>
      </TweaksPanel>
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App/>);
