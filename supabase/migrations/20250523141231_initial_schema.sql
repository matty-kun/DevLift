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
    duration_weeks integer NOT NULL,
    max_students integer NOT NULL,
    start_date date,
    deadline date,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Create applications table
CREATE TABLE IF NOT EXISTS applications (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
    student_id uuid REFERENCES users(id) ON DELETE CASCADE,
    cover_letter text NOT NULL,
    status application_status DEFAULT 'pending',
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    UNIQUE(project_id, student_id)
);

-- Create skills table
CREATE TABLE IF NOT EXISTS skills (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text UNIQUE NOT NULL,
    category text,
    created_at timestamptz DEFAULT now()
);

-- Create projects_skills junction table
CREATE TABLE IF NOT EXISTS project_skills (
    project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
    skill_id uuid REFERENCES skills(id) ON DELETE CASCADE,
    created_at timestamptz DEFAULT now(),
    PRIMARY KEY (project_id, skill_id)
);

-- Create users_skills junction table
CREATE TABLE IF NOT EXISTS user_skills (
    user_id uuid REFERENCES users(id) ON DELETE CASCADE,
    skill_id uuid REFERENCES skills(id) ON DELETE CASCADE,
    proficiency integer CHECK (proficiency BETWEEN 1 AND 5),
    created_at timestamptz DEFAULT now(),
    PRIMARY KEY (user_id, skill_id)
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_id uuid REFERENCES users(id) ON DELETE CASCADE,
    receiver_id uuid REFERENCES users(id) ON DELETE CASCADE,
    content text NOT NULL,
    read boolean DEFAULT false,
    created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Users Policies
CREATE POLICY "Users can read all profiles"
    ON users FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Users can update own profile"
    ON users FOR UPDATE
    TO authenticated
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Projects policies
CREATE POLICY "Anyone can read projects"
    ON projects FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Mentors can create projects"
    ON projects FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM users
            WHERE id = auth.uid()
            AND role = 'mentor'
        )
    );

CREATE POLICY "Mentors can update own projects"
    ON projects FOR UPDATE 
    TO authenticated
    USING (mentor_id = auth.uid())
    WITH CHECK (mentor_id = auth.uid());

-- Applications policies
CREATE POLICY "Student can create applications"
    ON applications FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM users
            WHERE id = auth.uid()
            AND role = 'student'
        )
    );

CREATE POLICY "Users can read relevant applications"
     ON applications FOR SELECT
     TO authenticated
     USING (
        student_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM projects
            WHERE projects.id = applications.project_id
            AND projects.mentor_id = auth.uid()
        )
     );

-- Skills policies
CREATE POLICY "Anyone can read skills"
    ON skills FOR SELECT
    TO authenticated
    USING (true);

-- Project skills policies
CREATE POLICY "Anyone can read project skills"
    ON project_skills FOR SELECT
    TO authenticated
    USING (true);

-- User skills policies
CREATE POLICY "Anyone can read user skills"
    ON user_skills FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Users can manage own skills"
    ON user_skills FOR ALL 
    TO authenticated
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

-- Messages policies
CREATE POLICY "Users can read own messages"
    ON messages FOR SELECT
    TO authenticated
    USING (
        sender_id = auth.uid() OR
        receiver_id = auth.uid()
    );

CREATE POLICY "Users can send messages"
    ON messages FOR INSERT
    TO authenticated
    WITH CHECK (sender_id = auth.uid());

-- Create functions
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN 
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_projects_updated_at
    BEFORE UPDATE ON projects
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_applications_updated_at
    BEFORE UPDATE ON applications
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_mentor_id ON projects(mentor_id);
CREATE INDEX IF NOT EXISTS idx_applications_project_id ON applications(project_id);
CREATE INDEX IF NOT EXISTS idx_applications_student_id ON applications(student_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_receiver_id ON messages(receiver_id);
CREATE INDEX IF NOT EXISTS idx_user_skills_user_id ON user_skills(user_id);
CREATE INDEX IF NOT EXISTS idx_project_skills_project_id ON project_skills(project_id);
