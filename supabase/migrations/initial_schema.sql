/* 
    # Initial Schema Setup

    1. Tables
        - users
            - Custom user data extending auth.users
        - projects
            - Project listings with details and requirements
        - applications
            - Student application for projects
        - project_skills
            - Skills required for projects
        - user_skills
            - Skills possessed by users
        - messages
            - Communication between users

    2. Security
        - Enable Row-Level Security (RLS) on all tables
        - Set up policies for data access 
*/

-- Create custom types
CREATE TYPE user_role AS ENUM ('student', 'mentor');
CREATE TYPE project_status AS ENUM ('open', 'in_progress', 'completed');
CREATE TYPE project_difficulty AS ENUM ('beginner', 'intermediate', 'advanced');
CREATE TYPE application_status AS ENUM ('pending', 'accepted', 'rejected');

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id uuid PRIMARY KEY REFERENCES auth.users(id),
    role user_role NOT NULL,
    full_name text NOT NULL,
    avatar_url text,
    bio text,
    location text,
    company text,
    position text,
    website text,
    linkedin_url text,
    github_url text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title text NOT NULL,
    description text NOT NULL,
    mentor_id uuid NOT NULL REFERENCES users(id),
    status project_status DEFAULT 'open',
    difficulty project_difficulty NOT NULL,
)