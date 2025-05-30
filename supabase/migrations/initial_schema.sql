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