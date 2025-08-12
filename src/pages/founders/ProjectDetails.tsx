import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Avatar from '../../components/common/Avatar';
import { Project } from '../../types';
import { supabase } from '../../lib/supabase';

type ProjectRow = {
  id: string;
  title: string;
  description: string;
  mentor_id: string;
  status: 'open' | 'in_progress' | 'completed' | null;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration_weeks: number | null;
  max_students: number | null;
  created_at: string;
};

type ProjectSkillRow = { project_id: string; skills: { name: string } | null };
type ApplicationRow = { status: 'pending' | 'accepted' | 'rejected'; student_id: string | null };
type UserProfile = { full_name: string | null; avatar_url: string | null } | null;

const mapStatus = (s: string | null): Project['status'] => {
  if (!s) return 'open';
  if (s === 'in_progress') return 'in-progress';
  if (s === 'completed') return 'completed';
  return 'open';
};

const defaultImage = (title: string) =>
  `https://source.unsplash.com/1200x400/?technology,${encodeURIComponent(title)}`;

const ProjectDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [project, setProject] = useState<(Project & { founderName: string; startupLogo?: string; bannerUrl?: string }) | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      try {
        setLoading(true);
        setError(null);

        // Project core
        const { data: pRow, error: pErr } = await supabase
          .from('projects')
          .select('id, title, description, mentor_id, status, difficulty, duration_weeks, max_students, created_at')
          .eq('id', id)
          .maybeSingle();
        if (pErr) throw pErr;
        if (!pRow) { setProject(null); setLoading(false); return; }

        const row = pRow as ProjectRow;

        // Mentor profile
        const { data: mentor, error: mErr } = await supabase
          .from('users')
          .select('full_name, avatar_url')
          .eq('id', row.mentor_id)
          .maybeSingle();
        if (mErr) throw mErr;
        const profile = (mentor as UserProfile) ?? null;

        // Skills
        const { data: ps } = await supabase
          .from('project_skills')
          .select('project_id, skills(name)')
          .eq('project_id', row.id);
        const skills = ((ps as ProjectSkillRow[] | null) ?? [])
          .map(r => r.skills?.name)
          .filter((s): s is string => !!s);

        // Applications (accepted vs total)
        const { data: apps } = await supabase
          .from('applications')
          .select('student_id, status')
          .eq('project_id', row.id);
        const applicants = ((apps as ApplicationRow[] | null) ?? []).map(a => a.student_id ?? '');
        const assigned = ((apps as ApplicationRow[] | null) ?? [])
          .filter(a => a.status === 'accepted')
          .map(a => a.student_id ?? '');

        const mapped: Project & { founderName: string; startupLogo?: string; bannerUrl?: string } = {
          id: row.id,
          title: row.title,
          description: row.description,
          mentorId: row.mentor_id,
          skills,
          duration: `${row.duration_weeks ?? 0} weeks`,
          status: mapStatus(row.status),
          difficulty: row.difficulty,
          maxStudents: row.max_students ?? 0,
          assignedStudents: assigned,
          applicants,
          createdAt: new Date(row.created_at),
          imageUrl: defaultImage(row.title),
          founderName: profile?.full_name ?? 'Founder',
          startupLogo: profile?.avatar_url ?? undefined,
          bannerUrl: defaultImage(row.title),
        };

        setProject(mapped);
        setLoading(false);
      } catch (e) {
        console.error(e);
        setError('Failed to load project');
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">Loading…</div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <p>Project not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <Link to="/projects" className="text-custom-cyan hover:text-custom-purple mb-4 inline-block">&larr; Back to Projects</Link>
        <Card className="mb-8 text-white">
          {project.bannerUrl && (
            <div className="mb-4 -mx-6 -mt-6 rounded-t-2xl overflow-hidden relative">
              <img src={project.bannerUrl} alt="Project Banner" className="w-full h-40 object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div>
          )}
          <div className="flex items-center gap-4 mb-4">
            <Avatar size="xxl" src={project.startupLogo || 'https://via.placeholder.com/64x64.png?text=Logo'} alt="Startup Logo" />
            <div>
              <h1 className="text-3xl font-bold">{project.title}</h1>
              <div className="flex gap-2 mt-2">
                <Badge variant="primary">{project.status === 'open' ? 'Open to Apply' : project.status === 'in-progress' ? 'In Progress' : 'Completed'}</Badge>
                <Badge variant="secondary">{project.difficulty.charAt(0).toUpperCase() + project.difficulty.slice(1)}</Badge>
              </div>
              <div className="mt-2 text-custom-orange font-medium text-sm">Founder: {project.founderName}</div>
            </div>
          </div>
          <p className="mb-4">{project.description}</p>
          <div className="mb-4">
            <span className="text-custom-cyan font-medium">Mentor ID:</span> {project.mentorId}
          </div>
          <div className="mb-4">
            <span className="text-custom-orange font-medium">Duration:</span> {project.duration}
          </div>
          <div className="mb-4">
            <span className="text-custom-purple font-medium">Max Students:</span> {project.maxStudents}
          </div>
          <div className="mb-4">
            <span className="text-custom-cyan font-medium">Skills:</span>
            <div className="flex flex-wrap gap-2 mt-1">
              {project.skills.map((skill) => (
                <Badge key={skill} variant="primary" size="sm">{skill}</Badge>
              ))}
            </div>
          </div>
          <div className="mb-4">
            <span className="text-custom-orange font-medium">Assigned Students:</span> {project.assignedStudents.length}
          </div>
          <div className="mb-4">
            <span className="text-custom-purple font-medium">Applicants:</span> {project.applicants.length}
          </div>
          <div className="text-neutral-400 text-sm mb-6">
            Posted on: {project.createdAt.toLocaleDateString()}
          </div>
          <button
            className="w-full bg-custom-cyan text-black font-semibold py-3 rounded-lg mt-2 hover:bg-custom-cyan/90 transition-colors text-lg"
            onClick={() => alert('Application submitted!')}
          >
            Apply
          </button>
        </Card>
      </div>
    </div>
  );
};

export default ProjectDetails;