# Tutor Marketplace App

_Started 2026-05-25 04:47 UTC_

---

## User

<system-info comment="Only acknowledge these if relevant">
Project title is now "Tution Media"
Project is currently empty (no files)
Current date is now May 25, 2026
</system-info>

<default aesthetic>
If no references, art direction or design systems were provided, use this default professional modern, minimal aesthetic as a base. Declare your choice out loud so you stick to it. Guidance:
- Choose a type pairing from web-safe set or Google Fonts. Helvetica is a good choice. Avoid hard-to-read or overly stylized fonts. Use 1-3 fonts only.
- Foreground and background: choose a color tone (warm, cool, neutral, something in-between). Use subtly-toned whites and blacks; avoid saturations above 0.02 for whites.
- Accents: choose 0-2 additional accent colors using oklch. All accents should share same chroma and lightness; vary hue.
- NEVER write out an SVG yourself that's more complicated than a square, circle, diamond, etc.
- For imagery, never hand-draw SVGs; use subtly-striped SVG placeholders instead with monospace explainers for what should be dropped there (e.g. “product shot”)

CRITICAL: ignore default aesthetic entirely if given other aesthetic instructions like reference images, design systems or guidance, or if there are files in the project already.
</default aesthetic>

<pasted_text name="Pasted text (222 lines)">
Tutor Marketplace — Product & Feature Specification (v1.1)
Strategy: Supply-first (tutors before guardians) · Launch: Dhaka, hyperlocal · Wedge: own the ongoing relationship + the money flow, not just the match.

Resolved decisions (from §9): Fee paid by tutors · On-platform payment optional (nudged, not forced) · Easy signup, verification gated before placement · App: PWA-first, published to Play Store as a TWA, Android-first · Cold start: two areas — one in DNCC (North), one in DSCC (South), sequenced not split.
New in v1.1: Demand heatmap (tutor-facing + ops) · Privacy-controlled location reveal with Google Maps navigation.


0. Five product principles (every feature must serve at least one)

Be a magnet for tutors. Fast money, fast matches, a reputation that compounds. The incumbent's tutors wait weeks; cut that to days and protect their pay and we win supply.
Own the relationship, kill the leakage. Tutoring is high-value, low-frequency, and trivially easy to take offline after match one. Every feature should make staying on-platform easier and safer than leaving.
Trust is the moat. Verification, verified reviews, safety, accountability. We can't out-age a 13-year incumbent — we out-engineer and out-focus it.
Hyperlocal, not "Dhaka." For in-home tutoring, the neighborhood is the market. Match at neighborhood/thana granularity.
Bootstrap discipline. Prove the matching loop first, then layer the moat. (See §6 Phasing.)


1. The core flow (the spine)
TUTOR SIDE                          GUARDIAN/STUDENT SIDE
──────────                          ─────────────────────
1. Sign up (OTP) — EASY, no docs
2. Build profile (browse + apply OK)
3. Browse live job feed
                                    4. Post a tuition requirement
5. Get matched → 1-tap apply  ───►  6. Receive applicants (verification status shown)
                                    7. Review profiles, shortlist (max 5)
   ── VERIFICATION GATE: tutor must be verified before placement ──
8. Request exact location  ───►     9. Guardian grants location access
10. Get shortlisted, accept trial ◄ 11. Book trial class (via app) + map unlocked
12. Teach trial class
                                    13. Confirm hire
        ── 14. DIGITAL AGREEMENT signed by both (terms locked) ──
        ── 15. FIRST PAYMENT runs through the platform ──
16. Log attendance per class        17. See attendance + progress
        ── 18. RECURRING monthly payment auto-collected (the moat, V2) ──
19. Reputation accrues  ◄─────────► 20. Rate & review (each month)
        ── 21. Dispute resolution if needed ──
22. Find next job                   23. Replace/renew tutor as needed
Where we diverge from the incumbent: Caretutors monetizes once at placement and the relationship then leaves the platform. Steps 15–20 are our product — the monthly money flow + accountability nobody owns.

2. Tutor app — features (THE PRIORITY SIDE)
2.1 Onboarding & profile — EASY signup

OTP phone signup, no documents required to start (mirror the bKash mental model).
Bangla-first UI, English toggle.
Profile builder: institution, dept, year/CGPA; subjects × levels; medium (Bangla / English version / English medium); curriculum (National / Cambridge / Edexcel / Madrasa); service areas (multi-select by neighborhood/thana); expected salary; weekly availability grid; gender; photo; 30-sec intro video (optional, strong trust + conversion signal).
A new tutor can immediately browse and apply — value before friction.

2.2 Verification — optional to climb, REQUIRED before placement
Verification is not a wall at signup. It's a gate at the moment of real opportunity (highest conversion — they verify when a job is on the line):

Tier 0 — Phone (auto, at signup).
Tier 1 — NID (national ID verification API, e.g. Porichoy — validate access/cost).
Tier 2 — Education (university ID, board roll/result lookup, enrollment proof).
Tier 3 — Reference / background check (manual; premium / high-stakes).
Rule: signup, browse, and apply are open to all. A tutor cannot be confirmed/placed until Tier 1 + Tier 2 are complete. Verification status is shown on every application so guardians always know what they're looking at.
Visible badges + ranking boost for verified tutors → voluntary climbing, no friction at the door.

2.3 Job discovery & matching (kill the "weeks of waiting")

Live job feed filtered to subjects, level, area, schedule, price.
Push + SMS notifications the instant a matching job posts (speed is the tutor's #1 pain).
One-tap apply with a "why you match" score.
Commute/distance indicator per job (from the approximate pin — see §4.7).
Application tracker: applied → shortlisted → location granted → trial → confirmed / rejected.

2.4 Demand intelligence — "Demand near you" (NEW)

Tutor-facing heatmap: a map overlay showing where tuition requests are concentrated right now, plus trending subjects/levels per area.
Helps tutors decide which service areas to add and which subjects to list to get more jobs → increases supply mobility and fill rate.
Powered by live job-post density vs tutor coverage (same data that feeds the ops heatmap in §4.6).

2.5 Reputation & growth (supply magnet + anti-leakage)

Portable, compounding profile: completed jobs, hours taught, on-time %, student retention, ratings, reviews.
Tutor tiers/levels unlocked by track record → higher-paying jobs + premium rate.
Reputation accrues for on-platform jobs only — the asset they'd forfeit by going informal.
Earnings dashboard: income history, upcoming payouts, projections.

2.6 Money

In-app wallet + payout to bKash/Nagad/bank.
Automatic monthly collection from guardian → tutor (removes the awkward "please pay me" ask — real pain relief). Optional in V1; the default we nudge toward.
Payment protection: pay guaranteed when attendance is logged + confirmed — available only for on-platform payments (the carrot for staying).
Verified income statement (basis for future lending, §7).

2.7 Work management

Schedule/calendar; per-class attendance logging (feeds payments + reputation); in-app progress notes to guardian (keeps comms on-platform); leave/reschedule requests.

2.8 Location & navigation (NEW — see §4.7 for the full flow)

Request location access for a job; once granted, exact pin + Google Maps turn-by-turn navigation to the guardian's home.

2.9 Safety & support

Masked in-app chat & calls (no raw phone-number exchange → safety + anti-leakage); report/SOS; help center.


3. Guardian / Student app — features
3.1 Onboarding

OTP signup, lightweight profile, Bangla-first.

3.2 Post a requirement (the demand trigger)

Guided wizard: subject(s), class/level, curriculum/medium, exact address (stored private) + nearest landmark, mode (in-home / online / tutor's place / group), preferred tutor gender, days & times, budget range, special needs.

3.3 Discover & decide (keep guardian control — it works)

Receive applicants; browse verified profiles, ratings, reviews, intro videos.
Filter/sort by verification tier, rating, distance, price, university.
Shortlist up to 5; compare side by side.
Grant location access to selected tutors (see §4.7); book a trial through the app.

3.4 Hire & manage

Digital agreement on confirm — locks schedule, subjects, fee, start date.
Recurring payment setup (bKash/Nagad/card) — offered, not forced; made clearly better.
Attendance visibility + progress reports; pay monthly in-app with reminders + optional auto-pay; rate & review each month / on completion.

3.5 Trust & safety

Tutor verification visible at a glance.
Replace-tutor flow (keeps them from defaulting to the informal market).
Satisfaction guarantee on trial / first period (on-platform only).
Home-address privacy by default (only revealed to tutors the guardian explicitly approves — §4.7); masked comms; report/safety tools.


4. Cross-cutting systems
4.1 Trust & verification engine

Multi-tier pipeline (NID, education, references); manual review queue for high-stakes/premium; fraud & duplicate detection; verified reviews only (left only from confirmed, paid tuitions — unfakeable).

4.2 Payments & transaction layer (biggest differentiator)

Wallet + ledger both sides.
Gateway: SSLCommerz aggregator (bKash/Nagad/Rocket/cards) and/or bKash PGW direct. Validate tokenized auto-debit / recurring capability and per-txn cost early — it shapes the whole model.
Recurring monthly auto-billing (V2); escrow-style hold-and-release for trial + first month; payment protection (on-platform only).
Fee model (per resolved §9): tutor pays. Structured to reward staying — see §5.
Payouts, refunds, disputes, invoices/receipts (formalization is itself a value-add in a cash market).

4.3 Matching & discovery engine

Hyperlocal geo-matching (neighborhood/thana granularity).
Multi-factor: subject/level fit · location/commute · schedule overlap · price fit · gender pref · verification tier · rating · track record.
Ranking favors verified, reliable, high-rated tutors → quality flywheel.

4.4 Reputation & accountability

Two-sided verified ratings/reviews; tutor metrics (completion, retention, punctuality, response time); guardian reliability score; dispute workflow; digital agreement as the accountability anchor.

4.5 Communication layer

Masked chat + masked voice (VOIP/number masking); push + SMS (non-negotiable given device/data realities); automated reminders; WhatsApp/SMS fallbacks.

4.6 Demand heatmap & ops intelligence (NEW)

Aggregate demand-vs-supply heatmap for acquisition/ops: where requests cluster, where supply is thin, which subjects/levels/areas are trending.
Drives where to acquire tutors and run campaigns, surfaces under-served pockets, and powers the tutor-facing "Demand near you" view (§2.4). One data layer, two audiences.

4.7 Location access & navigation (NEW — privacy-controlled)
Designed so a guardian's home address is never exposed to strangers, only to tutors they choose:

At posting: guardian enters exact address; system stores it private. Publicly, only area + nearest landmark + a fuzzed approximate pin show — enough for tutors to estimate commute, not enough to identify the home.
Tutor requests location access (when interested / shortlisted).
Guardian approves access for that specific tutor only (single tap; can approve all shortlisted at once).
On approval: exact pin + full address + Google Maps turn-by-turn navigation unlock for that tutor.
Access is scoped and revocable (e.g., auto-revoked if the tutor is rejected; persists once hired).


Why it matters: it's a safety/privacy feature and an anti-leakage feature (location + navigation live in-app) and a trust signal for anxious guardians — all three at once.

4.8 Admin / Ops console (≈50% of the real work)

Verification review dashboard; user & job management; dispute/complaint management; payment monitoring/reconciliation/payout approvals/fraud alerts; manual matchmaking assist (do things that don't scale early); CRM with proactive outbound calls (the incumbent's ~20% referral rate is built on this); analytics; support ticketing; moderation.


5. Anti-disintermediation — and why your fee choices raise the stakes
You chose tutor-pays-the-fee + optional on-platform payment. Both are right for V1 adoption (low guardian friction, no forced behavior) — but together they put 100% of the anti-leakage burden on making on-platform genuinely better, because neither side is forced to stay. Hold the line with value, not lock-in:

Payment protection + verified reputation accrue ONLY on-platform.
Auto-collection removes the monthly awkward payment ask.
Satisfaction guarantee + free replacement only on-platform.
Masked comms — no phone number to take offline early.
Fee structure that rewards staying: prefer a small recurring platform charge over a big one-time placement fee, and/or waive/reduce the tutor fee when the tuition is run + paid on-platform. Don't make leaving the way to dodge the fee.
Receipts/income proof the informal market can't provide.
Honest stance: you'll lose some to leakage. Capture value even on those (placement fee), and treat recurring as the upside you earn by being better.


6. Phasing
V1 / MVP — prove the matching loop + plant the payment habit (2 Dhaka areas, tutor-first)

Tutor: easy OTP signup, profile, Tier 0–2 verification (gated before placement), live job feed, 1-tap apply, application tracker, "Demand near you" (basic), basic reputation, schedule, masked chat, location request.
Guardian: OTP signup, post requirement (private address), view applicants, shortlist, grant location access + Google Maps, book trial, confirm + digital agreement, rate/review.
Matching: hyperlocal + subject + schedule + notifications.
Payments (lean): tutor placement fee + trial/first-month collected through the platform to seed the habit. Not full auto-recurring yet.
App: PWA, shipped to Play Store as a TWA, Android-first; SMS for critical alerts.
Ops: manual verification, manual disputes, proactive CRM calls, manual matchmaking assist.
MVP's only job: match tutors faster + more trustworthily than the informal market and the incumbent, inside the chosen clusters.

V2 — build the moat (recurring + accountability)

Full recurring auto-billing, wallet, escrow/hold-release, payment protection, attendance→payment linkage, replacement guarantee, tutor tiers/levels, richer reputation, masked calling, progress reports, full demand heatmap.

V3 — scale & monetize deeper

Fintech: tutor income-based lending, guardian installments, tutor insurance.
Verticals: English-medium/IGCSE/A-Level, admission cramming (medical/BUET/varsity), special needs.
Formats: group, package, "shadow," online + diaspora.
Geography: beyond the launch clusters; aggregator/ecosystem; B2B (coaching centers/schools).


7. Monetization, mapped to features
StageRevenue lineEnabled byV1Tutor placement feeMatching + digital agreementV1Trial/first-month txn marginPayment layer (lean)V2Recurring % of tuition (GMV)On-platform recurring paymentsV2Payment-protection feeEscrow + attendance linkageV3Lending / installment marginWallet + verified income dataV3Premium verification, featured listingsVerification + rankingV3B2B + diaspora premiumScale + online

8. Instrument these from day one (your BA dashboard)

Supply: tutor signups, verification-completion rate, time-to-first-application, weekly active tutors.
Liquidity: jobs posted, applications/job, time-to-shortlist, time-to-confirm, fill rate.
Demand: guardian signups, post→confirm conversion.
Money (the moat): % of transactions on-platform, GMV, take rate, recurring-payment retention (inverse of leakage).
Quality/retention: tutor retention, student retention (months kept), rating distribution, dispute rate, referral rate (north star — incumbent ~20%).
</pasted_text>


<system-reminder>Auto-injected reminder (ignore if not relevant): do not recreate copyrighted or branded UI unless the user's email domain matches that company. Create original designs instead.</system-reminder>

## Assistant

_[tool: questions_v2]_

I've read through the v1.1 spec for Tution Media — supply-first tutor marketplace, Dhaka hyperlocal, PWA-first Android. Before I start designing, I want to make sure I build the right thing. A few questions:

## User

Questions answered:
- deliverable: Tutor app — hi-fi clickable prototype (the priority side)
- fidelity: Hi-fi — production-quality visuals, real branding, polished
- design_system: No — invent a brand identity from scratch (Bangla-first, modern, trustworthy)
- frame: Android device bezel (matches launch plan)
- language: English primary (mock copy in English)
- tutor_screens: Onboarding + OTP signup, Profile builder, Live job feed (the spine), One-tap apply + application tracker, Verification flow (Tier 0–3, gated before placement), Demand-near-you heatmap, Location request + Google Maps navigation, Schedule + attendance logging, Masked chat, Reputation/tier profile
- variations: 2–3 variations of the visual style (color/type/density)
- tone: Warm & community (like a neighborhood app)
- interactivity: Some interactions (tap to navigate between screens)

## Assistant

_[tool: update_todos]_

_[tool: copy_starter_component]_

_[tool: copy_starter_component]_

_[tool: copy_starter_component]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: write_file]_

Now I have a clear picture. Let me commit to the system out loud before building:

**Tution Media — design system commitment**
- **Type**: Instrument Serif (display, warm editorial), Geist (UI body), JetBrains Mono (data/meta) — none of the banned families.
- **Voice**: Warm community, neighborhood-grounded. English copy with real Dhaka neighborhoods (Dhanmondi, Mirpur, Mohammadpur).
- **Default palette "Clay"**: terracotta primary, deep ink, paper cream — with Sage and Marigold as Tweak variations.
- **Motifs**: paper-cream surfaces, generous 14–18px radii, hairline strokes, tabular numerals for stats, no emoji.
- **Structure**: Design canvas with 4 sections — Get started, Find work, Trust & verification, Day to day — each artboard is a 412×892 Android frame with custom UI inside.

Building now.

_[tool: str_replace_edit]_

Now the shared UI primitives — phone shell, status bar, bottom nav, buttons, icons, etc.

_[tool: write_file]_

_[tool: write_file]_

Now the screens. I'll split into 3 files of ~3 screens each, plus a shared data file.Now the first batch of screens — Onboarding, Profile builder, Feed, Apply tracker.

_[tool: write_file]_

Now batch 2 — Verification, Heatmap, Location/Maps.

_[tool: write_file]_

Now batch 3 — Schedule/Attendance, Chat, Reputation.

_[tool: write_file]_

_[tool: read_file]_

_[tool: write_file]_

Now the main HTML entry.

_[tool: write_file]_

_[tool: show_html]_

_[tool: done]_

_[tool: fork_verifier_agent]_

Built the Tution Media tutor app — 10 screens laid out across 4 sections on a pan/zoom design canvas.

**What you'll see**
- **Get started**: OTP signup → profile builder (subjects · levels · areas · weekly availability grid)
- **Find work** (the spine): live feed with match scores → application tracker with funnel → demand heatmap → location request that toggles to a navigation reveal
- **Trust & verification**: 4-tier ladder gated before placement, plus the reputation/tier profile with verified reviews
- **Day to day**: schedule + attendance, masked inbox with a thread you can open

**System**
- Type: Instrument Serif (display) + Geist (UI) + JetBrains Mono (data tags)
- Default *Clay* palette (warm terracotta on cream); switch to *Sage* or *Marigold* in the Tweaks panel (bottom right)
- Real Dhaka neighborhoods (Dhanmondi, Mohammadpur, Lalmatia), tabular ৳ numerals, no emoji

**Interactions wired** — most cards and CTAs navigate. Try: feed → tap a job → apply tracker → "Request location" → granted state. The verification ribbon on the feed jumps to the trust ladder. Click any artboard label to open it fullscreen and ←/→ through.

**Caveats / next steps**
- Maps illustration is a stylized SVG, not real Google Maps tiles — drop in a screenshot of real tiles later
- Bangla copy not included (you said English primary); easy to add a localization pass
- Tweaks expose palette only — happy to add density, type-pairing, or feed-density tweaks if helpful

## User

Verifier agent check completed

## Assistant

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: done]_

Fixed — the M3 status bar and gesture pill from the starter were stacking on top of the branded ones in `Phone`. Made them opt-out on `AndroidDevice` and disabled both in `MiniApp` so only the paper/JetBrains-Mono status bar and the warm gesture pill remain.

## User

Keep everything same. just use the following color pallette and UI/UX

### Color Palette
 * *Primary Dark (Background):* #0F0F0F (Deep near-black for depth).
 * *Primary Accent:* #FFC83D (Vibrant yellow for primary buttons/highlights).
 * *Secondary Surface:* #1E1E1E (Lighter gray for cards/containers).
 * *Text/Content:* #FFFFFF (White for primary text) and #888888 (Gray for secondary text).
 * *Special Surface:* #F5F5F5 (Off-white for focus cards).
### UI Design Language
 * *Card-Based Layout:* Uses layered containers with generous rounded corners (approx. 20-30px radius) to separate distinct information blocks.
 * *Visual Hierarchy:*
   * *Large Typography:* Used for titles (like "Neewick") to create a clear starting point.
   * *Soft Shadows/Depth:* Containers use subtle inner and outer shadows (neumorphic-lite) to lift them off the dark background.
   * *Iconography:* Minimalist, thin-stroke line icons that match the primary accent color.
 * *Spacing:* High whitespace usage ensures the dense information in cards remains readable and not cluttered.

## Assistant

_[tool: str_replace_edit]_

On it — keeping everything intact, just adding a Midnight palette as the new default and softening cards into the neumorphic-lite style.Now update the UI primitives to use the shadow var and bump radii a touch.

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

A few cross-palette polish fixes so things work cleanly on both light and dark backgrounds — track strokes need to respect the surface they sit on, not hard-coded white.

_[tool: done]_

_[tool: fork_verifier_agent]_

Switched to Midnight as the default — `#0F0F0F` near-black canvas, `#1E1E1E` surface cards with soft outer shadow + faint inset highlight, `#FFC83D` yellow for CTAs/highlights, white + `#888` text. Bumped card radii to 22px. The original Clay, Sage, and Marigold palettes are still available in the Tweaks panel (bottom-right).

The two "focus" surfaces (verification Trust Score hero, reputation Tier card, feed verification ribbon) intentionally invert to a light/white surface — matches your `#F5F5F5 focus card` spec for occasional emphasis moments on the dark canvas.

## User

Verifier agent check completed

## Assistant

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: done]_

_[tool: fork_verifier_agent]_

Fixed the inheritance bug — `Phone` was redefining `--tm-paper`/`--tm-primary` on every screen and overriding the Midnight scope set by `MiniApp`. Now Phone inherits the active palette cleanly, and the Android bezel's inner surface tracks the theme too so no `#f4fbf8` leak shows through.

## User

Verifier agent check completed

## Assistant

Midnight palette now applies cleanly across all 10 screens — deep black `#0F0F0F` canvas, `#1E1E1E` cards with soft depth shadow, `#FFC83D` yellow accents on CTAs and active tabs. The Tweaks panel still lets you swap to Clay, Sage, or Marigold if you want to A/B.

## User

use DM Sans Fonts 
and make a verson of it in powerpoint presentation for pitch

## Assistant

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

Two things: swap fonts to DM Sans across the prototype, and build a pitch deck version. Let me do both.

## User

use DM Sans font

## User

make a powerpoint presentation of all the screen and feature of this app and what it does

## Assistant

_[tool: list_files]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: write_file]_

_[tool: show_html]_

There's already a strategic pitch deck. What's missing is a **product walkthrough** — one slide per screen showing what each does. Let me build that.

_[tool: show_to_user]_

_[tool: gen_pptx]_

Now exporting to PPTX so you have an editable PowerPoint version.

_[tool: present_fs_item_for_download]_

Done. **14 slides**, fully editable in PowerPoint, with speaker notes baked in.

**Walkthrough order**
1. Cover · 2. Onboarding/OTP · 3. Profile builder · 4. Live job feed · 5. Application tracker · 6. Verification ladder · 7. Demand heatmap · 8. Location/Maps reveal · 9. Schedule + attendance · 10. Masked inbox · 11. Reputation profile · 12. System overview (all 10 screens) · 13. Cross-cutting mechanisms · 14. Close

Each screen slide pairs a phone mockup on the left with title, description, three key features, and the product principles it serves on the right. Tap-and-edit any text directly in PowerPoint.

## User

parfect. keep everything same. just edit the background of the slides. make it white to contrast with the black UI/UX

## Assistant

_[tool: read_file]_

_[tool: str_replace_edit]_

_[tool: grep]_

_[tool: grep]_

_[tool: grep]_

_[tool: show_html]_

_[tool: sleep]_

Let me verify visually before regenerating the PPTX.

_[tool: save_screenshot]_

_[tool: show_html]_

_[tool: save_screenshot]_

_[tool: show_to_user]_

_[tool: gen_pptx]_

_[tool: present_fs_item_for_download]_

White slide canvas now contrasts the dark phone UI on every slide. Same 14 slides, same content, regenerated PPTX above.

