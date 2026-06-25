
-- Roles
create type public.app_role as enum ('admin');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  created_at timestamptz not null default now()
);
grant select, insert, update on public.profiles to authenticated;
grant all on public.profiles to service_role;
alter table public.profiles enable row level security;
create policy "users read own profile" on public.profiles for select to authenticated using (auth.uid() = id);
create policy "users update own profile" on public.profiles for update to authenticated using (auth.uid() = id);
create policy "users insert own profile" on public.profiles for insert to authenticated with check (auth.uid() = id);

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role app_role not null,
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

create policy "users see own roles" on public.user_roles for select to authenticated using (user_id = auth.uid());
create policy "admins see all roles" on public.user_roles for select to authenticated using (public.has_role(auth.uid(),'admin'));

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', new.email));
  return new;
end; $$;
create trigger on_auth_user_created
  after insert on auth.users for each row execute function public.handle_new_user();

-- Submissions
create table public.submissions (
  id uuid primary key default gen_random_uuid(),
  session_id text not null,
  full_name text not null,
  school_name text not null,
  standard int,
  category text not null check (category in ('junior','senior')),
  round int not null default 1,
  score int not null default 0,
  total int not null default 0,
  time_taken_seconds int not null default 0,
  reason text not null default 'completed',
  flag_count int not null default 0,
  submitted_at timestamptz not null default now()
);
grant insert on public.submissions to anon, authenticated;
grant select, update, delete on public.submissions to authenticated;
grant all on public.submissions to service_role;
alter table public.submissions enable row level security;
create policy "anyone can submit" on public.submissions for insert to anon, authenticated with check (true);
create policy "admins read submissions" on public.submissions for select to authenticated using (public.has_role(auth.uid(),'admin'));
create policy "admins update submissions" on public.submissions for update to authenticated using (public.has_role(auth.uid(),'admin'));
create index submissions_category_round_score_idx on public.submissions (category, round, score desc, time_taken_seconds asc);

-- Proctor events
create table public.proctor_events (
  id uuid primary key default gen_random_uuid(),
  session_id text not null,
  submission_id uuid references public.submissions(id) on delete cascade,
  type text not null,
  question_number int,
  occurred_at timestamptz not null default now()
);
grant insert on public.proctor_events to anon, authenticated;
grant select, delete on public.proctor_events to authenticated;
grant all on public.proctor_events to service_role;
alter table public.proctor_events enable row level security;
create policy "anyone can log events" on public.proctor_events for insert to anon, authenticated with check (true);
create policy "admins read events" on public.proctor_events for select to authenticated using (public.has_role(auth.uid(),'admin'));

-- Active sessions for live monitoring
create table public.active_sessions (
  session_id text primary key,
  full_name text not null,
  school_name text,
  standard int,
  category text not null,
  snapshot_path text,
  started_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now()
);
grant insert, update, delete on public.active_sessions to anon, authenticated;
grant select on public.active_sessions to authenticated;
grant all on public.active_sessions to service_role;
alter table public.active_sessions enable row level security;
create policy "anyone upsert own session" on public.active_sessions for insert to anon, authenticated with check (true);
create policy "anyone update own session" on public.active_sessions for update to anon, authenticated using (true);
create policy "anyone delete own session" on public.active_sessions for delete to anon, authenticated using (true);
create policy "admins read sessions" on public.active_sessions for select to authenticated using (public.has_role(auth.uid(),'admin'));

-- Access codes
create table public.access_codes (
  code text primary key,
  school_name text,
  enabled boolean not null default true,
  created_at timestamptz not null default now()
);
grant select on public.access_codes to anon, authenticated;
grant all on public.access_codes to service_role;
grant insert, update, delete on public.access_codes to authenticated;
alter table public.access_codes enable row level security;
create policy "anyone read enabled codes" on public.access_codes for select to anon, authenticated using (enabled = true);
create policy "admins manage codes" on public.access_codes for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

insert into public.access_codes (code, school_name) values ('EDISON2026','Default School');
