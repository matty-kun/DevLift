import React, { useEffect, useState } from 'react';
import BackButton from '../../components/common/BackButton';
import { Bell, BookOpen, ClipboardList, Star, ArrowRightLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Avatar from '../../components/common/Avatar';
import ProjectCard from '../../components/projects/ProjectCard';
import { Project } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

// Helpers to map DB to UI
const mapStatus = (s: string | null): Project['status'] => {
  if (!s) return 'open';
  if (s === 'in_progress') return 'in-progress';
  if (s === 'completed') return 'completed';
  return 'open';
};
// defaultImage no longer needed; ProjectCard handles robust fallbacks

type ProjectRow = {
  id: string;
  title: string;
  description: string;
  mentor_id: string;
  status: 'open' | 'in_progress' | 'completed' | null;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration_weeks: number | null;
  max_students: number | null;
  header_image_url?: string | null;
  created_at: string;
};
type ProjectSkillRow = {
  project_id: string;
  skills: { name: string } | null;
};
type ApplicationRow = {
  project_id: string;
  student_id: string | null;
  status: 'pending' | 'accepted' | 'rejected';
};

const resources = [
  {
    name: 'freeCodeCamp',
    url: 'https://www.freecodecamp.org/',
    description: 'Interactive coding lessons and projects for web development, data science, and more.',
    color: 'cyan',
  },
  {
    name: 'MDN Web Docs',
    url: 'https://developer.mozilla.org/',
    description: 'Comprehensive documentation and guides for HTML, CSS, JavaScript, and web APIs.',
    color: 'purple',
  },
  {
    name: 'Fireship (YouTube)',
    url: 'https://www.youtube.com/c/Fireship',
    description: 'High-energy, concise programming tutorials and tech overviews.',
    color: 'orange',
  },
];

const StudentDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { session, profile, signOut, loading: authLoading } = useAuth();

  const [applications, setApplications] = useState<Project[]>([]);
  const [assignedProjects, setAssignedProjects] = useState<Project[]>([]);
  const [studentSkills, setStudentSkills] = useState<string[]>([]);
  const [recentActivity, setRecentActivity] = useState<string[]>([]);
  const displayName = profile?.full_name || session?.user?.email || 'Student';
  const avatarSrc = profile?.avatar_url || 'https://api.dicebear.com/7.x/identicon/svg?seed=student';
  const studentId = session?.user?.id; // Get the current user's ID

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !session) {
      navigate('/sign-in', { replace: true });
    }
  }, [authLoading, session, navigate]);

  // Load applications and assigned projects for this student
  useEffect(() => {
    const load = async () => {
      if (!session?.user?.id) return;
      const uid = session.user.id;

      // Get all applications by this student
      const { data: apps, error: appsErr } = await supabase
        .from('applications')
        .select('project_id, student_id, status')
        .eq('student_id', uid);
      if (appsErr) {
        console.error(appsErr);
        return;
      }

      const appRows = (apps as ApplicationRow[] | null) ?? [];
      const projectIds = Array.from(new Set(appRows.map(a => a.project_id))).filter(Boolean) as string[];
      const acceptedIds = new Set(appRows.filter(a => a.status === 'accepted').map(a => a.project_id));

      if (projectIds.length === 0) {
        setApplications([]);
        setAssignedProjects([]);
        setStudentSkills([]);
        setRecentActivity([]);
        return;
      }

      // Fetch projects
      const { data: proj, error: projErr } = await supabase
        .from('projects')
        .select('id, title, description, mentor_id, status, difficulty, duration_weeks, max_students, header_image_url, created_at')
        .in('id', projectIds);
      if (projErr) {
        console.error(projErr);
        return;
      }
      const rows: ProjectRow[] = (proj as ProjectRow[] | null) ?? [];

      // Skills per project
      const skillsMap = new Map<string, string[]>();
      const { data: ps } = await supabase
        .from('project_skills')
        .select('project_id, skills(name)')
        .in('project_id', projectIds);
      (ps as ProjectSkillRow[] | null)?.forEach((row) => {
        const name = row.skills?.name;
        if (!name) return;
        const list = skillsMap.get(row.project_id) ?? [];
        list.push(name);
        skillsMap.set(row.project_id, list);
      });

      // For counts
      const acceptedMap = new Map<string, string[]>();
      const applicantsMap = new Map<string, string[]>();
      const { data: appsAll } = await supabase
        .from('applications')
        .select('project_id, student_id, status')
        .in('project_id', projectIds);
      (appsAll as ApplicationRow[] | null)?.forEach((a) => {
        const pid = a.project_id;
        const sid = a.student_id ?? '';
        const applicants = applicantsMap.get(pid) ?? [];
        applicants.push(sid);
        applicantsMap.set(pid, applicants);
        if (a.status === 'accepted') {
          const acc = acceptedMap.get(pid) ?? [];
          acc.push(sid);
          acceptedMap.set(pid, acc);
        }
      });

      const mapped: Project[] = rows.map((r) => ({
        id: r.id,
        title: r.title,
        description: r.description,
        mentorId: r.mentor_id,
        skills: skillsMap.get(r.id) ?? [],
        duration: `${r.duration_weeks ?? 0} weeks`,
        status: mapStatus(r.status),
        difficulty: r.difficulty,
        maxStudents: r.max_students ?? 0,
        assignedStudents: acceptedMap.get(r.id) ?? [],
        applicants: applicantsMap.get(r.id) ?? [],
        createdAt: new Date(r.created_at),
        imageUrl: r.header_image_url ?? '',
      }));

      setApplications(mapped);
      setAssignedProjects(mapped.filter(p => acceptedIds.has(p.id)));
      setStudentSkills(Array.from(new Set(mapped.flatMap(p => p.skills))).slice(0, 8));
      // Recent activity from application statuses
      const titleById = new Map(mapped.map(m => [m.id, m.title] as const));
      const activity = appRows.slice(-5).map((a) => {
        const title = titleById.get(a.project_id) || 'a project';
        if (a.status === 'accepted') return `You were accepted to "${title}"`;
        if (a.status === 'rejected') return `Your application was rejected for "${title}"`;
        return `You applied to "${title}"`;
      }).reverse();
      setRecentActivity(activity);
    };
    load();
  }, [session?.user?.id]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/sign-in', { replace: true });
  };

  const studentActionButtons = (
    <>
      <Link to="/projects" className="text-neutral-300 hover:text-custom-cyan transition-colors">
        Browse Projects
      </Link>
      <Link to="/resources" className="text-neutral-300 hover:text-custom-orange transition-colors">
        Learning Resources
      </Link>
      <Link to="/startups" className="text-neutral-300 hover:text-custom-purple transition-colors">
        Find Startups
      </Link>
    </>
  );

  return (
    <div className="bg-black min-h-screen flex flex-col">
      <main className="flex-1 px-4 py-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="flex items-start justify-between mb-8">
            <BackButton to={studentId ? `/students/${studentId}` : '/profile'} text="Back to Profile" />
            <div className="flex items-center gap-4">
              <Avatar src={avatarSrc} alt={displayName} size="lg" />
              <div>
                <h1 className="text-2xl font-bold text-custom-cyan">Welcome, {displayName}!</h1>
                <p className="text-neutral-400 text-sm">Here's your student dashboard.</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="relative bg-neutral-900 p-2 rounded-full hover:bg-neutral-800 transition-colors" aria-label="Notifications">
                <Bell className="h-6 w-6 text-custom-orange" />
                <span className="absolute top-1 right-1 h-2 w-2 bg-custom-orange rounded-full"></span>
              </button>
              <button onClick={handleSignOut} className="bg-neutral-900 text-red-400 border border-red-500/40 px-4 py-2 rounded hover:bg-red-500 hover:text-white transition-colors">
                Sign out
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <Card className="flex flex-col items-center" variant="hover">
              <ClipboardList className="h-8 w-8 text-custom-cyan mb-2" />
              <div className="text-2xl font-bold text-custom-cyan">{applications.length}</div>
              <div className="text-neutral-400">Applications</div>
            </Card>
            <Card className="flex flex-col items-center" variant="hover">
              <BookOpen className="h-8 w-8 text-custom-orange mb-2" />
              <div className="text-2xl font-bold text-custom-orange">{assignedProjects.length}</div>
              <div className="text-neutral-400">Assigned Projects</div>
            </Card>
            <Card className="flex flex-col items-center" variant="hover">
              <Star className="h-8 w-8 text-custom-purple mb-2" />
              <div className="flex flex-wrap gap-1 justify-center mb-1">
                {studentSkills.map((skill) => (
                  <Badge key={skill} variant="primary" size="sm">{skill}</Badge>
                ))}
              </div>
              <div className="text-neutral-400">Skills</div>
            </Card>
          </div>

          

          {/* Recent Activity */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-custom-cyan">Recent Activity</h2>
            <ul className="bg-neutral-900 rounded-lg p-6 text-neutral-300 space-y-2">
              {recentActivity.length === 0 ? (
                <li className="text-neutral-500">No recent activity yet.</li>
              ) : (
                recentActivity.map((activity, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="h-2 w-2 bg-custom-cyan rounded-full inline-block"></span>
                    {activity}
                  </li>
                ))
              )}
            </ul>
          </div>

          {/* My Applications */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-custom-cyan">My Applications</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {applications.length === 0 ? (
                <Card className="text-neutral-400">You haven't applied to any projects yet.</Card>
              ) : (
                applications.map((project) => (
                  <ProjectCard key={project.id} project={project} ctaLabel="Open Project" />
                ))
              )}
            </div>
          </div>

          {/* Assigned Projects */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-custom-cyan">Assigned Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {assignedProjects.length === 0 ? (
                <Card className="text-neutral-400">No projects assigned yet.</Card>
              ) : (
                assignedProjects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))
              )}
            </div>
          </div>

          {/* Resources */}
          <div>
            <h2 className="text-xl font-semibold mb-4 text-custom-cyan">Resources for Students</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {resources.map((res) => (
                <Card key={res.name} className="h-full text-white border border-custom-cyan hover:shadow-lg hover:-translate-y-2 transition-all duration-200">
                  <a href={res.url} target="_blank" rel="noopener noreferrer" className="block">
                    <h3 className={`text-xl font-bold mb-1 ${res.color === 'cyan' ? 'text-custom-cyan' : res.color === 'purple' ? 'text-custom-purple' : 'text-custom-orange'}`}>{res.name}</h3>
                    <p className="text-neutral-300">{res.description}</p>
                  </a>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;