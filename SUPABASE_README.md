=========== .env code =========

VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=








============== SUPABASE SQL EDITOR CODE =============
--
-- File: Supabase Schema.sql
-- Description: This script sets up a complete schema for a project collaboration platform.
-- It includes enums, tables, row-level security (RLS) policies, triggers, and a
-- function to automatically create a user profile on signup.
--
-- This version addresses a syntax issue by removing the "IF NOT EXISTS"
-- clause from CREATE POLICY statements, as this is not supported by PostgreSQL.
-- It also adds `DROP POLICY IF EXISTS` to prevent errors when re-running the script.
--

-- ====================
-- ENUMS
-- ====================
-- Create custom enum types if they don't already exist.
-- This is done in a transaction block to ensure atomicity.

do $$
begin
  if not exists (select 1 from pg_type where typname='user_role') then
    create type user_role as enum ('student','mentor','founder');
  end if;
end $$;

do $$
begin
  if not exists (select 1 from pg_type where typname='project_status') then
    create type project_status as enum ('open','in_progress','completed');
  end if;
end $$;

do $$
begin
  if not exists (select 1 from pg_type where typname='project_difficulty') then
    create type project_difficulty as enum ('beginner','intermediate','advanced');
  end if;
end $$;

do $$
begin
  if not exists (select 1 from pg_type where typname='application_status') then
    create type application_status as enum ('pending','accepted','rejected');
  end if;
end $$;

-- ====================
-- TABLES
-- ====================

--
-- Table: public.users
-- This table extends the `auth.users` table with additional profile information.
--
create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  role user_role not null default 'student',
  full_name text,
  avatar_url text,
  bio text,
  location text,
  company text,
  position text,
  website text,
  linkedin_url text,
  github_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

--
-- Table: public.projects
-- Stores project details, linking each project to a mentor.
--
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  mentor_id uuid not null references public.users(id) on delete cascade,
  status project_status not null default 'open',
  difficulty project_difficulty not null,
  duration_weeks integer not null default 0,
  max_students integer not null default 1,
  start_date date,
  deadline date,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

--
-- Table: public.skills
-- A list of available skills.
--
create table if not exists public.skills (
  id uuid primary key default gen_random_uuid(),
  name text unique not null,
  category text,
  created_at timestamptz default now()
);

--
-- Table: public.project_skills
-- A junction table to link projects with their required skills.
--
create table if not exists public.project_skills (
  project_id uuid not null references public.projects(id) on delete cascade,
  skill_id uuid not null references public.skills(id) on delete cascade,
  created_at timestamptz default now(),
  primary key (project_id, skill_id)
);

--
-- Table: public.applications
-- Stores applications from students to projects.
--
create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  student_id uuid not null references public.users(id) on delete cascade,
  cover_letter text,
  status application_status not null default 'pending',
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(project_id, student_id)
);

-- ====================
-- ROW-LEVEL SECURITY (RLS)
-- ====================
-- Enable RLS on all tables that require it.

alter table public.users enable row level security;
alter table public.projects enable row level security;
alter table public.skills enable row level security;
alter table public.project_skills enable row level security;
alter table public.applications enable row level security;

--
-- Policies
--
-- Drop policies before creating to allow for re-running the script.
drop policy if exists "Users can read all profiles" on public.users;
create policy "Users can read all profiles" on public.users for select to authenticated using (true);

drop policy if exists "Users can update own profile" on public.users;
create policy "Users can update own profile" on public.users for update to authenticated
  using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "Anyone can read projects" on public.projects;
create policy "Anyone can read projects" on public.projects for select to authenticated using (true);

drop policy if exists "Mentors or Founders can create projects" on public.projects;
create policy "Mentors or Founders can create projects" on public.projects for insert to authenticated
  with check (exists (select 1 from public.users u where u.id=auth.uid() and u.role in ('mentor','founder')));

drop policy if exists "Mentors update own projects" on public.projects;
create policy "Mentors update own projects" on public.projects for update to authenticated
  using (mentor_id = auth.uid()) with check (mentor_id = auth.uid());

drop policy if exists "Anyone can read skills" on public.skills;
create policy "Anyone can read skills" on public.skills for select to authenticated using (true);

drop policy if exists "Anyone can read project skills" on public.project_skills;
create policy "Anyone can read project skills" on public.project_skills for select to authenticated using (true);

drop policy if exists "Students create applications" on public.applications;
create policy "Students create applications" on public.applications for insert to authenticated
  with check (exists (select 1 from public.users u where u.id=auth.uid() and u.role='student'));

drop policy if exists "Users read relevant applications" on public.applications;
create policy "Users read relevant applications" on public.applications for select to authenticated
  using (
    student_id = auth.uid() or
    exists (
      select 1 from public.projects p
      where p.id = applications.project_id and p.mentor_id = auth.uid()
    )
  );

-- ====================
-- TRIGGERS
-- ====================

-- Function to update the `updated_at` timestamp on row modifications.
create or replace function public.update_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Apply the `update_updated_at` trigger to relevant tables.
drop trigger if exists update_users_updated_at on public.users;
create trigger update_users_updated_at before update on public.users
  for each row execute function public.update_updated_at();

drop trigger if exists update_projects_updated_at on public.projects;
create trigger update_projects_updated_at before update on public.projects
  for each row execute function public.update_updated_at();

drop trigger if exists update_applications_updated_at on public.applications;
create trigger update_applications_updated_at before update on public.applications
  for each row execute function public.update_updated_at();

-- ====================
-- FUNCTIONS
-- ====================

-- Function to handle new user signups by creating a corresponding profile.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path=public as $$
begin
  insert into public.users (id, role, full_name, avatar_url)
  values (
    new.id,
    case
      when new.raw_user_meta_data ? 'role' and (new.raw_user_meta_data->>'role') in ('student','mentor','founder')
      then (new.raw_user_meta_data->>'role')::user_role
      else 'student'
    end,
    nullif(new.raw_user_meta_data->>'full_name',''),
    nullif(new.raw_user_meta_data->>'avatar_url','')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

-- Apply the `handle_new_user` trigger to the `auth.users` table.
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- ====================
-- INDEXES
-- ====================
-- Create indexes to optimize query performance.

create index if not exists idx_projects_status on public.projects(status);
create index if not exists idx_projects_mentor_id on public.projects(mentor_id);
create index if not exists idx_applications_project_id on public.applications(project_id);
create index if not exists idx_applications_student_id on public.applications(student_id);
create index if not exists idx_project_skills_project_id on public.project_skills(project_id);

-- ====================
-- SEED DATA (OPTIONAL)
-- ====================
-- Insert some sample data to get started.

-- The seed data section has been updated with the user UUIDs you provided.
-- You can now run the following inserts to populate your tables.

insert into public.skills (name)
values ('React'), ('TypeScript'), ('Tailwind CSS'), ('D3.js'), ('Python'), ('NLP'),
       ('Machine Learning'), ('API Integration'), ('React Native'), ('Redux'), ('Firebase')
on conflict (name) do nothing;

-- Example of inserting a project with a hardcoded mentor ID.
insert into public.projects (id, title, description, mentor_id, status, difficulty, duration_weeks, max_students)
values (
  '12345678-1234-5678-1234-567812345678', -- Hardcoded UUID for the project
  'Sample Project',
  'Build a modern web app using React + Supabase.',
  '0ce7fcd1-3ebe-471f-9898-b2cb7a81e725', -- Replace with your actual mentor UUID
  'open',
  'intermediate',
  8,
  3
)
on conflict (id) do nothing;

with p as (select id from public.projects where id = '12345678-1234-5678-1234-567812345678'),
s as (select id from public.skills where name in ('React','TypeScript','Tailwind CSS'))
insert into public.project_skills (project_id, skill_id)
select p.id, s.id from p cross join s
on conflict do nothing;

-- Create a few more skills if they don't exist
insert into public.skills (name)
values ('Supabase'), ('PostgreSQL'), ('UI/UX Design'), ('Testing'), ('Node.js')
on conflict (name) do nothing;

-- Insert a few more projects with different mentors
insert into public.projects (title, description, mentor_id, status, difficulty, duration_weeks, max_students)
values
  ('AI Chatbot with NLP', 'Develop a simple chatbot using Python and a machine learning model.', '0ce7fcd1-3ebe-471f-9898-b2cb7a81e725', 'in_progress', 'advanced', 12, 1),
  ('E-commerce Website', 'Create a full-stack e-commerce site with React and Supabase.', '55d45a4c-2791-404b-9f01-9af83d081cb4', 'open', 'intermediate', 10, 2),
  ('Mobile App with React Native', 'Build a cross-platform mobile app for tracking habits.', '0ce7fcd1-3ebe-471f-9898-b2cb7a81e725', 'completed', 'beginner', 6, 1)
on conflict do nothing;

-- Add skills to the new projects
with projects as (select id, title from public.projects where title in ('AI Chatbot with NLP', 'E-commerce Website', 'Mobile App with React Native')),
     skills_nlp as (select id from public.skills where name in ('Python', 'NLP', 'Machine Learning')),
     skills_ecommerce as (select id from public.skills where name in ('React', 'TypeScript', 'Supabase')),
     skills_mobile as (select id from public.skills where name in ('React Native'))
insert into public.project_skills (project_id, skill_id)
select p.id, s.id from projects p cross join skills_nlp s where p.title = 'AI Chatbot with NLP'
union all
select p.id, s.id from projects p cross join skills_ecommerce s where p.title = 'E-commerce Website'
union all
select p.id, s.id from projects p cross join skills_mobile s where p.title = 'Mobile App with React Native'
on conflict do nothing;

-- Insert applications from a student to various projects
with project1 as (select id from public.projects where title = 'AI Chatbot with NLP'),
     project2 as (select id from public.projects where title = 'E-commerce Website')
insert into public.applications (project_id, student_id, cover_letter, status)
values
  ((select id from project1), 'e7f2fcaf-66ba-4b8e-b042-5d3d85de80c9', 'I am very interested in AI and have some experience with Python and ML.', 'pending'),
  ((select id from project2), 'e7f2fcaf-66ba-4b8e-b042-5d3d85de80c9', 'I am a passionate React developer and would love to work on a full-stack project.', 'accepted')
on conflict do nothing;



