import { Download, Clock, XCircle } from 'lucide-react';
import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import BackToProfileButton from '../../components/common/BackToProfileButton';

type ApplicationRow = {
  id: string;
  student_id: string | null;
  status: 'pending' | 'accepted' | 'rejected';
  cover_letter: string;
  created_at: string;
  users: { full_name: string; avatar_url: string | null } | null; // joined alias
  rejection_reason?: string | null;
};
type ProjectRow = {
  id: string; title: string; mentor_id: string; status: string | null; max_students: number | null; created_at: string;
};

const formatTimeAgo = (iso: string) => {
  const diff = Date.now() - new Date(iso).getTime();
  const d = Math.floor(diff / 86400000);
  if (d <= 0) return 'Today';
  if (d === 1) return '1 day ago';
  if (d < 7) return `${d} days ago`;
  const w = Math.floor(d / 7);
  return w === 1 ? '1 week ago' : `${w} weeks ago`;
};

const Applications: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { session, loading: authLoading } = useAuth();
  const [project, setProject] = useState<ProjectRow | null>(null);
  const [apps, setApps] = useState<ApplicationRow[]>([]);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const selected = apps[selectedIdx];

  const load = useCallback(async () => {
    if (!id || !session?.user?.id) return;
    setLoading(true); setError(null);
    try {
      const { data: proj, error: pErr } = await supabase
        .from('projects')
        .select('id, title, mentor_id, status, max_students, created_at')
        .eq('id', id)
        .maybeSingle();
      if (pErr) throw pErr;
      if (!proj) { setError('Project not found'); return; }
      const pr = proj as ProjectRow;
      // Authorization: ensure current user is mentor
      if (pr.mentor_id !== session.user.id) {
        setError('You are not authorized to view applications for this project.');
        return;
      }
      setProject(pr);
      const { data: appRows, error: aErr } = await supabase
        .from('applications')
        .select('id, student_id, status, cover_letter, created_at, rejection_reason, users:student_id (full_name, avatar_url)')
        .eq('project_id', id)
        .order('created_at', { ascending: false });
      if (aErr) throw aErr;
  interface RawUser { full_name: string; avatar_url: string | null }
  interface RawApp { id:string; student_id:string|null; status:ApplicationRow['status']; cover_letter:string; created_at:string; rejection_reason?:string|null; users: RawUser | RawUser[] | null };
      const normalized: ApplicationRow[] | undefined = (appRows as RawApp[] | null)?.map(r => ({
        id: r.id,
        student_id: r.student_id,
        status: r.status,
        cover_letter: r.cover_letter,
        created_at: r.created_at,
        rejection_reason: r.rejection_reason,
  users: Array.isArray(r.users) ? r.users[0] : r.users
      }));
      setApps(normalized || []);
      setSelectedIdx(0);
    } catch (e: unknown) {
      const msg = typeof e === 'object' && e && 'message' in e ? String((e as { message?: unknown }).message) : 'Failed to load applications';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [id, session?.user?.id]);

  useEffect(() => { if (!authLoading) load(); }, [authLoading, load]);

  const updateStatus = async (appId: string, status: 'accepted' | 'rejected') => {
    let rejection_reason: string | undefined;
    if (status === 'rejected') {
      rejection_reason = window.prompt('Optional: Provide a brief rejection reason (leave blank to skip)') || undefined;
    }
    // Optimistic update
  setApps(prev => prev.map(a => a.id === appId ? { ...a, status, rejection_reason: rejection_reason ?? a.rejection_reason } : a));
  const { error: uErr } = await supabase.from('applications').update({ status, rejection_reason }).eq('id', appId);
    if (uErr) {
      await load();
      alert('Failed to update status (check RLS / permissions).');
    }
  };

  if (loading) return <div className="min-h-screen bg-black text-white flex items-center justify-center">Loading…</div>;
  if (error) return <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center gap-4"><p>{error}</p><button onClick={()=>navigate('/founder-dashboard')} className="text-custom-cyan underline">Back to Dashboard</button></div>;
  if (!project) return null;

  const accepted = apps.filter(a => a.status === 'accepted').length;
  const total = apps.length;

  return (
    <div className="min-h-screen bg-black text-white px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-custom-cyan">Applications</h1>
            <p className="text-neutral-400 text-sm">Project: {project.title}</p>
          </div>
          <BackToProfileButton className="!px-4 !py-2" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-neutral-900 rounded-lg p-4">
            <div className="text-xl font-semibold text-custom-cyan">{total}</div>
            <div className="text-neutral-400 text-sm">Total Applications</div>
          </div>
          <div className="bg-neutral-900 rounded-lg p-4">
            <div className="text-xl font-semibold text-custom-orange">{accepted}</div>
            <div className="text-neutral-400 text-sm">Accepted</div>
          </div>
          <div className="bg-neutral-900 rounded-lg p-4">
            <div className="text-xl font-semibold text-custom-purple">{project.max_students ?? 0}</div>
            <div className="text-neutral-400 text-sm">Max Students</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-5 space-y-3">
            <h2 className="text-lg font-semibold text-custom-cyan">Applicants</h2>
            {apps.length === 0 && <p className="text-neutral-500 text-sm">No applications yet.</p>}
            {apps.map((a, idx) => (
              <button key={a.id} onClick={() => setSelectedIdx(idx)} className={`w-full text-left bg-neutral-900 border rounded-lg p-4 flex items-start gap-3 transition-colors ${selectedIdx===idx? 'border-custom-cyan' : 'border-neutral-800 hover:border-neutral-700'}`}> 
                <img src={a.users?.avatar_url || `https://api.dicebear.com/7.x/identicon/svg?seed=${a.student_id}`} alt={a.users?.full_name || 'student'} className="h-10 w-10 rounded-full object-cover" />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    {a.student_id ? (
                      <Link to={`/students/${a.student_id}`} className="font-medium text-custom-cyan hover:underline">{a.users?.full_name || 'Student'}</Link>
                    ) : (
                      <span className="font-medium">{a.users?.full_name || 'Student'}</span>
                    )}
                    <span className={`text-xs px-2 py-0.5 rounded ${a.status==='accepted' ? 'bg-custom-cyan text-black' : a.status==='rejected' ? 'bg-red-600' : 'bg-neutral-700'}`}>{a.status}</span>
                  </div>
                  <p className="text-neutral-400 text-xs mt-1 line-clamp-2">{a.cover_letter}</p>
                  <p className="text-neutral-500 text-[10px] mt-1">Applied {formatTimeAgo(a.created_at)}</p>
                </div>
                <svg className="w-4 h-4 text-custom-cyan mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </button>
            ))}
          </div>
          <div className="md:col-span-7">
            {selected ? (
              <div className="bg-neutral-900 rounded-lg p-6 border border-neutral-800">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <img src={selected.users?.avatar_url || `https://api.dicebear.com/7.x/identicon/svg?seed=${selected.student_id}`} className="h-12 w-12 rounded-full object-cover" alt={selected.users?.full_name || 'student'} />
                    <div>
                      <h2 className="text-xl font-semibold">
                        {selected.student_id ? (
                          <Link to={`/students/${selected.student_id}`} className="text-custom-cyan hover:underline">{selected.users?.full_name || 'Student'}</Link>
                        ) : (
                          selected.users?.full_name || 'Student'
                        )}
                      </h2>
                      <p className="text-neutral-500 text-sm">Applied {formatTimeAgo(selected.created_at)}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {selected.status === 'pending' && (
                      <>
                        <button onClick={() => updateStatus(selected.id, 'accepted')} className="bg-custom-cyan text-black px-4 py-2 rounded text-sm font-medium hover:opacity-90">Accept</button>
                        <button onClick={() => updateStatus(selected.id, 'rejected')} className="bg-red-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-red-500">Reject</button>
                      </>
                    )}
                    {selected.status !== 'pending' && (
                      <span className={`px-3 py-1 rounded text-xs font-semibold self-center ${selected.status==='accepted' ? 'bg-custom-cyan text-black' : 'bg-red-600'}`}>{selected.status}</span>
                    )}
                  </div>
                </div>
                <div className="mb-6">
                  <h3 className="text-sm uppercase tracking-wide text-neutral-400 mb-2">Cover Letter</h3>
                  <p className="text-neutral-200 whitespace-pre-line text-sm leading-relaxed">{selected.cover_letter}</p>
                </div>
                <div className="mb-6">
                  <h3 className="text-sm uppercase tracking-wide text-neutral-400 mb-2">Resume</h3>
                  <button className="flex items-center gap-2 text-neutral-400 hover:text-white text-sm" disabled>
                    <Download className="h-4 w-4" /> (Not provided)
                  </button>
                </div>
                <div>
                  {selected.status === 'rejected' && selected.rejection_reason && (
                    <div className="mb-6 bg-red-600/10 border border-red-600 rounded p-4 text-sm flex gap-3">
                      <XCircle className="h-5 w-5 text-red-500 mt-0.5" />
                      <div>
                        <h3 className="font-semibold text-red-400 mb-1">Rejection Reason</h3>
                        <p className="text-neutral-300 whitespace-pre-line">{selected.rejection_reason}</p>
                      </div>
                    </div>
                  )}
                  <PreviousProjects studentId={selected.student_id} currentProjectId={project.id} />
                </div>
              </div>
            ) : (
              <div className="text-neutral-500 text-sm">Select an applicant to view details.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Component to list previous accepted project participation for a student
const PreviousProjects: React.FC<{ studentId: string | null; currentProjectId: string }> = ({ studentId, currentProjectId }) => {
  const [items, setItems] = React.useState<Array<{ id: string; title: string; status: string | null; created_at: string }>>([]);
  const [loading, setLoading] = React.useState(false);
  React.useEffect(() => {
    (async () => {
      if (!studentId) return;
      setLoading(true);
      // Fetch other applications by this student that were accepted
      const { data: otherApps } = await supabase
        .from('applications')
        .select('project_id, status')
        .eq('student_id', studentId)
        .neq('project_id', currentProjectId)
        .in('status', ['accepted']);
      const projectIds = Array.from(new Set((otherApps ?? []).map(a => a.project_id)));
      if (projectIds.length) {
        interface ProjectRecord { id:string; title:string; status:string|null; created_at:string }
        const { data: projects } = await supabase
          .from('projects')
          .select('id, title, status, created_at')
          .in('id', projectIds);
        setItems((projects as ProjectRecord[] | null) || []);
      } else {
        setItems([]);
      }
      setLoading(false);
    })();
  }, [studentId, currentProjectId]);
  return (
    <div className="mb-2">
      <h3 className="text-sm uppercase tracking-wide text-neutral-400 mb-2">Previous Projects</h3>
      {loading && <p className="text-neutral-500 text-xs">Loading...</p>}
      {!loading && items.length === 0 && <p className="text-neutral-500 text-xs">None yet.</p>}
      <div className="space-y-2">
        {items.map(p => (
          <div key={p.id} className="flex items-center justify-between text-xs bg-neutral-800/50 p-2 rounded">
            <div className="flex items-center gap-2">
              <span className="h-6 w-6 rounded bg-custom-orange flex items-center justify-center text-[10px] font-semibold">P</span>
              <div>
                <p>{p.title}</p>
                <p className="text-neutral-500">{p.status ?? 'open'}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1 text-custom-orange"><Clock className="h-3 w-3" />{new Date(p.created_at).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Applications;