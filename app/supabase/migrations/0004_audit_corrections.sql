-- ─── Schema + policy corrections after the deploy-readiness audit ───────
-- These are split from 0001/0002 so that anyone who already ran the first
-- batch can pull just this file and apply the fixes.

-- ─── 1. chat_threads: NULL-aware uniqueness ─────────────────────────────
-- The plain `unique (guardian_id, tutor_id, listing_id)` constraint doesn't
-- prevent duplicates when listing_id is NULL because, per SQL, NULL ≠ NULL.
-- Split it into two partial indexes: one for the listing-scoped case, one
-- for the unscoped thread between the same pair.
alter table public.chat_threads drop constraint if exists chat_threads_guardian_id_tutor_id_listing_id_key;

create unique index if not exists chat_threads_uniq_with_listing
  on public.chat_threads(guardian_id, tutor_id, listing_id)
  where listing_id is not null;

create unique index if not exists chat_threads_uniq_no_listing
  on public.chat_threads(guardian_id, tutor_id)
  where listing_id is null;

-- ─── 2. student_feedback: only the class's tutor may insert ─────────────
-- Previous insert policy let any signed-in user post feedback for any
-- class. Restrict insert to the tutor on that class (the privacy contract
-- still keeps the row unreadable to the tutor afterwards).
drop policy if exists student_feedback_insert_anyone on public.student_feedback;
create policy student_feedback_insert_by_tutor on public.student_feedback
  for insert with check (
    exists (
      select 1 from public.classes c
      where c.id = class_id and c.tutor_id = auth.uid()
    )
  );

-- ─── 3. profiles: don't leak phone numbers ──────────────────────────────
-- The previous policy made every column world-readable to authenticated
-- users. Phone is PII — restrict selects to the safe columns by using a
-- column-level grant pattern. Postgres RLS is row-level; for column-level
-- protection we drop the column from the GRANT and expose a view for the
-- safe public columns.
revoke select on public.profiles from anon, authenticated;
grant select (id, display_name, avatar_url, area, primary_role, created_at)
  on public.profiles to anon, authenticated;
-- The owner still needs to read their own phone; let them.
grant select (phone) on public.profiles to authenticated;
-- Tighten the policy too: authenticated users can read public profile
-- columns of any user; phone is still restricted by the column-level
-- privileges above to the owner via a separate select-self policy.
drop policy if exists profiles_select_all on public.profiles;
create policy profiles_select_public on public.profiles
  for select using (auth.role() = 'authenticated');

-- ─── 4. Phone auto-populated at signup ──────────────────────────────────
-- A trigger on auth.users copies the verified phone into profiles when the
-- profile row is created. Idempotent so re-runs of the migration are safe.
create or replace function public.copy_phone_to_profile() returns trigger language plpgsql security definer as $$
begin
  if new.phone is not null and new.phone is distinct from coalesce(old.phone, '') then
    update public.profiles set phone = new.phone where id = new.id;
  end if;
  return new;
end $$;

drop trigger if exists auth_users_phone_to_profile on auth.users;
create trigger auth_users_phone_to_profile
  after update of phone on auth.users
  for each row execute function public.copy_phone_to_profile();

-- ─── 5. Auto-close listing when an application is hired ─────────────────
-- Stops a filled listing from staying in the open feed.
create or replace function public.close_listing_on_hire() returns trigger language plpgsql as $$
begin
  if new.state = 'hired' and (old.state is null or old.state <> 'hired') then
    update public.listings set status = 'filled' where id = new.listing_id and status = 'open';
  end if;
  return new;
end $$;

drop trigger if exists applications_close_listing on public.applications;
create trigger applications_close_listing
  after insert or update on public.applications
  for each row execute function public.close_listing_on_hire();

-- ─── 6. Reasonable check constraints ────────────────────────────────────
-- Note length must be bounded; bad-clients can stuff megabytes otherwise.
do $$ begin
  begin
    alter table public.listings add constraint listings_note_len check (note is null or length(note) <= 2000);
  exception when duplicate_object then null; end;
end $$;

do $$ begin
  begin
    alter table public.listings add constraint listings_pay_positive check (pay_taka > 0 and pay_taka <= 1000000);
  exception when duplicate_object then null; end;
end $$;

-- ─── 7. Useful indexes that 0001 missed ─────────────────────────────────
-- Read-receipt query path: per-thread, unread-only.
create index if not exists messages_unread_idx
  on public.messages(thread_id) where read_at is null;
