# QA Report — three-persona pass

Headless-browser automated QA against the production-built bundle.
**42/42 checks pass, zero JavaScript errors.**

| Persona | Pass | Warn | Fail | Total |
|---|---:|---:|---:|---:|
| Tutor | 15 | 0 | 0 | 15 |
| Guardian | 11 | 0 | 0 | 11 |
| Student | 10 | 0 | 0 | 10 |
| Cross-cutting | 6 | 0 | 0 | 6 |
| **Total** | **42** | **0** | **0** | **42** |

## Tutor checklist

The tutor is the supply side — a university student who teaches.

- [✓] **TUTOR-01** — Sign-in screen renders with branding (`+880`, "One number, one app")
- [✓] **TUTOR-02** — Phone validation rejects sub-10-digit input with clear error
- [✓] **TUTOR-03** — Phone-OTP flow sends code; OTP step appears
- [✓] **TUTOR-04** — OTP verifies (demo `123456`) and lands on Welcome
- [✓] **TUTOR-05** — Welcome → "Teach as a tutor" → Continue → "About you"
- [✓] **TUTOR-06** — Enter name + area → land on feed showing "jobs near you"
- [✓] **TUTOR-07** — Bottom nav has all 5 tutor tabs (Jobs / Demand / Schedule / Inbox / Profile)
- [✓] **TUTOR-08** — Demand tab renders heatmap + stats card (open jobs / in your areas / median pay)
- [✓] **TUTOR-09** — Schedule tab renders empty-earnings state with ৳
- [✓] **TUTOR-10** — Inbox tab renders header (empty until first chat)
- [✓] **TUTOR-11** — Profile renders honest empty-states (Apprentice tier, "No reviews yet", "Mark a class attended to start earning")
- [✓] **TUTOR-12** — Edit profile + save subjects persists (verified by reading store state)
- [✓] **TUTOR-13** — Reputation strip shows the saved subjects
- [✓] **TUTOR-14** — Verification ladder renders and tier advances on submit
- [✓] **TUTOR-15** — Settings reachable from profile gear; shows switch role + sign out

## Guardian checklist

The guardian is the buyer — a parent hiring a tutor for their kid.

- [✓] **GUARDIAN-01** — Role switch lands on g-home with "GUARDIAN · {name}" header
- [✓] **GUARDIAN-02** — Empty home shows "Post your first tuition" prompt
- [✓] **GUARDIAN-03** — Post-listing form opens with subjects / level / pay sections
- [✓] **GUARDIAN-04** — Submit button greyed without required fields (subjects + pay)
- [✓] **GUARDIAN-05** — Valid submit posts listing + redirects to home
- [✓] **GUARDIAN-06** — Active listing card shows the posted details (pay, area, level)
- [✓] **GUARDIAN-07** — Listings tab shows the "my listings" index
- [✓] **GUARDIAN-08** — (cross) Switch to tutor + apply works
- [✓] **GUARDIAN-09** — (cross) Switching back, guardian sees the live applicant count (1)
- [✓] **GUARDIAN-10** — Hire applicant — listing auto-closes to `filled`
- [✓] **GUARDIAN-11** — Settings on guardian side shows sign-out + reset

## Student checklist

The student is the kid. They only appear on a single screen: the anonymous
post-class check-in. The privacy contract — *the tutor never sees this* —
is enforced at the UI, at the route handoff, and (when wired) at RLS.

- [✓] **STUDENT-01** — Push a class to today so the attend button shows
- [✓] **STUDENT-02** — Tutor marks attended → handoff screen appears ("Please hand the phone to…")
- [✓] **STUDENT-03** — Handoff names the actual student (not "Student")
- [✓] **STUDENT-04** — Continue button → check-in form ("Hey — how did today's class feel?")
- [✓] **STUDENT-05** — Mood picker shows all 5 emoji buttons (Rough / Meh / OK / Good / Great)
- [✓] **STUDENT-06** — Picking "Good" reveals positive context tags
- [✓] **STUDENT-07** — Tags select; optional comment textarea works
- [✓] **STUDENT-08** — Submit → "Thanks for sharing" confirmation, with "won't see it" reminder
- [✓] **STUDENT-09** — "Hand phone back" returns to tutor's schedule
- [✓] **STUDENT-10** — Feedback stored in studentFeedback with mood, tags, comment

## Cross-cutting checklist

- [✓] **CROSS-01** — Guardian sees "From your child" with the actual mood + tags + comment
- [✓] **CROSS-02** — **PRIVACY** — tutor does NOT see the feedback on Profile
- [✓] **CROSS-03** — **PRIVACY** — tutor does NOT see the feedback on Feed
- [✓] **CROSS-04** — **PRIVACY** — tutor does NOT see the feedback on Schedule
- [✓] **CROSS-05** — Reload preserves session, role, subjects, feedback
- [✓] **CROSS-06** — Sign out clears state and returns to sign-in

## Bugs fixed during this QA pass

The 42/42 pass count is the result of fixing bugs found mid-run.

1. **Hardcoded student name in `hireApplicant`.** Classes were always created
   with `student_name: 'Student'`, so the schedule and handoff screen showed
   "Student" instead of the actual child's name.

2. **Guardian onboarding didn't ask for child name.** Added a "Your child's
   name" field on the welcome step (guardian-only), wired through
   `completeOnboarding` → `guardian_profiles.child_name` → looked up in
   `hireApplicant` for the class's `student_name`.

3. **Check-in form pointed at the wrong name.** "Tap honestly. *{student}*
   won't see this" — but the student *is* the one filling it out. Now
   reads the tutor's name (the person who actually can't see it).

4. **Fake reputation tier for new tutors.** Every fresh profile displayed
   "Trusted · 12 of 25 hires to Expert" — fabricated against 0 real
   hires. Now derived from `completedHires`: a 0-hire tutor is
   correctly "Apprentice · 0 of 5 hires".

5. **Fake verified reviews.** Three hardcoded reviews ("Mr. Rahman",
   "Mrs. Akter", "Ms. Karim") appeared on every tutor's profile. Removed;
   replaced with an empty-state explaining when reviews appear.

6. **Fake earnings delta.** "↑ ৳3,200 vs April · verified income" was
   shown to every tutor including new ones with ৳0 earnings. Replaced
   with "Mark a class attended to start earning" / "Auto-collected from
   completed classes" based on real earnings.

7. **Fake upcoming trial on guardian home.** A "Tanvir Hasan · BUET · Mech.
   Eng · 3rd yr / Saturday, Jun 1 / 6:30pm" trial card was always shown,
   even on a fresh account that had hired no one. Now only renders when
   there's a real `trial-scheduled` or upcoming class.

8. **Fake "Top matches" tutor list on guardian home.** Three made-up
   tutors (94% / 88% / 82% match) were shown to every guardian. Now only
   renders real applicants, with the actual `listingApplicants` slice
   and their real states.

9. **Broken description on tutor profile.** A fresh profile showed
   "·  ,. Teaching ." because empty institution / department / year /
   subjects rendered as bare separators. Now builds the line from real
   fields only with a clean fallback.

## What this run did NOT cover

Honest scope:

- **Local-mode only.** The Supabase code paths are written but not
  exercised against a real Postgres + RLS. Both data layers share the
  same JavaScript interface; an issue would most likely surface in
  RLS-policy interpretation, not in app logic.
- **No file picker tests.** The avatar upload button is wired; the file
  picker can't be triggered headlessly without an OS dialog driver.
- **No realtime tests.** Chat sends work but Supabase realtime
  subscriptions can't be tested without the backend.
- **Photo upload, NID upload, real OTP via SMS.** These all require
  external configuration.

## How to reproduce the run

```bash
cd app
npm install
npm run build
npx vite preview --port 4173 &

# Driver:
node /path/to/qa.mjs    # see commit history for the script
```

The script lives in the commit history as `/tmp/qa.mjs` and was run
against `http://localhost:4173/`. It clears localStorage at the start,
drives the full multi-role flow, captures a screenshot per step into
`/tmp/qa-screens/`, and asserts user-visible text + store state at every
checkpoint.

The 42 screenshots survive in `/tmp/qa-screens/` after the run for
post-hoc inspection.
