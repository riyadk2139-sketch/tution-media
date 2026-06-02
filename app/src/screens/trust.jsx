import React from 'react';
import {
  RouterCtx, Icon, StatusBar, TabBar, ScreenHeader, Button, Card,
  Chip, Tag, VerifyBadge, Avatar, SectionLabel, Phone, Stat, Link,
} from '../components/ui.jsx';
import { useStore, TmActions, computeMatch } from '../store/store.js';
import { pickAndUploadAvatar as pickAndSetAvatar } from '../lib/storage.js';
import {
  requestNotifPermission as tmRequestNotifPermission,
  fireNotification as tmFireNotification,
} from '../lib/notifications.js';

// The legacy code branches on `typeof X === 'function'` to detect the store
// being globally available. In the new module-based app these are always
// defined, so simplify by predeclaring `tmStore` for the few sites that use it.
import { getState as __tmGet } from '../store/store.js';
import { TM_HEATMAP } from '../lib/heatmap-seed.js';
const tmStore = { get state() { return __tmGet(); }, commit() {} };
const isMobileApp = () => true;

// Tution Media — screens batch 2: Verification gate, Demand heatmap,
// Location request + Google Maps reveal.

// ─── 5. Verification gate ────────────────────────────────────
const ScreenVerify = () => {
  const s = useStore();
  const tier = s ? (s.profile.verifyTier || 0) : 2;
  const [submitted, setSubmitted] = React.useState(false);

  React.useEffect(() => {
    if (!submitted) return;
    const t = setTimeout(() => {
      TmActions.advanceVerification();
      setSubmitted(false);
    }, 1200);
    return () => clearTimeout(t);
  }, [submitted]);

  // Tier states are derived from the user's current tier.
  const stateFor = (n) => n < tier ? 'done' : n === tier ? 'current' : 'locked';
  const tiers = [
    { n: 0, name: 'Phone', sub: 'Verified at signup', icon: 'phone',
      help: '+880 1712 048 391' },
    { n: 1, name: 'National ID', sub: 'Porichoy lookup', icon: 'id',
      help: 'NID #1989 12345' },
    { n: 2, name: 'Education', sub: 'Student ID + board result', icon: 'book',
      help: 'BUET · Mechanical Eng · ID 1804023' },
    { n: 3, name: 'Reference check', sub: 'Manual · for premium jobs', icon: 'shieldCheck',
      help: 'Unlocks ৳15k+/month placements' },
  ].map(t => ({ ...t, state: stateFor(t.n) }));

  return (
    <Phone tab="reputation">
      <ScreenHeader back title="Verification" sub={`Tier ${tier} of 4`}/>

      {/* trust ladder visual */}
      <div style={{ padding: '6px 22px 18px' }}>
        <div style={{
          background: 'var(--tm-ink)', color: 'var(--tm-paper)', borderRadius: 18,
          padding: '18px 18px 16px', position: 'relative', overflow: 'hidden',
        }}>
          {/* subtle textured backdrop */}
          <div style={{
            position: 'absolute', inset: 0, opacity: 0.15, pointerEvents: 'none',
            backgroundImage: 'radial-gradient(circle at 90% 110%, var(--tm-primary) 0%, transparent 60%)',
          }}/>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
            <div>
              <div style={{ fontFamily: 'var(--tm-font-mono)', fontSize: 10.5, letterSpacing: '0.14em', textTransform: 'uppercase', opacity: 0.65 }}>
                Trust score
              </div>
              <div style={{ fontFamily: 'var(--tm-font-display)', fontSize: 38, marginTop: 4, letterSpacing: '-0.01em', lineHeight: 1 }}>
                {tier === 0 ? 'Unverified' : tier >= 4 ? 'Trusted' : 'Verified'}
              </div>
              <div style={{ fontSize: 12.5, opacity: 0.7, marginTop: 6, maxWidth: 220, lineHeight: 1.4 }}>
                {tier === 0 && 'Complete tier 1 to start applying for jobs.'}
                {tier === 1 && 'You can apply. Add education to be hired faster.'}
                {tier === 2 && 'You can be hired. Complete tier 3 to unlock premium-rate jobs.'}
                {tier === 3 && 'Premium tier reached. Add references for the top 1% badge.'}
                {tier >= 4 && 'Highest trust tier. Top of the leaderboard.'}
              </div>
            </div>
            <div style={{ position: 'relative', width: 78, height: 78 }}>
              <svg width="78" height="78" viewBox="0 0 78 78">
                <circle cx="39" cy="39" r="32" fill="none" stroke="currentColor" strokeOpacity="0.15" strokeWidth="6"/>
                <circle cx="39" cy="39" r="32" fill="none" stroke="var(--tm-primary)" strokeWidth="6"
                  strokeDasharray={2 * Math.PI * 32} strokeDashoffset={2 * Math.PI * 32 * (1 - tier / 4)}
                  transform="rotate(-90 39 39)" strokeLinecap="round"/>
              </svg>
              <div style={{
                position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'var(--tm-font-display)', fontSize: 22,
              }}>{tier}/4</div>
            </div>
          </div>
        </div>
      </div>

      <SectionLabel>The trust ladder</SectionLabel>
      <div style={{ padding: '0 22px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {tiers.map(t => {
          const isDone = t.state === 'done';
          const isCurrent = t.state === 'current';
          const isLocked = t.state === 'locked';
          return (
            <div key={t.n} style={{
              borderRadius: 16, padding: '14px 16px',
              background: isCurrent ? 'var(--tm-primary-soft)' : 'var(--tm-surface)',
              border: `1px solid ${isCurrent ? 'transparent' : 'var(--tm-line)'}`,
              opacity: isLocked ? 0.62 : 1,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 38, height: 38, borderRadius: 10,
                  background: isDone ? 'var(--tm-accent-soft)' : isCurrent ? 'var(--tm-surface)' : 'var(--tm-paper-deep)',
                  color: isDone ? 'var(--tm-accent)' : isCurrent ? 'var(--tm-primary-deep)' : 'var(--tm-ink-muted)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon name={t.icon} size={18}/>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{
                      fontFamily: 'var(--tm-font-mono)', fontSize: 10, letterSpacing: '0.14em',
                      color: 'var(--tm-ink-muted)', textTransform: 'uppercase',
                    }}>Tier {t.n}</span>
                    {isDone && <Chip tone="accent" size="sm" icon="check">Done</Chip>}
                    {isCurrent && <Chip tone="primary" size="sm">In progress</Chip>}
                    {isLocked && <Chip tone="line" size="sm" icon="lock">Locked</Chip>}
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--tm-ink)', marginTop: 4 }}>{t.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--tm-ink-soft)', marginTop: 2 }}>{t.sub}</div>
                </div>
                {!isLocked && !isCurrent && (
                  <Icon name="chevR" size={16}/>
                )}
              </div>
              {t.help && (
                <div style={{
                  marginTop: 12, paddingTop: 12, borderTop: '1px dashed var(--tm-line)',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10,
                }}>
                  <div style={{
                    fontFamily: isDone ? 'var(--tm-font-mono)' : 'var(--tm-font-ui)',
                    fontSize: 12, color: 'var(--tm-ink-soft)', letterSpacing: isDone ? '0.02em' : 0,
                  }}>{t.help}</div>
                  {t.when && <Tag>{t.when}</Tag>}
                </div>
              )}
              {isCurrent && (
                <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <UploadRow done label="Student ID photo" meta="2 MB · uploaded"/>
                  <UploadRow label="HSC certificate" meta="JPG, PDF accepted" cta/>
                  <UploadRow label="University enrollment letter" meta="optional"/>
                  {submitted ? (
                    <div style={{
                      marginTop: 4, padding: '12px 14px', borderRadius: 12,
                      background: 'var(--tm-accent-soft)', color: 'var(--tm-accent)',
                      display: 'flex', alignItems: 'center', gap: 10, fontSize: 13.5, fontWeight: 600,
                    }}>
                      <Icon name="checkCircle" size={18}/> Submitted · review in 24h
                    </div>
                  ) : (
                    <Button full icon="upload" style={{ marginTop: 4 }} onClick={() => setSubmitted(true)}>
                      Submit for review
                    </Button>
                  )}
                  <p style={{ fontSize: 11.5, color: 'var(--tm-ink-soft)', textAlign: 'center', margin: 0, lineHeight: 1.5 }}>
                    Reviewed manually in 24h. We'll text when it's done.
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* footnote */}
      <div style={{ padding: '22px 22px 24px' }}>
        <div style={{
          background: 'transparent', border: '1px dashed var(--tm-line)', borderRadius: 14,
          padding: '14px 16px', display: 'flex', gap: 12, alignItems: 'flex-start',
        }}>
          <Icon name="shield" size={18} stroke={1.6}/>
          <div style={{ fontSize: 12.5, color: 'var(--tm-ink-soft)', lineHeight: 1.5 }}>
            <strong style={{ color: 'var(--tm-ink)' }}>Why this matters.</strong> Guardians see your tier on every application —
            verified tutors are <span style={{ color: 'var(--tm-primary-deep)', fontWeight: 600 }}>3.4× more likely</span> to be shortlisted.
            We never share your documents.
          </div>
        </div>
      </div>
    </Phone>
  );
};

const UploadRow = ({ label, meta, done: initDone, cta }) => {
  const [done, setDone] = React.useState(initDone || false);
  const [uploading, setUploading] = React.useState(false);

  const handleAdd = () => {
    if (done || uploading) return;
    setUploading(true);
    setTimeout(() => { setUploading(false); setDone(true); }, 1400);
  };

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '10px 12px', borderRadius: 10,
      background: done ? 'var(--tm-accent-soft)' : 'var(--tm-paper)',
      border: `1px ${cta ? 'solid' : 'dashed'} ${done ? 'transparent' : 'var(--tm-line)'}`,
      transition: 'background .2s',
    }}>
      <div style={{
        width: 30, height: 30, borderRadius: 8,
        background: done ? 'var(--tm-accent)' : uploading ? 'var(--tm-primary-soft)' : 'var(--tm-paper-deep)',
        color: done ? '#fff' : uploading ? 'var(--tm-primary-deep)' : 'var(--tm-ink-muted)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        transition: 'background .2s',
      }}>
        <Icon name={done ? 'check' : uploading ? 'refresh' : 'upload'} size={15} stroke={2}/>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, color: 'var(--tm-ink)', fontWeight: 500 }}>{label}</div>
        <div style={{ fontSize: 11, color: uploading ? 'var(--tm-primary-deep)' : 'var(--tm-ink-muted)', marginTop: 2 }}>
          {uploading ? 'Uploading…' : done ? 'Uploaded ✓' : meta}
        </div>
      </div>
      {cta && !done && !uploading && (
        <span onClick={handleAdd} style={{ cursor: 'pointer' }}>
          <Chip tone="primary" size="sm" icon="plus">Add</Chip>
        </span>
      )}
    </div>
  );
};

// ─── 6. Demand "near you" heatmap ────────────────────────────
const ScreenHeatmap = () => {
  const { go } = React.useContext(RouterCtx);
  const s = useStore();
  const listings = s ? s.listings : [];
  const myAreas = s ? (s.profile.areas || []) : [];

  // Real, computed stats from current listings.
  const openJobs = listings.length;
  const inMyAreas = listings.filter(l =>
    myAreas.some(a => (l.area || '').toLowerCase().includes(a.toLowerCase()))
  ).length;
  const pays = listings.map(l => l.pay).filter(Boolean).sort((a, b) => a - b);
  const median = pays.length ? pays[Math.floor(pays.length / 2)] : 0;
  const medianLabel = median >= 1000 ? `${(median / 1000).toFixed(1)}k` : String(median);

  // Suggest the highest-demand zone the tutor hasn't added yet.
  const heat = s ? s.heatmap : TM_HEATMAP;
  const suggestion = heat.find(z => !myAreas.some(a => z.name.toLowerCase().includes(a.toLowerCase())));

  return (
    <Phone tab="heatmap">
      <ScreenHeader sub="This week · near you" title="Demand near you" large
        right={
          <button style={{
            background: 'var(--tm-surface)', border: '1px solid var(--tm-line)', borderRadius: 12,
            padding: '8px 10px', color: 'var(--tm-ink)', display: 'flex', alignItems: 'center', gap: 6,
            fontSize: 12, fontWeight: 500, cursor: 'pointer',
          }}>
            <Icon name="layers" size={14}/> Subjects
          </button>
        }/>

      {/* Hero stats — computed from real listings */}
      <div style={{ padding: '0 22px 14px' }}>
        <Card pad={18}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
            <Stat value={String(openJobs)} label="Open jobs"/>
            <Stat value={String(inMyAreas)} label="In your areas"/>
            <Stat value={`৳${medianLabel}`} label="Median pay"/>
          </div>
          {suggestion && (
            <div onClick={() => { TmActions.toggleArea(suggestion.name); }} style={{
              marginTop: 14, paddingTop: 14, borderTop: '1px dashed var(--tm-line)',
              display: 'flex', alignItems: 'center', gap: 8, fontSize: 12.5, color: 'var(--tm-primary-deep)',
              cursor: 'pointer',
            }}>
              <Icon name="bolt" size={14}/> Add <strong>{suggestion.name}</strong> to your areas to see {suggestion.requests} more requests.
            </div>
          )}
        </Card>
      </div>

      {/* The map */}
      <div style={{ padding: '0 22px' }}>
        <div style={{
          position: 'relative', height: 280, borderRadius: 18, overflow: 'hidden',
          background: '#f5f3ee', border: '1px solid rgba(0,0,0,0.12)',
          boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
        }}>
          <Heatmap/>

          {/* GMaps-style search bar */}
          <div style={{
            position: 'absolute', top: 12, left: 12, right: 52,
            background: '#fff', borderRadius: 24, padding: '9px 14px',
            display: 'flex', alignItems: 'center', gap: 8,
            boxShadow: '0 2px 8px rgba(0,0,0,0.22)',
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2.2" strokeLinecap="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <span style={{ fontSize: 12.5, color: '#555', flex: 1 }}>Dhanmondi cluster</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4285F4" strokeWidth="2.2" strokeLinecap="round">
              <polygon points="3 11 22 2 13 21 11 13 3 11"/>
            </svg>
          </div>

          {/* Zoom buttons */}
          <div style={{
            position: 'absolute', right: 12, top: 60,
            display: 'flex', flexDirection: 'column', gap: 1,
            boxShadow: '0 2px 8px rgba(0,0,0,0.22)', borderRadius: 6, overflow: 'hidden',
          }}>
            {['+', '−'].map(s => (
              <div key={s} style={{
                width: 32, height: 32, background: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 18, color: '#555', cursor: 'pointer', fontWeight: 300,
                borderBottom: s === '+' ? '1px solid #e8e8e8' : 'none',
              }}>{s}</div>
            ))}
          </div>

          {/* Layer button */}
          <div style={{
            position: 'absolute', right: 12, top: 12,
            width: 32, height: 32, background: '#fff', borderRadius: 6,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.22)', cursor: 'pointer',
          }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 2 7 12 12 22 7 12 2"/>
              <polyline points="2 17 12 22 22 17"/>
              <polyline points="2 12 12 17 22 12"/>
            </svg>
          </div>

          {/* YOU — Google blue current-location dot */}
          <div style={{
            position: 'absolute', left: 'calc(42% - 16px)', top: 'calc(50% - 16px)',
          }}>
            <div style={{
              width: 32, height: 32, borderRadius: 16,
              background: 'rgba(66,133,244,0.18)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <div style={{
                width: 18, height: 18, borderRadius: 9,
                background: 'rgba(66,133,244,0.25)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <div style={{
                  width: 10, height: 10, borderRadius: 5,
                  background: '#4285F4', border: '2.5px solid #fff',
                  boxShadow: '0 2px 6px rgba(66,133,244,0.5)',
                }}/>
              </div>
            </div>
          </div>

          {/* Multi-color heat legend */}
          <div style={{
            position: 'absolute', left: 12, bottom: 12, background: 'rgba(255,255,255,0.92)',
            borderRadius: 8, padding: '6px 10px',
            boxShadow: '0 1px 5px rgba(0,0,0,0.18)',
          }}>
            <div style={{ fontSize: 9, color: '#666', marginBottom: 4, fontFamily: 'Arial,sans-serif', fontWeight: 600, letterSpacing: '0.04em' }}>
              DEMAND INTENSITY
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ fontSize: 9, color: '#888' }}>Low</span>
              <div style={{
                width: 80, height: 6, borderRadius: 3,
                background: 'linear-gradient(90deg, #0078ff, #00b894, #8cd200, #ffb300, #ff5000, #cc0000)',
              }}/>
              <span style={{ fontSize: 9, color: '#888' }}>High</span>
            </div>
          </div>

          {/* Scale bar */}
          <div style={{
            position: 'absolute', right: 12, bottom: 14,
            display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2,
          }}>
            <div style={{
              width: 44, height: 3, borderLeft: '1.5px solid #555',
              borderRight: '1.5px solid #555', borderBottom: '1.5px solid #555',
            }}/>
            <span style={{ fontSize: 8.5, color: '#555', fontFamily: 'Arial,sans-serif' }}>500 m</span>
          </div>
        </div>
      </div>

      <SectionLabel right={<span style={{ fontFamily: 'var(--tm-font-mono)', fontSize: 10.5, letterSpacing: '0.1em', color: 'var(--tm-ink-muted)' }}>SORTED BY HEAT</span>}>
        Top zones this week
      </SectionLabel>
      <div style={{ padding: '0 22px 24px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {TM_HEATMAP.slice(0, 5).map((z, i) => (
          <div key={z.name} onClick={() => go('feed')} style={{
            display: 'flex', alignItems: 'center', gap: 14,
            padding: '12px 14px', background: 'var(--tm-surface)',
            border: '1px solid var(--tm-line)', borderRadius: 14,
            cursor: 'pointer',
          }}>
            <div style={{
              width: 30, textAlign: 'center', fontFamily: 'var(--tm-font-display)',
              fontSize: 22, color: 'var(--tm-ink-muted)',
              fontVariantNumeric: 'tabular-nums', lineHeight: 1,
            }}>{i + 1}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--tm-ink)' }}>{z.name}</span>
                {i < 2 && <Chip tone="primary" size="sm" icon="flame">Hot</Chip>}
              </div>
              <div style={{ fontSize: 12, color: 'var(--tm-ink-soft)', marginTop: 2 }}>
                {z.requests} requests · {z.top}
              </div>
            </div>
            <div style={{ width: 60, height: 6, borderRadius: 3, background: 'var(--tm-paper-deep)', overflow: 'hidden' }}>
              <div style={{ width: `${z.intensity * 100}%`, height: '100%', background: 'var(--tm-primary)' }}/>
            </div>
          </div>
        ))}
      </div>
    </Phone>
  );
};

// Google Maps-inspired heat map of Dhaka's Dhanmondi cluster
const Heatmap = () => {
  const W = 380, H = 280;

  const heatStop = (intensity) => {
    if (intensity > 0.85) return { c: 'rgb(200,0,0)',   op: 0.85 };
    if (intensity > 0.70) return { c: 'rgb(255,80,0)',  op: 0.80 };
    if (intensity > 0.55) return { c: 'rgb(255,175,0)', op: 0.75 };
    if (intensity > 0.40) return { c: 'rgb(140,210,0)', op: 0.68 };
    if (intensity > 0.25) return { c: 'rgb(0,185,130)', op: 0.60 };
    return                        { c: 'rgb(0,120,255)', op: 0.52 };
  };

  const pinColor = (intensity) => {
    if (intensity > 0.85) return '#cc0000';
    if (intensity > 0.70) return '#ff5000';
    if (intensity > 0.55) return '#ffb300';
    if (intensity > 0.40) return '#7bc800';
    if (intensity > 0.25) return '#00b894';
    return '#0078ff';
  };

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
      <defs>
        {TM_HEATMAP.map((z, i) => {
          const { c, op } = heatStop(z.intensity);
          return (
            <radialGradient key={i} id={`gheat-${i}`} cx="50%" cy="50%" r="50%">
              <stop offset="0%"   stopColor={c} stopOpacity={op}/>
              <stop offset="55%"  stopColor={c} stopOpacity={op * 0.45}/>
              <stop offset="100%" stopColor={c} stopOpacity="0"/>
            </radialGradient>
          );
        })}
      </defs>

      {/* Google Maps light base */}
      <rect width={W} height={H} fill="#f5f3ee"/>

      {/* Parks */}
      <rect x="24" y="14" width="54" height="40" rx="5" fill="#c6e6b3"/>
      <rect x="296" y="196" width="68" height="55" rx="5" fill="#c6e6b3"/>

      {/* Dhanmondi Lake */}
      <path d="M176 10 C 180 55, 172 105, 177 148 C 182 188, 173 228, 178 272"
        stroke="#a5c8df" strokeWidth="22" fill="none" strokeLinecap="round"/>

      {/* Building blocks */}
      <g fill="#e8e2d4">
        <rect x="34" y="20" width="38" height="24" rx="2"/>
        <rect x="80" y="20" width="34" height="24" rx="2"/>
        <rect x="34" y="50" width="26" height="20" rx="2"/>
        <rect x="68" y="50" width="44" height="20" rx="2"/>
        <rect x="10" y="118" width="40" height="26" rx="2"/>
        <rect x="10" y="150" width="58" height="24" rx="2"/>
        <rect x="10" y="182" width="46" height="22" rx="2"/>
        <rect x="10" y="212" width="52" height="22" rx="2"/>
        <rect x="208" y="38" width="50" height="30" rx="2"/>
        <rect x="266" y="38" width="44" height="30" rx="2"/>
        <rect x="318" y="38" width="50" height="30" rx="2"/>
        <rect x="208" y="76" width="38" height="24" rx="2"/>
        <rect x="254" y="76" width="50" height="24" rx="2"/>
        <rect x="312" y="76" width="56" height="24" rx="2"/>
        <rect x="252" y="146" width="44" height="28" rx="2"/>
        <rect x="304" y="146" width="64" height="28" rx="2"/>
        <rect x="252" y="182" width="36" height="24" rx="2"/>
        <rect x="52" y="224" width="48" height="30" rx="2"/>
        <rect x="112" y="224" width="44" height="30" rx="2"/>
      </g>

      {/* Major roads */}
      <g stroke="#ffffff" strokeWidth="7" fill="none" strokeLinecap="round">
        <line x1="14" y1="0" x2="14" y2={H}/>
        <line x1="204" y1="0" x2="203" y2={H}/>
        <line x1="0" y1="102" x2={W} y2="100"/>
        <line x1="0" y1="210" x2={W} y2="208"/>
      </g>

      {/* Secondary roads */}
      <g stroke="#ede8de" strokeWidth="4" fill="none" strokeLinecap="round">
        <line x1="0" y1="56" x2={W} y2="54"/>
        <line x1="0" y1="158" x2={W} y2="160"/>
        <line x1="0" y1="256" x2={W} y2="254"/>
        <line x1="80" y1="0" x2="80" y2={H}/>
        <line x1="144" y1="0" x2="144" y2={H}/>
        <line x1="250" y1="0" x2="250" y2={H}/>
        <line x1="312" y1="0" x2="312" y2={H}/>
      </g>

      {/* Tertiary streets */}
      <g stroke="#ede8de" strokeWidth="2" fill="none" opacity="0.7">
        <line x1="0" y1="28" x2={W} y2="28"/>
        <line x1="0" y1="130" x2={W} y2="130"/>
        <line x1="0" y1="184" x2={W} y2="183"/>
        <line x1="50" y1="0" x2="50" y2={H}/>
        <line x1="114" y1="0" x2="114" y2={H}/>
        <line x1="228" y1="0" x2="228" y2={H}/>
        <line x1="278" y1="0" x2="278" y2={H}/>
        <line x1="344" y1="0" x2="344" y2={H}/>
      </g>

      {/* Heat blobs */}
      {TM_HEATMAP.map((z, i) => (
        <circle key={i} cx={z.x * W} cy={z.y * H} r={32 + z.intensity * 60}
          fill={`url(#gheat-${i})`}/>
      ))}

      {/* Zone pins — top 4 zones */}
      {TM_HEATMAP.slice(0, 4).map((z, i) => {
        const cx = z.x * W, cy = z.y * H;
        const col = pinColor(z.intensity);
        return (
          <g key={i} transform={`translate(${cx},${cy})`}>
            <circle r="14" fill="rgba(0,0,0,0.18)" cx="1" cy="3"/>
            <circle r="14" fill={col} stroke="#ffffff" strokeWidth="2.5"/>
            <text textAnchor="middle" dominantBaseline="central" y="0.5"
              fontFamily="Arial,sans-serif" fontSize="10" fontWeight="700" fill="#fff">
              {z.requests}
            </text>
            {/* label pill */}
            <rect x="-22" y="18" width="44" height="14" rx="7" fill="rgba(255,255,255,0.9)"/>
            <text textAnchor="middle" y="28" fontFamily="Arial,sans-serif"
              fontSize="8.5" fontWeight="700" fill="#333">
              {z.name.split(' ')[0]}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

// ─── 7. Location request + reveal (Google Maps) ─────────────
const ScreenLocation = () => {
  const { go } = React.useContext(RouterCtx);
  const [granted, setGranted] = React.useState(false);

  return (
    <Phone tab="feed">
      <ScreenHeader back title={granted ? 'Navigate to home' : 'Location access'} sub={granted ? 'Dhanmondi 27' : 'Job j-114'}/>

      {/* The map view — same in both states, but the marker mode changes */}
      <div style={{ padding: '0 22px 14px' }}>
        <div style={{
          position: 'relative', height: 340, borderRadius: 18, overflow: 'hidden',
          background: '#f5f3ee', border: '1px solid rgba(0,0,0,0.12)',
          boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
        }}>
          <MapsView granted={granted}/>

          {!granted && (
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(180deg, rgba(35,29,24,0.05) 40%, rgba(35,29,24,0.55) 100%)',
              display: 'flex', alignItems: 'flex-end', padding: 16,
            }}>
              <div style={{
                background: 'var(--tm-surface)', borderRadius: 14, padding: '14px 14px',
                width: '100%', display: 'flex', alignItems: 'center', gap: 12,
                border: '1px solid var(--tm-line)',
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10, background: 'var(--tm-warn-soft)',
                  color: 'var(--tm-warn)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon name="lock" size={16}/>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--tm-ink)' }}>Exact address hidden</div>
                  <div style={{ fontSize: 11.5, color: 'var(--tm-ink-soft)', marginTop: 2 }}>
                    Approximate pin · ~300m radius
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* GMaps-style search bar — always visible */}
          <div style={{
            position: 'absolute', top: 12, left: 12, right: 12,
            background: '#fff', borderRadius: 24, padding: '10px 14px',
            display: 'flex', alignItems: 'center', gap: 10,
            boxShadow: '0 2px 10px rgba(0,0,0,0.24)',
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={granted ? '#4285F4' : '#888'} strokeWidth="2.2" strokeLinecap="round">
              {granted
                ? <><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></>
                : <><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></>
              }
            </svg>
            <div style={{ flex: 1, fontSize: 12.5, color: granted ? '#333' : '#777', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {granted ? 'House 47, Road 9/A, Dhanmondi 27' : 'Approximate area · Dhanmondi 27'}
            </div>
            {granted && (
              <div style={{
                background: '#4285F4', color: '#fff', padding: '3px 9px',
                borderRadius: 12, fontSize: 10, fontWeight: 700, letterSpacing: '0.04em', whiteSpace: 'nowrap',
              }}>14 MIN</div>
            )}
          </div>

          {/* Zoom + Layer buttons */}
          <div style={{ position: 'absolute', right: 12, top: 60, display: 'flex', flexDirection: 'column', gap: 1 }}>
            <div style={{
              display: 'flex', flexDirection: 'column', gap: 1,
              boxShadow: '0 2px 8px rgba(0,0,0,0.22)', borderRadius: 6, overflow: 'hidden',
            }}>
              {['+', '−'].map(s => (
                <div key={s} style={{
                  width: 32, height: 32, background: '#fff', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: 18, color: '#555', cursor: 'pointer', fontWeight: 300,
                  borderBottom: s === '+' ? '1px solid #e8e8e8' : 'none',
                }}>{s}</div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Status panel */}
      {!granted && (
        <div style={{ padding: '0 22px' }}>
          <Card pad={18}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Avatar name="Mr. Rahman" size={42}/>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--tm-ink)' }}>Mr. Rahman</div>
                <div style={{ fontSize: 12, color: 'var(--tm-ink-soft)', marginTop: 2 }}>
                  Guardian · shortlisted you 14 min ago
                </div>
              </div>
              <Chip tone="primary" size="sm">Shortlisted</Chip>
            </div>
            <div style={{
              marginTop: 14, padding: '12px 14px', background: 'var(--tm-paper)', borderRadius: 12,
              fontSize: 13, color: 'var(--tm-ink-soft)', lineHeight: 1.5,
            }}>
              Request the guardian's exact location to plan a trial. They'll get a single tap to approve —
              you'll only see the address for this job.
            </div>
            <div style={{ marginTop: 14, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <Detail label="Area" value="Dhanmondi 27"/>
              <Detail label="Landmark" value="Near Aarong"/>
              <Detail label="Trial slot" value="Sat, 6:30pm"/>
              <Detail label="Estimated" value="~1.4 km"/>
            </div>
            <div style={{ marginTop: 14 }}>
              <Button full icon="pin" onClick={() => setGranted(true)}>Request exact location</Button>
            </div>
            <p style={{ fontSize: 11.5, color: 'var(--tm-ink-muted)', textAlign: 'center', margin: '10px 0 0', lineHeight: 1.5 }}>
              Access is scoped to this job and revoked if you're not hired.
            </p>
          </Card>
        </div>
      )}

      {granted && (
        <div style={{ padding: '0 22px' }}>
          <Card pad={16}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 42, height: 42, borderRadius: 12, background: 'var(--tm-accent-soft)',
                color: 'var(--tm-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Icon name="shieldCheck" size={20}/>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--tm-ink)' }}>Location unlocked</div>
                <div style={{ fontSize: 12, color: 'var(--tm-ink-soft)', marginTop: 2 }}>
                  Mr. Rahman approved · just now
                </div>
              </div>
            </div>

            <div style={{
              marginTop: 14, paddingTop: 14, borderTop: '1px dashed var(--tm-line)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10,
            }}>
              <div>
                <div style={{ fontFamily: 'var(--tm-font-display)', fontSize: 22, color: 'var(--tm-ink)', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>1.4 km</div>
                <div style={{ fontSize: 11, color: 'var(--tm-ink-muted)', marginTop: 4, fontFamily: 'var(--tm-font-mono)', letterSpacing: '0.06em' }}>BY ROAD</div>
              </div>
              <div>
                <div style={{ fontFamily: 'var(--tm-font-display)', fontSize: 22, color: 'var(--tm-ink)', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>14 min</div>
                <div style={{ fontSize: 11, color: 'var(--tm-ink-muted)', marginTop: 4, fontFamily: 'var(--tm-font-mono)', letterSpacing: '0.06em' }}>RICKSHAW</div>
              </div>
              <div>
                <div style={{ fontFamily: 'var(--tm-font-display)', fontSize: 22, color: 'var(--tm-ink)', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>6 min</div>
                <div style={{ fontSize: 11, color: 'var(--tm-ink-muted)', marginTop: 4, fontFamily: 'var(--tm-font-mono)', letterSpacing: '0.06em' }}>CAR</div>
              </div>
            </div>

            <div style={{ marginTop: 14, display: 'flex', gap: 8 }}>
              <Button variant="secondary" icon="phone" full>Call masked</Button>
              <Button icon="nav" full>Navigate</Button>
            </div>
          </Card>

          <div style={{ marginTop: 14, padding: '12px 14px', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <Icon name="shield" size={16} stroke={1.7}/>
            <div style={{ fontSize: 11.5, color: 'var(--tm-ink-soft)', lineHeight: 1.5 }}>
              You're seeing this address because the guardian shortlisted you.
              We log every access — please don't share it.
            </div>
          </div>
        </div>
      )}
      <div style={{ height: 24 }}/>
    </Phone>
  );
};

const Detail = ({ label, value }) => (
  <div style={{ padding: '10px 12px', background: 'var(--tm-paper)', borderRadius: 10 }}>
    <div style={{
      fontFamily: 'var(--tm-font-mono)', fontSize: 9.5, letterSpacing: '0.14em',
      color: 'var(--tm-ink-muted)', textTransform: 'uppercase',
    }}>{label}</div>
    <div style={{ fontSize: 13, color: 'var(--tm-ink)', marginTop: 4, fontWeight: 500 }}>{value}</div>
  </div>
);

// Google Maps-style map — fuzzy pin when not granted, blue route + red pin when granted
const MapsView = ({ granted }) => {
  const W = 380, H = 340;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
      {/* Google Maps light base */}
      <rect width={W} height={H} fill="#f5f3ee"/>

      {/* Parks */}
      <rect x="50" y="18" width="85" height="62" rx="5" fill="#c6e6b3"/>
      <rect x="252" y="242" width="106" height="72" rx="5" fill="#c6e6b3"/>

      {/* Water (lake) */}
      <path d="M186 14 C 190 75, 182 145, 187 205 C 192 260, 182 300, 186 342"
        stroke="#a5c8df" strokeWidth="26" fill="none" strokeLinecap="round"/>

      {/* Building blocks */}
      <g fill="#e8e2d4">
        <rect x="18" y="24" width="46" height="32" rx="2"/>
        <rect x="72" y="24" width="38" height="32" rx="2"/>
        <rect x="18" y="64" width="36" height="26" rx="2"/>
        <rect x="62" y="64" width="50" height="26" rx="2"/>
        <rect x="18" y="142" width="44" height="28" rx="2"/>
        <rect x="18" y="178" width="58" height="25" rx="2"/>
        <rect x="18" y="212" width="50" height="26" rx="2"/>
        <rect x="18" y="248" width="46" height="27" rx="2"/>
        <rect x="214" y="36" width="54" height="36" rx="2"/>
        <rect x="276" y="36" width="48" height="36" rx="2"/>
        <rect x="332" y="36" width="36" height="36" rx="2"/>
        <rect x="214" y="80" width="40" height="26" rx="2"/>
        <rect x="262" y="80" width="54" height="26" rx="2"/>
        <rect x="324" y="80" width="44" height="26" rx="2"/>
        <rect x="232" y="148" width="48" height="30" rx="2"/>
        <rect x="288" y="148" width="62" height="30" rx="2"/>
        <rect x="232" y="186" width="42" height="27" rx="2"/>
        <rect x="282" y="186" width="72" height="27" rx="2"/>
        <rect x="232" y="222" width="46" height="26" rx="2"/>
      </g>

      {/* Major roads */}
      <g stroke="#ffffff" strokeWidth="8" fill="none" strokeLinecap="round">
        <line x1="16" y1="0" x2="16" y2={H}/>
        <line x1="210" y1="0" x2="208" y2={H}/>
        <line x1="0" y1="120" x2={W} y2="118"/>
        <line x1="0" y1="238" x2={W} y2="236"/>
      </g>

      {/* Secondary roads */}
      <g stroke="#ede8de" strokeWidth="4.5" fill="none" strokeLinecap="round">
        <line x1="0" y1="66" x2={W} y2="64"/>
        <line x1="0" y1="176" x2={W} y2="178"/>
        <line x1="0" y1="308" x2={W} y2="306"/>
        <line x1="90" y1="0" x2="90" y2={H}/>
        <line x1="155" y1="0" x2="155" y2={H}/>
        <line x1="268" y1="0" x2="268" y2={H}/>
        <line x1="330" y1="0" x2="330" y2={H}/>
      </g>

      {/* Tertiary */}
      <g stroke="#ede8de" strokeWidth="2.5" fill="none" opacity="0.7">
        <line x1="0" y1="32" x2={W} y2="32"/>
        <line x1="0" y1="97" x2={W} y2="97"/>
        <line x1="0" y1="155" x2={W} y2="154"/>
        <line x1="0" y1="207" x2={W} y2="206"/>
        <line x1="0" y1="270" x2={W} y2="269"/>
        <line x1="52" y1="0" x2="52" y2={H}/>
        <line x1="120" y1="0" x2="120" y2={H}/>
        <line x1="240" y1="0" x2="240" y2={H}/>
        <line x1="294" y1="0" x2="294" y2={H}/>
        <line x1="352" y1="0" x2="352" y2={H}/>
      </g>

      {/* Compass rose */}
      <g transform="translate(348, 28)">
        <circle r="14" fill="rgba(255,255,255,0.92)" stroke="#e0dcd4" strokeWidth="1"/>
        <text textAnchor="middle" y="-3" fontFamily="Arial,sans-serif" fontSize="9" fontWeight="700" fill="#444">N</text>
        <path d="M0 0 L -3 6 L 0 4 L 3 6 Z" fill="#EA4335"/>
        <path d="M0 0 L -3 -6 L 0 -4 L 3 -6 Z" fill="#bbb"/>
      </g>

      {/* YOU — Google blue current location */}
      <g transform="translate(115, 255)">
        <circle r="26" fill="#4285F4" opacity="0.12"/>
        <circle r="16" fill="#4285F4" opacity="0.18"/>
        <circle r="9" fill="#4285F4" stroke="#ffffff" strokeWidth="3"
          style={{ filter: 'drop-shadow(0 2px 4px rgba(66,133,244,0.6))' }}/>
      </g>

      {/* NOT GRANTED — fuzzy dashed circle + ghost pin */}
      {!granted && (
        <g transform="translate(258, 115)">
          <circle r="68" fill="#4285F4" opacity="0.07"/>
          <circle r="68" fill="none" stroke="#4285F4" strokeWidth="1.5"
            strokeDasharray="6 5" opacity="0.45"/>
          {/* ghost pin */}
          <path d="M0 -22 C -13 -22, -20 -12, -20 -2 C -20 12, 0 30, 0 30 C 0 30, 20 12, 20 -2 C 20 -12, 13 -22, 0 -22Z"
            fill="#999" opacity="0.30"/>
          <circle r="6" cy="-2" fill="rgba(255,255,255,0.65)"/>
          <text textAnchor="middle" y="48" fontFamily="Arial,sans-serif" fontSize="9"
            fontWeight="600" fill="#555">~300 m radius</text>
        </g>
      )}

      {/* GRANTED — Google-style blue route + red destination pin */}
      {granted && (
        <>
          {/* Route glow */}
          <path d="M115 255 C 142 228, 175 198, 198 172 C 218 150, 244 132, 258 117"
            stroke="#4285F4" strokeWidth="12" fill="none" strokeLinecap="round" opacity="0.2"/>
          {/* Route line */}
          <path d="M115 255 C 142 228, 175 198, 198 172 C 218 150, 244 132, 258 117"
            stroke="#4285F4" strokeWidth="6" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
          {/* Direction arrow mid-route */}
          <g transform="translate(185,188) rotate(-45)">
            <path d="M0 -5 L 5 0 L 0 5" stroke="#4285F4" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
          </g>
          {/* Destination shadow */}
          <ellipse cx="260" cy="116" rx="8" ry="4" fill="rgba(0,0,0,0.22)"/>
          {/* Destination pin — Google red */}
          <g transform="translate(258, 110)">
            <path d="M0 -20 C -13 -20, -20 -10, -20 -2 C -20 14, 0 32, 0 32 C 0 32, 20 14, 20 -2 C 20 -10, 13 -20, 0 -20Z"
              fill="#EA4335" stroke="#ffffff" strokeWidth="2.5"/>
            <circle r="6.5" cy="-4" fill="#ffffff"/>
          </g>
          {/* Distance badge */}
          <rect x="258" y="148" width="50" height="20" rx="10" fill="rgba(255,255,255,0.95)"
            style={{ filter: 'drop-shadow(0 1px 4px rgba(0,0,0,0.2))' }}/>
          <text x="283" y="161" textAnchor="middle" fontFamily="Arial,sans-serif"
            fontSize="9.5" fontWeight="700" fill="#333">1.4 km</text>
        </>
      )}
    </svg>
  );
};

export { ScreenVerify, ScreenHeatmap, ScreenLocation };