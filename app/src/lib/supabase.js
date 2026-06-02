// Supabase client singleton.
//
// Reads VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY at build time. If either
// is missing we run in `localMode` — the app stays fully functional with
// localStorage as the backend. This lets every developer clone, install, and
// run without any cloud setup.

import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const localMode = !url || !key;

export const supabase = localMode
  ? null
  : createClient(url, key, {
      auth: {
        // Phone-OTP based, no third-party redirects, persists session in
        // localStorage so PWA reopens stay signed in.
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: false,
      },
      realtime: { params: { eventsPerSecond: 5 } },
    });

if (typeof window !== 'undefined') {
  // Surface mode at runtime for debugging and the settings screen.
  window.__tm_localMode = localMode;
}
