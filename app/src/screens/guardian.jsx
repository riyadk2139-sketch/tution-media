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
const tmStore = { get state() { return __tmGet(); }, commit() {} };
const isMobileApp = () => true;

// Tution Media — Guardian / parent side.
// Four screens: Home dashboard, applicant list, tutor detail + shortlist,
// trial → hire confirmation.

// ─── G-1. Guardian dashboard ──────────────────────────────────
const GuardianHome = () => {
  const { go } = React.useContext(RouterCtx);
  const [dismissed, setDismissed] = React.useState(false);
  const s = useStore();
  const myName = s.profile.name || 'Guardian';
  // Guardians read their own listings from state.myListings (loaded server-
  // side by guardian id) rather than filtering the open-feed by ownership,
  // which is brittle and won't include filled/closed ones.
  const myListings = s.myListings || [];
  const activeListing = myListings[0];
  // state.applications holds *my own* applications (empty for guardians).
  // Per-listing applicants live in state.listingApplicants, keyed by id.
  const applicantsForActive = activeListing
    ? (s.listingApplicants[activeListing.id] || [])
    : [];

  return (
    <Phone tab="feed" noTab>
      <StatusBar/>
      <div style={{ overflowY: 'auto', flex: 1 }}>
        {/* Header */}
        <div style={{ padding: '14px 22px 6px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
              <div style={{
                width: 22, height: 22, borderRadius: 6, background: 'var(--tm-primary)',
                color: 'var(--tm-primary-ink)', display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontFamily: 'var(--tm-font-display)', fontSize: 15,
                transform: 'translateY(1px)',
              }}>t</div>
              <span style={{ fontFamily: 'var(--tm-font-display)', fontSize: 17, color: 'var(--tm-ink)', letterSpacing: '-0.01em' }}>
                Tution<span style={{ color: 'var(--tm-primary)' }}>.</span>media
              </span>
            </div>
            <div style={{ fontSize: 12, color: 'var(--tm-ink-muted)', marginTop: 2, fontFamily: 'var(--tm-font-mono)', letterSpacing: '0.06em' }}>
              GUARDIAN · {myName.toUpperCase()}
            </div>
          </div>
          <div style={{ position: 'relative' }}>
            <Avatar name={myName} size={38} src={s ? s.profile.avatar : undefined}/>
            {applicantsForActive.length > 0 && (
              <div style={{
                position: 'absolute', top: -2, right: -2, minWidth: 14, height: 14, padding: '0 3px',
                borderRadius: 7, background: 'var(--tm-primary)', border: '2px solid var(--tm-paper)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 8, fontWeight: 700, color: 'var(--tm-primary-ink)',
              }}>{applicantsForActive.length}</div>
            )}
          </div>
        </div>

        {/* Empty state: prompt to post first listing */}
        {!activeListing && (
          <div style={{ padding: '20px 22px' }}>
            <div style={{
              borderRadius: 18, padding: '24px 20px',
              background: 'var(--tm-primary-soft)', textAlign: 'center',
            }}>
              <div style={{
                width: 56, height: 56, borderRadius: 16, background: 'var(--tm-primary)',
                color: 'var(--tm-primary-ink)', display: 'inline-flex',
                alignItems: 'center', justifyContent: 'center', marginBottom: 14,
              }}>
                <Icon name="plus" size={26} stroke={2}/>
              </div>
              <div style={{ fontFamily: 'var(--tm-font-display)', fontSize: 22, color: 'var(--tm-ink)', letterSpacing: '-0.01em' }}>
                Post your first tuition
              </div>
              <div style={{ fontSize: 13, color: 'var(--tm-ink-soft)', marginTop: 8, lineHeight: 1.5, maxWidth: 280, margin: '8px auto 16px' }}>
                Tutors near you will see it instantly. Most listings get applicants within 1 hour.
              </div>
              <Button icon="bolt" onClick={() => go('g-new')}>Post a tuition</Button>
            </div>
          </div>
        )}

        {/* Active requirement card */}
        {activeListing && (
          <div style={{ padding: '10px 22px' }}>
            <div onClick={() => go('g-applicants', { listingId: activeListing.id })} style={{
              borderRadius: 18, padding: '18px 18px 16px', position: 'relative', overflow: 'hidden',
              background: 'var(--tm-ink)', color: 'var(--tm-paper)', cursor: 'pointer',
            }}>
              <div style={{
                position: 'absolute', inset: 0, opacity: 0.12, pointerEvents: 'none',
                backgroundImage: 'radial-gradient(circle at 85% 105%, var(--tm-primary) 0%, transparent 60%)',
              }}/>
              <div style={{ position: 'relative' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontFamily: 'var(--tm-font-mono)', fontSize: 9.5, opacity: 0.55, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
                      Active listing · {activeListing.id}
                    </div>
                    <div style={{ fontFamily: 'var(--tm-font-display)', fontSize: 22, marginTop: 4, letterSpacing: '-0.01em', lineHeight: 1.1 }}>
                      {activeListing.subjects.join(' + ')}
                    </div>
                  </div>
                  <Chip tone="primary" size="sm" icon="bolt">Live</Chip>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 12 }}>
                  {[
                    `${activeListing.level} · ${activeListing.curriculum}`,
                    ...activeListing.subjects,
                    activeListing.area,
                    `৳${activeListing.pay.toLocaleString()}/mo`,
                  ].map(t => (
                    <div key={t} style={{
                      padding: '4px 10px', borderRadius: 20, background: 'rgba(255,255,255,0.10)',
                      fontSize: 11.5, fontWeight: 500,
                    }}>{t}</div>
                  ))}
                </div>

                <div style={{
                  marginTop: 16, paddingTop: 14, borderTop: '1px solid rgba(255,255,255,0.12)',
                  display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8,
                }}>
                  {[
                    { v: String(applicantsForActive.length), l: 'Applicants' },
                    { v: String(applicantsForActive.filter(a => a.state === 'shortlisted').length), l: 'Shortlisted' },
                    { v: String(applicantsForActive.filter(a => a.state === 'trial-scheduled' || a.state === 'hired').length), l: 'Trial / hired' },
                  ].map(st => (
                    <div key={st.l}>
                      <div style={{ fontFamily: 'var(--tm-font-display)', fontSize: 26, lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>{st.v}</div>
                      <div style={{ fontSize: 10.5, opacity: 0.65, marginTop: 3 }}>{st.l}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div style={{ marginTop: 12 }}>
              <Button variant="secondary" full icon="plus" onClick={() => go('g-new')}>
                Post another tuition
              </Button>
            </div>
          </div>
        )}

        {/* New applicants nudge — only when there really are applicants. */}
        {!dismissed && applicantsForActive.length > 0 && (
          <div style={{ padding: '0 22px 12px' }}>
            <div onClick={() => go('g-applicants', { listingId: activeListing.id })} style={{
              background: 'var(--tm-primary-soft)', borderRadius: 14, padding: '12px 14px',
              display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer',
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10, background: 'var(--tm-primary)',
                color: 'var(--tm-primary-ink)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <Icon name="bell" size={17}/>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--tm-ink)' }}>
                  {applicantsForActive.length} {applicantsForActive.length === 1 ? 'applicant' : 'applicants'} ready to review
                </div>
                <div style={{ fontSize: 11.5, color: 'var(--tm-primary-deep)', marginTop: 2 }}>Tap to see who's interested</div>
              </div>
              <Icon name="chevR" size={16}/>
            </div>
          </div>
        )}

        {/* Recent check-ins from the child — anonymous to the tutor */}
        {s && (s.studentFeedback || []).length > 0 && (() => {
          const fb = s.studentFeedback.slice(0, 3);
          const emoji = ['', '😞', '😕', '😐', '🙂', '😄'];
          return (
            <>
              <SectionLabel right={
                <span style={{ fontFamily: 'var(--tm-font-mono)', fontSize: 10.5, letterSpacing: '0.1em', color: 'var(--tm-ink-muted)' }}>
                  PRIVATE · TUTOR CAN'T SEE
                </span>
              }>
                From your child
              </SectionLabel>
              <div style={{ padding: '0 22px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                {fb.map(f => {
                  const cls = s.classes.find(c => c.id === f.classId);
                  const when = new Date(f.when).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
                  return (
                    <Card key={f.id} pad={14}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                        <div style={{
                          width: 40, height: 40, borderRadius: 12,
                          background: 'var(--tm-paper-deep)', fontSize: 24,
                          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                        }}>{emoji[f.mood] || '😐'}</div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--tm-ink-muted)' }}>
                            <span style={{ fontFamily: 'var(--tm-font-mono)', letterSpacing: '0.06em' }}>{when.toUpperCase()}</span>
                            {cls && <span>· {cls.subject}</span>}
                          </div>
                          {f.tags.length > 0 && (
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
                              {f.tags.map(t => <Chip key={t} tone="neutral" size="sm">{t}</Chip>)}
                            </div>
                          )}
                          {f.comment && (
                            <div style={{
                              marginTop: 10, padding: '8px 10px', borderLeft: '3px solid var(--tm-primary)',
                              background: 'var(--tm-paper)', fontSize: 13, color: 'var(--tm-ink-soft)',
                              fontStyle: 'italic', lineHeight: 1.4,
                            }}>"{f.comment}"</div>
                          )}
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </>
          );
        })()}

        {/* Upcoming trial — only render when there's an actual trial-scheduled
            class. Without this guard, every fresh guardian saw a fake "Tanvir
            Hasan / BUET" trial that didn't exist. */}
        {(() => {
          const trial = (s.classes || []).find(c => c.state === 'trial-scheduled' || (c.state === 'upcoming' && new Date(c.scheduledAt) > new Date()));
          if (!trial) return null;
          const subject = trial.subject || '—';
          const day = trial.date || new Date(trial.scheduledAt).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'short' });
          return (
            <>
              <SectionLabel>Upcoming class</SectionLabel>
              <div style={{ padding: '0 22px' }}>
                <Card pad={16}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <Avatar name={trial.student || 'Tutor'} size={42}/>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--tm-ink)' }}>{trial.student}</div>
                      <div style={{ fontSize: 12, color: 'var(--tm-ink-soft)', marginTop: 2 }}>{trial.area}</div>
                    </div>
                    <Chip tone="accent" size="sm">{trial.state === 'trial-scheduled' ? 'Trial' : 'Class'}</Chip>
                  </div>
                  <div style={{ marginTop: 14, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    {[
                      { l: 'Day', v: day },
                      { l: 'Time', v: trial.time || '—' },
                      { l: 'Subject', v: subject },
                      { l: 'Duration', v: trial.dur || '—' },
                    ].map(d => (
                      <div key={d.l} style={{ padding: '9px 12px', background: 'var(--tm-paper)', borderRadius: 10 }}>
                        <div style={{ fontFamily: 'var(--tm-font-mono)', fontSize: 9, letterSpacing: '0.14em', color: 'var(--tm-ink-muted)', textTransform: 'uppercase' }}>{d.l}</div>
                        <div style={{ fontSize: 13, color: 'var(--tm-ink)', marginTop: 3, fontWeight: 500 }}>{d.v}</div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </>
          );
        })()}

        {/* Top matches — only render when there are real applicants. The
            previous mock displayed three made-up tutors for every guardian. */}
        {(() => {
          const all = Object.values(s.listingApplicants || {}).flat();
          if (all.length === 0) return null;
          // Highest-state apps first; cap at three.
          const order = ['hired','trial-scheduled','location-granted','shortlisted','applied'];
          const top = all
            .slice()
            .sort((a, b) => order.indexOf(a.state) - order.indexOf(b.state))
            .slice(0, 3);
          return (
            <>
              <SectionLabel right={
                <span onClick={() => go('g-listings')} style={{ fontSize: 12, color: 'var(--tm-primary-deep)', cursor: 'pointer', fontWeight: 500 }}>
                  See all {all.length}
                </span>
              }>Active applicants</SectionLabel>
              <div style={{ padding: '0 22px 24px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                {top.map((a) => (
                  <div key={a.id} onClick={() => go('g-applicants', { listingId: a.jobId })} style={{
                    display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px',
                    background: 'var(--tm-surface)', border: '1px solid var(--tm-line)',
                    borderRadius: 14, cursor: 'pointer',
                  }}>
                    <Avatar name={a.tutor?.name || 'Tutor'} size={40}/>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--tm-ink)' }}>{a.tutor?.name || 'Tutor'}</span>
                        <VerifyBadge tier={a.tutor?.tier || 0}/>
                      </div>
                      <div style={{ fontSize: 11.5, color: 'var(--tm-ink-soft)', marginTop: 2 }}>{a.when}</div>
                    </div>
                    <Chip tone={a.state === 'hired' ? 'accent' : a.state === 'shortlisted' ? 'primary' : 'neutral'} size="sm">
                      {a.state.replace('-', ' ')}
                    </Chip>
                  </div>
                ))}
              </div>
            </>
          );
        })()}
      </div>
    </Phone>
  );
};

// ─── G-2. Applicants list ─────────────────────────────────────
// Demo applicants we mix in alongside any real ones that have been generated.
const DEMO_APPLICANTS = [
  { id: 'demo-tanvir', name: 'Tanvir Hasan', inst: 'BUET · Mech. Eng', year: '3rd yr', match: 94, rating: 4.9, hires: 14, tier: 2, avail: 'Eve · 6–9pm' },
  { id: 'demo-nusrat', name: 'Nusrat Jahan', inst: 'DU · Physics', year: '4th yr', match: 88, rating: 4.7, hires: 8, tier: 2, avail: 'Eve · 5–8pm' },
  { id: 'demo-rahim',  name: 'Rahim Chowdhury', inst: 'BUET · EEE', year: '4th yr', match: 82, rating: 4.8, hires: 11, tier: 2, avail: 'Eve · 7–10pm' },
  { id: 'demo-farhan', name: 'Farhan Islam', inst: 'IUT · CSE', year: 'Graduate', match: 77, rating: 4.5, hires: 5, tier: 1, avail: 'Wknd only' },
  { id: 'demo-sadia',  name: 'Sadia Akter', inst: 'DU · Math', year: '3rd yr', match: 73, rating: 4.6, hires: 7, tier: 1, avail: 'Aft · 3–6pm' },
  { id: 'demo-mehdi',  name: 'Mehdi Hassan', inst: 'BUET · CE', year: '4th yr', match: 68, rating: 4.4, hires: 3, tier: 1, avail: 'Eve · 6–9pm' },
];

const GuardianApplicants = () => {
  const { back, go, params } = React.useContext(RouterCtx);
  const s = useStore();
  const [filter, setFilter] = React.useState('all');

  // Pick the listing being reviewed. Route param wins; otherwise default to
  // the user's first listing.
  const myListings = s.myListings || [];
  const listingId = (params && params.listingId) || (myListings[0] && myListings[0].id);
  const listing = myListings.find(l => l.id === listingId);

  // Real applications submitted to this listing, normalized to the local
  // applicant shape so we can mix in demo applicants for visual density.
  const realApps = ((listingId && s.listingApplicants[listingId]) || []).map(a => ({
    id: a.id,
    name: a.tutor?.name || 'New applicant',
    inst: 'Joined recently', year: '', match: 95,
    rating: 4.6, hires: 0, tier: a.tutor?.tier || 0, avail: 'Available now',
    real: true, state: a.state,
  }));

  const applicants = [...realApps, ...DEMO_APPLICANTS];

  // Shortlist state is local to this screen for demo applicants, while real
  // applicants reflect server state via realApp.state === 'shortlisted'.
  const [demoShortlist, setDemoShortlist] = React.useState(
    () => new Set(['demo-tanvir', 'demo-nusrat', 'demo-rahim'])
  );
  const isShort = (a) => a.real
    ? a.state === 'shortlisted' || a.state === 'location-granted' || a.state === 'trial-scheduled' || a.state === 'hired'
    : demoShortlist.has(a.id);

  const toggle = (a) => {
    if (a.real) {
      TmActions.shortlistApplicant(a.id, !isShort(a));
    } else {
      setDemoShortlist(prev => {
        const next = new Set(prev);
        if (next.has(a.id)) next.delete(a.id); else next.add(a.id);
        return next;
      });
    }
  };

  const visible = filter === 'shortlisted'
    ? applicants.filter(isShort)
    : applicants;

  return (
    <Phone noTab>
      <ScreenHeader back title="Applicants" sub={`${listingId} · ${applicants.length} total`}/>

      {/* Filter pills */}
      <div style={{ padding: '4px 22px 10px', display: 'flex', gap: 8 }}>
        {[['all', `All ${applicants.length}`], ['shortlisted', `Shortlisted ${applicants.filter(isShort).length}`]].map(([v, label]) => (
          <div key={v} onClick={() => setFilter(v)} style={{
            padding: '7px 14px', borderRadius: 20, cursor: 'pointer', fontSize: 13, fontWeight: 500,
            background: filter === v ? 'var(--tm-ink)' : 'var(--tm-surface)',
            color: filter === v ? 'var(--tm-paper)' : 'var(--tm-ink-soft)',
            border: `1px solid ${filter === v ? 'transparent' : 'var(--tm-line)'}`,
            transition: 'background .15s',
          }}>{label}</div>
        ))}
      </div>

      <div style={{ padding: '0 22px 24px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {visible.map((a) => {
          const isShortlisted = isShort(a);
          return (
            <div key={a.id} style={{
              borderRadius: 16, padding: '14px 16px',
              background: isShortlisted ? 'var(--tm-primary-soft)' : 'var(--tm-surface)',
              border: `1px solid ${isShortlisted ? 'transparent' : 'var(--tm-line)'}`,
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <Avatar name={a.name} size={42}/>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--tm-ink)' }}>{a.name}</span>
                    <VerifyBadge tier={a.tier}/>
                    {a.match >= 90 && <Chip tone="primary" size="sm" icon="bolt">Top pick</Chip>}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--tm-ink-soft)', marginTop: 3 }}>
                    {a.inst} · {a.year}
                  </div>
                  <div style={{ display: 'flex', gap: 14, marginTop: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12 }}>
                      <Icon name="star" size={13} stroke={0} fill="var(--tm-primary)"/>
                      <span style={{ fontWeight: 600, color: 'var(--tm-ink)' }}>{a.rating}</span>
                      <span style={{ color: 'var(--tm-ink-muted)' }}>· {a.hires} hires</span>
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--tm-ink-muted)' }}>{a.avail}</div>
                  </div>
                </div>
                <div style={{
                  fontFamily: 'var(--tm-font-display)', fontSize: 20, color: isShortlisted ? 'var(--tm-primary-deep)' : 'var(--tm-ink-muted)',
                  lineHeight: 1, flexShrink: 0, fontVariantNumeric: 'tabular-nums',
                }}>{a.match}%</div>
              </div>

              <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
                <button onClick={() => go('g-tutor', { name: a.name })} style={{
                  flex: 1, padding: '9px 0', borderRadius: 10,
                  background: 'var(--tm-paper)', border: '1px solid var(--tm-line)',
                  color: 'var(--tm-ink)', fontSize: 12.5, fontWeight: 500, cursor: 'pointer',
                  fontFamily: 'var(--tm-font-ui)',
                }}>View profile</button>
                <button onClick={() => toggle(a)} style={{
                  flex: 1, padding: '9px 0', borderRadius: 10,
                  background: isShortlisted ? 'var(--tm-ink)' : 'var(--tm-primary)',
                  border: 'none',
                  color: isShortlisted ? 'var(--tm-paper)' : 'var(--tm-primary-ink)',
                  fontSize: 12.5, fontWeight: 600, cursor: 'pointer',
                  fontFamily: 'var(--tm-font-ui)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                }}>
                  <Icon name={isShortlisted ? 'check' : 'plus'} size={14} stroke={2.2}/>
                  {isShortlisted ? 'Shortlisted' : 'Shortlist'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </Phone>
  );
};

// ─── G-3. Tutor profile detail ────────────────────────────────
const GuardianTutorDetail = () => {
  const { back, go } = React.useContext(RouterCtx);
  const [locationRequested, setLocationRequested] = React.useState(false);

  const reviews = [
    { name: 'Mrs. Ali', text: 'Very patient and explains concepts clearly. My son improved a lot.', rating: 5, when: '2 wks ago' },
    { name: 'Mr. Bari', text: 'Reliable and punctual. Highly recommended for HSC students.', rating: 5, when: '1 mo ago' },
    { name: 'Mrs. Das', text: 'Good tutor, sometimes runs late.', rating: 4, when: '2 mo ago' },
  ];

  return (
    <Phone noTab>
      <ScreenHeader back title="Tanvir Hasan" sub="BUET · 3rd year"/>

      <div style={{ overflowY: 'auto', flex: 1 }}>
        {/* Profile hero */}
        <div style={{ padding: '8px 22px 16px' }}>
          <Card pad={18}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
              <div style={{ position: 'relative' }}>
                <Avatar name="Tanvir Hasan" size={56}/>
                <VerifyBadge tier={2} style={{ position: 'absolute', bottom: -4, right: -4 }}/>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 17, fontWeight: 700, color: 'var(--tm-ink)' }}>Tanvir Hasan</div>
                <div style={{ fontSize: 12.5, color: 'var(--tm-ink-soft)', marginTop: 2 }}>
                  BUET · Mechanical Engineering · 3rd year
                </div>
                <div style={{ display: 'flex', gap: 12, marginTop: 10 }}>
                  <Stat value="4.9" label="Rating"/>
                  <Stat value="14" label="Hires"/>
                  <Stat value="98%" label="On time"/>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Match breakdown */}
        <SectionLabel>Match breakdown · 94%</SectionLabel>
        <div style={{ padding: '0 22px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            { label: 'Subject fit', score: 1.0, note: 'Physics + Higher Math — exact match' },
            { label: 'Level fit', score: 1.0, note: 'HSC National — exact match' },
            { label: 'Area', score: 0.95, note: 'Dhanmondi — 1.4 km away' },
            { label: 'Availability', score: 0.88, note: 'Evenings — mostly overlaps' },
            { label: 'Budget', score: 0.90, note: 'Requesting ৳12,000 — within range' },
          ].map(m => (
            <div key={m.label} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', background: 'var(--tm-surface)', borderRadius: 12, border: '1px solid var(--tm-line)' }}>
              <div style={{ width: 90, fontSize: 12.5, color: 'var(--tm-ink)', fontWeight: 500 }}>{m.label}</div>
              <div style={{ flex: 1, height: 5, borderRadius: 3, background: 'var(--tm-paper-deep)', overflow: 'hidden' }}>
                <div style={{ width: `${m.score * 100}%`, height: '100%', background: m.score >= 0.95 ? 'var(--tm-accent)' : 'var(--tm-primary)', borderRadius: 3 }}/>
              </div>
              <div style={{ fontSize: 11, color: 'var(--tm-ink-muted)', minWidth: 0, textAlign: 'right', flexShrink: 0 }}>
                {Math.round(m.score * 100)}%
              </div>
            </div>
          ))}
        </div>

        {/* Subjects + levels */}
        <SectionLabel>Teaches</SectionLabel>
        <div style={{ padding: '0 22px', display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {['Physics', 'Higher Math', 'Math', 'Chemistry'].map(s => (
            <Chip key={s} tone="primary" size="sm">{s}</Chip>
          ))}
          {['HSC', 'O-Level', 'Class 9–10'].map(s => (
            <Chip key={s} tone="line" size="sm">{s}</Chip>
          ))}
        </div>

        {/* Reviews */}
        <SectionLabel>Guardian reviews</SectionLabel>
        <div style={{ padding: '0 22px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {reviews.map((r, i) => (
            <div key={i} style={{ padding: '12px 14px', background: 'var(--tm-surface)', borderRadius: 14, border: '1px solid var(--tm-line)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--tm-ink)' }}>{r.name}</span>
                <div style={{ display: 'flex', gap: 1 }}>
                  {Array.from({length: r.rating}).map((_, j) => (
                    <Icon key={j} name="star" size={12} stroke={0} fill="var(--tm-primary)"/>
                  ))}
                  {Array.from({length: 5 - r.rating}).map((_, j) => (
                    <Icon key={`e${j}`} name="star" size={12} stroke={1.4}/>
                  ))}
                </div>
              </div>
              <div style={{ fontSize: 12.5, color: 'var(--tm-ink-soft)', marginTop: 6, lineHeight: 1.5 }}>{r.text}</div>
              <div style={{ fontSize: 11, color: 'var(--tm-ink-muted)', marginTop: 6 }}>{r.when}</div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div style={{ padding: '20px 22px 28px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {locationRequested ? (
            <div style={{
              padding: '14px 16px', borderRadius: 14, background: 'var(--tm-accent-soft)',
              color: 'var(--tm-accent)', display: 'flex', alignItems: 'center', gap: 10,
              fontSize: 13.5, fontWeight: 600,
            }}>
              <Icon name="shieldCheck" size={18}/> Location request sent — Tanvir will see it shortly.
            </div>
          ) : (
            <Button full icon="pin" onClick={() => setLocationRequested(true)}>
              Request tutor's area pin
            </Button>
          )}
          <Button full icon="check" onClick={() => go('g-hire')}>
            Schedule trial
          </Button>
          <Button variant="secondary" full icon="x">Pass on Tanvir</Button>
        </div>
      </div>
    </Phone>
  );
};

// ─── G-4. Trial → hire flow ───────────────────────────────────
const GuardianHire = () => {
  const { back, go } = React.useContext(RouterCtx);
  const [trialDone, setTrialDone] = React.useState(false);
  const [rating, setRating] = React.useState(0);
  const [hovered, setHovered] = React.useState(0);
  const [tags, setTags] = React.useState(new Set());
  const [hired, setHired] = React.useState(false);

  const feedbackTags = ['Punctual', 'Clear explanations', 'Student liked', 'Engaging style', 'Well-prepared', 'Needs improvement'];

  const toggleTag = (t) => setTags(prev => {
    const next = new Set(prev);
    if (next.has(t)) next.delete(t); else next.add(t);
    return next;
  });

  return (
    <Phone noTab>
      <ScreenHeader back title={hired ? 'Hired!' : trialDone ? 'Rate the trial' : 'Trial scheduled'} sub="Tanvir Hasan"/>

      <div style={{ overflowY: 'auto', flex: 1 }}>
        {/* Hired state */}
        {hired && (
          <div style={{ padding: '24px 22px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, textAlign: 'center' }}>
            <div style={{
              width: 80, height: 80, borderRadius: 24, background: 'var(--tm-accent-soft)',
              color: 'var(--tm-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Icon name="shieldCheck" size={38} stroke={1.5}/>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--tm-font-display)', fontSize: 28, color: 'var(--tm-ink)', letterSpacing: '-0.01em' }}>
                Tanvir is hired!
              </div>
              <div style={{ fontSize: 14, color: 'var(--tm-ink-soft)', marginTop: 8, maxWidth: 260, lineHeight: 1.5 }}>
                Classes start next Saturday. We'll notify Tanvir and send you a confirmation.
              </div>
            </div>

            <Card pad={16} style={{ width: '100%', textAlign: 'left' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {[
                  { l: 'Monthly fee', v: '৳12,000' },
                  { l: 'Schedule', v: '4 days/wk' },
                  { l: 'Start date', v: 'June 8, 2025' },
                  { l: 'First class', v: 'Sat 6:30pm' },
                ].map(d => (
                  <div key={d.l} style={{ padding: '9px 12px', background: 'var(--tm-paper)', borderRadius: 10 }}>
                    <div style={{ fontFamily: 'var(--tm-font-mono)', fontSize: 9, letterSpacing: '0.14em', color: 'var(--tm-ink-muted)', textTransform: 'uppercase' }}>{d.l}</div>
                    <div style={{ fontSize: 13, color: 'var(--tm-ink)', marginTop: 3, fontWeight: 600 }}>{d.v}</div>
                  </div>
                ))}
              </div>
            </Card>

            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 8, marginTop: 4 }}>
              <Button full icon="inbox" onClick={() => go('g-home')}>Message Tanvir</Button>
              <Button variant="secondary" full onClick={() => go('g-home')}>Back to dashboard</Button>
            </div>

            <div style={{
              padding: '12px 14px', background: 'transparent', border: '1px dashed var(--tm-line)',
              borderRadius: 14, display: 'flex', gap: 10, textAlign: 'left', fontSize: 12, color: 'var(--tm-ink-soft)',
            }}>
              <Icon name="shield" size={16} stroke={1.7}/>
              <div style={{ lineHeight: 1.5 }}>
                <strong style={{ color: 'var(--tm-ink)' }}>Payments stay in-app.</strong> Monthly fees are processed through Tution Media — no cash handling needed. You can cancel anytime.
              </div>
            </div>
          </div>
        )}

        {/* Trial scheduled state */}
        {!hired && !trialDone && (
          <>
            {/* Tutor summary */}
            <div style={{ padding: '8px 22px 14px' }}>
              <Card pad={16}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <Avatar name="Tanvir Hasan" size={44}/>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 14.5, fontWeight: 600, color: 'var(--tm-ink)' }}>Tanvir Hasan</span>
                      <VerifyBadge tier={2}/>
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--tm-ink-soft)', marginTop: 2 }}>BUET · Mech. Eng · 3rd yr</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                      {[1,2,3,4,5].map(i => <Icon key={i} name="star" size={13} stroke={0} fill="var(--tm-primary)"/>)}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--tm-ink-muted)', marginTop: 2 }}>14 hires</div>
                  </div>
                </div>
              </Card>
            </div>

            <SectionLabel>Trial details</SectionLabel>
            <div style={{ padding: '0 22px' }}>
              <Card pad={16}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  {[
                    { l: 'Date', v: 'Saturday, Jun 1' },
                    { l: 'Time', v: '6:30 pm' },
                    { l: 'Subject', v: 'Physics + H. Math' },
                    { l: 'Duration', v: '1.5 hours' },
                    { l: 'Location', v: 'Your home' },
                    { l: 'Fee', v: 'Free trial' },
                  ].map(d => (
                    <div key={d.l} style={{ padding: '10px 12px', background: 'var(--tm-paper)', borderRadius: 10 }}>
                      <div style={{ fontFamily: 'var(--tm-font-mono)', fontSize: 9, letterSpacing: '0.14em', color: 'var(--tm-ink-muted)', textTransform: 'uppercase' }}>{d.l}</div>
                      <div style={{ fontSize: 13, color: 'var(--tm-ink)', marginTop: 3, fontWeight: 500 }}>{d.v}</div>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 14, display: 'flex', gap: 8 }}>
                  <Button variant="secondary" icon="phone" full>Message Tanvir</Button>
                  <Button full icon="check" onClick={() => setTrialDone(true)}>Trial done →</Button>
                </div>
              </Card>
            </div>

            <div style={{ padding: '14px 22px 28px' }}>
              <div style={{
                padding: '12px 14px', border: '1px dashed var(--tm-line)', borderRadius: 14,
                display: 'flex', gap: 10, fontSize: 12, color: 'var(--tm-ink-soft)',
              }}>
                <Icon name="shield" size={16} stroke={1.7}/>
                <span style={{ lineHeight: 1.5 }}>
                  Tanvir's exact address is shared only with you. Don't share it with others — it's scoped to this listing.
                </span>
              </div>
            </div>
          </>
        )}

        {/* Post-trial rating state */}
        {!hired && trialDone && (
          <>
            <div style={{ padding: '18px 22px 10px', textAlign: 'center' }}>
              <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--tm-ink)' }}>How did the trial go?</div>
              <div style={{ fontSize: 13, color: 'var(--tm-ink-soft)', marginTop: 6, lineHeight: 1.5 }}>
                Your rating helps other guardians and improves Tanvir's profile.
              </div>
            </div>

            {/* Star rating */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 8, padding: '12px 0' }}>
              {[1, 2, 3, 4, 5].map(s => (
                <div key={s}
                  onClick={() => setRating(s)}
                  onMouseEnter={() => setHovered(s)}
                  onMouseLeave={() => setHovered(0)}
                  style={{ cursor: 'pointer', padding: 4 }}>
                  <Icon name="star" size={36}
                    stroke={s <= (hovered || rating) ? 0 : 1.5}
                    fill={s <= (hovered || rating) ? 'var(--tm-primary)' : 'none'}/>
                </div>
              ))}
            </div>
            {rating > 0 && (
              <div style={{ textAlign: 'center', fontSize: 13, color: 'var(--tm-ink-soft)', marginBottom: 8 }}>
                {['', 'Not what we expected', 'Below average', 'Good session', 'Great session!', 'Outstanding!'][rating]}
              </div>
            )}

            {/* Feedback chips */}
            <SectionLabel>What stood out?</SectionLabel>
            <div style={{ padding: '0 22px', display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {feedbackTags.map(t => (
                <div key={t} onClick={() => toggleTag(t)} style={{
                  padding: '8px 14px', borderRadius: 20, cursor: 'pointer', fontSize: 13, fontWeight: 500,
                  background: tags.has(t) ? 'var(--tm-ink)' : 'var(--tm-surface)',
                  color: tags.has(t) ? 'var(--tm-paper)' : 'var(--tm-ink-soft)',
                  border: `1px solid ${tags.has(t) ? 'transparent' : 'var(--tm-line)'}`,
                  transition: 'background .15s',
                }}>{t}</div>
              ))}
            </div>

            {/* Decision */}
            <SectionLabel>Decision</SectionLabel>
            <div style={{ padding: '0 22px 30px', display: 'flex', flexDirection: 'column', gap: 10 }}>
              <button onClick={() => {
                  // If there's a real application for the active listing, hire it.
                  try {
                    const st = tmStore.state;
                    const lid = (st.myListings || [])[0]?.id;
                    const apps = lid ? (st.listingApplicants[lid] || []) : [];
                    const candidate = apps.find(a => a.state !== 'rejected' && a.state !== 'hired');
                    if (candidate) TmActions.hireApplicant(candidate.id);
                  } catch (e) {}
                  setHired(true);
                }} style={{
                width: '100%', padding: '16px', borderRadius: 14, border: 'none',
                background: 'var(--tm-primary)', color: 'var(--tm-primary-ink)',
                fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--tm-font-ui)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              }}>
                <Icon name="check" size={18} stroke={2.5}/>
                Hire Tanvir · ৳12,000/mo
              </button>
              <div style={{
                display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8,
              }}>
                <button onClick={() => back()} style={{
                  padding: '12px', borderRadius: 12, background: 'var(--tm-surface)',
                  border: '1px solid var(--tm-line)', color: 'var(--tm-ink-soft)',
                  fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'var(--tm-font-ui)',
                }}>See other applicants</button>
                <button onClick={() => back()} style={{
                  padding: '12px', borderRadius: 12, background: 'transparent',
                  border: '1px solid var(--tm-line)', color: 'var(--tm-ink-soft)',
                  fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'var(--tm-font-ui)',
                }}>Not this time</button>
              </div>
              <div style={{ fontSize: 11.5, color: 'var(--tm-ink-muted)', textAlign: 'center', lineHeight: 1.5 }}>
                Hiring locks the rate at ৳12,000/mo. Payment setup happens after first class.
              </div>
            </div>
          </>
        )}
      </div>
    </Phone>
  );
};

export { GuardianHome, GuardianApplicants, GuardianTutorDetail, GuardianHire };