-- Storage buckets.
--
-- `avatars` — public read, owner-write. URLs are usable directly in <img>.
-- `verification-docs` — private. Signed URLs only, generated server-side
-- for the admin review queue.

insert into storage.buckets (id, name, public)
  values ('avatars', 'avatars', true)
  on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
  values ('verification-docs', 'verification-docs', false)
  on conflict (id) do nothing;

-- Avatars: owners can write, world can read.
create policy "avatars insert own"
  on storage.objects for insert
  with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "avatars update own"
  on storage.objects for update
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "avatars delete own"
  on storage.objects for delete
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "avatars public read"
  on storage.objects for select
  using (bucket_id = 'avatars');

-- Verification docs: owner write, owner read. Admins read via service role.
create policy "verif insert own"
  on storage.objects for insert
  with check (bucket_id = 'verification-docs' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "verif read own"
  on storage.objects for select
  using (bucket_id = 'verification-docs' and (storage.foldername(name))[1] = auth.uid()::text);
