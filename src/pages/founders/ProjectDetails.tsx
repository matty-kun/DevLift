import React, { useEffect, useState } from 'react';
import Modal from '../../components/common/Modal';
import BackToProfileButton from '../../components/common/BackToProfileButton';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Avatar from '../../components/common/Avatar';
import { Project } from '../../types';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

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
  const navigate = useNavigate();
  const { session, profile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [project, setProject] = useState<(Project & { founderName: string; startupLogo?: string; bannerUrl?: string }) | null>(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [applyStatus, setApplyStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [applyError, setApplyError] = useState<string | null>(null);
  // Frontend-only: mark as completed and feedback modal
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbacks, setFeedbacks] = useState<{ studentId: string; rating: number; review: string }[]>([]);
  const [localStatus, setLocalStatus] = useState<string | null>(null); // simulate status change

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      try {
        setLoading(true);
  // reset any previous error state (none currently tracked)

        // Project core
        const { data: pRow, error: pErr } = await supabase
          .from('projects')
          .select('id, title, description, mentor_id, status, difficulty, duration_weeks, max_students, header_image_url, created_at')
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
          imageUrl: row.header_image_url ?? defaultImage(row.title),
          founderName: profile?.full_name ?? 'Founder',
          startupLogo: profile?.avatar_url ?? undefined,
          bannerUrl: row.header_image_url ?? defaultImage(row.title),
        };

        setProject(mapped);
        setLoading(false);
      } catch (e) {
  console.error(e);
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

  const userId = session?.user?.id;
  const isStudent = (profile?.role === 'student' || !profile?.role); // fallback: if profile row missing yet, allow apply
  const alreadyApplied = !!(userId && project.applicants.includes(userId));
  const projectFull = project.assignedStudents.length >= project.maxStudents;
  const projectOpen = (localStatus ?? project.status) === 'open';
  const projectCompleted = (localStatus ?? project.status) === 'completed';
  const canApply = userId && isStudent && projectOpen && !alreadyApplied && !projectFull;
  const isMentor = userId && userId === project.mentorId;

  const handleApply = async () => {
    if (!userId) { navigate('/sign-in'); return; }
    if (!canApply) return;
    setApplyStatus('submitting');
    setApplyError(null);
    try {
      // Ensure user profile exists with student role (RLS requires role='student' to insert applications)
      if (isStudent) {
        const { data: existingProfile, error: profileErr } = await supabase
          .from('users')
          .select('id, role')
          .eq('id', userId)
          .maybeSingle();
        if (profileErr) throw profileErr; // surface unexpected error
        if (!existingProfile) {
          // Derive fallback name only from user metadata (avoid depending on auth email in public.users)
          const fallbackName = (session?.user?.user_metadata as { full_name?: string } | undefined)?.full_name || 'Student';
          const { error: insertProfErr } = await supabase.from('users').insert({
            id: userId,
            role: 'student',
            full_name: fallbackName
          });
          if (insertProfErr) throw insertProfErr;
        } else if (existingProfile && (existingProfile as { role?: string }).role !== 'student') {
          // If role not student, prevent misleading application attempt
          setApplyStatus('error');
          setApplyError('Your account role cannot apply to projects.');
          return;
        }
      }
      const { error } = await supabase.from('applications').insert({
        project_id: project.id,
        student_id: userId,
        cover_letter: coverLetter.trim() || 'N/A'
      });
      if (error) throw error;
      // Optimistic update
      setProject(p => p ? { ...p, applicants: [...p.applicants, userId] } : p);
      setApplyStatus('success');
    } catch (e: unknown) {
      const msg = (typeof e === 'object' && e && 'message' in e) ? String((e as { message?: unknown }).message) : 'Failed to submit application';
      setApplyError(msg);
      setApplyStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-black py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <BackToProfileButton />
          <Link to="/projects" className="text-custom-cyan hover:text-custom-purple inline-block">&larr; Back to Projects</Link>
        </div>
        <Card className="mb-8 text-white">
          {/* Mark as Completed button for founders */}
          {isMentor && !projectCompleted && (
            <button
              className="mb-4 bg-custom-purple text-white px-4 py-2 rounded hover:bg-custom-cyan transition-colors"
              onClick={() => {
                setLocalStatus('completed');
                setShowFeedbackModal(true);
              }}
            >
              Mark Project as Completed
            </button>
          )}
          {project.bannerUrl && (
            <div className="mb-4 -mx-6 -mt-6 rounded-t-2xl overflow-hidden relative">
              <img
                src={project.bannerUrl}
                alt="Project Banner"
                className="w-full h-40 object-cover"
                onError={(e) => {
                  const target = e.currentTarget as HTMLImageElement;
                  if (target.dataset.fallbackApplied === '1') return;
                  target.dataset.fallbackApplied = '1';
                  target.src = defaultImage(project.title);
                }}
              />
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
          {/* Feedback Modal (frontend only) */}
          <Modal isOpen={showFeedbackModal} onClose={() => setShowFeedbackModal(false)} title="Leave Feedback for Students">
            <form
              onSubmit={e => {
                e.preventDefault();
                setShowFeedbackModal(false);
                // Simulate storing feedback
                alert('Feedback submitted! (frontend only)');
              }}
            >
              {project.assignedStudents.length === 0 ? (
                <div className="text-neutral-400">No accepted students to review.</div>
              ) : (
                project.assignedStudents.map((sid, idx) => (
                  <div key={sid} className="mb-6">
                    <div className="font-semibold mb-1">Student ID: {sid}</div>
                    <label className="block text-sm mb-1">Rating:</label>
                    <select
                      className="mb-2 p-2 rounded bg-neutral-800 text-white"
                      value={feedbacks[idx]?.rating || ''}
                      onChange={e => {
                        const val = Number(e.target.value);
                        setFeedbacks(fb => {
                          const arr = [...fb];
                          arr[idx] = { ...arr[idx], studentId: sid, rating: val, review: arr[idx]?.review || '' };
                          return arr;
                        });
                      }}
                      required
                    >
                      <option value="">Select</option>
                      <option value={5}>5 - Excellent</option>
                      <option value={4}>4 - Good</option>
                      <option value={3}>3 - Average</option>
                      <option value={2}>2 - Poor</option>
                      <option value={1}>1 - Very Poor</option>
                    </select>
                    <label className="block text-sm mb-1">Feedback:</label>
                    <textarea
                      className="w-full bg-neutral-800 border border-neutral-700 rounded p-2 text-sm"
                      rows={2}
                      value={feedbacks[idx]?.review || ''}
                      onChange={e => {
                        const val = e.target.value;
                        setFeedbacks(fb => {
                          const arr = [...fb];
                          arr[idx] = { ...arr[idx], studentId: sid, rating: arr[idx]?.rating || 0, review: val };
                          return arr;
                        });
                      }}
                      required
                    />
                  </div>
                ))
              )}
              <button
                type="submit"
                className="w-full bg-custom-cyan text-black font-semibold py-2 rounded-lg mt-2 hover:bg-custom-cyan/90 transition-colors"
              >
                Submit Feedback
              </button>
            </form>
          </Modal>
          <div className="border-t border-neutral-800 pt-6 mt-8">
            <h2 className="text-xl font-semibold mb-3">Apply to this Project</h2>
            {!userId && (
              <p className="text-neutral-400 text-sm mb-4">You must <button onClick={()=>navigate('/sign-in')} className="text-custom-cyan underline">sign in</button> to apply.</p>
            )}
            {userId && !isStudent && (
              <p className="text-neutral-400 text-sm mb-4">Only student accounts can apply to projects.</p>
            )}
            {alreadyApplied && (
              <p className="text-custom-cyan text-sm mb-4">You have already applied. Good luck!</p>
            )}
            {projectFull && (
              <p className="text-red-400 text-sm mb-4">This project has reached its maximum number of students.</p>
            )}
            {!alreadyApplied && isStudent && projectOpen && !projectFull && (
              <>
                <label className="block text-sm font-medium mb-1">Cover Letter (optional)</label>
                <textarea
                  value={coverLetter}
                  onChange={e=>setCoverLetter(e.target.value)}
                  rows={4}
                  placeholder="Share briefly why you're a good fit..."
                  className="w-full bg-neutral-900 border border-neutral-700 focus:border-custom-cyan rounded p-3 text-sm resize-y outline-none"
                  disabled={applyStatus==='submitting' || applyStatus==='success'}
                />
                {applyError && <div className="text-red-400 text-sm mt-2">{applyError}</div>}
                {applyStatus==='success' && <div className="text-green-400 text-sm mt-2">Application submitted!</div>}
                <button
                  className="w-full bg-custom-cyan text-black font-semibold py-3 rounded-lg mt-4 hover:bg-custom-cyan/90 transition-colors text-lg disabled:opacity-50"
                  onClick={handleApply}
                  disabled={!canApply || applyStatus==='submitting'}
                >
                  {applyStatus==='submitting' ? 'Submitting...' : 'Apply'}
                </button>
              </>
            )}
            {!projectOpen && (
              <p className="text-neutral-400 text-sm">Project is not open for new applications.</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ProjectDetails;