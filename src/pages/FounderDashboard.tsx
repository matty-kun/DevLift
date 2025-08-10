import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

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

const mapStatus = (s: ProjectRow['status']) => {
  if (s === 'in_progress') return 'In Progress';
  if (s === 'completed') return 'Completed';
  return 'Open';
};

const FounderDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { session, profile, signOut, loading: authLoading } = useAuth();

  const [projects, setProjects] = useState<ProjectRow[]>([]);
  const [applications, setApplications] = useState<ApplicationRow[]>([]);
  const [recentActivity, setRecentActivity] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const founderName = useMemo(() => profile?.full_name || session?.user?.email?.split('@')[0] || 'Founder', [profile?.full_name, session?.user?.email]);
  const avatarUrl = profile?.avatar_url || 'https://api.dicebear.com/7.x/identicon/svg?seed=founder';

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

  const handleSignOut = async () => { await signOut(); navigate('/sign-in', { replace: true }); };

  return (
    <div className="min-h-screen bg-black text-white px-4 py-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="bg-neutral-800 rounded-full p-2 overflow-hidden">
              {/* Avatar or placeholder icon */}
              {avatarUrl ? (
                <img src={avatarUrl} alt={founderName} className="h-8 w-8 rounded-full object-cover" />
              ) : (
                <User className="h-8 w-8 text-custom-cyan" />
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-custom-cyan">Welcome, {founderName}!</h1>
              <p className="text-neutral-400 text-sm">Here's your founder dashboard.</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative bg-neutral-900 p-2 rounded-full hover:bg-neutral-800 transition-colors" aria-label="Notifications">
              <Bell className="h-6 w-6 text-custom-orange" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-custom-orange rounded-full"></span>
            </button>
            <button onClick={handleSignOut} className="bg-neutral-900 text-red-400 border border-red-500/40 px-4 py-2 rounded hover:bg-red-500 hover:text-white transition-colors">Sign out</button>
          </div>
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

        {/* Quick Actions */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <Link
            to="/post-project"
            className="bg-gradient-to-r from-custom-cyan to-custom-purple text-black font-semibold px-6 py-3 rounded shadow hover:scale-105 transition-transform duration-200"
          >
            + Post New Project
          </Link>
          <Link
            to="/projects"
            className="bg-neutral-900 text-custom-cyan border border-custom-cyan px-6 py-3 rounded hover:bg-custom-cyan hover:text-black transition-colors duration-200"
          >
            View All Projects
          </Link>
          <Link
            to="/applications"
            className="bg-neutral-900 text-custom-orange border border-custom-orange px-6 py-3 rounded hover:bg-custom-orange hover:text-black transition-colors duration-200"
          >
            View Applications
          </Link>
        </div>

        {/* Recent Activity */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-custom-cyan">Recent Activity</h2>
          <ul className="bg-neutral-900 rounded-lg p-6 text-neutral-300 space-y-2">
            {loading ? (
              <li className="text-neutral-500">Loading…</li>
            ) : recentActivity.length === 0 ? (
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
          <div className="bg-neutral-900 rounded-lg p-6">
            {loading ? (
              <p className="text-neutral-400">Loading…</p>
            ) : projects.length === 0 ? (
              <p className="text-neutral-400">
                No projects posted yet.{" "}
                <Link to="/post-project" className="text-custom-cyan hover:underline">
                  Post your first project!
                </Link>
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-left">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 text-neutral-400">Project</th>
                      <th className="px-4 py-2 text-neutral-400">Status</th>
                      <th className="px-4 py-2 text-neutral-400">Applicants</th>
                      <th className="px-4 py-2 text-neutral-400">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projects.map((project) => {
                      const applicants = applicantsPerProject.get(project.id) || 0;
                      return (
                        <tr key={project.id} className="border-t border-neutral-800">
                          <td className="px-4 py-2">{project.title}</td>
                          <td className="px-4 py-2">
                            <span
                              className={`px-2 py-1 rounded text-xs font-semibold ${
                                mapStatus(project.status) === 'Open'
                                  ? 'bg-custom-cyan text-black'
                                  : 'bg-custom-purple text-white'
                              }`}
                            >
                              {mapStatus(project.status)}
                            </span>
                          </td>
                          <td className="px-4 py-2">{applicants}</td>
                          <td className="px-4 py-2 space-x-2">
                            <Link className="text-custom-cyan hover:underline" to={`/projects/${project.id}`}>View</Link>
                            <button className="text-custom-orange opacity-60 cursor-not-allowed">Edit</button>
                            <button className="text-red-500 opacity-60 cursor-not-allowed">Delete</button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

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
    </div>
  );
};

export default FounderDashboard;