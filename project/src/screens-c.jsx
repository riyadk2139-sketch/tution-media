// Tution Media — screens batch 3: Schedule + attendance log,
// Masked chat, Reputation/tier profile.

// ─── 8. Schedule + Attendance ────────────────────────────────
const ScreenSchedule = () => {
  const days = [
    { d: 'Sat', n: 23, classes: 1 },
    { d: 'Sun', n: 24, classes: 2 },
    { d: 'Mon', n: 25, classes: 2, today: true },
    { d: 'Tue', n: 26, classes: 1 },
    { d: 'Wed', n: 27, classes: 3 },
    { d: 'Thu', n: 28, classes: 0 },
    { d: 'Fri', n: 29, classes: 0 },
  ];

  return (
    <Phone tab="schedule">
      <div style={{ padding: '14px 22px 6px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <div>
          <div style={{
            fontFamily: 'var(--tm-font-mono)', fontSize: 10.5, letterSpacing: '0.14em',
            color: 'var(--tm-ink-muted)', textTransform: 'uppercase',
          }}>May · Week 21</div>
          <div style={{ fontFamily: 'var(--tm-font-display)', fontSize: 30, color: 'var(--tm-ink)', lineHeight: 1.05, marginTop: 2 }}>
            Today, Monday 25
          </div>
        </div>
        <button style={{
          background: 'var(--tm-surface)', border: '1px solid var(--tm-line)', borderRadius: 12,
          padding: '8px 10px', display: 'flex', alignItems: 'center', gap: 6, fontSize: 12,
          color: 'var(--tm-ink)', fontWeight: 500, cursor: 'pointer',
        }}>
          <Icon name="plus" size={14}/> Block
        </button>
      </div>

      {/* week strip */}
      <div style={{ padding: '12px 22px 4px' }}>
        <div style={{ display: 'flex', gap: 6, justifyContent: 'space-between' }}>
          {days.map(d => (
            <div key={d.d} style={{
              flex: 1, padding: '10px 0', borderRadius: 12, textAlign: 'center',
              background: d.today ? 'var(--tm-ink)' : 'transparent',
              border: `1px solid ${d.today ? 'var(--tm-ink)' : 'var(--tm-line)'}`,
              color: d.today ? 'var(--tm-paper)' : 'var(--tm-ink)',
            }}>
              <div style={{
                fontFamily: 'var(--tm-font-mono)', fontSize: 10, letterSpacing: '0.1em',
                textTransform: 'uppercase', opacity: 0.7,
              }}>{d.d}</div>
              <div style={{
                fontFamily: 'var(--tm-font-display)', fontSize: 20, marginTop: 4, lineHeight: 1,
                fontVariantNumeric: 'tabular-nums',
              }}>{d.n}</div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 2, marginTop: 6, height: 4 }}>
                {Array.from({length: d.classes}).map((_, i) => (
                  <span key={i} style={{
                    width: 4, height: 4, borderRadius: 2,
                    background: d.today ? 'var(--tm-primary)' : 'var(--tm-primary-deep)',
                  }}/>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Earnings strip */}
      <div style={{ padding: '14px 22px 0' }}>
        <div style={{
          background: 'var(--tm-primary)', color: 'var(--tm-primary-ink)',
          borderRadius: 16, padding: '14px 16px',
          display: 'flex', alignItems: 'center', gap: 14,
        }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: 'var(--tm-font-mono)', fontSize: 10, letterSpacing: '0.14em', opacity: 0.8, textTransform: 'uppercase' }}>
              This week
            </div>
            <div style={{ fontFamily: 'var(--tm-font-display)', fontSize: 26, marginTop: 4, lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
              ৳ 6,250
            </div>
            <div style={{ fontSize: 11.5, opacity: 0.85, marginTop: 6 }}>
              Auto-collected for 5 of 7 students
            </div>
          </div>
          <div style={{
            background: 'rgba(255,255,255,0.12)', borderRadius: 12, padding: '10px 12px', textAlign: 'right',
          }}>
            <div style={{ fontSize: 11, opacity: 0.85 }}>Payout</div>
            <div style={{ fontFamily: 'var(--tm-font-mono)', fontSize: 12, fontWeight: 600, marginTop: 4 }}>FRI</div>
          </div>
        </div>
      </div>

      <SectionLabel right={<Chip tone="ink" size="sm">2 today</Chip>}>Classes today</SectionLabel>
      <div style={{ padding: '0 22px 4px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {TM_DATA.classes.filter(c => c.date === 'Today').map((c, i) => (
          <ClassCard key={c.id} c={c} first={i === 0}/>
        ))}
      </div>

      <SectionLabel>Tomorrow</SectionLabel>
      <div style={{ padding: '0 22px 24px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {TM_DATA.classes.filter(c => c.date === 'Tomorrow').map(c => (
          <ClassCard key={c.id} c={c} muted/>
        ))}
      </div>
    </Phone>
  );
};

const ClassCard = ({ c, first, muted }) => {
  const [attended, setAttended] = React.useState(false);
  return (
    <Card pad={0} style={{ overflow: 'hidden', opacity: muted ? 0.85 : 1 }}>
      <div style={{ display: 'flex', gap: 14, padding: '14px 16px' }}>
        <div style={{
          width: 56, textAlign: 'center', padding: '6px 0', borderRadius: 10,
          background: first ? 'var(--tm-primary-soft)' : 'var(--tm-paper-deep)',
          color: first ? 'var(--tm-primary-deep)' : 'var(--tm-ink-soft)',
          display: 'flex', flexDirection: 'column', justifyContent: 'center', flexShrink: 0,
        }}>
          <div style={{ fontFamily: 'var(--tm-font-display)', fontSize: 18, lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
            {c.time.replace(/(am|pm)/, '')}
          </div>
          <div style={{ fontFamily: 'var(--tm-font-mono)', fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 4, opacity: 0.8 }}>
            {c.time.match(/(am|pm)/)?.[0] || ''} · {c.dur}
          </div>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14.5, fontWeight: 600, color: 'var(--tm-ink)' }}>{c.student}</div>
          <div style={{ fontSize: 12.5, color: 'var(--tm-ink-soft)', marginTop: 3 }}>
            {c.subject}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6, fontSize: 11.5, color: 'var(--tm-ink-muted)' }}>
            <Icon name="pin" size={12}/> {c.area}
            <span style={{ opacity: 0.6, margin: '0 6px' }}>·</span>
            <span style={{ fontFamily: 'var(--tm-font-mono)' }}>৳{c.payPerClass} / class</span>
          </div>
        </div>
      </div>
      {first && (
        <div style={{
          borderTop: '1px dashed var(--tm-line)', padding: '12px 16px',
          background: 'var(--tm-paper)', display: 'flex', gap: 8, alignItems: 'center',
        }}>
          <Button variant="secondary" size="sm" icon="nav">Navigate</Button>
          <div style={{ flex: 1 }}/>
          {attended ? (
            <Button variant="secondary" size="sm" icon="checkCircle"
              style={{ color: 'var(--tm-accent)', borderColor: 'var(--tm-accent-soft)' }}>
              Attended ✓
            </Button>
          ) : (
            <Button size="sm" icon="check" onClick={() => setAttended(true)}>
              Mark attended
            </Button>
          )}
        </div>
      )}
    </Card>
  );
};

// ─── 9. Masked Chat ──────────────────────────────────────────
const ScreenChat = () => {
  const [openId, setOpenId] = React.useState(null);
  return (
    <Phone tab="chat">
      {!openId && <ChatList onOpen={(id) => {
        setOpenId(id);
        if (typeof TmActions !== 'undefined') TmActions.markChatRead(id);
      }}/>}
      {openId && <ChatThread chatId={openId} onClose={() => setOpenId(null)}/>}
    </Phone>
  );
};

const ChatList = ({ onOpen }) => {
  const s = (typeof useStore === 'function') ? useStore() : null;
  const chats = s ? s.chats : TM_DATA.chats;
  return (
  <>
    <ScreenHeader title="Inbox" large
      right={<button style={{ background: 'transparent', border: 0, color: 'var(--tm-ink)', cursor: 'pointer', padding: 4 }}><Icon name="search" size={20}/></button>}/>
    <div style={{ padding: '0 22px 12px' }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px',
        background: 'var(--tm-paper-deep)', borderRadius: 12,
      }}>
        <Icon name="shield" size={16}/>
        <div style={{ fontSize: 12, color: 'var(--tm-ink-soft)', lineHeight: 1.4 }}>
          All chats are masked. Guardians never see your phone number, and you never see theirs.
        </div>
      </div>
    </div>

    <div style={{ padding: '0 22px 0' }}>
      {chats.map((c, i) => (
        <div key={c.id} onClick={() => onOpen(c.id)} style={{
          display: 'flex', gap: 12, padding: '14px 0',
          borderBottom: i < chats.length - 1 ? '1px solid var(--tm-line-soft)' : 'none',
          cursor: 'pointer',
        }}>
          {c.system ? (
            <div style={{
              width: 44, height: 44, borderRadius: 12, background: 'var(--tm-ink)', color: 'var(--tm-paper)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <Icon name="shieldCheck" size={18}/>
            </div>
          ) : (
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <Avatar name={c.name} size={44}/>
              {c.masked && (
                <div style={{
                  position: 'absolute', bottom: -2, right: -2,
                  width: 18, height: 18, borderRadius: 9, background: 'var(--tm-surface)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: '2px solid var(--tm-paper)', color: 'var(--tm-ink-muted)',
                }}>
                  <Icon name="lock" size={9} stroke={2.2}/>
                </div>
              )}
            </div>
          )}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
              <span style={{
                fontSize: 14.5, fontWeight: c.unread ? 600 : 500, color: 'var(--tm-ink)',
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>{c.name}</span>
              <span style={{ fontSize: 11, color: 'var(--tm-ink-muted)', fontFamily: 'var(--tm-font-mono)', flexShrink: 0 }}>
                {c.time}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginTop: 4 }}>
              <span style={{
                fontSize: 12.5, color: c.unread ? 'var(--tm-ink)' : 'var(--tm-ink-muted)',
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                fontWeight: c.unread ? 500 : 400,
              }}>{c.preview}</span>
              {c.unread > 0 && (
                <span style={{
                  background: 'var(--tm-primary)', color: 'var(--tm-primary-ink)',
                  fontSize: 10.5, fontWeight: 700, padding: '2px 7px', borderRadius: 999,
                  fontFamily: 'var(--tm-font-mono)', flexShrink: 0,
                }}>{c.unread}</span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  </>
  );
};

const ChatThread = ({ chatId, onClose }) => {
  const s = (typeof useStore === 'function') ? useStore() : null;
  const chat = s ? s.chats.find(c => c.id === chatId) : null;
  const messages = chat ? (chat.messages || []) : [];
  const peerName = chat ? chat.name : 'Chat';
  const [draft, setDraft] = React.useState('');
  const scrollRef = React.useRef(null);

  React.useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages.length]);

  const send = () => {
    const text = draft.trim();
    if (!text) return;
    setDraft('');
    if (typeof TmActions !== 'undefined') TmActions.sendMessage(chatId, text);
    // Echo back a polite acknowledgement after a small delay so the chat
    // feels alive — only for non-system chats.
    if (chat && !chat.system) {
      setTimeout(() => {
        if (typeof TmActions !== 'undefined') {
          const replies = [
            'Got it, thanks!',
            'Sounds good.',
            'Let me check and get back to you.',
            'Perfect, see you then.',
            'Noted.',
          ];
          TmActions.sendMessage(chatId, replies[Math.floor(Math.random() * replies.length)]);
          // immediately flip the last message author to 'them' since sendMessage assumes me
          // (simpler: directly mutate)
          const st = tmStore.state;
          tmStore.commit({ ...st,
            chats: st.chats.map(c => c.id === chatId ? {
              ...c, last: 'them',
              messages: c.messages.map((m, i) => i === c.messages.length - 1 ? { ...m, from: 'them' } : m),
            } : c),
          });
        }
      }, 1400);
    }
  };

  return (
    <>
      {/* Custom chat header */}
      <div style={{
        padding: '12px 18px', background: 'var(--tm-paper)',
        borderBottom: '1px solid var(--tm-line)', display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <button onClick={onClose} style={{
          background: 'var(--tm-surface)', border: '1px solid var(--tm-line)',
          width: 36, height: 36, borderRadius: 18, color: 'var(--tm-ink)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', padding: 0,
        }}>
          <Icon name="chevL" size={18}/>
        </button>
        <Avatar name={peerName} size={36}/>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--tm-ink)', display: 'flex', alignItems: 'center', gap: 6 }}>
            {peerName} {chat && chat.masked && <Icon name="lock" size={11} stroke={2}/>}
          </div>
          <div style={{ fontSize: 11, color: 'var(--tm-ink-muted)', marginTop: 1 }}>
            {chat && chat.system ? 'Tution Media · official' : 'via Tution Media · masked'}
          </div>
        </div>
        <button style={{
          background: 'var(--tm-surface)', border: '1px solid var(--tm-line)',
          width: 36, height: 36, borderRadius: 18, color: 'var(--tm-ink)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', padding: 0,
        }}>
          <Icon name="phone" size={16}/>
        </button>
      </div>

      <div ref={scrollRef} style={{ padding: '14px 18px 12px', background: 'var(--tm-paper)' }}>
        <div style={{
          textAlign: 'center', fontSize: 10.5, fontFamily: 'var(--tm-font-mono)',
          letterSpacing: '0.14em', color: 'var(--tm-ink-muted)', textTransform: 'uppercase',
          marginBottom: 18,
        }}>· {messages.length ? 'Conversation' : 'Say hi'} ·</div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {messages.map((m, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: m.from === 'me' ? 'flex-end' : 'flex-start' }}>
              <div style={{
                maxWidth: '78%', padding: '10px 13px',
                background: m.from === 'me' ? 'var(--tm-primary)' : 'var(--tm-surface)',
                color: m.from === 'me' ? 'var(--tm-primary-ink)' : 'var(--tm-ink)',
                borderRadius: 14,
                borderTopRightRadius: m.from === 'me' ? 4 : 14,
                borderTopLeftRadius: m.from === 'them' ? 4 : 14,
                border: m.from === 'them' ? '1px solid var(--tm-line)' : 'none',
                fontSize: 13.5, lineHeight: 1.4,
              }}>
                {m.text}
                <div style={{
                  fontSize: 10, marginTop: 4, fontFamily: 'var(--tm-font-mono)',
                  opacity: 0.6, textAlign: 'right',
                }}>{m.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* composer — sticky so it stays put while messages scroll */}
      <div style={{
        position: 'sticky', bottom: 0, padding: '10px 14px',
        background: 'var(--tm-paper)', borderTop: '1px solid var(--tm-line)',
        display: 'flex', alignItems: 'center', gap: 8, zIndex: 2,
      }}>
        <input value={draft} onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') send(); }}
          placeholder={`Message ${peerName.split(' ')[0]}…`}
          style={{
            flex: 1, background: 'var(--tm-surface)', border: '1px solid var(--tm-line)',
            borderRadius: 22, padding: '10px 16px', fontSize: 14, color: 'var(--tm-ink)',
            outline: 'none', WebkitAppearance: 'none', minWidth: 0,
          }}/>
        <button onClick={send} style={{
          width: 38, height: 38, borderRadius: 19,
          background: draft.trim() ? 'var(--tm-primary)' : 'var(--tm-paper-deep)',
          color: draft.trim() ? 'var(--tm-primary-ink)' : 'var(--tm-ink-muted)',
          border: 0, display: 'flex', alignItems: 'center',
          justifyContent: 'center', cursor: 'pointer', flexShrink: 0,
        }}>
          <Icon name="send" size={16}/>
        </button>
      </div>
    </>
  );
};

// ─── 10. Reputation / Profile ────────────────────────────────
const ScreenReputation = () => {
  const t = TM_DATA.tutor;
  // tier ladder
  const tierLadder = [
    { name: 'Apprentice', need: 0,  cur: false },
    { name: 'Tutor', need: 5, cur: false, passed: true },
    { name: 'Trusted', need: 12, cur: true },
    { name: 'Expert', need: 25, cur: false },
    { name: 'Mentor', need: 50, cur: false },
  ];
  const reviews = [
    { from: 'Mr. Rahman', when: 'May', rating: 5,
      text: 'Tanvir is patient and explains physics in a way my daughter finally gets. On-time every class.' },
    { from: 'Mrs. Akter', when: 'Apr', rating: 5,
      text: 'Strong with maths. Saif\'s SSC marks jumped from C to A in 3 months.' },
    { from: 'Ms. Karim', when: 'Apr', rating: 4,
      text: 'Reliable. Could share more practice problems between classes.' },
  ];

  return (
    <Phone tab="reputation">
      {/* Identity header — paper-textured */}
      <div style={{ padding: '14px 22px 18px', position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <Avatar name={t.name} size={64} tone="#b8462a"/>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: 'var(--tm-font-display)', fontSize: 26, color: 'var(--tm-ink)', lineHeight: 1.1, letterSpacing: '-0.01em' }}>
              {t.name}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6, flexWrap: 'wrap' }}>
              <VerifyBadge tier={t.verifyTier}/>
              <span style={{
                fontFamily: 'var(--tm-font-mono)', fontSize: 11, color: 'var(--tm-ink-muted)',
                letterSpacing: '0.04em',
              }}>{t.handle}</span>
            </div>
          </div>
          <button style={{
            background: 'var(--tm-surface)', border: '1px solid var(--tm-line)',
            width: 36, height: 36, borderRadius: 18, color: 'var(--tm-ink)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', padding: 0,
          }}>
            <Icon name="pen" size={15}/>
          </button>
        </div>

        <div style={{ marginTop: 14, fontSize: 13.5, color: 'var(--tm-ink-soft)', lineHeight: 1.5 }}>
          {t.institution} · {t.department}, {t.year}. Teaching Physics & Math
          across Dhanmondi, Mohammadpur, Lalmatia.
        </div>
      </div>

      {/* Tier card */}
      <div style={{ padding: '0 22px 14px' }}>
        <div style={{
          background: 'var(--tm-ink)', color: 'var(--tm-paper)', borderRadius: 18,
          padding: '16px 18px', position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
            <div>
              <div style={{
                fontFamily: 'var(--tm-font-mono)', fontSize: 10.5, letterSpacing: '0.16em',
                opacity: 0.6, textTransform: 'uppercase',
              }}>Reputation tier</div>
              <div style={{
                fontFamily: 'var(--tm-font-display)', fontSize: 34, marginTop: 4,
                letterSpacing: '-0.01em', lineHeight: 1,
              }}>Trusted</div>
              <div style={{ fontSize: 12, opacity: 0.7, marginTop: 8 }}>
                12 of 25 hires to <strong style={{ color: 'var(--tm-primary-soft)' }}>Expert</strong>
              </div>
            </div>
            <Icon name="award" size={42} stroke={1.2}/>
          </div>
          <div style={{ marginTop: 14 }}>
            <div style={{ height: 6, background: 'currentColor', opacity: 0.18, borderRadius: 3, overflow: 'hidden' }}/>
            <div style={{ height: 6, marginTop: -6, borderRadius: 3, overflow: 'hidden', position: 'relative' }}>
              <div style={{ width: '48%', height: '100%', background: 'var(--tm-primary)' }}/>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10 }}>
              {tierLadder.map((tl, i) => (
                <div key={i} style={{
                  fontFamily: 'var(--tm-font-mono)', fontSize: 9.5, letterSpacing: '0.08em',
                  opacity: tl.cur ? 1 : (tl.passed ? 0.55 : 0.35),
                  color: tl.cur ? 'var(--tm-primary-soft)' : 'inherit',
                  textTransform: 'uppercase',
                }}>{tl.name}</div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div style={{ padding: '0 22px 4px' }}>
        <Card pad={16} style={{ background: 'var(--tm-surface)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
            <Stat value={t.rating} label="Rating"/>
            <Stat value={t.completedHires} label="Hires"/>
            <Stat value={`${t.onTime}%`} label="On-time"/>
            <Stat value={`${t.retention}%`} label="Retained"/>
          </div>
        </Card>
      </div>

      {/* Subjects strip */}
      <SectionLabel>Teaches</SectionLabel>
      <div style={{ padding: '0 22px', display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {TM_DATA.subjects.map(s => <Chip key={s} tone="primary" size="md">{s}</Chip>)}
        {TM_DATA.areas.map(a => <Chip key={a} tone="accent" size="md" icon="pin">{a}</Chip>)}
      </div>

      {/* Reviews */}
      <SectionLabel right={<span style={{ fontFamily: 'var(--tm-font-mono)', fontSize: 10.5, letterSpacing: '0.1em', color: 'var(--tm-ink-muted)' }}>{reviews.length} OF 11</span>}>
        Verified reviews
      </SectionLabel>
      <div style={{ padding: '0 22px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {reviews.map((r, i) => (
          <div key={i} style={{
            background: 'var(--tm-surface)', border: '1px solid var(--tm-line)', borderRadius: 16,
            padding: 16,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Avatar name={r.from} size={28}/>
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--tm-ink)' }}>{r.from}</span>
                <Icon name="checkCircle" size={13} stroke={2.2}/>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 2, color: 'var(--tm-primary)' }}>
                {Array.from({length: r.rating}).map((_, i) => (
                  <Icon key={i} name="star" size={12} stroke={0} fill="currentColor"/>
                ))}
                {Array.from({length: 5 - r.rating}).map((_, i) => (
                  <Icon key={`e${i}`} name="star" size={12} stroke={1.4}/>
                ))}
              </div>
            </div>
            <div style={{
              marginTop: 10, fontSize: 13.5, color: 'var(--tm-ink-soft)', lineHeight: 1.5, textWrap: 'pretty',
            }}>"{r.text}"</div>
            <div style={{
              marginTop: 10, fontFamily: 'var(--tm-font-mono)', fontSize: 10.5,
              letterSpacing: '0.1em', color: 'var(--tm-ink-muted)', textTransform: 'uppercase',
            }}>{r.when} · 3-month engagement</div>
          </div>
        ))}
      </div>

      {/* Earnings card */}
      <SectionLabel>Earnings</SectionLabel>
      <div style={{ padding: '0 22px 24px' }}>
        <Card pad={16}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontFamily: 'var(--tm-font-mono)', fontSize: 10.5, letterSpacing: '0.14em', color: 'var(--tm-ink-muted)', textTransform: 'uppercase' }}>
                This month
              </div>
              <div style={{ fontFamily: 'var(--tm-font-display)', fontSize: 30, color: 'var(--tm-ink)', marginTop: 4, lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
                ৳ {t.earnings.toLocaleString()}
              </div>
              <div style={{ fontSize: 12, color: 'var(--tm-accent)', marginTop: 6 }}>
                ↑ ৳3,200 vs April · verified income
              </div>
            </div>
            <BarSpark/>
          </div>
        </Card>
      </div>
    </Phone>
  );
};

const BarSpark = () => {
  const bars = [12, 16, 11, 18, 22, 19, 28];
  const max = Math.max(...bars);
  return (
    <svg width="120" height="56" viewBox="0 0 120 56">
      {bars.map((b, i) => {
        const h = (b / max) * 48;
        return <rect key={i} x={i * 17} y={56 - h} width="11" height={h}
          rx="2" fill={i === bars.length - 1 ? 'var(--tm-primary)' : 'var(--tm-paper-deep)'}/>;
      })}
    </svg>
  );
};

Object.assign(window, { ScreenSchedule, ScreenChat, ScreenReputation });
