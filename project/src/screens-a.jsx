// Tution Media — screens batch 1: Onboarding (OTP), Profile builder,
// Live job feed, Application tracker.

// ─── 1. Onboarding / OTP ─────────────────────────────────────
const ScreenOnboarding = () => {
  const { go } = React.useContext(RouterCtx);
  const [step, setStep] = React.useState('phone'); // phone | otp
  const [otpDigits, setOtpDigits] = React.useState(['4','2','7','9','—','—']);
  const [autoFilling, setAutoFilling] = React.useState(false);

  // Simulate OTP auto-fill when landing on OTP step
  React.useEffect(() => {
    if (step !== 'otp' || autoFilling) return;
    setAutoFilling(true);
    const fill = ['4','2','7','9','8','3'];
    let i = 4;
    const tick = () => {
      if (i >= fill.length) return;
      setOtpDigits(fill.slice(0, i + 1).concat(Array(6 - i - 1).fill('—')));
      i++;
      setTimeout(tick, 300);
    };
    setTimeout(tick, 600);
  }, [step]);

  return (
    <Phone palette={undefined} noTab>
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(circle at 80% 0%, var(--tm-primary-soft) 0%, transparent 55%)',
        opacity: 0.7,
      }}/>
      <div style={{ position: 'relative', padding: '8px 26px 0' }}>
        {/* wordmark */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 14 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 8,
            background: 'var(--tm-primary)', color: 'var(--tm-primary-ink)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--tm-font-display)', fontSize: 20, fontWeight: 400,
            transform: 'translateY(2px)',
          }}>t</div>
          <div style={{
            fontFamily: 'var(--tm-font-display)', fontSize: 22, color: 'var(--tm-ink)',
            letterSpacing: '-0.01em',
          }}>Tution<span style={{ color: 'var(--tm-primary)' }}>.</span>media</div>
        </div>

        <div style={{ marginTop: 78 }}>
          <div style={{
            fontFamily: 'var(--tm-font-mono)', fontSize: 10.5, letterSpacing: '0.18em',
            textTransform: 'uppercase', color: 'var(--tm-ink-muted)', marginBottom: 16,
          }}>For tutors · Dhaka</div>
          <h1 style={{
            fontFamily: 'var(--tm-font-display)', fontWeight: 400, fontSize: 42,
            letterSpacing: '-0.015em', lineHeight: 1.02, color: 'var(--tm-ink)',
            margin: 0, textWrap: 'pretty',
          }}>
            Get matched in <em style={{ color: 'var(--tm-primary)', fontStyle: 'italic' }}>days,</em><br/>
            not weeks.
          </h1>
          <p style={{
            margin: '18px 0 0', fontSize: 15, lineHeight: 1.5, color: 'var(--tm-ink-soft)',
            maxWidth: '88%',
          }}>
            Browse live tuition jobs in your neighborhood. Apply with one tap.
            Get paid on time, every time.
          </p>
        </div>

        {step === 'phone' && (
          <div style={{ marginTop: 56 }}>
            <label style={{
              fontFamily: 'var(--tm-font-mono)', fontSize: 10.5, letterSpacing: '0.14em',
              textTransform: 'uppercase', color: 'var(--tm-ink-muted)',
            }}>Phone number</label>
            <div style={{
              marginTop: 8, display: 'flex', alignItems: 'center',
              background: 'var(--tm-surface)', border: '1px solid var(--tm-line)',
              borderRadius: 14, padding: '4px 14px 4px 4px', gap: 10,
            }}>
              <div style={{
                background: 'var(--tm-paper-deep)', padding: '12px 14px', borderRadius: 10,
                fontFamily: 'var(--tm-font-mono)', fontSize: 15, color: 'var(--tm-ink)',
              }}>+880</div>
              <div style={{
                flex: 1, fontFamily: 'var(--tm-font-mono)', fontSize: 19, letterSpacing: '0.03em',
                color: 'var(--tm-ink)', padding: '12px 0',
              }}>1712 048 391<span style={{
                display: 'inline-block', width: 2, height: 18, background: 'var(--tm-primary)',
                marginLeft: 4, verticalAlign: 'middle', animation: 'tm-blink 1s infinite',
              }}/></div>
            </div>
            <p style={{ marginTop: 14, fontSize: 12, color: 'var(--tm-ink-muted)', lineHeight: 1.5 }}>
              We'll send a one-time code. No documents needed yet — verify when you're ready to be hired.
            </p>
            <div style={{ marginTop: 24 }}>
              <Button full size="lg" icon="arrR" onClick={() => setStep('otp')}>Send code</Button>
            </div>
          </div>
        )}

        {step === 'otp' && (
          <div style={{ marginTop: 56 }}>
            <label style={{
              fontFamily: 'var(--tm-font-mono)', fontSize: 10.5, letterSpacing: '0.14em',
              textTransform: 'uppercase', color: 'var(--tm-ink-muted)',
            }}>Verify code · +880 1712 048 391</label>
            <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
              {otpDigits.map((d, i) => {
                const filled = d !== '—';
                const isActive = !filled && otpDigits[i - 1] !== '—';
                return (
                  <div key={i} style={{
                    flex: 1, aspectRatio: '1 / 1.15',
                    background: filled ? 'var(--tm-surface)' : 'var(--tm-paper-deep)',
                    border: '1px solid ' + (isActive ? 'var(--tm-primary)' : filled ? 'var(--tm-line)' : 'var(--tm-line)'),
                    borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'var(--tm-font-display)', fontSize: 26, color: 'var(--tm-ink)',
                    transition: 'background .15s, border-color .15s',
                  }}>{filled ? d : isActive ? <span style={{ display: 'inline-block', width: 2, height: 20, background: 'var(--tm-primary)', animation: 'tm-blink 1s infinite' }}/> : ''}</div>
                );
              })}
            </div>
            <p style={{ marginTop: 14, fontSize: 12, color: 'var(--tm-ink-muted)' }}>
              Didn't get it? <Link>Resend in 32s</Link>
            </p>
            <div style={{ marginTop: 18 }}>
              <Button full size="lg" icon="arrR" onClick={() => go('profile')}>Continue</Button>
            </div>
            <p style={{ marginTop: 14, fontSize: 11.5, color: 'var(--tm-ink-muted)', lineHeight: 1.5, textAlign: 'center' }}>
              By continuing you agree to our <u>Terms</u> and <u>Tutor Code of Conduct</u>.
            </p>
          </div>
        )}
      </div>
      <style>{`@keyframes tm-blink{50%{opacity:0}}`}</style>
    </Phone>
  );
};

// ─── 2. Profile builder ──────────────────────────────────────
const ScreenProfile = () => {
  const { back } = React.useContext(RouterCtx);
  const s = (typeof useStore === 'function') ? useStore() : null;
  const prof = s ? s.profile : TM_DATA.tutor;
  const subjectsAll = ['Physics', 'Math', 'Higher Math', 'Chemistry', 'Biology', 'English', 'ICT', 'Bangla', 'Accounting', 'Economics'];
  const levelsAll = ['Class 6–8', 'Class 9–10 / SSC', 'HSC', 'O-Level / A-Level', 'University'];
  const [selected, setSelected] = React.useState(new Set(prof.subjects || []));
  const [levels, setLevels] = React.useState(
    levelsAll.map(l => ({ l, on: (prof.levels || []).includes(l) }))
  );
  const days = ['Sat','Sun','Mon','Tue','Wed','Thu','Fri'];
  const slots = ['Morning','Afternoon','Evening','Night'];
  const [availability, setAvailability] = React.useState(
    (prof.availability && prof.availability.length === 7) ? prof.availability :
    [[0,0,1,1],[0,0,1,1],[0,1,1,1],[0,1,1,0],[0,1,1,1],[0,1,1,0],[1,1,0,0]]
  );

  const save = () => {
    if (typeof TmActions !== 'undefined') {
      TmActions.setProfile({
        subjects: Array.from(selected),
        levels: levels.filter(l => l.on).map(l => l.l),
        availability,
      });
    }
    back();
  };

  return (
    <Phone>
      <ScreenHeader back title="Build your profile" sub="Subjects · levels · availability"
        right={<button onClick={save} style={{ background: 'transparent', border: 0, fontFamily: 'var(--tm-font-mono)', fontSize: 11, color: 'var(--tm-primary)', letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer' }}>Save</button>}/>

      {/* progress */}
      <div style={{ padding: '0 22px 14px' }}>
        <div style={{ height: 4, background: 'var(--tm-paper-deep)', borderRadius: 2, overflow: 'hidden' }}>
          <div style={{ width: '50%', height: '100%', background: 'var(--tm-primary)' }}/>
        </div>
      </div>

      {/* identity row */}
      <div style={{ padding: '6px 22px 18px', display: 'flex', alignItems: 'center', gap: 14 }}>
        <div onClick={() => typeof pickAndSetAvatar === 'function' && pickAndSetAvatar()} style={{
          width: 64, height: 64, borderRadius: 32, background: 'var(--tm-paper-deep)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--tm-ink-muted)',
          border: '1px dashed var(--tm-line)', cursor: 'pointer', overflow: 'hidden', position: 'relative',
        }}>
          {prof.avatar
            ? <img src={prof.avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
            : <Icon name="camera" size={22}/>}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: 'var(--tm-font-display)', fontSize: 22, color: 'var(--tm-ink)', lineHeight: 1.1 }}>{prof.name || 'You'}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
            <Chip tone="neutral" icon="book" size="sm">{prof.institution} · {prof.department ? prof.department.split(' ')[0] : ''}</Chip>
            <Chip tone="primary" size="sm">CGPA {prof.cgpa}</Chip>
          </div>
        </div>
      </div>

      {/* Subjects */}
      <SectionLabel>Subjects you teach</SectionLabel>
      <div style={{ padding: '0 22px', display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {subjectsAll.map(s => {
          const on = selected.has(s);
          return (
            <div key={s} onClick={() => setSelected(prev => {
              const next = new Set(prev);
              if (next.has(s)) next.delete(s); else next.add(s);
              return next;
            })} style={{
              padding: '8px 14px', borderRadius: 999,
              background: on ? 'var(--tm-ink)' : 'transparent',
              color: on ? 'var(--tm-paper)' : 'var(--tm-ink-soft)',
              border: `1px solid ${on ? 'var(--tm-ink)' : 'var(--tm-line)'}`,
              fontSize: 13, fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: 6,
              cursor: 'pointer', userSelect: 'none', transition: 'background .15s, color .15s',
            }}>
              {on && <Icon name="check" size={12} stroke={2.4}/>}
              {s}
            </div>
          );
        })}
      </div>

      {/* Levels */}
      <SectionLabel>Levels</SectionLabel>
      <div style={{ padding: '0 22px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {levels.map((l, i) => (
          <div key={l.l} onClick={() => setLevels(prev => prev.map((x, j) => j === i ? {...x, on: !x.on} : x))} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '12px 14px', borderRadius: 12,
            background: l.on ? 'var(--tm-primary-soft)' : 'var(--tm-surface)',
            border: `1px solid ${l.on ? 'transparent' : 'var(--tm-line)'}`,
            cursor: 'pointer', userSelect: 'none',
          }}>
            <span style={{ fontSize: 14, fontWeight: 500, color: l.on ? 'var(--tm-primary-deep)' : 'var(--tm-ink)' }}>{l.l}</span>
            <div style={{
              width: 32, height: 18, borderRadius: 9,
              background: l.on ? 'var(--tm-primary)' : 'var(--tm-paper-deep)', position: 'relative',
            }}>
              <div style={{
                position: 'absolute', top: 2, left: l.on ? 16 : 2, width: 14, height: 14, borderRadius: 7,
                background: '#fdfaf3', transition: 'left .2s',
              }}/>
            </div>
          </div>
        ))}
      </div>

      {/* Areas (chips with map preview line) */}
      <SectionLabel>Service areas <span style={{ color: 'var(--tm-ink-soft)', textTransform: 'none', letterSpacing: 0, marginLeft: 6 }}>· tap to add</span></SectionLabel>
      <div style={{ padding: '0 22px', display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {TM_DATA.areas.map(a => (
          <Chip key={a} tone="accent" icon="pin">{a}</Chip>
        ))}
        <Chip tone="line" icon="plus">Add area</Chip>
      </div>

      {/* Availability grid */}
      <SectionLabel>Weekly availability</SectionLabel>
      <div style={{ padding: '0 22px 24px' }}>
        <div style={{
          background: 'var(--tm-surface)', border: '1px solid var(--tm-line)', borderRadius: 14, padding: 12,
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: '54px repeat(7, 1fr)', gap: 4 }}>
            <div/>
            {days.map(d => (
              <div key={d} style={{
                textAlign: 'center', fontFamily: 'var(--tm-font-mono)', fontSize: 10,
                letterSpacing: '0.1em', color: 'var(--tm-ink-muted)', textTransform: 'uppercase',
                padding: '4px 0',
              }}>{d}</div>
            ))}
            {slots.map((s, si) => (
              <React.Fragment key={s}>
                <div style={{
                  fontSize: 11, color: 'var(--tm-ink-soft)', display: 'flex', alignItems: 'center',
                  paddingRight: 8, textAlign: 'right', justifyContent: 'flex-end',
                }}>{s}</div>
                {availability.map((day, di) => (
                  <div key={`${di}-${si}`} onClick={() => setAvailability(prev => {
                    const next = prev.map(row => [...row]);
                    next[di][si] = next[di][si] ? 0 : 1;
                    return next;
                  })} style={{
                    aspectRatio: '1', borderRadius: 6,
                    background: day[si] ? 'var(--tm-primary)' : 'var(--tm-paper-deep)',
                    cursor: 'pointer', transition: 'background .12s',
                  }}/>
                ))}
              </React.Fragment>
            ))}
          </div>
        </div>
        <p style={{ fontSize: 12, color: 'var(--tm-ink-muted)', marginTop: 10 }}>
          Tap squares to toggle. Guardians see this when shortlisting.
        </p>
      </div>

      <div style={{ padding: '0 22px 18px', display: 'flex', gap: 10 }}>
        <Button variant="secondary" size="lg" full onClick={back}>Cancel</Button>
        <Button size="lg" full icon="check" onClick={save}>Save profile</Button>
      </div>
    </Phone>
  );
};

// ─── 3. Live job feed ────────────────────────────────────────
const JobCard = ({ job, dim }) => {
  const { go } = React.useContext(RouterCtx);
  // Live-read store so the "applied" state reflects updates without re-mounting.
  const s = (typeof useStore === 'function') ? useStore() : null;
  const meName = s ? (s.profile.name || 'You') : null;
  const myApp = s ? s.applications.find(a => a.jobId === job.id && a.tutor && a.tutor.name === meName) : null;
  const applicantCount = s ? s.applications.filter(a => a.jobId === job.id).length : (job.applicants || 0);

  const handleApply = (e) => {
    e.stopPropagation();
    if (myApp) { go('apply'); return; }
    if (typeof TmActions !== 'undefined') TmActions.applyToJob(job.id);
    go('apply');
  };

  return (
    <Card pad={0} onClick={() => go('job', { id: job.id })} style={{ opacity: dim ? 0.6 : 1, overflow: 'hidden' }}>
      {/* match score bar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 16px 0',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Chip tone="primary" icon="spark" size="sm">{job.match}% match</Chip>
          <span style={{ fontFamily: 'var(--tm-font-mono)', fontSize: 10.5, color: 'var(--tm-ink-muted)', letterSpacing: '0.06em' }}>
            {job.posted.toUpperCase()}
          </span>
        </div>
        <span style={{ fontFamily: 'var(--tm-font-mono)', fontSize: 10.5, color: 'var(--tm-ink-muted)' }}>
          {applicantCount} applied
        </span>
      </div>

      <div style={{ padding: '8px 16px 14px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 }}>
          <div style={{ minWidth: 0 }}>
            <div style={{
              fontFamily: 'var(--tm-font-display)', fontSize: 22, lineHeight: 1.1,
              color: 'var(--tm-ink)', letterSpacing: '-0.01em',
            }}>
              {job.subjects.join(' + ')}
            </div>
            <div style={{ fontSize: 13, color: 'var(--tm-ink-soft)', marginTop: 4 }}>
              {job.level} · {job.curriculum}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{
              fontFamily: 'var(--tm-font-display)', fontSize: 22,
              color: 'var(--tm-ink)', lineHeight: 1, letterSpacing: '-0.01em',
              fontVariantNumeric: 'tabular-nums',
            }}>
              ৳{job.pay.toLocaleString()}
            </div>
            <div style={{ fontSize: 11, color: 'var(--tm-ink-muted)', marginTop: 2, fontFamily: 'var(--tm-font-mono)', letterSpacing: '0.06em' }}>
              /MONTH
            </div>
          </div>
        </div>

        <div style={{
          marginTop: 12, display: 'grid', gridTemplateColumns: '1fr 1fr',
          gap: 8, fontSize: 12.5, color: 'var(--tm-ink-soft)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Icon name="pin" size={14}/> {job.area}
            <span style={{
              fontFamily: 'var(--tm-font-mono)', fontSize: 10.5, color: 'var(--tm-ink-muted)',
            }}>· {job.distanceKm}km</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Icon name="clock" size={14}/> {job.window}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Icon name="calendar" size={14}/> {job.days}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Icon name="user" size={14}/> {job.gender === 'Any' ? 'Any tutor' : `${job.gender} tutor`}
          </div>
        </div>

        <div style={{
          marginTop: 14, paddingTop: 12, borderTop: '1px dashed var(--tm-line)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12.5, color: 'var(--tm-ink-soft)' }}>
            <Avatar name={job.guardian.name} size={24}/>
            <span>{job.guardian.name}</span>
            {job.guardian.verified && (
              <Icon name="checkCircle" size={13} stroke={2.2}/>
            )}
          </div>
          {myApp ? (
            <Chip tone="accent" size="sm" icon="check">Applied</Chip>
          ) : (
            <Button size="sm" icon="bolt" onClick={handleApply}>1-tap apply</Button>
          )}
        </div>
      </div>
    </Card>
  );
};

const ScreenFeed = () => {
  const { go } = React.useContext(RouterCtx);
  // Subscribe to the store so new listings appear immediately.
  const s = (typeof useStore === 'function') ? useStore() : null;
  const isMobile = (typeof isMobileApp === 'function') && isMobileApp();
  const jobs = s ? s.listings : TM_DATA.jobs;
  const profileName = s ? (s.profile.name || 'Tanvir') : 'Tanvir';
  const [filters, setFilters] = React.useState([
    {l: 'All near me', on: true, ic: 'pin'},
    {l: 'Physics', on: true},
    {l: 'HSC', on: true},
    {l: '৳10k+', on: false},
    {l: 'Evening', on: false, ic: 'clock'},
  ]);
  return (
    <Phone tab={isMobile ? undefined : 'feed'} noTab={isMobile}>
      {/* greeting header */}
      <div style={{
        padding: '14px 22px 8px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
      }}>
        <div>
          <div style={{
            fontFamily: 'var(--tm-font-mono)', fontSize: 10.5, letterSpacing: '0.14em',
            textTransform: 'uppercase', color: 'var(--tm-ink-muted)',
          }}>Hi {profileName.split(' ')[0]}</div>
          <div style={{ fontFamily: 'var(--tm-font-display)', fontSize: 26, color: 'var(--tm-ink)', lineHeight: 1.1, marginTop: 4 }}>
            {jobs.length} {jobs.length === 1 ? 'job' : 'jobs'} near you
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button style={{
            width: 38, height: 38, borderRadius: 19, border: '1px solid var(--tm-line)',
            background: 'var(--tm-surface)', color: 'var(--tm-ink)', position: 'relative',
            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
          }}>
            <Icon name="bell" size={18}/>
            <span style={{
              position: 'absolute', top: 6, right: 7, width: 8, height: 8, borderRadius: 4,
              background: 'var(--tm-primary)', border: '1.5px solid var(--tm-surface)',
            }}/>
          </button>
        </div>
      </div>

      {/* alert ribbon — verification nudge (hidden once fully verified) */}
      {(s ? (s.profile.verifyTier || 0) : 2) < 3 && (
        <div style={{ padding: '8px 22px 0' }}>
          <div onClick={() => go('verify')} style={{
            background: 'var(--tm-ink)', color: 'var(--tm-paper)', borderRadius: 14,
            padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer',
          }}>
            <Icon name="shield" size={20}/>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13.5, fontWeight: 600 }}>
                {(s ? (s.profile.verifyTier || 0) : 2) === 0
                  ? 'Verify your phone to start applying'
                  : `${3 - (s ? (s.profile.verifyTier || 0) : 2)} step${3 - (s ? (s.profile.verifyTier || 0) : 2) === 1 ? '' : 's'} left to unlock more jobs`}
              </div>
              <div style={{ fontSize: 11.5, opacity: 0.7, marginTop: 2 }}>Tap to continue verification · ~2 min</div>
            </div>
            <Icon name="chevR" size={16}/>
          </div>
        </div>
      )}

      {/* filter pills */}
      <div style={{
        padding: '14px 22px 6px', display: 'flex', gap: 8,
        overflowX: 'auto', WebkitOverflowScrolling: 'touch',
      }}>
        {filters.map((f, i) => (
          <span key={i} onClick={() => setFilters(prev => prev.map((x, j) => j === i ? {...x, on: !x.on} : x))} style={{
            display: 'inline-flex', alignItems: 'center', gap: 6, flexShrink: 0,
            padding: '8px 14px', borderRadius: 999, fontSize: 13, fontWeight: 500,
            border: `1px solid ${f.on ? 'transparent' : 'var(--tm-line)'}`,
            background: f.on ? 'var(--tm-primary-soft)' : 'var(--tm-surface)',
            color: f.on ? 'var(--tm-primary-deep)' : 'var(--tm-ink-soft)',
            cursor: 'pointer', userSelect: 'none', transition: 'background .12s, color .12s',
          }}>
            {f.ic && <Icon name={f.ic} size={13}/>}
            {f.l}
          </span>
        ))}
        <span style={{
          display: 'inline-flex', alignItems: 'center', flexShrink: 0,
          padding: '8px 12px', borderRadius: 999, border: '1px solid var(--tm-line)',
          background: 'var(--tm-surface)', color: 'var(--tm-ink-soft)',
        }}>
          <Icon name="filter" size={14}/>
        </span>
      </div>

      <SectionLabel right={<span style={{ fontFamily: 'var(--tm-font-mono)', fontSize: 10.5, letterSpacing: '0.1em', color: 'var(--tm-ink-muted)' }}>LIVE</span>}>
        Top matches today
      </SectionLabel>
      <div style={{ padding: '0 22px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {jobs.slice(0,2).map(j => <JobCard key={j.id} job={j}/>)}
      </div>

      {jobs.length > 2 && (
        <>
          <SectionLabel>Also nearby</SectionLabel>
          <div style={{ padding: '0 22px 24px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {jobs.slice(2).map(j => <JobCard key={j.id} job={j} dim={j.match < 75}/>)}
          </div>
        </>
      )}
      {jobs.length === 0 && (
        <div style={{ padding: '40px 22px', textAlign: 'center', color: 'var(--tm-ink-soft)', fontSize: 14 }}>
          No jobs yet. Check back soon — guardians post throughout the day.
        </div>
      )}
    </Phone>
  );
};

// ─── 4. Apply / Tracker ──────────────────────────────────────
// Combined screen: top is the applied-to job, below is funnel + other apps.
const ScreenApply = () => {
  const { go } = React.useContext(RouterCtx);
  const s = (typeof useStore === 'function') ? useStore() : null;
  const isMobile = (typeof isMobileApp === 'function') && isMobileApp();
  const meName = s ? (s.profile.name || 'You') : 'Tanvir Hasan';

  // The "primary" application = the user's most recent one with an active state.
  const allMine = s ? s.applications.filter(a => a.tutor && a.tutor.name === meName) : TM_DATA.applications;
  const activeStates = ['applied','shortlisted','location-granted','trial-scheduled','hired'];
  const primaryApp = allMine.find(a => activeStates.includes(a.state)) || allMine[0];
  const primaryListing = primaryApp ? (s ? s.listings.find(l => l.id === primaryApp.jobId) : TM_DATA.jobs.find(j => j.id === primaryApp.jobId)) : null;
  const job = primaryListing || (primaryApp && primaryApp.meta) || (s && s.listings[0]) || TM_DATA.jobs[0];

  // Compute funnel stages based on application state.
  const stateOrder = ['applied','shortlisted','location-granted','trial-scheduled','hired'];
  const curIdx = primaryApp ? stateOrder.indexOf(primaryApp.state) : -1;
  const stages = [
    { l: 'Applied', when: primaryApp ? primaryApp.when : '—' },
    { l: 'Shortlisted', when: curIdx >= 1 ? 'today' : 'pending' },
    { l: 'Location access', when: curIdx >= 2 ? 'granted' : 'pending' },
    { l: 'Trial booked', when: curIdx >= 3 ? 'scheduled' : '—' },
    { l: 'Confirmed', when: curIdx >= 4 ? 'hired' : '—' },
  ].map((st, i) => ({ ...st, done: i <= curIdx, current: i === curIdx + 1 }));

  const stateChip = (state) => {
    const map = {
      'applied':         { tone: 'neutral', l: 'Applied' },
      'shortlisted':     { tone: 'primary', l: 'Shortlisted' },
      'location-granted':{ tone: 'accent',  l: 'Location granted' },
      'trial-scheduled': { tone: 'accent',  l: 'Trial booked' },
      'hired':           { tone: 'accent',  l: 'Hired' },
      'rejected':        { tone: 'line',    l: 'Closed' },
    };
    const m = map[state] || map.applied;
    return <Chip tone={m.tone} size="sm">{m.l}</Chip>;
  };

  if (!primaryApp) {
    return (
      <Phone tab={isMobile ? undefined : 'feed'} noTab={isMobile}>
        <ScreenHeader back title="Applications" sub="Track your apps"/>
        <div style={{ padding: '40px 22px', textAlign: 'center' }}>
          <div style={{ fontSize: 14, color: 'var(--tm-ink-soft)', marginBottom: 18 }}>
            You haven't applied to any jobs yet.
          </div>
          <Button icon="bolt" onClick={() => go('feed')}>Browse jobs</Button>
        </div>
      </Phone>
    );
  }

  return (
    <Phone tab={isMobile ? undefined : 'feed'} noTab={isMobile}>
      <ScreenHeader back title="Your application" sub={`Job ${primaryApp.jobId}`}/>
      {/* job summary */}
      <div style={{ padding: '0 22px 4px' }}>
        <Card pad={16}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}>
            <div>
              <div style={{ fontFamily: 'var(--tm-font-display)', fontSize: 20, color: 'var(--tm-ink)', lineHeight: 1.1 }}>
                {job.subjects.join(' + ')}
              </div>
              <div style={{ fontSize: 12.5, color: 'var(--tm-ink-soft)', marginTop: 4 }}>
                {job.level} · {job.curriculum} · {job.area}
              </div>
            </div>
            <div style={{
              fontFamily: 'var(--tm-font-display)', fontSize: 20, color: 'var(--tm-ink)',
              fontVariantNumeric: 'tabular-nums',
            }}>৳{job.pay.toLocaleString()}</div>
          </div>
          {job.note && (
            <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px dashed var(--tm-line)', fontSize: 13, color: 'var(--tm-ink-soft)', lineHeight: 1.5 }}>
              "{job.note}"
            </div>
          )}
        </Card>
      </div>

      {/* funnel */}
      <SectionLabel>Progress</SectionLabel>
      <div style={{ padding: '0 22px' }}>
        <Card pad={18}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {stages.map((s, i) => (
              <div key={s.l} style={{ display: 'flex', gap: 14, position: 'relative' }}>
                <div style={{ width: 22, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{
                    width: 22, height: 22, borderRadius: 11,
                    background: s.done ? 'var(--tm-primary)' : 'var(--tm-paper-deep)',
                    color: s.done ? 'var(--tm-primary-ink)' : 'var(--tm-ink-muted)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: s.current ? '2.5px solid var(--tm-primary-soft)' : 'none',
                    boxSizing: 'border-box',
                  }}>
                    {s.done ? <Icon name="check" size={12} stroke={2.6}/> : <div style={{ width: 5, height: 5, borderRadius: 3, background: 'currentColor' }}/>}
                  </div>
                  {i < stages.length - 1 && (
                    <div style={{
                      flex: 1, width: 2, minHeight: 28,
                      background: s.done ? 'var(--tm-primary)' : 'var(--tm-paper-deep)',
                      marginTop: 2, marginBottom: -4,
                    }}/>
                  )}
                </div>
                <div style={{ flex: 1, paddingBottom: i < stages.length - 1 ? 18 : 0 }}>
                  <div style={{
                    fontSize: 14, fontWeight: s.current ? 600 : 500,
                    color: s.done ? 'var(--tm-ink)' : 'var(--tm-ink-muted)',
                  }}>{s.l}</div>
                  <div style={{ fontSize: 11.5, color: 'var(--tm-ink-muted)', marginTop: 2, fontFamily: 'var(--tm-font-mono)', letterSpacing: '0.04em' }}>
                    {s.when}
                  </div>
                  {s.current && (
                    <div style={{
                      marginTop: 8, padding: '10px 12px', background: 'var(--tm-primary-soft)',
                      borderRadius: 10, fontSize: 12.5, color: 'var(--tm-primary-deep)', lineHeight: 1.4,
                    }}>
                      Guardian wants to meet. Request their exact location to navigate over.
                      <div style={{ marginTop: 10 }}>
                        <Button size="sm" icon="pin" onClick={() => go('location')}>Request location</Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Other applications */}
      {allMine.length > 1 && (
        <>
          <SectionLabel right={<span style={{ fontFamily: 'var(--tm-font-mono)', fontSize: 10.5, letterSpacing: '0.1em', color: 'var(--tm-ink-muted)' }}>{allMine.length - 1} OTHER</span>}>
            Other applications
          </SectionLabel>
          <div style={{ padding: '0 22px 24px', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {allMine.filter(a => a.id !== primaryApp.id).map(a => {
              const allJobs = s ? s.listings : TM_DATA.jobs;
              const j = allJobs.find(x => x.id === a.jobId) || a.meta || {};
              const subj = (j.subjects || []).join(', ') || a.jobId;
              return (
                <div key={a.id} style={{
                  display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px',
                  background: 'var(--tm-surface)', border: '1px solid var(--tm-line)', borderRadius: 14,
                  opacity: a.state === 'rejected' ? 0.55 : 1,
                }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--tm-ink)' }}>{subj}</div>
                    <div style={{ fontSize: 11.5, color: 'var(--tm-ink-muted)', marginTop: 2 }}>
                      {j.area || (j.meta && j.meta.area) || '—'} · {j.level || ''} · {a.when}
                    </div>
                  </div>
                  {stateChip(a.state)}
                </div>
              );
            })}
          </div>
        </>
      )}
    </Phone>
  );
};

Object.assign(window, { ScreenOnboarding, ScreenProfile, ScreenFeed, ScreenApply, JobCard });
