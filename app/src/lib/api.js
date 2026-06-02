// Data API. One interface, two implementations:
//   - Supabase mode → real Postgres rows, RLS-enforced.
//   - Local mode    → localStorage, same shape, for offline dev and demos.
//
// Every function returns a Promise so screens are written once and don't
// care which backend is active.

import { supabase, localMode } from './supabase.js';
import { currentUser } from './auth.js';

// ─── localStorage helpers ──────────────────────────────────────────────
const KEY = 'tm_data_v1';

function readLocal() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return seedLocal();
    return JSON.parse(raw);
  } catch {
    return seedLocal();
  }
}

function writeLocal(state) {
  localStorage.setItem(KEY, JSON.stringify(state));
  return state;
}

function seedLocal() {
  const seed = {
    profiles: {},          // keyed by user id
    listings: [],
    applications: [],
    classes: [],
    chat_threads: [],
    messages: [],
    student_feedback: [],
  };
  return writeLocal(seed);
}

function uid() {
  return 'id-' + Math.random().toString(36).slice(2, 11) + Date.now().toString(36);
}

async function meId() {
  const u = await currentUser();
  if (!u) throw new Error('Not signed in');
  return u.id;
}

// ─── Profiles ──────────────────────────────────────────────────────────
export async function getProfile(userId) {
  const id = userId || (await meId());
  if (localMode) {
    return readLocal().profiles[id] || null;
  }
  const { data, error } = await supabase
    .from('profiles')
    .select('*, tutor_profiles(*), guardian_profiles(*)')
    .eq('id', id)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function upsertProfile(patch) {
  const id = await meId();
  if (localMode) {
    const s = readLocal();
    s.profiles[id] = { ...(s.profiles[id] || { id }), ...patch, updated_at: new Date().toISOString() };
    writeLocal(s);
    return s.profiles[id];
  }
  const { tutor, guardian, ...base } = patch;
  const { error: e1 } = await supabase.from('profiles').upsert({ id, ...base });
  if (e1) throw e1;
  if (tutor) {
    const { error: e2 } = await supabase.from('tutor_profiles').upsert({ id, ...tutor });
    if (e2) throw e2;
  }
  if (guardian) {
    const { error: e3 } = await supabase.from('guardian_profiles').upsert({ id, ...guardian });
    if (e3) throw e3;
  }
  return getProfile(id);
}

// ─── Listings ──────────────────────────────────────────────────────────
export async function listListings({ limit = 50 } = {}) {
  if (localMode) {
    return readLocal().listings
      .slice()
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, limit);
  }
  const { data, error } = await supabase
    .from('listings')
    .select('*, guardian:profiles!guardian_id(id, display_name, avatar_url)')
    .eq('status', 'open')
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data;
}

export async function getListing(id) {
  if (localMode) return readLocal().listings.find(l => l.id === id) || null;
  const { data, error } = await supabase
    .from('listings')
    .select('*, guardian:profiles!guardian_id(id, display_name, avatar_url)')
    .eq('id', id)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function postListing(input) {
  const guardian_id = await meId();
  const row = {
    id: uid(),
    guardian_id,
    area: input.area,
    level: input.level,
    curriculum: input.curriculum,
    subjects: input.subjects,
    pay_cents: input.pay_cents,
    pay_unit: input.pay_unit || 'mo',
    days_label: input.days_label,
    time_window: input.time_window,
    gender_pref: input.gender_pref || 'Any',
    note: input.note || null,
    status: 'open',
    created_at: new Date().toISOString(),
  };
  if (localMode) {
    const s = readLocal();
    s.listings.unshift(row);
    writeLocal(s);
    return row;
  }
  const { data, error } = await supabase.from('listings').insert(row).select().single();
  if (error) throw error;
  return data;
}

export async function listMyListings() {
  const me = await meId();
  if (localMode) return readLocal().listings.filter(l => l.guardian_id === me);
  const { data, error } = await supabase
    .from('listings').select('*').eq('guardian_id', me).order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function removeListing(id) {
  if (localMode) {
    const s = readLocal();
    s.listings = s.listings.filter(l => l.id !== id);
    s.applications = s.applications.filter(a => a.listing_id !== id);
    writeLocal(s);
    return;
  }
  const { error } = await supabase.from('listings').delete().eq('id', id);
  if (error) throw error;
}

// ─── Applications ──────────────────────────────────────────────────────
export async function listMyApplications() {
  const me = await meId();
  if (localMode) return readLocal().applications.filter(a => a.tutor_id === me);
  const { data, error } = await supabase
    .from('applications')
    .select('*, listing:listings(*, guardian:profiles!guardian_id(id, display_name, avatar_url))')
    .eq('tutor_id', me)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function listApplicantsFor(listingId) {
  if (localMode) {
    const s = readLocal();
    const apps = s.applications.filter(a => a.listing_id === listingId);
    return apps.map(a => ({ ...a, tutor: s.profiles[a.tutor_id] }));
  }
  const { data, error } = await supabase
    .from('applications')
    .select('*, tutor:profiles!tutor_id(*, tutor_profiles(*))')
    .eq('listing_id', listingId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function applyToListing(listingId) {
  const tutor_id = await meId();
  const row = {
    id: uid(),
    listing_id: listingId,
    tutor_id,
    state: 'applied',
    created_at: new Date().toISOString(),
  };
  if (localMode) {
    const s = readLocal();
    if (s.applications.some(a => a.listing_id === listingId && a.tutor_id === tutor_id)) return null;
    s.applications.unshift(row);
    writeLocal(s);
    return row;
  }
  const { data, error } = await supabase
    .from('applications')
    .insert({ listing_id: listingId, tutor_id, state: 'applied' })
    .select()
    .single();
  if (error && !/duplicate/.test(error.message)) throw error;
  return data;
}

export async function setApplicationState(id, state) {
  if (localMode) {
    const s = readLocal();
    s.applications = s.applications.map(a => a.id === id ? { ...a, state, updated_at: new Date().toISOString() } : a);
    writeLocal(s);
    return s.applications.find(a => a.id === id);
  }
  const { data, error } = await supabase
    .from('applications').update({ state }).eq('id', id).select().single();
  if (error) throw error;
  return data;
}

// ─── Classes ───────────────────────────────────────────────────────────
export async function listMyClasses() {
  const me = await meId();
  if (localMode) {
    return readLocal().classes.filter(c => c.tutor_id === me || c.guardian_id === me);
  }
  const { data, error } = await supabase
    .from('classes')
    .select('*')
    .or(`tutor_id.eq.${me},guardian_id.eq.${me}`)
    .order('scheduled_at', { ascending: true });
  if (error) throw error;
  return data;
}

export async function createClass(input) {
  const row = {
    id: uid(),
    ...input,
    created_at: new Date().toISOString(),
  };
  if (localMode) {
    const s = readLocal();
    s.classes.unshift(row);
    writeLocal(s);
    return row;
  }
  const { data, error } = await supabase.from('classes').insert(input).select().single();
  if (error) throw error;
  return data;
}

export async function markClassAttended(classId) {
  if (localMode) {
    const s = readLocal();
    s.classes = s.classes.map(c => c.id === classId ? { ...c, state: 'completed' } : c);
    writeLocal(s);
    return s.classes.find(c => c.id === classId);
  }
  const { data, error } = await supabase
    .from('classes').update({ state: 'completed' }).eq('id', classId).select().single();
  if (error) throw error;
  return data;
}

// ─── Hire flow — convenience that combines the application + class write ─
export async function hireApplicant(applicationId) {
  if (localMode) {
    const s = readLocal();
    const app = s.applications.find(a => a.id === applicationId);
    if (!app) return null;
    const listing = s.listings.find(l => l.id === app.listing_id);
    const cls = {
      id: uid(),
      tutor_id: app.tutor_id,
      guardian_id: listing ? listing.guardian_id : (await meId()),
      listing_id: app.listing_id,
      student_name: 'Student',
      subject_label: listing ? listing.subjects.join(', ') : 'General',
      area: listing ? listing.area : '',
      scheduled_at: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
      duration_min: 90,
      pay_cents: listing ? Math.round((listing.pay_cents || 0) / 12) : 0,
      state: 'upcoming',
      created_at: new Date().toISOString(),
    };
    s.classes.unshift(cls);
    s.applications = s.applications.map(a => a.id === applicationId ? { ...a, state: 'hired' } : a);
    writeLocal(s);
    return cls;
  }
  // Real impl: do both writes in a transaction via an Edge Function.
  const app = await supabase.from('applications').select('*, listing:listings(*)').eq('id', applicationId).single();
  if (app.error) throw app.error;
  const a = app.data;
  const listing = a.listing;
  const cls = await createClass({
    tutor_id: a.tutor_id,
    guardian_id: listing.guardian_id,
    listing_id: a.listing_id,
    student_name: 'Student',
    subject_label: listing.subjects.join(', '),
    area: listing.area,
    scheduled_at: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
    duration_min: 90,
    pay_cents: Math.round((listing.pay_cents || 0) / 12),
    state: 'upcoming',
  });
  await setApplicationState(applicationId, 'hired');
  return cls;
}

// ─── Chat ──────────────────────────────────────────────────────────────
export async function listThreads() {
  const me = await meId();
  if (localMode) {
    const s = readLocal();
    return s.chat_threads
      .filter(t => t.guardian_id === me || t.tutor_id === me)
      .sort((a, b) => new Date(b.last_msg_at) - new Date(a.last_msg_at))
      .map(t => {
        const otherId = t.guardian_id === me ? t.tutor_id : t.guardian_id;
        const other = s.profiles[otherId] || { display_name: 'Unknown' };
        const last = s.messages.filter(m => m.thread_id === t.id).slice(-1)[0];
        const unread = s.messages.filter(m => m.thread_id === t.id && m.sender_id !== me && !m.read_at).length;
        return { ...t, other, last_message: last, unread };
      });
  }
  const { data, error } = await supabase
    .from('chat_threads')
    .select('*, guardian:profiles!guardian_id(id, display_name, avatar_url), tutor:profiles!tutor_id(id, display_name, avatar_url)')
    .or(`guardian_id.eq.${me},tutor_id.eq.${me}`)
    .order('last_msg_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function listMessages(threadId) {
  if (localMode) return readLocal().messages.filter(m => m.thread_id === threadId);
  const { data, error } = await supabase
    .from('messages').select('*').eq('thread_id', threadId).order('created_at', { ascending: true });
  if (error) throw error;
  return data;
}

export async function sendMessage(threadId, body) {
  const sender_id = await meId();
  const row = { id: uid(), thread_id: threadId, sender_id, body, created_at: new Date().toISOString() };
  if (localMode) {
    const s = readLocal();
    s.messages.push(row);
    s.chat_threads = s.chat_threads.map(t => t.id === threadId ? { ...t, last_msg_at: row.created_at } : t);
    writeLocal(s);
    return row;
  }
  const { data, error } = await supabase.from('messages').insert(row).select().single();
  if (error) throw error;
  return data;
}

export async function findOrCreateThread({ guardian_id, tutor_id, listing_id = null }) {
  if (localMode) {
    const s = readLocal();
    let t = s.chat_threads.find(x =>
      x.guardian_id === guardian_id && x.tutor_id === tutor_id && (x.listing_id || null) === (listing_id || null));
    if (!t) {
      t = { id: uid(), guardian_id, tutor_id, listing_id,
            created_at: new Date().toISOString(), last_msg_at: new Date().toISOString() };
      s.chat_threads.push(t);
      writeLocal(s);
    }
    return t;
  }
  // Try to find existing; if not, insert.
  const { data: found } = await supabase
    .from('chat_threads').select('*')
    .eq('guardian_id', guardian_id).eq('tutor_id', tutor_id).eq('listing_id', listing_id)
    .maybeSingle();
  if (found) return found;
  const { data, error } = await supabase.from('chat_threads')
    .insert({ guardian_id, tutor_id, listing_id }).select().single();
  if (error) throw error;
  return data;
}

// ─── Student feedback (insert-only; tutor cannot SELECT — RLS enforced) ─
export async function submitStudentFeedback(classId, { mood, tags, comment }) {
  const row = {
    id: uid(),
    class_id: classId,
    mood,
    tags: tags || [],
    comment: (comment || '').trim() || null,
    created_at: new Date().toISOString(),
  };
  if (localMode) {
    const s = readLocal();
    s.student_feedback.unshift(row);
    writeLocal(s);
    return row;
  }
  const { data, error } = await supabase.from('student_feedback').insert(row).select().single();
  if (error) throw error;
  return data;
}

export async function listStudentFeedbackForMyClasses() {
  const me = await meId();
  if (localMode) {
    const s = readLocal();
    const myClassIds = new Set(s.classes.filter(c => c.guardian_id === me).map(c => c.id));
    return s.student_feedback.filter(f => myClassIds.has(f.class_id));
  }
  // RLS guarantees this only returns rows the guardian is allowed to see.
  const { data, error } = await supabase
    .from('student_feedback')
    .select('*, class:classes(*)')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

// ─── Verification ──────────────────────────────────────────────────────
export async function submitVerification(tier, documentUrl) {
  const tutor_id = await meId();
  const row = { id: uid(), tutor_id, tier, document_url: documentUrl,
                status: 'pending', created_at: new Date().toISOString() };
  if (localMode) {
    // local mode just auto-approves so the demo flow continues.
    const s = readLocal();
    const me = s.profiles[tutor_id];
    if (me && me.tutor) me.tutor.verify_tier = Math.max(me.tutor.verify_tier || 0, tier);
    writeLocal(s);
    return { ...row, status: 'approved' };
  }
  const { data, error } = await supabase.from('verifications').insert(row).select().single();
  if (error) throw error;
  return data;
}
