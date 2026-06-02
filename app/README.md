# Tution Media — production app

The deploy-ready version of the marketplace. Vite + React + Supabase
(Postgres + Auth + Storage + Realtime). The prototype at `../project/`
remains for design review; this is what ships to users.

## Quick start (local dev — no backend needed)

```bash
cd app
npm install
npm run dev
```

Open http://localhost:5173. The app runs in **local mode** out of the box:
all data persists to `localStorage`, the OTP code is `123456`, and you can
exercise every flow without provisioning anything. This is the same demo
mode the prototype used.

To flip to the real backend, set `VITE_SUPABASE_URL` and
`VITE_SUPABASE_ANON_KEY` (see below) — the same code paths talk to Supabase.

## Production deploy (one-time, ~45 minutes)

### 1. Create the Supabase project (10 min)

1. Sign up at https://supabase.com and create a project. Pick the **Singapore**
   region for Bangladesh latency.
2. Note your **Project URL** and **anon (public) API key** from
   *Settings → API*.
3. In *SQL editor*, run each migration in order:
   - `supabase/migrations/0001_init.sql` — schema (tables, indexes, triggers)
   - `supabase/migrations/0002_rls.sql` — row-level security policies
   - `supabase/migrations/0003_storage.sql` — avatar + verification buckets

   Or via the Supabase CLI: `supabase db push`.

### 2. Wire phone OTP (15 min)

Supabase's built-in phone auth needs an SMS provider. For Bangladesh,
**SSL Wireless** or **BulkSMSBD** are the standard choices; Twilio works
but is expensive locally.

1. Sign up with an SMS provider, get an API key/secret + sender ID.
2. In Supabase *Authentication → Providers → Phone*, configure either:
   - **Twilio / MessageBird** if using those, OR
   - **Custom SMS hook** — point it at a tiny Supabase Edge Function that
     forwards the OTP to your SMS provider's HTTP API. Template:
     ```js
     // supabase/functions/send-sms/index.ts
     Deno.serve(async (req) => {
       const { phone, code } = await req.json();
       await fetch('https://api.your-sms.com/send', {
         method: 'POST',
         headers: { 'Authorization': 'Bearer ' + Deno.env.get('SMS_KEY') },
         body: JSON.stringify({ to: phone, text: `Your Tution code: ${code}` }),
       });
       return new Response('ok');
     });
     ```
3. Confirm a real number gets a real SMS via *Authentication → Users → Send
   test OTP*.

### 3. Deploy the frontend (10 min)

The easiest path is Vercel. From the repo root:

```bash
npm i -g vercel
cd app
vercel --prod
```

When prompted, set the environment variables:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...your-anon-key
```

Alternatively: Netlify, Cloudflare Pages, or any static host that runs
`npm run build` and serves `dist/`.

### 4. Point the domain (10 min)

In Vercel → *Settings → Domains*, add your domain (e.g. `tution.media`).
Add the suggested A / CNAME records at your DNS host. Wait for the
certificate; Vercel handles HTTPS automatically.

That's the whole launch.

## Local development with Supabase

To develop against your live Supabase project locally:

```bash
cp .env.example .env.local
# Edit .env.local with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
npm run dev
```

Leave `.env.local` empty (or delete it) to go back to local-storage mode.

## Architecture

```
app/
├── index.html              · entry, splash, PWA meta
├── vite.config.js          · build + PWA service worker
├── public/                 · icons
├── supabase/migrations/    · run these in SQL editor
└── src/
    ├── main.jsx            · React root
    ├── app.jsx             · router + bottom nav
    ├── tokens.js           · design tokens (palettes, fonts)
    ├── components/ui.jsx   · primitives (Phone, Button, Card, Avatar, Icon, …)
    ├── lib/
    │   ├── supabase.js     · client singleton; null in localMode
    │   ├── auth.js         · phone-OTP sign in/out, session
    │   ├── api.js          · all data CRUD (dual: Supabase or localStorage)
    │   ├── storage.js      · avatar upload + downscale
    │   ├── matching.js     · computeMatch(tutor, listing) → 0..100
    │   └── notifications.js · web Notification API
    ├── store/store.js      · reactive store on top of api.js + adapters
    └── screens/            · feature screens
```

### Local vs. Supabase mode

Every API function checks `localMode` (computed from whether env vars are
set) and forks. This means:

- A new developer clones, `npm install`, `npm run dev`, and has a working app
  in under 60 seconds.
- The Supabase deploy is feature-identical — code paths are the same shape.
- Demos work even with the backend down.

### Row-level security

Every user-facing table has RLS enforced. Notable invariants:

- A tutor **cannot** read `student_feedback` rows even for classes they
  taught (the explicit privacy guarantee).
- Guardians can only read applications for **their own** listings.
- Chat messages are visible only to the two thread participants.
- Listings are world-readable while `status = 'open'`; only the owner mutates.

If RLS is misconfigured, the app appears broken before it appears insecure —
err on too restrictive.

### Realtime

`store.js` subscribes to `postgres_changes` on `listings` so new posts hit
tutor feeds without polling. Extend the pattern (chat messages,
applications) once the realtime channel quota is understood at your scale.

## What's deliberately not here

These belong to **Phase 2** (trust + payments) and **Phase 3** (push +
calls), not Phase 1:

- **NID / Porichoy verification** — placeholder upload only.
- **Payments / escrow** — no SSLCommerz/bKash wiring.
- **Real masked voice calls** — chat is real, calls are not.
- **FCM / APNs push** — uses the web Notification API for in-session
  alerts. True push from the server needs a service worker + token
  registration + a sender backend.
- **Admin dashboard** — verification reviews and disputes need a separate
  admin app authenticated against the Supabase service role.

## Migration from the prototype

`localStorage` data from the prototype won't auto-migrate. Users sign up
fresh after deploy. If that's a problem, write a one-shot import in
`src/lib/migrate-from-prototype.js`.

## TypeScript

Vite supports `.ts` / `.tsx` out of the box. Migrate files incrementally —
start with `src/lib/*` (smaller and most type-critical) and work outward.
