// Minimal reactive store. Loads slices via the API and notifies subscribers
// when actions mutate. Screens read with `useStore()` and refresh
// automatically.

import { useEffect, useReducer } from 'react';
import * as api from '../lib/api.js';
import * as auth from '../lib/auth.js';
import { supabase, localMode } from '../lib/supabase.js';
import { computeMatch as _computeMatch } from '../lib/matching.js';

// Re-export so screens can import everything from one place.
export { computeMatch as _computeMatch } from '../lib/matching.js';
export const computeMatch = (profile, listing) =>
  _computeMatch(profile, listing, { feedbackAvg: aggregateFeedbackAvg() });

function aggregateFeedbackAvg() {
  const fb = state.studentFeedback || [];
  if (!fb.length) return 0;
  return fb.reduce((s, f) => s + (f.mood || 3), 0) / fb.length;
}

// ─── View-model adapters ───────────────────────────────────────────────
// The API returns rows matching the SQL schema. Screens have historically
// used a flatter shape. Adapters translate one to the other so screen code
// stays minimal-edit. The shape is the contract between store and screens.

function relativeTime(iso) {
  const t = new Date(iso).getTime();
  const d = Date.now() - t;
  if (d < 60_000) return 'just now';
  if (d < 3600_000) return Math.floor(d / 60_000) + ' min ago';
  if (d < 86400_000) return Math.floor(d / 3600_000) + ' hr ago';
  return Math.floor(d / 86400_000) + ' days ago';
}

function adaptListing(row, myId) {
  if (!row) return row;
  return {
    id: row.id,
    area: row.area,
    level: row.level,
    curriculum: row.curriculum,
    subjects: row.subjects || [],
    pay: row.pay_cents,
    payUnit: row.pay_unit || 'mo',
    days: row.days_label || '',
    window: row.time_window || '',
    gender: row.gender_pref || 'Any',
    note: row.note || '',
    distanceKm: 0,
    createdAt: row.created_at,
    posted: relativeTime(row.created_at),
    guardian: row.guardian
      ? { id: row.guardian.id, name: row.guardian.display_name, verified: !!row.guardian.avatar_url }
      : { name: 'Guardian', verified: false },
    guardian_id: row.guardian_id,
    owner: row.guardian_id === myId ? 'self' : 'other',
    status: row.status,
  };
}

// Always returns a profile-shaped object. Fields are filled from `row` when
// available, otherwise zeroed — this lets every screen treat profile as
// non-null and just read its fields.
function adaptProfile(row) {
  row = row || {};
  const t = (row.tutor_profiles && (Array.isArray(row.tutor_profiles) ? row.tutor_profiles[0] : row.tutor_profiles)) || {};
  const g = (row.guardian_profiles && (Array.isArray(row.guardian_profiles) ? row.guardian_profiles[0] : row.guardian_profiles)) || {};
  return {
    id: row.id,
    name: row.display_name || '',
    avatar: row.avatar_url || '',
    area: row.area || '',
    role: row.primary_role,
    handle: '@' + (row.display_name || 'you').toLowerCase().replace(/\s+/g, '.'),
    // tutor fields
    institution: t.institution || '',
    department: t.department || '',
    year: t.year_label || '',
    cgpa: t.cgpa || null,
    subjects: t.subjects || [],
    levels: t.levels || [],
    areas: t.areas || [],
    availability: t.availability || Array(7).fill([0,0,0,0]),
    verifyTier: t.verify_tier || 0,
    rating: t.rating || 0,
    completedHires: t.completed_hires || 0,
    monthsTaught: t.months_taught || 0,
    onTime: t.on_time_pct || 0,
    retention: t.retention_pct || 0,
    earnings: (t.earnings_cents || 0) / 100,
    // guardian fields
    childName: g.child_name || '',
    childLevel: g.child_level || '',
    childCurriculum: g.child_curriculum || '',
  };
}

function adaptApplication(row) {
  if (!row) return row;
  return {
    id: row.id,
    jobId: row.listing_id,
    state: row.state,
    when: relativeTime(row.created_at),
    createdAt: row.created_at,
    tutor: row.tutor
      ? { id: row.tutor.id, name: row.tutor.display_name, tier: row.tutor.tutor_profiles?.[0]?.verify_tier || 0 }
      : null,
    listing: row.listing ? adaptListing(row.listing, state.user?.id) : null,
  };
}

function adaptClass(row) {
  if (!row) return row;
  return {
    id: row.id,
    tutor_id: row.tutor_id,
    guardian_id: row.guardian_id,
    student: row.student_name,
    subject: row.subject_label,
    area: row.area,
    scheduledAt: row.scheduled_at,
    date: dateBucket(row.scheduled_at),
    time: formatTime(row.scheduled_at),
    dur: row.duration_min + ' min',
    state: row.state,
    payPerClass: (row.pay_cents || 0) / 100,
  };
}

function dateBucket(iso) {
  const d = new Date(iso); d.setHours(0, 0, 0, 0);
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const diff = Math.round((d - today) / 86400000);
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Tomorrow';
  if (diff === -1) return 'Yesterday';
  return d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric' });
}
function formatTime(iso) {
  return new Date(iso).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }).toLowerCase().replace(' ', '');
}

function adaptFeedback(row) {
  if (!row) return row;
  return {
    id: row.id,
    classId: row.class_id,
    mood: row.mood,
    tags: row.tags || [],
    comment: row.comment || '',
    when: row.created_at,
  };
}

const state = {
  user: null,
  // Always an object (never null) so screens can safely read fields. Role is
  // undefined until the user completes onboarding, which is how we detect it.
  profile: {},
  listings: [],
  myListings: [],
  applications: [],
  classes: [],
  threads: [],
  studentFeedback: [],
  ready: false,
};

const listeners = new Set();
function notify() { listeners.forEach(fn => fn()); }

export function getState() { return state; }
export function subscribe(fn) { listeners.add(fn); return () => listeners.delete(fn); }

export function useStore() {
  const [, force] = useReducer(x => x + 1, 0);
  useEffect(() => subscribe(force), []);
  return state;
}

// ─── Bootstrap ─────────────────────────────────────────────────────────
export async function bootstrap() {
  state.user = await auth.currentUser();
  if (state.user) {
    await Promise.all([
      refreshProfile(),
      refreshListings(),
      refreshMyData(),
    ]);
  }
  state.ready = true;
  notify();

  // Re-sync on auth changes.
  auth.onAuthChange(async (u) => {
    state.user = u;
    if (u) {
      await Promise.all([refreshProfile(), refreshListings(), refreshMyData()]);
    } else {
      Object.assign(state, {
        profile: adaptProfile(null), listings: [], myListings: [], applications: [],
        classes: [], threads: [], studentFeedback: [],
      });
    }
    notify();
  });

  // Realtime: when listings change, refresh the feed. Cheap to do — fewer
  // than 100 rows per area per day in practice.
  if (!localMode && supabase) {
    supabase
      .channel('listings-feed')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'listings' },
          () => { refreshListings(); })
      .subscribe();
  }
}

async function refreshProfile() {
  try {
    const raw = await api.getProfile();
    state.profile = adaptProfile(raw);
  } catch (e) {
    console.warn('refreshProfile failed', e.message);
    state.profile = adaptProfile(null);
  }
  notify();
}

async function refreshListings() {
  try {
    const rows = await api.listListings({ limit: 50 });
    state.listings = rows.map(r => adaptListing(r, state.user?.id));
    notify();
  } catch (e) { console.warn('refreshListings failed', e.message); }
}

async function refreshMyData() {
  try {
    const [apps, classes, threads, mine, fb] = await Promise.all([
      api.listMyApplications().catch(() => []),
      api.listMyClasses().catch(() => []),
      api.listThreads().catch(() => []),
      api.listMyListings().catch(() => []),
      api.listStudentFeedbackForMyClasses().catch(() => []),
    ]);
    state.applications = apps.map(adaptApplication);
    state.classes = classes.map(adaptClass);
    state.threads = threads;
    state.myListings = mine.map(r => adaptListing(r, state.user?.id));
    state.studentFeedback = fb.map(adaptFeedback);
    notify();
  } catch (e) {
    console.warn('refreshMyData failed', e.message);
  }
}

// ─── Actions — thin wrappers that mutate the API then refresh the slice ─
// Stable mutable object so screens can do `TmActions.foo(...)` from a closure.
// We populate it below after defining each method.
export const TmActions = {};
export const actions = TmActions;
Object.assign(TmActions, {
  async signIn(phone, code) {
    const r = await auth.verifyOtp(phone, code);
    if (r.ok) {
      state.user = r.user;
      await Promise.all([refreshProfile(), refreshListings(), refreshMyData()]);
      notify();
    }
    return r;
  },

  async signOut() {
    await auth.signOut();
    state.user = null;
    state.profile = null;
    notify();
  },

  async completeOnboarding({ role, name, area }) {
    const base = {
      display_name: name, area, primary_role: role,
    };
    const detail = role === 'tutor'
      ? { tutor: { subjects: [], levels: [], areas: area ? [area] : [], verify_tier: 0 } }
      : { guardian: {} };
    await api.upsertProfile({ ...base, ...detail });
    await refreshProfile();
  },

  async setProfile(patch) {
    await api.upsertProfile(patch);
    await refreshProfile();
  },

  async postListing(input) {
    const created = await api.postListing(input);
    await refreshListings();
    await refreshMyData();
    return created;
  },

  async removeListing(id) {
    await api.removeListing(id);
    await refreshListings();
    await refreshMyData();
  },

  async applyToListing(listingId) {
    await api.applyToListing(listingId);
    await refreshMyData();
  },

  async setApplicationState(id, s) {
    await api.setApplicationState(id, s);
    await refreshMyData();
  },

  async hireApplicant(id) {
    await api.hireApplicant(id);
    await refreshMyData();
  },

  async markAttended(classId) {
    await api.markClassAttended(classId);
    await refreshMyData();
  },

  async sendMessage(threadId, body) {
    await api.sendMessage(threadId, body);
    await refreshMyData();
  },

  async submitStudentFeedback(classId, fb) {
    await api.submitStudentFeedback(classId, fb);
    await refreshMyData();
  },

  async submitVerification(tier, docUrl = null) {
    await api.submitVerification(tier, docUrl);
    await refreshProfile();
  },

  // Aliases the legacy screens use directly.
  setRole(role) { return TmActions.setProfile({ primary_role: role }); },
  setProfile(patch) {
    // Map flat patch shape back to the API's nested shape.
    const out = {};
    if ('name' in patch) out.display_name = patch.name;
    if ('avatar' in patch) out.avatar_url = patch.avatar;
    if ('area' in patch) out.area = patch.area;
    if ('role' in patch) out.primary_role = patch.role;
    const tutor = {};
    if ('subjects' in patch) tutor.subjects = patch.subjects;
    if ('levels' in patch) tutor.levels = patch.levels;
    if ('areas' in patch) tutor.areas = patch.areas;
    if ('availability' in patch) tutor.availability = patch.availability;
    if ('verifyTier' in patch) tutor.verify_tier = patch.verifyTier;
    if (Object.keys(tutor).length) out.tutor = tutor;
    return api.upsertProfile(out).then(refreshProfile);
  },
  setAvatar(url) { return TmActions.setProfile({ avatar: url }); },
  advanceVerification() {
    const cur = (state.profile && state.profile.verifyTier) || 0;
    return TmActions.submitVerification(Math.min(cur + 1, 4)).then(refreshProfile);
  },
  toggleArea(area) {
    const cur = state.profile?.areas || [];
    const next = cur.includes(area) ? cur.filter(a => a !== area) : [...cur, area];
    return TmActions.setProfile({ areas: next });
  },
  toggleSubject(s) {
    const cur = state.profile?.subjects || [];
    const next = cur.includes(s) ? cur.filter(x => x !== s) : [...cur, s];
    return TmActions.setProfile({ subjects: next });
  },
  applyToJob(id) { return TmActions.applyToListing(id); },
  shortlistApplicant(id, on) { return TmActions.setApplicationState(id, on ? 'shortlisted' : 'applied'); },
  grantLocation(id) { return TmActions.setApplicationState(id, 'location-granted'); },
  scheduleTrial(id) { return TmActions.setApplicationState(id, 'trial-scheduled'); },
  markAttendance(id, st) {
    if (st === 'completed') return TmActions.markAttended(id);
    return supabase
      ? supabase.from('classes').update({ state: st }).eq('id', id).then(refreshMyData)
      : refreshMyData();
  },
  markListingsSeen() { /* could persist a per-user marker server-side */ },
  resetDemo() {
    try { localStorage.removeItem('tm_data_v1'); localStorage.removeItem('tm_local_user_v1'); }
    catch {}
    location.reload();
  },
});
