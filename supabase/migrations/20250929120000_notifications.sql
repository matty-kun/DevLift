-- Notifications system: table, policies, and triggers
-- idempotent-ish: use IF NOT EXISTS where possible

-- prereq extension for gen_random_uuid
create extension if not exists pgcrypto;

-- 1) Table
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade, -- recipient
  actor_id uuid references public.users(id) on delete set null, -- who caused the event
  type text not null, -- e.g., application_created, application_accepted, project_completed, review_received
  payload jsonb not null default '{}'::jsonb,
  read_at timestamptz null,
  created_at timestamptz not null default now()
);

create index if not exists idx_notifications_user_created on public.notifications(user_id, created_at desc);
create index if not exists idx_notifications_unread on public.notifications(user_id) where read_at is null;

-- 2) RLS: Only recipient can read/update. Inserts come from SECURITY DEFINER functions only.
alter table public.notifications enable row level security;

do $$ begin
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'notifications' and policyname = 'select_own_notifications'
  ) then
    create policy select_own_notifications on public.notifications for select
      using (auth.uid() = user_id);
  end if;
end $$;

do $$ begin
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'notifications' and policyname = 'update_own_notifications'
  ) then
    create policy update_own_notifications on public.notifications for update
      using (auth.uid() = user_id)
      with check (auth.uid() = user_id);
  end if;
end $$;

-- DO NOT allow client inserts; triggers will insert with SECURITY DEFINER

-- 3) Helper to create a notification (SECURITY DEFINER)
create or replace function public._notify(
  p_user_id uuid,
  p_actor_id uuid,
  p_type text,
  p_payload jsonb
) returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.notifications (user_id, actor_id, type, payload)
  values (p_user_id, p_actor_id, p_type, coalesce(p_payload, '{}'::jsonb));
end;
$$;

revoke all on function public._notify(uuid, uuid, text, jsonb) from public;
grant execute on function public._notify(uuid, uuid, text, jsonb) to postgres, service_role; -- only internal callers

-- 4) Triggers for domain events

-- a) New application -> notify project mentor
create or replace function public.notify_on_application_insert()
returns trigger language plpgsql security definer set search_path = public as $$
declare v_mentor uuid; begin
  select mentor_id into v_mentor from public.projects where id = new.project_id;
  if v_mentor is not null then
    perform public._notify(v_mentor, new.student_id, 'application_created', jsonb_build_object('project_id', new.project_id, 'application_id', new.id));
  end if;
  return new;
end; $$;

drop trigger if exists trg_notify_on_application_insert on public.applications;
create trigger trg_notify_on_application_insert
after insert on public.applications
for each row execute procedure public.notify_on_application_insert();

-- b) Application status change -> notify student (accepted/rejected)
create or replace function public.notify_on_application_update()
returns trigger language plpgsql security definer set search_path = public as $$
declare v_mentor uuid; begin
  if tg_op = 'UPDATE' and new.status is distinct from old.status then
    select mentor_id into v_mentor from public.projects where id = new.project_id;
    if new.status = 'accepted' then
      perform public._notify(new.student_id, v_mentor, 'application_accepted', jsonb_build_object('project_id', new.project_id, 'application_id', new.id));
    elsif new.status = 'rejected' then
      perform public._notify(new.student_id, v_mentor, 'application_rejected', jsonb_build_object('project_id', new.project_id, 'application_id', new.id));
    end if;
  end if;
  return new;
end; $$;

drop trigger if exists trg_notify_on_application_update on public.applications;
create trigger trg_notify_on_application_update
after update on public.applications
for each row execute procedure public.notify_on_application_update();

-- c) Project marked completed -> notify accepted students
create or replace function public.notify_on_project_completed()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if tg_op = 'UPDATE' and old.status is distinct from new.status and new.status = 'completed' then
    insert into public.notifications (user_id, actor_id, type, payload)
    select a.student_id, new.mentor_id, 'project_completed', jsonb_build_object('project_id', new.id)
    from public.applications a
    where a.project_id = new.id and a.status = 'accepted' and a.student_id is not null;
  end if;
  return new;
end; $$;

drop trigger if exists trg_notify_on_project_completed on public.projects;
create trigger trg_notify_on_project_completed
after update on public.projects
for each row execute procedure public.notify_on_project_completed();

-- d) Review received -> notify reviewee
create or replace function public.notify_on_review_insert()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  perform public._notify(new.reviewee_id, new.reviewer_id, 'review_received', jsonb_build_object('project_id', new.project_id, 'review_id', new.id));
  return new;
end; $$;

drop trigger if exists trg_notify_on_review_insert on public.reviews;
create trigger trg_notify_on_review_insert
after insert on public.reviews
for each row execute procedure public.notify_on_review_insert();

-- 5) Realtime publication
do $$ begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
    if not exists (
      select 1 from pg_publication_tables where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'notifications'
    ) then
      alter publication supabase_realtime add table public.notifications;
    end if;
  end if;
end $$;
