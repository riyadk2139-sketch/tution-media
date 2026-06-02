// Phone-OTP sign in. The auth lib handles both Supabase and local modes.
// In local mode the demo code is 123456 (shown in the hint).

import React from 'react';
import { Phone, Button, Icon, Link } from '../components/ui.jsx';
import { sendOtp } from '../lib/auth.js';
import { actions } from '../store/store.js';
import { localMode } from '../lib/supabase.js';

export function ScreenSignIn() {
  const [step, setStep] = React.useState('phone');     // phone | otp
  const [phone, setPhone] = React.useState('');
  const [code, setCode] = React.useState('');
  const [error, setError] = React.useState('');
  const [busy, setBusy] = React.useState(false);
  const [hint, setHint] = React.useState('');

  const fullPhone = () => phone.startsWith('+') ? phone : '+880' + phone.replace(/\D/g, '');

  const requestCode = async () => {
    if (!phone) return setError('Enter a phone number');
    setBusy(true); setError('');
    const r = await sendOtp(fullPhone());
    setBusy(false);
    if (!r.ok) return setError(r.error || 'Could not send code');
    if (r.hint) setHint(r.hint);
    setStep('otp');
  };

  const submitCode = async () => {
    if (code.length !== 6) return setError('6-digit code');
    setBusy(true); setError('');
    const r = await actions.signIn(fullPhone(), code);
    setBusy(false);
    if (!r.ok) setError(r.error || 'Invalid code');
    // On success, the store updates state.user and the router redirects.
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
            width: 28, height: 28, borderRadius: 8, background: 'var(--tm-primary)', color: 'var(--tm-primary-ink)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--tm-font-display)', fontSize: 20, transform: 'translateY(2px)',
          }}>t</div>
          <div style={{
            fontFamily: 'var(--tm-font-display)', fontSize: 22, color: 'var(--tm-ink)', letterSpacing: '-0.01em',
          }}>Tution<span style={{ color: 'var(--tm-primary)' }}>.</span>media</div>
        </div>

        <div style={{ marginTop: 78 }}>
          <div style={{
            fontFamily: 'var(--tm-font-mono)', fontSize: 10.5, letterSpacing: '0.18em',
            textTransform: 'uppercase', color: 'var(--tm-ink-muted)', marginBottom: 16,
          }}>Sign in · Dhaka</div>
          <h1 style={{
            fontFamily: 'var(--tm-font-display)', fontWeight: 400, fontSize: 40,
            letterSpacing: '-0.015em', lineHeight: 1.02, color: 'var(--tm-ink)', margin: 0,
          }}>
            One number,<br/>one app.
          </h1>
          <p style={{
            margin: '18px 0 0', fontSize: 15, lineHeight: 1.5, color: 'var(--tm-ink-soft)', maxWidth: '88%',
          }}>
            We'll text you a one-time code to verify your phone. No documents needed yet.
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
              <input value={phone} onChange={(e) => setPhone(e.target.value)}
                placeholder="1712 048 391" inputMode="tel" autoComplete="tel-national"
                style={{
                  flex: 1, fontFamily: 'var(--tm-font-mono)', fontSize: 19, letterSpacing: '0.03em',
                  color: 'var(--tm-ink)', padding: '12px 0', background: 'transparent',
                  border: 0, outline: 'none', minWidth: 0,
                }}/>
            </div>
            {error && <p style={{ marginTop: 10, fontSize: 12, color: 'var(--tm-warn)' }}>{error}</p>}
            <div style={{ marginTop: 24 }}>
              <Button full size="lg" icon="arrR" onClick={requestCode}>
                {busy ? 'Sending…' : 'Send code'}
              </Button>
            </div>
            {localMode && (
              <p style={{ marginTop: 14, fontSize: 11.5, color: 'var(--tm-ink-muted)', lineHeight: 1.5, textAlign: 'center' }}>
                Demo mode — any number works. Code: <strong>123456</strong>
              </p>
            )}
          </div>
        )}

        {step === 'otp' && (
          <div style={{ marginTop: 56 }}>
            <label style={{
              fontFamily: 'var(--tm-font-mono)', fontSize: 10.5, letterSpacing: '0.14em',
              textTransform: 'uppercase', color: 'var(--tm-ink-muted)',
            }}>Verify code · {fullPhone()}</label>
            <input value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="------" inputMode="numeric" autoComplete="one-time-code" autoFocus
              style={{
                marginTop: 12, padding: '16px 18px', fontFamily: 'var(--tm-font-mono)',
                fontSize: 24, letterSpacing: '0.4em', color: 'var(--tm-ink)', width: '100%',
                background: 'var(--tm-surface)', border: '1px solid var(--tm-line)',
                borderRadius: 14, outline: 'none', WebkitAppearance: 'none', textAlign: 'center',
                boxSizing: 'border-box',
              }}/>
            {hint && (
              <p style={{ marginTop: 8, fontSize: 12, color: 'var(--tm-primary-deep)' }}>{hint}</p>
            )}
            {error && <p style={{ marginTop: 8, fontSize: 12, color: 'var(--tm-warn)' }}>{error}</p>}
            <div style={{ marginTop: 18 }}>
              <Button full size="lg" icon="arrR" onClick={submitCode}>
                {busy ? 'Verifying…' : 'Continue'}
              </Button>
            </div>
            <p style={{ marginTop: 14, fontSize: 12, color: 'var(--tm-ink-muted)' }}>
              <Link onClick={() => setStep('phone')}>Use a different number</Link>
            </p>
          </div>
        )}
      </div>
    </Phone>
  );
}
