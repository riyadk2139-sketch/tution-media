// Phone-OTP authentication.
//
// In Supabase-backed mode: uses Supabase Auth's `signInWithOtp({ phone })`.
// You must configure an SMS provider (Twilio / SSL Wireless / BulkSMSBD via
// the custom SMS hook) in your Supabase project for codes to actually send.
//
// In localMode: a deterministic dummy flow that "sends" the code `123456`.
// Useful for local dev and demos — never ships to production.

import { supabase, localMode } from './supabase.js';

const LOCAL_USER_KEY = 'tm_local_user_v1';

export async function sendOtp(phone) {
  if (localMode) {
    sessionStorage.setItem('tm_pending_phone', phone);
    return { ok: true, mode: 'local', hint: 'Demo code: 123456' };
  }
  const { error } = await supabase.auth.signInWithOtp({
    phone,
    options: { shouldCreateUser: true },
  });
  if (error) return { ok: false, error: error.message };
  return { ok: true, mode: 'supabase' };
}

export async function verifyOtp(phone, code) {
  if (localMode) {
    if (code !== '123456') return { ok: false, error: 'Use 123456 for demo' };
    const user = { id: 'local-' + phone.replace(/\D/g, ''), phone };
    localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(user));
    return { ok: true, user };
  }
  const { data, error } = await supabase.auth.verifyOtp({ phone, token: code, type: 'sms' });
  if (error) return { ok: false, error: error.message };
  return { ok: true, user: data.user, session: data.session };
}

export async function signOut() {
  if (localMode) {
    localStorage.removeItem(LOCAL_USER_KEY);
    return;
  }
  await supabase.auth.signOut();
}

export async function currentUser() {
  if (localMode) {
    try { return JSON.parse(localStorage.getItem(LOCAL_USER_KEY) || 'null'); }
    catch { return null; }
  }
  const { data } = await supabase.auth.getUser();
  return data.user || null;
}

// Subscribe to auth state changes. Returns an unsubscribe fn.
export function onAuthChange(handler) {
  if (localMode) {
    const onStorage = (e) => {
      if (e.key === LOCAL_USER_KEY) handler(e.newValue ? JSON.parse(e.newValue) : null);
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }
  const { data } = supabase.auth.onAuthStateChange((_event, session) => {
    handler(session ? session.user : null);
  });
  return () => data.subscription.unsubscribe();
}
