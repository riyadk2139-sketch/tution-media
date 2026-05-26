// Tution Media — screens batch 2: Verification gate, Demand heatmap,
// Location request + Google Maps reveal.

// ─── 5. Verification gate ────────────────────────────────────
const ScreenVerify = () => {
  const tiers = [
    { n: 0, name: 'Phone', sub: 'Verified at signup', state: 'done', icon: 'phone',
      help: '+880 1712 048 391' },
    { n: 1, name: 'National ID', sub: 'Porichoy lookup', state: 'done', icon: 'id',
      help: 'NID #1989 12345', when: '2 days ago' },
    { n: 2, name: 'Education', sub: 'Student ID + board result', state: 'current', icon: 'book',
      help: 'BUET · Mechanical Eng · ID 1804023' },
    { n: 3, name: 'Reference check', sub: 'Manual · for premium jobs', state: 'locked', icon: 'shieldCheck',
      help: 'Unlocks ৳15k+/month placements' },
  ];

  return (
    <Phone tab="reputation">
      <ScreenHeader back title="Verification" sub="Tier 2 of 4"/>

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
                Verified
              </div>
              <div style={{ fontSize: 12.5, opacity: 0.7, marginTop: 6, maxWidth: 220, lineHeight: 1.4 }}>
                You can be hired. Complete tier 3 to unlock premium-rate jobs.
              </div>
            </div>
            <div style={{ position: 'relative', width: 78, height: 78 }}>
              <svg width="78" height="78" viewBox="0 0 78 78">
                <circle cx="39" cy="39" r="32" fill="none" stroke="currentColor" strokeOpacity="0.15" strokeWidth="6"/>
                <circle cx="39" cy="39" r="32" fill="none" stroke="var(--tm-primary)" strokeWidth="6"
                  strokeDasharray={2 * Math.PI * 32} strokeDashoffset={2 * Math.PI * 32 * 0.4}
                  transform="rotate(-90 39 39)" strokeLinecap="round"/>
              </svg>
              <div style={{
                position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'var(--tm-font-display)', fontSize: 22,
              }}>2/4</div>
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
                  <Button full icon="upload" style={{ marginTop: 4 }}>Submit for review</Button>
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

const UploadRow = ({ label, meta, done, cta }) => (
  <div style={{
    display: 'flex', alignItems: 'center', gap: 12,
    padding: '10px 12px', borderRadius: 10,
    background: done ? 'var(--tm-accent-soft)' : 'var(--tm-paper)',
    border: `1px ${cta ? 'solid' : 'dashed'} ${done ? 'transparent' : 'var(--tm-line)'}`,
  }}>
    <div style={{
      width: 30, height: 30, borderRadius: 8,
      background: done ? 'var(--tm-accent)' : 'var(--tm-paper-deep)',
      color: done ? '#fff' : 'var(--tm-ink-muted)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
    }}>
      <Icon name={done ? 'check' : 'upload'} size={15} stroke={2}/>
    </div>
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ fontSize: 13, color: 'var(--tm-ink)', fontWeight: 500 }}>{label}</div>
      <div style={{ fontSize: 11, color: 'var(--tm-ink-muted)', marginTop: 2 }}>{meta}</div>
    </div>
    {cta && <Chip tone="primary" size="sm" icon="plus">Add</Chip>}
  </div>
);

// ─── 6. Demand "near you" heatmap ────────────────────────────
const ScreenHeatmap = () => {
  return (
    <Phone tab="heatmap">
      <ScreenHeader sub="This week · Dhanmondi cluster" title="Demand near you" large
        right={
          <button style={{
            background: 'var(--tm-surface)', border: '1px solid var(--tm-line)', borderRadius: 12,
            padding: '8px 10px', color: 'var(--tm-ink)', display: 'flex', alignItems: 'center', gap: 6,
            fontSize: 12, fontWeight: 500, cursor: 'pointer',
          }}>
            <Icon name="layers" size={14}/> Subjects
          </button>
        }/>

      {/* Hero stats */}
      <div style={{ padding: '0 22px 14px' }}>
        <Card pad={18}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
            <Stat value="71" label="Open jobs"/>
            <Stat value="14" label="In your areas"/>
            <Stat value="8.7k" label="Median pay"/>
          </div>
          <div style={{
            marginTop: 14, paddingTop: 14, borderTop: '1px dashed var(--tm-line)',
            display: 'flex', alignItems: 'center', gap: 8, fontSize: 12.5, color: 'var(--tm-primary-deep)',
          }}>
            <Icon name="bolt" size={14}/> Add <strong>Lalmatia</strong> to your areas to see 6 more matches.
          </div>
        </Card>
      </div>

      {/* The map */}
      <div style={{ padding: '0 22px' }}>
        <div style={{
          position: 'relative', height: 280, borderRadius: 18, overflow: 'hidden',
          background: 'var(--tm-paper-deep)', border: '1px solid var(--tm-line)',
        }}>
          <Heatmap/>
          {/* legend */}
          <div style={{
            position: 'absolute', left: 12, bottom: 12, background: 'var(--tm-surface)',
            border: '1px solid var(--tm-line)', borderRadius: 10, padding: '8px 10px',
            display: 'flex', alignItems: 'center', gap: 8, fontSize: 11,
          }}>
            <span style={{ fontFamily: 'var(--tm-font-mono)', color: 'var(--tm-ink-muted)', letterSpacing: '0.08em' }}>LOW</span>
            <div style={{
              width: 80, height: 6, borderRadius: 3,
              background: 'linear-gradient(90deg, var(--tm-paper-deep), var(--tm-primary))',
            }}/>
            <span style={{ fontFamily: 'var(--tm-font-mono)', color: 'var(--tm-ink-muted)', letterSpacing: '0.08em' }}>HIGH</span>
          </div>
          {/* "you" marker */}
          <div style={{
            position: 'absolute', left: '38%', top: '50%', transform: 'translate(-50%,-50%)',
            display: 'flex', alignItems: 'center', gap: 6,
          }}>
            <div style={{
              width: 14, height: 14, borderRadius: 7, background: 'var(--tm-ink)',
              border: '3px solid var(--tm-surface)', boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
            }}/>
            <div style={{
              background: 'var(--tm-ink)', color: 'var(--tm-paper)', padding: '3px 8px',
              borderRadius: 6, fontSize: 10.5, fontFamily: 'var(--tm-font-mono)', letterSpacing: '0.04em',
            }}>YOU</div>
          </div>
        </div>
      </div>

      <SectionLabel right={<span style={{ fontFamily: 'var(--tm-font-mono)', fontSize: 10.5, letterSpacing: '0.1em', color: 'var(--tm-ink-muted)' }}>SORTED BY HEAT</span>}>
        Top zones this week
      </SectionLabel>
      <div style={{ padding: '0 22px 24px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {TM_DATA.heatmap.slice(0, 5).map((z, i) => (
          <div key={z.name} style={{
            display: 'flex', alignItems: 'center', gap: 14,
            padding: '12px 14px', background: 'var(--tm-surface)',
            border: '1px solid var(--tm-line)', borderRadius: 14,
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

// Stylized heat blobs over an abstract Dhaka street grid
const Heatmap = () => {
  const W = 380, H = 280;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
      {/* base streets */}
      <g stroke="var(--tm-line)" strokeWidth="1" fill="none" opacity="0.7">
        {Array.from({length: 9}).map((_, i) => (
          <line key={`h${i}`} x1="0" y1={30 + i * 28} x2={W} y2={30 + i * 28 + (i % 2 ? 6 : -4)}/>
        ))}
        {Array.from({length: 11}).map((_, i) => (
          <line key={`v${i}`} x1={30 + i * 34} y1="0" x2={30 + i * 34 + (i % 2 ? 4 : -3)} y2={H}/>
        ))}
      </g>
      {/* main road */}
      <path d="M0 130 C 80 110, 200 160, 380 120" stroke="var(--tm-ink-muted)" strokeWidth="3" opacity="0.45" fill="none"/>
      <path d="M180 0 C 200 80, 150 180, 200 280" stroke="var(--tm-ink-muted)" strokeWidth="3" opacity="0.45" fill="none"/>

      {/* heat blobs */}
      <defs>
        {TM_DATA.heatmap.map((z, i) => (
          <radialGradient key={i} id={`heat-${i}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--tm-primary)" stopOpacity={0.85 * z.intensity}/>
            <stop offset="100%" stopColor="var(--tm-primary)" stopOpacity="0"/>
          </radialGradient>
        ))}
      </defs>
      {TM_DATA.heatmap.map((z, i) => {
        const r = 30 + z.intensity * 50;
        return (
          <circle key={i} cx={z.x * W} cy={z.y * H} r={r} fill={`url(#heat-${i})`}/>
        );
      })}
      {/* labels for top 3 */}
      {TM_DATA.heatmap.slice(0, 3).map((z, i) => (
        <g key={i} transform={`translate(${z.x * W}, ${z.y * H - 6})`}>
          <text textAnchor="middle" y="-12" fontFamily="var(--tm-font-mono)" fontSize="9"
            letterSpacing="0.1em" fill="var(--tm-ink)" style={{ textTransform: 'uppercase' }}>
            {z.requests}
          </text>
          <circle r="4" fill="var(--tm-primary-deep)"/>
          <text textAnchor="middle" y="16" fontFamily="var(--tm-font-ui)" fontSize="9.5" fontWeight="600" fill="var(--tm-ink)">
            {z.name.split(' ')[0]}
          </text>
        </g>
      ))}
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
          background: '#e8e3d6', border: '1px solid var(--tm-line)',
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

          {/* Maps-like top search bar in granted mode */}
          {granted && (
            <div style={{
              position: 'absolute', top: 12, left: 12, right: 12,
              background: 'var(--tm-surface)', borderRadius: 12, padding: '10px 12px',
              display: 'flex', alignItems: 'center', gap: 10,
              boxShadow: '0 4px 14px rgba(35,29,24,0.18)',
            }}>
              <Icon name="search" size={16}/>
              <div style={{ flex: 1, fontSize: 13, color: 'var(--tm-ink-soft)', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                House 47, Road 9/A, Dhanmondi 27
              </div>
              <div style={{
                fontFamily: 'var(--tm-font-mono)', fontSize: 10, color: 'var(--tm-primary)',
                letterSpacing: '0.08em', fontWeight: 600,
              }}>14 MIN</div>
            </div>
          )}
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

// Maps illustration — fuzzed circle when not granted, exact pin + route when granted
const MapsView = ({ granted }) => {
  const W = 380, H = 340;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
      {/* parks / blocks */}
      <rect x="0" y="0" width={W} height={H} fill="#eee6d2"/>
      <g fill="#d8e3c8">
        <rect x="40" y="30" width="80" height="60" rx="4"/>
        <rect x="200" y="220" width="120" height="80" rx="4"/>
      </g>
      {/* blocks (buildings) */}
      <g fill="#dccea7">
        {Array.from({length: 22}).map((_, i) => {
          const x = 20 + (i % 6) * 60 + (i % 2 ? 4 : 0);
          const y = 20 + Math.floor(i / 6) * 70 + (i % 3 ? 0 : 8);
          const w = 38 + (i % 3) * 6;
          const h = 30 + (i % 4) * 8;
          return <rect key={i} x={x} y={y} width={w} height={h} rx="2"/>;
        })}
      </g>
      {/* streets */}
      <g stroke="#fdfaf3" strokeWidth="6" strokeLinecap="round">
        <line x1="0" y1="120" x2={W} y2="124"/>
        <line x1="0" y1="220" x2={W} y2="216"/>
        <line x1="120" y1="0" x2="120" y2={H}/>
        <line x1="240" y1="0" x2="244" y2={H}/>
      </g>
      <g stroke="#fdfaf3" strokeWidth="3" strokeLinecap="round" opacity="0.8">
        <line x1="0" y1="60" x2={W} y2="62"/>
        <line x1="0" y1="290" x2={W} y2="288"/>
        <line x1="60" y1="0" x2="60" y2={H}/>
        <line x1="180" y1="0" x2="180" y2={H}/>
        <line x1="320" y1="0" x2="320" y2={H}/>
      </g>

      {/* "you" — current location dot, bottom-left area */}
      <g transform="translate(110, 230)">
        <circle r="22" fill="var(--tm-primary)" opacity="0.18"/>
        <circle r="9" fill="var(--tm-primary)" stroke="#fdfaf3" strokeWidth="3"/>
      </g>

      {!granted && (
        <g transform="translate(245, 110)">
          {/* fuzzy circle */}
          <circle r="62" fill="var(--tm-ink)" opacity="0.12"/>
          <circle r="62" fill="none" stroke="var(--tm-ink)" strokeWidth="1.4" strokeDasharray="5 5" opacity="0.6"/>
          {/* ghost pin */}
          <g opacity="0.6">
            <path d="M0 -22 a14 14 0 1 1 0 28 z" fill="var(--tm-ink)" opacity="0.4"/>
          </g>
        </g>
      )}

      {granted && (
        <>
          {/* navigation route */}
          <path d="M110 230 Q 150 200, 180 180 T 240 130 Q 246 120, 248 112"
            stroke="var(--tm-primary)" strokeWidth="5" fill="none" strokeLinecap="round"/>
          {/* destination pin */}
          <g transform="translate(248, 108)">
            <path d="M0 -8 C -10 -8, -16 -2, -16 6 C -16 16, 0 30, 0 30 C 0 30, 16 16, 16 6 C 16 -2, 10 -8, 0 -8 Z"
              fill="var(--tm-primary)" stroke="#fdfaf3" strokeWidth="2"/>
            <circle r="4" cy="2" fill="#fdfaf3"/>
          </g>
        </>
      )}
    </svg>
  );
};

Object.assign(window, { ScreenVerify, ScreenHeatmap, ScreenLocation });
