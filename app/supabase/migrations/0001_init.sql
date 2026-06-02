-- Tution Media — initial schema.
-- Run via the Supabase SQL editor, or `supabase db push` if using the CLI.
--
-- Conventions:
--   - All ids are uuid.
--   - All timestamps are timestamptz default now().
--   - Foreign keys cascade on delete where the child has no meaning without the
--     parent; restrict where audit history must survive.
--   - Row Level Security is enabled on every user-facing table. See 0002_rls.sql.

create extension if not exists "uuid-ossp";

-- ─── Profiles (extends auth.users) ──────────────────────────────────────
-- One row per Supabase auth user. Holds display info, primary role, and the
-- pieces shared between tutor and guardian variants.
create table public.profiles (
  id              uuid primary key references auth.users(id) on delete cascade,
  phone           text,                       -- denormalized from auth.users for filtering
  display_name    text not null,
  avatar_url      text,
  area            text,                       -- e.g. 'Dhanmondi'
  primary_role    text not null check (primary_role in ('tutor','guardian')),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index profiles_role_idx on public.profiles(primary_role);

-- ─── Tutor profile ───────────────────────────────────────────────────────
create table public.tutor_profiles (
  id              uuid primary key references public.profiles(id) on delete cascade,
  institution     text,
  department      text,
  year_label      text,
  cgpa            numeric(3,2),
  subjects        text[]   not null default '{}',
  levels          text[]   not null default '{}',
  areas           text[]   not null default '{}',
  -- 7 rows (Sat–Fri) × 4 cols (morning/afternoon/evening/night) as int[][]
  availability    jsonb    not null default '[[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]]'::jsonb,
  verify_tier     int      not null default 0 check (verify_tier between 0 and 4),
  -- aggregated reputation, updated by triggers / nightly jobs
  rating          numeric(3,2) not null default 0,
  completed_hires int      not null default 0,
  months_taught   int      not null default 0,
  on_time_pct     int      not null default 100,
  retention_pct   int      not null default 0,
  earnings_cents  bigint   not null default 0,
  updated_at      timestamptz not null default now()
);

create index tutor_subjects_idx on public.tutor_profiles using gin(subjects);
create index tutor_areas_idx    on public.tutor_profiles using gin(areas);

-- ─── Guardian profile ────────────────────────────────────────────────────
create table public.guardian_profiles (
  id                  uuid primary key references public.profiles(id) on delete cascade,
  child_name          text,
  child_level         text,
  child_curriculum    text,
  updated_at          timestamptz not null default now()
);

-- ─── Listings (a guardian posts a tuition requirement) ──────────────────
create table public.listings (
  id              uuid primary key default uuid_generate_v4(),
  guardian_id     uuid not null references public.profiles(id) on delete cascade,
  area            text not null,
  level           text not null,
  curriculum      text not null,
  subjects        text[] not null default '{}',
  pay_cents       bigint not null,
  pay_unit        text   not null default 'mo' check (pay_unit in ('mo','class','hr')),
  days_label      text,                       -- '3 days/wk · 1.5 hr'
  time_window     text,                       -- 'Evenings · 6–9pm'
  gender_pref     text   not null default 'Any' check (gender_pref in ('Any','Male','Female')),
  note            text,
  status          text   not null default 'open' check (status in ('open','filled','closed')),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index listings_open_idx     on public.listings(status, created_at desc);
create index listings_area_idx     on public.listings(area);
create index listings_subjects_idx on public.listings using gin(subjects);

-- ─── Applications (tutor applies to a listing) ──────────────────────────
create table public.applications (
  id            uuid primary key default uuid_generate_v4(),
  listing_id    uuid not null references public.listings(id) on delete cascade,
  tutor_id      uuid not null references public.profiles(id) on delete cascade,
  state         text not null default 'applied' check (state in
                  ('applied','shortlisted','location-granted','trial-scheduled','hired','rejected','withdrawn')),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  unique (listing_id, tutor_id)              -- a tutor applies at most once per listing
);

create index applications_listing_idx on public.applications(listing_id);
create index applications_tutor_idx   on public.applications(tutor_id);

-- ─── Chat threads + messages ────────────────────────────────────────────
-- One thread per (guardian, tutor) pair, optionally scoped to a listing.
create table public.chat_threads (
  id            uuid primary key default uuid_generate_v4(),
  guardian_id   uuid not null references public.profiles(id) on delete cascade,
  tutor_id      uuid not null references public.profiles(id) on delete cascade,
  listing_id    uuid references public.listings(id) on delete set null,
  created_at    timestamptz not null default now(),
  last_msg_at   timestamptz not null default now(),
  unique (guardian_id, tutor_id, listing_id)
);

create index chat_threads_guardian_idx on public.chat_threads(guardian_id, last_msg_at desc);
create index chat_threads_tutor_idx    on public.chat_threads(tutor_id, last_msg_at desc);

create table public.messages (
  id            uuid primary key default uuid_generate_v4(),
  thread_id     uuid not null references public.chat_threads(id) on delete cascade,
  sender_id     uuid not null references public.profiles(id) on delete cascade,
  body          text not null check (length(body) between 1 and 4000),
  created_at    timestamptz not null default now(),
  read_at       timestamptz
);

create index messages_thread_idx on public.messages(thread_id, created_at);

-- Bump thread.last_msg_at on insert so inbox sort works without an aggregation.
create or replace function public.bump_thread_last_msg() returns trigger language plpgsql as $$
begin
  update public.chat_threads set last_msg_at = new.created_at where id = new.thread_id;
  return new;
end $$;
create trigger messages_bump_thread after insert on public.messages
  for each row execute function public.bump_thread_last_msg();

-- ─── Classes (scheduled lessons after hire) ─────────────────────────────
create table public.classes (
  id                uuid primary key default uuid_generate_v4(),
  tutor_id          uuid not null references public.profiles(id) on delete cascade,
  guardian_id       uuid not null references public.profiles(id) on delete cascade,
  listing_id        uuid references public.listings(id) on delete set null,
  student_name      text not null,             -- denormalized for display
  subject_label     text not null,
  area              text not null,
  scheduled_at      timestamptz not null,
  duration_min      int  not null default 60,
  pay_cents         bigint not null default 0,
  state             text not null default 'upcoming' check (state in
                      ('upcoming','completed','cancelled','no-show')),
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create index classes_tutor_when_idx    on public.classes(tutor_id, scheduled_at);
create index classes_guardian_when_idx on public.classes(guardian_id, scheduled_at);

-- ─── Student check-in (anonymous to the tutor) ──────────────────────────
-- Insert-only; never updated. RLS denies SELECT for the tutor (see 0002).
create table public.student_feedback (
  id            uuid primary key default uuid_generate_v4(),
  class_id      uuid not null references public.classes(id) on delete cascade,
  mood          int not null check (mood between 1 and 5),
  tags          text[] not null default '{}',
  comment       text check (length(comment) <= 1000),
  created_at    timestamptz not null default now()
);

create index student_feedback_class_idx on public.student_feedback(class_id);

-- ─── Verifications (uploaded documents awaiting human review) ───────────
create table public.verifications (
  id            uuid primary key default uuid_generate_v4(),
  tutor_id      uuid not null references public.profiles(id) on delete cascade,
  tier          int  not null check (tier between 1 and 3),  -- 0 (phone) is automatic
  document_url  text,                                         -- supabase storage path
  status        text not null default 'pending' check (status in ('pending','approved','rejected')),
  reviewer_note text,
  created_at    timestamptz not null default now(),
  reviewed_at   timestamptz
);

create index verifications_pending_idx on public.verifications(status, created_at) where status = 'pending';

-- ─── Push device tokens (for FCM/APNs once wired) ───────────────────────
create table public.device_tokens (
  id            uuid primary key default uuid_generate_v4(),
  user_id       uuid not null references public.profiles(id) on delete cascade,
  platform      text not null check (platform in ('web','ios','android')),
  token         text not null,
  created_at    timestamptz not null default now(),
  unique (user_id, token)
);

-- ─── updated_at autotouchers ────────────────────────────────────────────
create or replace function public.touch_updated_at() returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;

create trigger touch_profiles_u            before update on public.profiles
  for each row execute function public.touch_updated_at();
create trigger touch_tutor_profiles_u      before update on public.tutor_profiles
  for each row execute function public.touch_updated_at();
create trigger touch_guardian_profiles_u   before update on public.guardian_profiles
  for each row execute function public.touch_updated_at();
create trigger touch_listings_u            before update on public.listings
  for each row execute function public.touch_updated_at();
create trigger touch_applications_u        before update on public.applications
  for each row execute function public.touch_updated_at();
create trigger touch_classes_u             before update on public.classes
  for each row execute function public.touch_updated_at();
