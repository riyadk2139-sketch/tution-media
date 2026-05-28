// Tution Media — screens not in the original wireframe but needed for a
// real working app: welcome/role picker, job detail, post-listing form,
// guardian listings index, settings.

// ─── Welcome / role picker ─────────────────────────────────────
const ScreenWelcome = () => {
  const { go } = React.useContext(RouterCtx);
  const s = useStore();
  const [step, setStep] = React.useState('hello');   // hello | role | name
  const [role, setRole] = React.useState(null);
  const [name, setName] = React.useState(s.profile.name || '');
  const [area, setArea] = React.useState(s.profile.area || 'Dhanmondi');

  const finish = () => {
    TmActions.completeOnboarding({ role, name: name || (role === 'tutor' ? 'Tanvir' : 'Mr. Rahman'), area });
    go(role === 'tutor' ? 'feed' : 'g-home');
  };

  return (
    <Phone noTab>
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(circle at 80% 0%, var(--tm-primary-soft) 0%, transparent 55%)',
        opacity: 0.7,
      }}/>

      <div style={{ position: 'relative', padding: '16px 26px 0', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 14 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 8,
            background: 'var(--tm-primary)', color: 'var(--tm-primary-ink)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--tm-font-display)', fontSize: 20, transform: 'translateY(2px)',
          }}>t</div>
          <div style={{
            fontFamily: 'var(--tm-font-display)', fontSize: 22, color: 'var(--tm-ink)',
            letterSpacing: '-0.01em',
          }}>Tution<span style={{ color: 'var(--tm-primary)' }}>.</span>media</div>
        </div>

        {step === 'hello' && (
          <div style={{ marginTop: 56, flex: 1 }}>
            <div style={{
              fontFamily: 'var(--tm-font-mono)', fontSize: 10.5, letterSpacing: '0.18em',
              textTransform: 'uppercase', color: 'var(--tm-ink-muted)', marginBottom: 16,
            }}>Tutor marketplace · Dhaka</div>
            <h1 style={{
              fontFamily: 'var(--tm-font-display)', fontWeight: 400, fontSize: 42,
              letterSpacing: '-0.015em', lineHeight: 1.02, color: 'var(--tm-ink)', margin: 0,
            }}>
              Find the <em style={{ color: 'var(--tm-primary)', fontStyle: 'italic' }}>right</em><br/>
              tutor, faster.
            </h1>
            <p style={{
              margin: '18px 0 0', fontSize: 15, lineHeight: 1.5, color: 'var(--tm-ink-soft)',
              maxWidth: '88%',
            }}>
              Browse live tuition jobs, apply with one tap, manage classes and
              payments — all in one place.
            </p>
            <div style={{ marginTop: 'auto', paddingTop: 80 }}>
              <Button full size="lg" icon="arrR" onClick={() => setStep('role')}>Get started</Button>
              <p style={{ marginTop: 14, fontSize: 11.5, color: 'var(--tm-ink-muted)', lineHeight: 1.5, textAlign: 'center' }}>
                By continuing you agree to our <u>Terms</u>.
              </p>
            </div>
          </div>
        )}

        {step === 'role' && (
          <div style={{ marginTop: 56, flex: 1, display: 'flex', flexDirection: 'column' }}>
            <div style={{
              fontFamily: 'var(--tm-font-mono)', fontSize: 10.5, letterSpacing: '0.14em',
              textTransform: 'uppercase', color: 'var(--tm-ink-muted)',
            }}>Step 1 of 2</div>
            <h2 style={{
              fontFamily: 'var(--tm-font-display)', fontWeight: 400, fontSize: 32,
              letterSpacing: '-0.01em', margin: '10px 0 24px', color: 'var(--tm-ink)',
            }}>
              I'm here to…
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { v: 'tutor', t: 'Teach as a tutor', d: 'Find and apply for tuition jobs near you.', i: 'book' },
                { v: 'guardian', t: 'Hire a tutor', d: 'Post a requirement, browse and shortlist tutors.', i: 'user' },
              ].map(o => (
                <div key={o.v} onClick={() => setRole(o.v)} style={{
                  display: 'flex', alignItems: 'center', gap: 14, padding: '18px 16px',
                  background: role === o.v ? 'var(--tm-primary-soft)' : 'var(--tm-surface)',
                  border: `1.5px solid ${role === o.v ? 'var(--tm-primary)' : 'var(--tm-line)'}`,
                  borderRadius: 16, cursor: 'pointer',
                }}>
                  <div style={{
                    width: 42, height: 42, borderRadius: 12,
                    background: role === o.v ? 'var(--tm-primary)' : 'var(--tm-paper-deep)',
                    color: role === o.v ? 'var(--tm-primary-ink)' : 'var(--tm-ink-soft)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    <Icon name={o.i} size={20}/>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--tm-ink)' }}>{o.t}</div>
                    <div style={{ fontSize: 12.5, color: 'var(--tm-ink-soft)', marginTop: 3 }}>{o.d}</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 'auto', paddingTop: 32 }}>
              <Button full size="lg" icon="arrR" onClick={() => role && setStep('name')}
                style={{ opacity: role ? 1 : 0.4 }}>
                Continue
              </Button>
            </div>
          </div>
        )}

        {step === 'name' && (
          <div style={{ marginTop: 56, flex: 1, display: 'flex', flexDirection: 'column' }}>
            <div style={{
              fontFamily: 'var(--tm-font-mono)', fontSize: 10.5, letterSpacing: '0.14em',
              textTransform: 'uppercase', color: 'var(--tm-ink-muted)',
            }}>Step 2 of 2</div>
            <h2 style={{
              fontFamily: 'var(--tm-font-display)', fontWeight: 400, fontSize: 32,
              letterSpacing: '-0.01em', margin: '10px 0 24px', color: 'var(--tm-ink)',
            }}>
              About you
            </h2>
            <label style={{
              fontFamily: 'var(--tm-font-mono)', fontSize: 10.5, letterSpacing: '0.14em',
              textTransform: 'uppercase', color: 'var(--tm-ink-muted)',
            }}>Your name</label>
            <input value={name} onChange={(e) => setName(e.target.value)}
              placeholder={role === 'tutor' ? 'e.g. Tanvir Hasan' : 'e.g. Mr. Rahman'}
              style={{
                marginTop: 8, padding: '14px 16px', fontFamily: 'var(--tm-font-ui)',
                fontSize: 16, color: 'var(--tm-ink)',
                background: 'var(--tm-surface)', border: '1px solid var(--tm-line)',
                borderRadius: 14, outline: 'none', WebkitAppearance: 'none',
              }}/>
            <label style={{
              marginTop: 20, fontFamily: 'var(--tm-font-mono)', fontSize: 10.5, letterSpacing: '0.14em',
              textTransform: 'uppercase', color: 'var(--tm-ink-muted)',
            }}>Area in Dhaka</label>
            <input value={area} onChange={(e) => setArea(e.target.value)}
              placeholder="e.g. Dhanmondi"
              style={{
                marginTop: 8, padding: '14px 16px', fontFamily: 'var(--tm-font-ui)',
                fontSize: 16, color: 'var(--tm-ink)',
                background: 'var(--tm-surface)', border: '1px solid var(--tm-line)',
                borderRadius: 14, outline: 'none', WebkitAppearance: 'none',
              }}/>
            <div style={{ marginTop: 'auto', paddingTop: 32 }}>
              <Button full size="lg" icon="arrR" onClick={finish}>
                Enter app
              </Button>
            </div>
          </div>
        )}
      </div>
    </Phone>
  );
};

// ─── Job detail (a job a tutor taps to view + apply) ───────────
const ScreenJobDetail = () => {
  const { go, params } = React.useContext(RouterCtx);
  const s = useStore();
  const jobId = (params && params.id) || (s.listings[0] && s.listings[0].id);
  const job = s.listings.find(l => l.id === jobId) || s.listings[0];
  const meName = s.profile.name || 'You';
  const myApp = s.applications.find(a => a.jobId === (job && job.id) && a.tutor.name === meName);

  if (!job) return <Phone noTab><div style={{padding:22}}>Job not found.</div></Phone>;

  const onApply = () => {
    TmActions.applyToJob(job.id);
    go('apply');
  };

  return (
    <Phone noTab>
      <ScreenHeader back title="Job detail" sub={job.id}/>
      <div style={{ padding: '0 22px 18px' }}>
        <Card pad={18}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <Chip tone="primary" icon="spark" size="sm">{job.match}% match</Chip>
            <span style={{ fontFamily: 'var(--tm-font-mono)', fontSize: 10.5, color: 'var(--tm-ink-muted)' }}>
              {job.posted.toUpperCase()}
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 }}>
            <div>
              <div style={{ fontFamily: 'var(--tm-font-display)', fontSize: 24, lineHeight: 1.05, color: 'var(--tm-ink)' }}>
                {job.subjects.join(' + ')}
              </div>
              <div style={{ fontSize: 13, color: 'var(--tm-ink-soft)', marginTop: 4 }}>
                {job.level} · {job.curriculum}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{
                fontFamily: 'var(--tm-font-display)', fontSize: 24, color: 'var(--tm-ink)',
                lineHeight: 1, fontVariantNumeric: 'tabular-nums',
              }}>৳{job.pay.toLocaleString()}</div>
              <div style={{ fontSize: 11, color: 'var(--tm-ink-muted)', marginTop: 2, fontFamily: 'var(--tm-font-mono)' }}>/MONTH</div>
            </div>
          </div>

          <div style={{
            marginTop: 14, paddingTop: 12, borderTop: '1px dashed var(--tm-line)',
            display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, fontSize: 13, color: 'var(--tm-ink-soft)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Icon name="pin" size={14}/> {job.area}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Icon name="clock" size={14}/> {job.window}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Icon name="calendar" size={14}/> {job.days}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Icon name="user" size={14}/> {job.gender}</div>
          </div>

          {job.note && (
            <div style={{
              marginTop: 14, padding: 12, background: 'var(--tm-paper-deep)', borderRadius: 12,
              fontSize: 13.5, color: 'var(--tm-ink-soft)', lineHeight: 1.5,
            }}>
              "{job.note}"
            </div>
          )}

          <div style={{
            marginTop: 14, paddingTop: 12, borderTop: '1px dashed var(--tm-line)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--tm-ink-soft)' }}>
              <Avatar name={job.guardian.name} size={26}/>
              <span>{job.guardian.name}</span>
              {job.guardian.verified && <Icon name="checkCircle" size={13} stroke={2.2}/>}
            </div>
          </div>
        </Card>

        <div style={{ marginTop: 16 }}>
          {myApp ? (
            <div style={{
              padding: '14px 16px', borderRadius: 14,
              background: 'var(--tm-accent-soft)', color: 'var(--tm-accent)',
              display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, fontWeight: 600,
            }}>
              <Icon name="checkCircle" size={18}/>
              You applied {myApp.when}
              <span style={{ marginLeft: 'auto' }}>
                <Link onClick={() => go('apply')}>View →</Link>
              </span>
            </div>
          ) : (
            <Button full size="lg" icon="bolt" onClick={onApply}>1-tap apply</Button>
          )}
        </div>

        <SectionLabel>What happens next</SectionLabel>
        <div style={{ fontSize: 13, color: 'var(--tm-ink-soft)', lineHeight: 1.6 }}>
          <div>1. Guardian reviews applicants within 24h.</div>
          <div>2. If shortlisted, you'll get a notification and can request location.</div>
          <div>3. Book a trial · meet the family · get hired.</div>
        </div>
      </div>
    </Phone>
  );
};

// ─── Guardian: post a listing ──────────────────────────────────
const ScreenListingNew = () => {
  const { go } = React.useContext(RouterCtx);
  const s = useStore();

  const allSubjects = ['Physics', 'Math', 'Higher Math', 'Chemistry', 'Biology', 'English', 'ICT', 'Bangla', 'Accounting'];
  const allLevels   = ['Class 6–8', 'Class 9–10 / SSC', 'HSC', 'O-Level', 'A-Level'];
  const allCurricula= ['National', 'English Version', 'Edexcel', 'Cambridge', 'IB'];

  const [subjects, setSubjects] = React.useState([]);
  const [level, setLevel] = React.useState('HSC');
  const [curriculum, setCurriculum] = React.useState('National');
  const [area, setArea] = React.useState(s.profile.area || 'Dhanmondi');
  const [pay, setPay] = React.useState('10000');
  const [days, setDays] = React.useState('3 days/wk · 1.5 hr');
  const [windowSlot, setWindowSlot] = React.useState('Evenings');
  const [gender, setGender] = React.useState('Any');
  const [note, setNote] = React.useState('');

  const toggle = (set, v) => set.includes(v) ? set.filter(x => x !== v) : [...set, v];
  const canSubmit = subjects.length > 0 && area && pay;

  const submit = () => {
    if (!canSubmit) return;
    const id = TmActions.postListing({ subjects, level, curriculum, area, pay, days, window: windowSlot, gender, note });
    go('g-home');
  };

  return (
    <Phone noTab>
      <ScreenHeader back title="Post a tuition" sub="Reach tutors instantly"/>
      <div style={{ padding: '0 22px 22px', display: 'flex', flexDirection: 'column', gap: 18 }}>

        <Field label="Subjects · pick any">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {allSubjects.map(sub => {
              const on = subjects.includes(sub);
              return (
                <div key={sub} onClick={() => setSubjects(toggle(subjects, sub))} style={{
                  padding: '8px 14px', borderRadius: 999,
                  background: on ? 'var(--tm-ink)' : 'transparent',
                  color: on ? 'var(--tm-paper)' : 'var(--tm-ink-soft)',
                  border: `1px solid ${on ? 'var(--tm-ink)' : 'var(--tm-line)'}`,
                  fontSize: 13, fontWeight: 500, cursor: 'pointer', userSelect: 'none',
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                }}>
                  {on && <Icon name="check" size={12} stroke={2.4}/>}
                  {sub}
                </div>
              );
            })}
          </div>
        </Field>

        <Field label="Level">
          <Pills options={allLevels} value={level} onChange={setLevel}/>
        </Field>

        <Field label="Curriculum">
          <Pills options={allCurricula} value={curriculum} onChange={setCurriculum}/>
        </Field>

        <Field label="Area">
          <input value={area} onChange={(e) => setArea(e.target.value)}
            style={inputStyle}/>
        </Field>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <Field label="Pay · ৳ / month">
            <input value={pay} onChange={(e) => setPay(e.target.value.replace(/\D/g,''))}
              inputMode="numeric" style={inputStyle}/>
          </Field>
          <Field label="Tutor gender">
            <Pills options={['Any','Male','Female']} value={gender} onChange={setGender}/>
          </Field>
        </div>

        <Field label="Schedule">
          <input value={days} onChange={(e) => setDays(e.target.value)} style={inputStyle}/>
        </Field>

        <Field label="Time window">
          <Pills options={['Mornings','Afternoons','Evenings','Nights','Weekends']} value={windowSlot} onChange={setWindowSlot}/>
        </Field>

        <Field label="Notes (optional)">
          <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={3}
            placeholder="What kind of help do you need? Anything tutors should know?"
            style={{ ...inputStyle, resize: 'vertical', minHeight: 76, fontFamily: 'var(--tm-font-ui)' }}/>
        </Field>

        <div style={{ paddingTop: 6 }}>
          <Button full size="lg" icon="bolt" onClick={submit}
            style={{ opacity: canSubmit ? 1 : 0.4 }}>
            Post listing
          </Button>
          <p style={{ marginTop: 12, fontSize: 11.5, color: 'var(--tm-ink-muted)', textAlign: 'center', lineHeight: 1.5 }}>
            Tutors near you will see this immediately. You'll get notified as applicants come in.
          </p>
        </div>
      </div>
    </Phone>
  );
};

const inputStyle = {
  padding: '12px 14px', fontSize: 15, color: 'var(--tm-ink)',
  background: 'var(--tm-surface)', border: '1px solid var(--tm-line)',
  borderRadius: 12, outline: 'none', WebkitAppearance: 'none', width: '100%',
  boxSizing: 'border-box',
};

const Field = ({ label, children }) => (
  <div>
    <label style={{
      display: 'block', marginBottom: 8,
      fontFamily: 'var(--tm-font-mono)', fontSize: 10.5, letterSpacing: '0.14em',
      textTransform: 'uppercase', color: 'var(--tm-ink-muted)',
    }}>{label}</label>
    {children}
  </div>
);

const Pills = ({ options, value, onChange }) => (
  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
    {options.map(o => {
      const on = value === o;
      return (
        <div key={o} onClick={() => onChange(o)} style={{
          padding: '8px 14px', borderRadius: 999,
          background: on ? 'var(--tm-primary-soft)' : 'transparent',
          color: on ? 'var(--tm-primary-deep)' : 'var(--tm-ink-soft)',
          border: `1px solid ${on ? 'transparent' : 'var(--tm-line)'}`,
          fontSize: 13, fontWeight: 500, cursor: 'pointer', userSelect: 'none',
        }}>{o}</div>
      );
    })}
  </div>
);

// ─── Guardian: list of MY listings ─────────────────────────────
const ScreenGuardianListings = () => {
  const { go } = React.useContext(RouterCtx);
  const s = useStore();
  const mine = s.listings.filter(l => l.owner === 'self');

  return (
    <Phone noTab>
      <ScreenHeader back title="My listings" sub={`${mine.length} active`}
        right={
          <button onClick={() => go('g-new')} style={{
            background: 'var(--tm-primary)', color: 'var(--tm-primary-ink)',
            border: 0, borderRadius: 10, padding: '8px 12px', fontSize: 13, fontWeight: 600,
            display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer',
          }}>
            <Icon name="plus" size={14}/> New
          </button>
        }/>

      {mine.length === 0 ? (
        <div style={{ padding: '40px 22px', textAlign: 'center' }}>
          <div style={{ fontSize: 14, color: 'var(--tm-ink-soft)', marginBottom: 18 }}>
            You haven't posted any tuitions yet.
          </div>
          <Button icon="plus" onClick={() => go('g-new')}>Post your first</Button>
        </div>
      ) : (
        <div style={{ padding: '0 22px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {mine.map(l => {
            const apps = s.applications.filter(a => a.jobId === l.id);
            return (
              <Card key={l.id} pad={14} onClick={() => go('g-applicants', { listingId: l.id })}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 }}>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontFamily: 'var(--tm-font-display)', fontSize: 18, color: 'var(--tm-ink)' }}>
                      {l.subjects.join(' + ')}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--tm-ink-soft)', marginTop: 3 }}>
                      {l.level} · {l.area} · ৳{l.pay.toLocaleString()}/mo
                    </div>
                  </div>
                  <Chip tone="primary" size="sm">{apps.length} {apps.length === 1 ? 'applicant' : 'applicants'}</Chip>
                </div>
                <div style={{
                  marginTop: 10, paddingTop: 10, borderTop: '1px dashed var(--tm-line)',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                }}>
                  <span style={{ fontSize: 11, color: 'var(--tm-ink-muted)', fontFamily: 'var(--tm-font-mono)', letterSpacing: '0.05em' }}>
                    {l.posted.toUpperCase()}
                  </span>
                  <button onClick={(e) => { e.stopPropagation(); if (confirm('Remove this listing?')) TmActions.removeListing(l.id); }}
                    style={{ background: 'transparent', border: 0, color: 'var(--tm-ink-muted)', fontSize: 12, cursor: 'pointer' }}>
                    Remove
                  </button>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </Phone>
  );
};

// ─── Settings ──────────────────────────────────────────────────
const ScreenSettings = () => {
  const { go } = React.useContext(RouterCtx);
  const s = useStore();
  const role = s.profile.role;

  const switchRole = (newRole) => {
    if (newRole === role) return;
    TmActions.setRole(newRole);
    go(newRole === 'tutor' ? 'feed' : 'g-home');
  };

  const reset = () => {
    if (!confirm('Reset all demo data? Your profile and activity will be lost.')) return;
    TmActions.resetDemo();
    go('welcome');
  };

  return (
    <Phone noTab>
      <ScreenHeader back title="Settings"/>

      <div style={{ padding: '0 22px 22px' }}>
        <SectionLabel>Account</SectionLabel>
        <Card pad={14}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div onClick={() => typeof pickAndSetAvatar === 'function' && pickAndSetAvatar()} style={{ cursor: 'pointer' }}>
              <Avatar name={s.profile.name || 'You'} size={40} src={s.profile.avatar}/>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--tm-ink)' }}>{s.profile.name || 'You'}</div>
              <div style={{ fontSize: 12, color: 'var(--tm-ink-soft)' }}>
                {role === 'tutor' ? 'Tutor' : 'Guardian'} · {s.profile.area || 'Dhaka'}
              </div>
            </div>
          </div>
        </Card>

        <SectionLabel>Switch role</SectionLabel>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            { v: 'tutor', t: 'Tutor view', d: 'Browse and apply for tuition jobs', i: 'book' },
            { v: 'guardian', t: 'Guardian view', d: 'Post requirements and hire tutors', i: 'user' },
          ].map(o => {
            const on = role === o.v;
            return (
              <div key={o.v} onClick={() => switchRole(o.v)} style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '14px 14px',
                background: on ? 'var(--tm-primary-soft)' : 'var(--tm-surface)',
                border: `1px solid ${on ? 'transparent' : 'var(--tm-line)'}`,
                borderRadius: 14, cursor: on ? 'default' : 'pointer',
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: on ? 'var(--tm-primary)' : 'var(--tm-paper-deep)',
                  color: on ? 'var(--tm-primary-ink)' : 'var(--tm-ink-soft)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon name={o.i} size={18}/>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--tm-ink)' }}>{o.t}</div>
                  <div style={{ fontSize: 12, color: 'var(--tm-ink-soft)', marginTop: 2 }}>{o.d}</div>
                </div>
                {on && <Chip tone="primary" size="sm" icon="check">Active</Chip>}
              </div>
            );
          })}
        </div>

        <SectionLabel>About</SectionLabel>
        <div style={{ fontSize: 13, color: 'var(--tm-ink-soft)', lineHeight: 1.6, padding: '0 4px' }}>
          Tution Media · v1.0.0<br/>
          Single-user demo · data saves to this device only.<br/>
          Built for Dhaka tutoring market.
        </div>

        <div style={{ marginTop: 28 }}>
          <Button variant="secondary" full onClick={reset} icon="refresh">Reset demo data</Button>
        </div>
      </div>
    </Phone>
  );
};

Object.assign(window, {
  ScreenWelcome, ScreenJobDetail, ScreenListingNew,
  ScreenGuardianListings, ScreenSettings,
});
