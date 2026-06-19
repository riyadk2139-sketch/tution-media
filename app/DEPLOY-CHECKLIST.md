# Deployment readiness checklist

Status: legend [ ] todo · [⚠] needs fix · [✓] done · [—] out of scope (Phase 2+).

Last full audit: **19/19 e2e checks pass, 4/4 SQL migrations parse OK**.

## Local-mode correctness

- [✓] Profile tutor/guardian fields persist (adapter shape fix in
      `lib/api.js`: writes `tutor_profiles` / `guardian_profiles` keys
      to match the Supabase row shape)
- [✓] Edit profile saves subjects, reputation shows them
      (verified by reading store + DOM after Save)
- [✓] Verification advances tier
- [✓] Sign-out fully clears state including `listingApplicants` and
      `lastSeenListingId`

## SQL schema + RLS

Migration `0004_audit_corrections.sql` fixes:

- [✓] `chat_threads` NULL-aware uniqueness via two partial unique indexes
      (one for listing-scoped, one for the no-listing pair)
- [✓] `student_feedback` insert policy now requires the inserter to be
      the tutor on that class (was: any authenticated user could insert)
- [✓] `profiles` no longer leaks phone numbers — column-level GRANT
      restricts `phone` to row owners only; world readable columns are
      explicitly listed
- [✓] Phone auto-populated at signup via `auth.users` trigger
- [✓] Listing auto-closes (`status='filled'`) on hire via trigger
- [✓] `listings.note` length capped at 2000 chars (DOS guard)
- [✓] `listings.pay_taka` constrained to a sane positive range
- [✓] Partial index for unread-message queries
- [✓] All four migration files parse as valid SQL (verified with
      pg_query_emscripten)

## Supabase API code

- [✓] `hireApplicant` rolls back the class insert if the application
      update fails (best-effort atomicity until an Edge Function is wired)
- [✓] `findOrCreateThread` handles the find-then-insert race by catching
      unique-violation and re-querying
- [✓] When an application becomes `hired`, listing auto-closes to
      `filled` (both client-side optimistic + server-side trigger)
- [✓] `markChatRead` now actually marks unread messages read
- [ ] `listMessages` has no pagination (acceptable for v1, ~hundreds of
      messages per thread is fine; revisit before thousands)

## Auth flow

- [✓] Phone-OTP sign-in works
- [✓] Phone input requires 10 BD digits, rejects too-short input
- [✓] OTP input submits on Enter
- [✓] Session persists across reload
- [✓] Sign out works and clears state

## Build + deploy artifacts

- [✓] `npm run build` clean, no warnings
- [✓] PWA manifest + service worker generated
- [✓] App icons in `public/`
- [✓] README has deploy checklist
- [✓] `.env.example` documents required vars; `.gitignore` covers
      `.env.local`

## Already verified end-to-end (19 checks)

- [✓] 1. Sign-in rejects sub-10-digit phone numbers
- [✓] 2. OTP submits on Enter
- [✓] 3. Welcome → role → name → onboarded
- [✓] 4. Edit profile persists subjects (read back from store)
- [✓] 5. Reputation strip shows the saved subjects
- [✓] 6. Verification submission advances tier
- [✓] 7. Switch to guardian + post listing
- [✓] 8. Switch back to tutor — feed shows the listing
- [✓] 9. Apply via 1-tap
- [✓] 10. Switch to guardian — sees 1 applicant
- [✓] 11. Hire applicant — listing auto-closes to `filled`
- [✓] 12. Tutor feed no longer shows filled listing
- [✓] 13. Schedule shows the hired class
- [✓] 14. Mark attended → handoff prompt
- [✓] 15. Student check-in form + submit
- [✓] 16. Guardian sees check-in
- [✓] 17. **PRIVACY: tutor does NOT see check-in** (verified at multiple
        screens)
- [✓] 18. Persistence across reload
- [✓] 19. Sign out clears state

## Open items (acceptable for v1 launch)

- [ ] Photo upload's file-extension sanitization (relies on browser
      type from File.type; safe in practice, hardening is cheap)
- [ ] Rate limiting on listing posts — needs Supabase Edge Function or
      a Postgres-side per-user-per-hour count
- [ ] Bad-words / spam filter on chat — defer until first abuse report
- [ ] Heatmap visual reflects fixed seed, not live listings — visual
      decoration; v2

## Deploy-time configuration (not code, real ops)

- [ ] Create Supabase project (Singapore region for BD latency)
- [ ] Run all 4 migrations in SQL editor (or `supabase db push`)
- [ ] Configure SMS provider (SSL Wireless / BulkSMSBD) and wire to
      Supabase Auth phone provider
- [ ] Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` on Vercel
- [ ] Point domain + verify HTTPS

## Phase 2+ (out of scope)

- [—] Push notifications via FCM/APNs
- [—] Real masked voice calls
- [—] Payments + escrow (bKash / SSLCommerz)
- [—] NID verification via Porichoy
- [—] Admin dashboard for verification review
- [—] Monitoring (Sentry, analytics)
