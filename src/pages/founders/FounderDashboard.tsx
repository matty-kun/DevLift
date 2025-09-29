import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Modal from '../../components/common/Modal';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import LoadingScreen from '../../components/common/LoadingScreen';
import FounderProjectCard from '../../components/founders/FounderProjectCard';

const encouragingMessages = [
  "The secret of getting ahead is getting started.",
  "The best way to predict the future is to create it.",
  "Your work is going to fill a large part of your life, and the only way to be truly satisfied is to do what you believe is great work.",
  "Success is not final, failure is not fatal: it is the courage to continue that counts.",
  "Believe you can and you're halfway there.",
  "The only limit to our realization of tomorrow will be our doubts of today.",
  "The future belongs to those who believe in the beauty of their dreams.",
  "Build your own dreams, or someone else will hire you to build theirs.",
  "The journey of a thousand miles begins with a single step.",
  "What you get by achieving your goals is not as important as what you become by achieving your goals."
];

type ProjectRow = {
  id: string;
  title: string;
  status: 'open' | 'in_progress' | 'completed' | null;
  mentor_id: string;
  created_at: string;
};
type ApplicationRow = {
  project_id: string;
  student_id: string | null;
  status: 'pending' | 'accepted' | 'rejected';
  created_at?: string;
};

const FounderDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { session, profile, loading: authLoading } = useAuth();

  const [projects, setProjects] = useState<ProjectRow[]>([]);
  const [applications, setApplications] = useState<ApplicationRow[]>([]);
  const [recentActivity, setRecentActivity] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const founderName = useMemo(() => profile?.full_name || session?.user?.email?.split('@')[0] || 'Founder', [profile?.full_name, session?.user?.email]);

  const dailyMessage = useMemo(() => {
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).valueOf()) / 1000 / 60 / 60 / 24);
    return encouragingMessages[dayOfYear % encouragingMessages.length];
  }, []);

  useEffect(() => {
    if (!authLoading && !session) {
      navigate('/sign-in', { replace: true });
    }
  }, [authLoading, session, navigate]);

  useEffect(() => {
    const run = async () => {
      if (!session?.user?.id) return;
      setLoading(true);
      try {
        const uid = session.user.id;
        // Load founder's projects
        const { data: proj, error: perr } = await supabase
          .from('projects')
          .select('id, title, status, mentor_id, created_at')
          .eq('mentor_id', uid)
          .order('created_at', { ascending: false });
        if (perr) throw perr;
        const projRows: ProjectRow[] = (proj as ProjectRow[] | null) ?? [];
        setProjects(projRows);

        const ids = projRows.map(p => p.id);
        if (ids.length) {
          const { data: apps, error: aerr } = await supabase
            .from('applications')
            .select('project_id, student_id, status, created_at')
            .in('project_id', ids)
            .order('created_at', { ascending: false });
          if (aerr) throw aerr;
          const appRows: ApplicationRow[] = (apps as ApplicationRow[] | null) ?? [];
          setApplications(appRows);

          // Build recent activity (last 5 events)
          const titleById = new Map(projRows.map(p => [p.id, p.title] as const));
          const acts = appRows.slice(0, 5).map(a => {
            const t = titleById.get(a.project_id) || 'a project';
            if (a.status === 'accepted') return `A student was accepted to '${t}'`;
            if (a.status === 'rejected') return `An application was rejected for '${t}'`;
            return `A student applied to '${t}'`;
          });
          // Also include most recent project creation
          if (projRows[0]) acts.unshift(`You posted a new project: ${projRows[0].title}`);
          setRecentActivity(acts.slice(0, 5));
        } else {
          setApplications([]);
          setRecentActivity([]);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [session?.user?.id]);

  const projectsPosted = projects.length;
  const totalApplications = applications.length;
  const activeStudents = useMemo(() => {
    const s = new Set<string>();
    applications.forEach(a => { if (a.status === 'accepted' && a.student_id) s.add(a.student_id); });
    return s.size;
  }, [applications]);

  const applicantsPerProject = useMemo(() => {
    const map = new Map<string, number>();
    applications.forEach(a => map.set(a.project_id, (map.get(a.project_id) || 0) + 1));
    return map;
  }, [applications]);

  // Delete modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);

  const handleDeleteProject = async (projectId: string) => {
    setProjectToDelete(projectId);
    setShowDeleteModal(true);
  };

  const confirmDeleteProject = async () => {
    if (!projectToDelete) return;

    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectToDelete);

      if (error) {
        throw error;
      }

      setProjects(projects.filter(p => p.id !== projectToDelete));
      setShowDeleteModal(false);
      setProjectToDelete(null);
    } catch (error: unknown) {
      alert('Error deleting project: ' + (error as Error).message);
    }
  };

  if (loading || authLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="max-w-5xl mx-auto p-4 text-white">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Welcome, {founderName}!</h1>
        <p className="text-neutral-400 mt-1">{dailyMessage}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-neutral-900 rounded-lg p-6 shadow">
          <div className="text-2xl font-bold text-custom-cyan">{projectsPosted}</div>
          <div className="text-neutral-400">Projects Posted</div>
        </div>
        <div className="bg-neutral-900 rounded-lg p-6 shadow">
          <div className="text-2xl font-bold text-custom-orange">{totalApplications}</div>
          <div className="text-neutral-400">Applications</div>
        </div>
        <div className="bg-neutral-900 rounded-lg p-6 shadow">
          <div className="text-2xl font-bold text-custom-purple">{activeStudents}</div>
          <div className="text-neutral-400">Active Students</div>
        </div>
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

      {/* Your Projects */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-custom-cyan">Your Projects</h2>
        {projects.length === 0 ? (
          <div className="bg-neutral-900 rounded-lg p-6 text-center">
            <p className="text-neutral-400 mb-4">No projects posted yet.</p>
            <Link to="/founders/post-project" className="text-custom-cyan hover:underline font-semibold">
              Post your first project!
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <FounderProjectCard 
                key={project.id} 
                project={project} 
                applicantCount={applicantsPerProject.get(project.id) || 0}
                onDelete={handleDeleteProject}
              />
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} title="Confirm Deletion">
        <div className="mb-4">
          <p>Are you sure you want to delete the project "{projects.find(p => p.id === projectToDelete)?.title}"?</p>
          <p className="text-sm text-red-400 mt-2">This action cannot be undone.</p>
        </div>
        <div className="flex justify-end gap-4">
          <button
            className="bg-neutral-800 text-white px-4 py-2 rounded hover:bg-neutral-700 transition-colors"
            onClick={() => setShowDeleteModal(false)}
          >
            Cancel
          </button>
          <button
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-500 transition-colors"
            onClick={confirmDeleteProject}
          >
            Delete
          </button>
        </div>
      </Modal>

      {/* Resources */}
      <div>
        <h2 className="text-xl font-semibold mb-4 text-custom-cyan">Resources for Founders</h2>
        <div className="bg-neutral-900 rounded-lg p-6 flex flex-col sm:flex-row gap-4">
          <a
            href="#"
            className="text-custom-cyan hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            How to Write a Great Project Description
          </a>
          <a
            href="#"
            className="text-custom-purple hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Tips for Attracting Student Talent
          </a>
          <a
            href="#"
            className="text-custom-orange hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            FAQ for Startup Founders
          </a>
        </div>
      </div>
    </div>
  );
};

export default FounderDashboard;
