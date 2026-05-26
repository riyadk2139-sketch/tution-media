// Tution Media — Guardian / parent side.
// Four screens: Home dashboard, applicant list, tutor detail + shortlist,
// trial → hire confirmation.

// ─── G-1. Guardian dashboard ──────────────────────────────────
const GuardianHome = () => {
  const { go } = React.useContext(RouterCtx);
  const [dismissed, setDismissed] = React.useState(false);

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
              GUARDIAN · MR. RAHMAN
            </div>
          </div>
          <div style={{ position: 'relative' }}>
            <Avatar name="Mr. Rahman" size={38}/>
            <div style={{
              position: 'absolute', top: -2, right: -2, width: 12, height: 12,
              borderRadius: 6, background: 'var(--tm-primary)', border: '2px solid var(--tm-paper)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 7, fontWeight: 700, color: 'var(--tm-primary-ink)',
            }}>2</div>
          </div>
        </div>

        {/* Active requirement card */}
        <div style={{ padding: '10px 22px' }}>
          <div style={{
            borderRadius: 18, padding: '18px 18px 16px', position: 'relative', overflow: 'hidden',
            background: 'var(--tm-ink)', color: 'var(--tm-paper)',
          }}>
            <div style={{
              position: 'absolute', inset: 0, opacity: 0.12, pointerEvents: 'none',
              backgroundImage: 'radial-gradient(circle at 85% 105%, var(--tm-primary) 0%, transparent 60%)',
            }}/>
            <div style={{ position: 'relative' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontFamily: 'var(--tm-font-mono)', fontSize: 9.5, opacity: 0.55, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
                    Active listing · j-114
                  </div>
                  <div style={{ fontFamily: 'var(--tm-font-display)', fontSize: 22, marginTop: 4, letterSpacing: '-0.01em', lineHeight: 1.1 }}>
                    Ifrat's Physics tutor
                  </div>
                </div>
                <Chip tone="primary" size="sm" icon="bolt">Live</Chip>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 12 }}>
                {['HSC · National', 'Physics', 'Higher Math', 'Dhanmondi 27', '৳12,000/mo'].map(t => (
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
                  { v: '14', l: 'Applicants' },
                  { v: '3', l: 'Shortlisted' },
                  { v: '1', l: 'Trial booked' },
                ].map(s => (
                  <div key={s.l}>
                    <div style={{ fontFamily: 'var(--tm-font-display)', fontSize: 26, lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>{s.v}</div>
                    <div style={{ fontSize: 10.5, opacity: 0.65, marginTop: 3 }}>{s.l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* New applicants nudge */}
        {!dismissed && (
          <div style={{ padding: '0 22px 12px' }}>
            <div onClick={() => go('g-applicants')} style={{
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
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--tm-ink)' }}>2 new applicants since yesterday</div>
                <div style={{ fontSize: 11.5, color: 'var(--tm-primary-deep)', marginTop: 2 }}>Tap to review · 98% + 88% match</div>
              </div>
              <Icon name="chevR" size={16}/>
            </div>
          </div>
        )}

        {/* Trial reminder */}
        <SectionLabel>Upcoming trial</SectionLabel>
        <div style={{ padding: '0 22px' }}>
          <Card pad={16}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Avatar name="Tanvir Hasan" size={42}/>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--tm-ink)' }}>Tanvir Hasan</span>
                  <VerifyBadge tier={2}/>
                </div>
                <div style={{ fontSize: 12, color: 'var(--tm-ink-soft)', marginTop: 2 }}>BUET · Mech. Eng · 3rd yr</div>
              </div>
              <Chip tone="accent" size="sm">Trial</Chip>
            </div>
            <div style={{
              marginTop: 14, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8,
            }}>
              {[
                { l: 'Date', v: 'Saturday, Jun 1' },
                { l: 'Time', v: '6:30 pm' },
                { l: 'Subject', v: 'Physics + H. Math' },
                { l: 'Duration', v: '1.5 hours' },
              ].map(d => (
                <div key={d.l} style={{ padding: '9px 12px', background: 'var(--tm-paper)', borderRadius: 10 }}>
                  <div style={{ fontFamily: 'var(--tm-font-mono)', fontSize: 9, letterSpacing: '0.14em', color: 'var(--tm-ink-muted)', textTransform: 'uppercase' }}>{d.l}</div>
                  <div style={{ fontSize: 13, color: 'var(--tm-ink)', marginTop: 3, fontWeight: 500 }}>{d.v}</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
              <Button variant="secondary" icon="phone" full>Message Tanvir</Button>
              <Button icon="check" full onClick={() => go('g-hire')}>After trial →</Button>
            </div>
          </Card>
        </div>

        {/* Shortlisted tutors */}
        <SectionLabel right={
          <span onClick={() => go('g-applicants')} style={{ fontSize: 12, color: 'var(--tm-primary-deep)', cursor: 'pointer', fontWeight: 500 }}>
            See all 14
          </span>
        }>Top matches</SectionLabel>
        <div style={{ padding: '0 22px 24px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            { name: 'Tanvir Hasan', inst: 'BUET · ME 3rd yr', match: 94, rating: 4.9, tier: 2, status: 'trial-booked' },
            { name: 'Nusrat Jahan', inst: 'DU · Physics 4th yr', match: 88, rating: 4.7, tier: 2, status: 'shortlisted' },
            { name: 'Rahim Chowdhury', inst: 'BUET · EEE 4th yr', match: 82, rating: 4.8, tier: 2, status: 'pending' },
          ].map((t, i) => (
            <div key={i} onClick={() => go('g-tutor')} style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px',
              background: 'var(--tm-surface)', border: '1px solid var(--tm-line)',
              borderRadius: 14, cursor: 'pointer',
            }}>
              <Avatar name={t.name} size={40}/>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--tm-ink)' }}>{t.name}</span>
                  <VerifyBadge tier={t.tier}/>
                </div>
                <div style={{ fontSize: 11.5, color: 'var(--tm-ink-soft)', marginTop: 2 }}>{t.inst}</div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{
                  fontFamily: 'var(--tm-font-display)', fontSize: 18, color: 'var(--tm-ink)',
                  lineHeight: 1, fontVariantNumeric: 'tabular-nums',
                }}>{t.match}<span style={{ fontSize: 11, color: 'var(--tm-ink-muted)' }}>%</span></div>
                <div style={{ fontSize: 10.5, color: 'var(--tm-ink-muted)', marginTop: 2 }}>match</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Phone>
  );
};

// ─── G-2. Applicants list ─────────────────────────────────────
const GuardianApplicants = () => {
  const { back, go } = React.useContext(RouterCtx);
  const [filter, setFilter] = React.useState('all');
  const [shortlisted, setShortlisted] = React.useState(new Set(['Tanvir Hasan', 'Nusrat Jahan', 'Rahim Chowdhury']));

  const applicants = [
    { name: 'Tanvir Hasan', inst: 'BUET · Mech. Eng', year: '3rd yr', match: 94, rating: 4.9, hires: 14, tier: 2, avail: 'Eve · 6–9pm', subj: 'Phys · H.Math' },
    { name: 'Nusrat Jahan', inst: 'DU · Physics', year: '4th yr', match: 88, rating: 4.7, hires: 8, tier: 2, avail: 'Eve · 5–8pm', subj: 'Phys · Math' },
    { name: 'Rahim Chowdhury', inst: 'BUET · EEE', year: '4th yr', match: 82, rating: 4.8, hires: 11, tier: 2, avail: 'Eve · 7–10pm', subj: 'Phys · Chem' },
    { name: 'Farhan Islam', inst: 'IUT · CSE', year: 'Graduate', match: 77, rating: 4.5, hires: 5, tier: 1, avail: 'Wknd only', subj: 'Math · Physics' },
    { name: 'Sadia Akter', inst: 'DU · Math', year: '3rd yr', match: 73, rating: 4.6, hires: 7, tier: 1, avail: 'Aft · 3–6pm', subj: 'Math · H.Math' },
    { name: 'Mehdi Hassan', inst: 'BUET · CE', year: '4th yr', match: 68, rating: 4.4, hires: 3, tier: 1, avail: 'Eve · 6–9pm', subj: 'Physics' },
  ];

  const visible = filter === 'shortlisted'
    ? applicants.filter(a => shortlisted.has(a.name))
    : applicants;

  const toggle = (name) => setShortlisted(prev => {
    const next = new Set(prev);
    if (next.has(name)) next.delete(name); else next.add(name);
    return next;
  });

  return (
    <Phone noTab>
      <ScreenHeader back title="Applicants" sub={`j-114 · ${applicants.length} total`}/>

      {/* Filter pills */}
      <div style={{ padding: '4px 22px 10px', display: 'flex', gap: 8 }}>
        {[['all', `All ${applicants.length}`], ['shortlisted', `Shortlisted ${shortlisted.size}`]].map(([v, label]) => (
          <div key={v} onClick={() => setFilter(v)} style={{
            padding: '7px 14px', borderRadius: 20, cursor: 'pointer', fontSize: 13, fontWeight: 500,
            background: filter === v ? 'var(--tm-ink)' : 'var(--tm-surface)',
            color: filter === v ? 'var(--tm-paper)' : 'var(--tm-ink-soft)',
            border: `1px solid ${filter === v ? 'transparent' : 'var(--tm-line)'}`,
            transition: 'background .15s',
          }}>{label}</div>
        ))}
      </div>

      <div style={{ overflowY: 'auto', flex: 1, padding: '0 22px 24px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {visible.map((a, i) => {
          const isShortlisted = shortlisted.has(a.name);
          return (
            <div key={i} style={{
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
                <button onClick={() => go('g-tutor')} style={{
                  flex: 1, padding: '9px 0', borderRadius: 10,
                  background: 'var(--tm-paper)', border: '1px solid var(--tm-line)',
                  color: 'var(--tm-ink)', fontSize: 12.5, fontWeight: 500, cursor: 'pointer',
                  fontFamily: 'var(--tm-font-ui)',
                }}>View profile</button>
                <button onClick={() => toggle(a.name)} style={{
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
              <button onClick={() => setHired(true)} style={{
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

Object.assign(window, { GuardianHome, GuardianApplicants, GuardianTutorDetail, GuardianHire });
