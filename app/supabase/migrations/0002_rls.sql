-- Row Level Security. The default-deny mindset: nothing is readable unless
-- a policy explicitly allows it. The auth.uid() helper returns the signed-in
-- user's id; we use it everywhere.

-- Enable RLS on every user-facing table.
alter table public.profiles           enable row level security;
alter table public.tutor_profiles     enable row level security;
alter table public.guardian_profiles  enable row level security;
alter table public.listings           enable row level security;
alter table public.applications       enable row level security;
alter table public.chat_threads       enable row level security;
alter table public.messages           enable row level security;
alter table public.classes            enable row level security;
alter table public.student_feedback   enable row level security;
alter table public.verifications      enable row level security;
alter table public.device_tokens      enable row level security;

-- ─── Profiles ──────────────────────────────────────────────────────────
-- Public read of basic profile info (display name, avatar, role) — needed
-- to render a tutor card to a guardian and vice versa. Update only your own.
create policy profiles_select_all on public.profiles
  for select using (true);
create policy profiles_insert_self on public.profiles
  for insert with check (id = auth.uid());
create policy profiles_update_self on public.profiles
  for update using (id = auth.uid());

-- ─── Tutor / Guardian profiles ─────────────────────────────────────────
create policy tutor_profiles_select_all on public.tutor_profiles
  for select using (true);
create policy tutor_profiles_write_self on public.tutor_profiles
  for all using (id = auth.uid()) with check (id = auth.uid());

create policy guardian_profiles_select_self on public.guardian_profiles
  for select using (id = auth.uid());
create policy guardian_profiles_write_self on public.guardian_profiles
  for all using (id = auth.uid()) with check (id = auth.uid());

-- ─── Listings ──────────────────────────────────────────────────────────
-- Any authenticated user can browse open listings; only the owning guardian
-- can mutate.
create policy listings_select_open on public.listings
  for select using (auth.role() = 'authenticated' and (status = 'open' or guardian_id = auth.uid()));
create policy listings_insert_owner on public.listings
  for insert with check (guardian_id = auth.uid());
create policy listings_update_owner on public.listings
  for update using (guardian_id = auth.uid());
create policy listings_delete_owner on public.listings
  for delete using (guardian_id = auth.uid());

-- ─── Applications ──────────────────────────────────────────────────────
-- A tutor sees their own applications. A guardian sees applications to their
-- own listings. Tutors create their applications; guardians (or the tutor)
-- can update state via the API layer.
create policy applications_select_visible on public.applications
  for select using (
    tutor_id = auth.uid()
    or exists (select 1 from public.listings l where l.id = listing_id and l.guardian_id = auth.uid())
  );
create policy applications_insert_self on public.applications
  for insert with check (tutor_id = auth.uid());
create policy applications_update_visible on public.applications
  for update using (
    tutor_id = auth.uid()
    or exists (select 1 from public.listings l where l.id = listing_id and l.guardian_id = auth.uid())
  );

-- ─── Chat ──────────────────────────────────────────────────────────────
-- Only thread participants see the thread and its messages.
create policy threads_select_participant on public.chat_threads
  for select using (guardian_id = auth.uid() or tutor_id = auth.uid());
create policy threads_insert_participant on public.chat_threads
  for insert with check (guardian_id = auth.uid() or tutor_id = auth.uid());

create policy messages_select_participant on public.messages
  for select using (exists (
    select 1 from public.chat_threads t
    where t.id = thread_id and (t.guardian_id = auth.uid() or t.tutor_id = auth.uid())
  ));
create policy messages_insert_participant on public.messages
  for insert with check (sender_id = auth.uid() and exists (
    select 1 from public.chat_threads t
    where t.id = thread_id and (t.guardian_id = auth.uid() or t.tutor_id = auth.uid())
  ));

-- ─── Classes ───────────────────────────────────────────────────────────
-- Both parties to a class can read and update (e.g., mark attended).
create policy classes_select_party on public.classes
  for select using (tutor_id = auth.uid() or guardian_id = auth.uid());
create policy classes_update_party on public.classes
  for update using (tutor_id = auth.uid() or guardian_id = auth.uid());
create policy classes_insert_party on public.classes
  for insert with check (tutor_id = auth.uid() or guardian_id = auth.uid());

-- ─── Student feedback ──────────────────────────────────────────────────
-- The privacy contract: tutors CANNOT see feedback rows even though they
-- own the class. Guardian of the class is the only viewer.
-- Insert is open to anyone who knows the class id — the form is shown after
-- the tutor passes the phone, so the row gets inserted from the tutor's
-- authenticated session; that's fine because they still can't read it back.
create policy student_feedback_insert_anyone on public.student_feedback
  for insert with check (auth.role() = 'authenticated');
create policy student_feedback_select_guardian on public.student_feedback
  for select using (exists (
    select 1 from public.classes c
    where c.id = class_id and c.guardian_id = auth.uid()
  ));
-- No update / delete policies → no one (including service role bypass aside)
-- can mutate feedback after the fact.

-- ─── Verifications ─────────────────────────────────────────────────────
create policy verifications_select_self on public.verifications
  for select using (tutor_id = auth.uid());
create policy verifications_insert_self on public.verifications
  for insert with check (tutor_id = auth.uid());
-- Admin updates go through the service role, which bypasses RLS by design.

-- ─── Device tokens ─────────────────────────────────────────────────────
create policy device_tokens_self on public.device_tokens
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());
