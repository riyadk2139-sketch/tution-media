// Tution Media — persistent store (localStorage). Single source of truth.
// Mirrors data to window.TM_DATA so existing screens keep working.

const TM_STORAGE_KEY = 'tm_v1';

// ─── Seed data ─────────────────────────────────────────────────
// Pre-populated demo data so the app feels alive on first launch.
function makeSeed() {
  const now = Date.now();
  const mins = (n) => new Date(now - n * 60_000).toISOString();

  return {
    meta: { version: 1, installedAt: new Date().toISOString(), seeded: true },
    profile: {
      role: null,                 // 'tutor' | 'guardian' | null (forces onboarding)
      name: '',
      phone: '',
      handle: '',
      avatar: '',
      // tutor fields
      institution: 'BUET',
      department: 'Mechanical Engineering',
      year: '3rd year',
      cgpa: 3.78,
      subjects: ['Physics', 'Math', 'Higher Math', 'Chemistry'],
      levels: ['Class 9–10 / SSC', 'HSC', 'O-Level / A-Level'],
      areas: ['Dhanmondi', 'Mohammadpur', 'Lalmatia'],
      availability: [[0,0,1,1],[0,0,1,1],[0,1,1,1],[0,1,1,0],[0,1,1,1],[0,1,1,0],[1,1,0,0]],
      verifyTier: 2,
      rating: 4.9,
      completedHires: 14,
      monthsTaught: 22,
      onTime: 98,
      retention: 86,
      earnings: 28400,
      // guardian fields
      area: '',
      childName: '',
      childLevel: '',
      childCurriculum: '',
    },
    // Listings posted by other guardians (tutor sees these). When the user
    // is a guardian, their own listings get prepended with role: 'self'.
    listings: [
      {
        id: 'j-114', area: 'Dhanmondi 27', distanceKm: 1.4,
        level: 'HSC', curriculum: 'National', subjects: ['Physics', 'Higher Math'],
        pay: 12000, payUnit: 'mo', days: '4 days/wk · 1.5 hr', window: 'Evenings · 6–9pm',
        gender: 'Any', posted: '8 min ago', createdAt: mins(8), match: 94,
        guardian: { name: 'Mr. Rahman', verified: true },
        note: 'Daughter is preparing for engineering admission. Needs help with mechanics and calculus.',
        owner: 'demo',
      },
      {
        id: 'j-109', area: 'Mohammadpur', distanceKm: 2.8,
        level: 'Class 10', curriculum: 'English Version', subjects: ['Math', 'Physics'],
        pay: 8500, payUnit: 'mo', days: '3 days/wk · 1 hr', window: 'Afternoons · 4–6pm',
        gender: 'Male', posted: '32 min ago', createdAt: mins(32), match: 88,
        guardian: { name: 'Mrs. Akter', verified: true },
        note: 'Looking for a patient tutor who can keep my son focused.',
        owner: 'demo',
      },
      {
        id: 'j-101', area: 'Lalmatia · Block C', distanceKm: 0.9,
        level: 'O-Level', curriculum: 'Edexcel', subjects: ['Physics'],
        pay: 14000, payUnit: 'mo', days: '2 days/wk · 2 hr', window: 'Weekends',
        gender: 'Any', posted: '2 hr ago', createdAt: mins(120), match: 79,
        guardian: { name: 'Ms. Karim', verified: false },
        note: 'Edexcel May/June exams in 4 months.',
        owner: 'demo',
      },
      {
        id: 'j-097', area: 'Dhanmondi 15', distanceKm: 1.8,
        level: 'HSC', curriculum: 'National', subjects: ['Chemistry'],
        pay: 9000, payUnit: 'mo', days: '3 days/wk · 1.5 hr', window: 'Evenings',
        gender: 'Any', posted: '5 hr ago', createdAt: mins(300), match: 71,
        guardian: { name: 'Mr. Hossain', verified: true },
        owner: 'demo',
      },
    ],
    // Tutor-side: applications the tutor has submitted.
    // Guardian-side: applications submitted to the guardian's listings.
    applications: [
      { id: 'a1', jobId: 'j-114', tutor: { name: 'Tanvir Hasan', tier: 2 },
        state: 'shortlisted', when: 'today, 9:14am', createdAt: mins(45) },
      { id: 'a2', jobId: 'j-109', tutor: { name: 'Tanvir Hasan', tier: 2 },
        state: 'location-granted', when: 'yesterday', createdAt: mins(1440) },
      { id: 'a3', jobId: 'j-101', tutor: { name: 'Tanvir Hasan', tier: 2 },
        state: 'applied', when: '2 days ago', createdAt: mins(2880) },
      { id: 'a4', jobId: 'j-088', tutor: { name: 'Tanvir Hasan', tier: 2 },
        state: 'trial-scheduled', when: '3 days ago', createdAt: mins(4320),
        meta: { area: 'Mirpur DOHS', level: 'Class 9', subjects: ['Math'] } },
      { id: 'a5', jobId: 'j-076', tutor: { name: 'Tanvir Hasan', tier: 2 },
        state: 'rejected', when: '1 wk ago', createdAt: mins(10080),
        meta: { area: 'Mohammadpur', level: 'Class 8', subjects: ['English'] } },
    ],
    classes: [
      { id: 'c1', student: 'Ifrat Rahman', area: 'Dhanmondi 27', subject: 'Physics, Math',
        date: 'Today', time: '6:30pm', dur: '90 min', state: 'upcoming', payPerClass: 750 },
      { id: 'c2', student: 'Saif Akter', area: 'Mohammadpur', subject: 'Math',
        date: 'Today', time: '8:30pm', dur: '60 min', state: 'upcoming', payPerClass: 500 },
      { id: 'c3', student: 'Rumana Hossain', area: 'Mirpur DOHS', subject: 'Higher Math',
        date: 'Tomorrow', time: '4:00pm', dur: '90 min', state: 'upcoming', payPerClass: 800 },
    ],
    chats: [
      { id: 'm1', name: 'Mr. Rahman', masked: true, unread: 2, time: '9:14am',
        preview: 'Approved your location request — see you tomorrow.',
        last: 'them',
        messages: [
          { from: 'them', text: 'Hi Tanvir, saw your application — looks great.', time: 'Yesterday 8:02pm' },
          { from: 'me', text: 'Thanks! Happy to chat about my approach for HSC physics.', time: 'Yesterday 8:14pm' },
          { from: 'them', text: 'Can you come for a trial Tuesday at 6:30pm?', time: 'Today 8:50am' },
          { from: 'them', text: 'Approved your location request — see you tomorrow.', time: 'Today 9:14am' },
        ],
      },
      { id: 'm2', name: 'Saif Akter', masked: true, unread: 1, time: '8:02am',
        preview: 'Can we move tonight to 9pm?', last: 'them',
        messages: [
          { from: 'them', text: 'Can we move tonight to 9pm?', time: 'Today 8:02am' },
        ],
      },
      { id: 'm3', name: 'Tution Media · Support', masked: false, unread: 0, time: 'Yesterday',
        preview: 'Your NID verification is complete.', last: 'them', system: true,
        messages: [
          { from: 'them', text: 'Your NID verification is complete. You are now tier-1 verified.', time: 'Yesterday' },
        ],
      },
      { id: 'm4', name: 'Rumana Hossain', masked: true, unread: 0, time: 'Mon',
        preview: 'You: Sent the practice set.', last: 'me',
        messages: [
          { from: 'them', text: 'Could you share Friday\'s practice set?', time: 'Mon 4:12pm' },
          { from: 'me', text: 'Sent the practice set.', time: 'Mon 5:02pm' },
        ],
      },
      { id: 'm5', name: 'Mrs. Akter', masked: true, unread: 0, time: 'Sun',
        preview: 'Thanks, see you Sunday.', last: 'them',
        messages: [
          { from: 'them', text: 'Thanks, see you Sunday.', time: 'Sun 7:30pm' },
        ],
      },
    ],
    notifications: [],
    heatmap: [
      { name: 'Dhanmondi 27', x: 0.42, y: 0.34, intensity: 1.0, requests: 18, top: 'Physics · HSC' },
      { name: 'Dhanmondi 15', x: 0.48, y: 0.48, intensity: 0.82, requests: 14, top: 'Math · Class 10' },
      { name: 'Lalmatia',     x: 0.32, y: 0.30, intensity: 0.71, requests: 11, top: 'Edexcel Phys' },
      { name: 'Mohammadpur',  x: 0.22, y: 0.46, intensity: 0.65, requests: 9, top: 'Math · Class 9' },
      { name: 'Kalabagan',    x: 0.58, y: 0.40, intensity: 0.55, requests: 7, top: 'Chemistry' },
      { name: 'Rayer Bazar',  x: 0.18, y: 0.62, intensity: 0.42, requests: 5, top: 'English' },
      { name: 'Hazaribagh',   x: 0.28, y: 0.74, intensity: 0.28, requests: 3, top: 'ICT' },
      { name: 'Shyamoli',     x: 0.16, y: 0.32, intensity: 0.36, requests: 4, top: 'Bangla' },
    ],
  };
}

// ─── Persistence ───────────────────────────────────────────────
function loadState() {
  try {
    const raw = localStorage.getItem(TM_STORAGE_KEY);
    if (!raw) return makeSeed();
    const parsed = JSON.parse(raw);
    if (!parsed.meta || parsed.meta.version !== 1) return makeSeed();
    return parsed;
  } catch (e) {
    return makeSeed();
  }
}

function persist(state) {
  try { localStorage.setItem(TM_STORAGE_KEY, JSON.stringify(state)); } catch (e) {}
}

// ─── Store singleton ───────────────────────────────────────────
const tmStore = {
  state: loadState(),
  listeners: new Set(),

  subscribe(fn) { this.listeners.add(fn); return () => this.listeners.delete(fn); },
  notify() { this.listeners.forEach(fn => fn()); },

  // Replace state and notify. Use this from actions.
  commit(next) {
    this.state = next;
    persist(next);
    syncToTMData(next);
    this.notify();
  },

  // Convenience: shallow-patch top-level keys.
  set(patch) {
    this.commit({ ...this.state, ...patch });
  },

  // Convenience: patch profile.
  patchProfile(p) {
    this.commit({ ...this.state, profile: { ...this.state.profile, ...p } });
  },

  reset() {
    localStorage.removeItem(TM_STORAGE_KEY);
    this.commit(makeSeed());
  },
};

// Mirror store data into TM_DATA so the legacy screens keep working.
function syncToTMData(s) {
  if (!window.TM_DATA) window.TM_DATA = {};
  TM_DATA.tutor = s.profile;
  TM_DATA.jobs = s.listings;
  TM_DATA.applications = s.applications;
  TM_DATA.classes = s.classes;
  TM_DATA.chats = s.chats;
  TM_DATA.heatmap = s.heatmap;
  TM_DATA.areas = s.profile.areas || [];
  TM_DATA.subjects = s.profile.subjects || [];
}
// Sync on initial load.
syncToTMData(tmStore.state);

// ─── React integration ────────────────────────────────────────
function useStore() {
  const [, force] = React.useReducer(x => x + 1, 0);
  React.useEffect(() => tmStore.subscribe(force), []);
  return tmStore.state;
}

// ─── Actions ───────────────────────────────────────────────────
const TmActions = {
  // ─ onboarding ─
  setRole(role) {
    tmStore.patchProfile({ role });
  },
  setProfile(patch) {
    tmStore.patchProfile(patch);
  },
  completeOnboarding({ role, name, phone, area }) {
    tmStore.patchProfile({
      role, name: name || 'You', phone: phone || '',
      handle: '@' + (name || 'you').toLowerCase().replace(/\s+/g, '.'),
      area: area || '',
    });
  },

  // ─ verification ─
  advanceVerification() {
    const cur = tmStore.state.profile.verifyTier || 0;
    tmStore.patchProfile({ verifyTier: Math.min(cur + 1, 4) });
  },

  // ─ tutor: apply to job ─
  applyToJob(jobId) {
    const s = tmStore.state;
    if (s.applications.some(a => a.jobId === jobId && a.tutor.name === (s.profile.name || 'You'))) {
      return; // already applied
    }
    const next = { ...s, applications: [
      {
        id: 'a' + Date.now(),
        jobId,
        tutor: { name: s.profile.name || 'You', tier: s.profile.verifyTier || 0 },
        state: 'applied',
        when: 'just now',
        createdAt: new Date().toISOString(),
      },
      ...s.applications,
    ]};
    tmStore.commit(next);
  },

  // ─ guardian: post a listing ─
  postListing(data) {
    const s = tmStore.state;
    const id = 'j-' + Math.floor(100 + Math.random() * 900);
    const listing = {
      id,
      area: data.area || s.profile.area || 'Dhanmondi',
      distanceKm: 0,
      level: data.level || 'HSC',
      curriculum: data.curriculum || 'National',
      subjects: data.subjects && data.subjects.length ? data.subjects : ['Math'],
      pay: Number(data.pay) || 8000,
      payUnit: 'mo',
      days: data.days || '3 days/wk · 1.5 hr',
      window: data.window || 'Evenings',
      gender: data.gender || 'Any',
      note: data.note || '',
      posted: 'just now',
      createdAt: new Date().toISOString(),
      match: 100,
      guardian: { name: s.profile.name || 'You', verified: (s.profile.verifyTier || 0) >= 1 },
      owner: 'self',
    };
    tmStore.commit({ ...s, listings: [listing, ...s.listings] });
    return id;
  },

  removeListing(listingId) {
    const s = tmStore.state;
    tmStore.commit({ ...s,
      listings: s.listings.filter(l => l.id !== listingId),
      applications: s.applications.filter(a => a.jobId !== listingId),
    });
  },

  // ─ guardian: applicant management ─
  setApplicationState(appId, state) {
    const s = tmStore.state;
    tmStore.commit({ ...s,
      applications: s.applications.map(a => a.id === appId ? { ...a, state } : a),
    });
  },

  shortlistApplicant(appId, on) {
    TmActions.setApplicationState(appId, on ? 'shortlisted' : 'applied');
  },

  grantLocation(appId) {
    TmActions.setApplicationState(appId, 'location-granted');
  },

  scheduleTrial(appId) {
    TmActions.setApplicationState(appId, 'trial-scheduled');
  },

  hireApplicant(appId) {
    const s = tmStore.state;
    const app = s.applications.find(a => a.id === appId);
    if (!app) return;
    const listing = s.listings.find(l => l.id === app.jobId);
    // Create a class entry
    const cls = {
      id: 'c' + Date.now(),
      student: s.profile.childName || s.profile.name || 'Student',
      area: listing ? listing.area : 'Dhanmondi',
      subject: listing ? listing.subjects.join(', ') : 'Math',
      date: 'Tomorrow', time: '6:00pm', dur: '90 min', state: 'upcoming',
      payPerClass: listing ? Math.round((listing.pay || 8000) / 12) : 700,
    };
    tmStore.commit({ ...s,
      applications: s.applications.map(a => a.id === appId ? { ...a, state: 'hired' } : a),
      classes: [cls, ...s.classes],
    });
  },

  // ─ chat ─
  sendMessage(chatId, text) {
    if (!text || !text.trim()) return;
    const s = tmStore.state;
    const time = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    tmStore.commit({ ...s,
      chats: s.chats.map(c => c.id === chatId ? {
        ...c,
        preview: 'You: ' + text.slice(0, 60),
        last: 'me',
        time,
        messages: [...(c.messages || []), { from: 'me', text, time: 'now' }],
      } : c),
    });
  },

  markChatRead(chatId) {
    const s = tmStore.state;
    if (!s.chats.some(c => c.id === chatId && c.unread > 0)) return;
    tmStore.commit({ ...s,
      chats: s.chats.map(c => c.id === chatId ? { ...c, unread: 0 } : c),
    });
  },

  // ─ schedule / attendance ─
  markAttendance(classId, status) {
    const s = tmStore.state;
    tmStore.commit({ ...s,
      classes: s.classes.map(c => c.id === classId ? { ...c, state: status } : c),
    });
  },

  // ─ profile updates ─
  toggleSubject(subject) {
    const s = tmStore.state;
    const cur = s.profile.subjects || [];
    const next = cur.includes(subject) ? cur.filter(x => x !== subject) : [...cur, subject];
    tmStore.patchProfile({ subjects: next });
  },

  toggleArea(area) {
    const s = tmStore.state;
    const cur = s.profile.areas || [];
    const next = cur.includes(area) ? cur.filter(x => x !== area) : [...cur, area];
    tmStore.patchProfile({ areas: next });
  },

  resetDemo() {
    tmStore.reset();
  },
};

Object.assign(window, { tmStore, useStore, TmActions });
