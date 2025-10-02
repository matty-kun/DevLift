import React, { useMemo, useEffect, useState } from 'react';
import BackButton from '../../components/common/BackButton';
import { SubmitHandler } from 'react-hook-form';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { useNavigate } from 'react-router-dom';
import Toast from '../../components/common/Toast';
import ProjectForm, { ProjectFormData } from '../../components/founders/ProjectForm';

const PostProject: React.FC = () => {
  const [showToast, setShowToast] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { session, profile } = useAuth();

  const isMentor = useMemo(() => {
    const meta = (session?.user?.user_metadata as { role?: string } | undefined)?.role;
    const metaIsFounder = meta === 'founder';
    const profileIsFounder = profile?.role === 'founder';
    return metaIsFounder || profileIsFounder;
  }, [profile?.role, session?.user?.user_metadata]);

  useEffect(() => {
    if (!session) navigate('/sign-in', { replace: true });
  }, [session, navigate]);

  const onSubmit: SubmitHandler<ProjectFormData> = async (data) => {
    setIsSubmitting(true);
    setError(null);
    try {
      if (!session?.user || !isMentor) {
        throw new Error('You must be a founder or mentor to post a project.');
      }

      const m = data.duration.match(/\d+/);
      const durationWeeks = m ? parseInt(m[0], 10) : NaN;
      if (!Number.isFinite(durationWeeks) || durationWeeks <= 0) {
        setError('Please enter a valid duration, like "6 weeks".');
        setIsSubmitting(false);
        return;
      }

      const { data: project, error: perr } = await supabase
        .from('projects')
        .insert({
          title: data.title.trim(),
          description: data.description.trim(),
          mentor_id: session.user.id,
          difficulty: data.difficulty,
          duration_weeks: durationWeeks,
          max_students: data.maxStudents,
        })
        .select('id')
        .single();
      if (perr) throw perr;

      const projectId = project?.id as string;

      const rawSkills = data.skills.split(',').map(s => s.trim()).filter(Boolean);
      if (rawSkills.length > 0) {
        const uniqueSkillNames = Array.from(new Set(rawSkills.map(s => s.toLowerCase())));
        const { data: existing } = await supabase.from('skills').select('id, name').in('name', uniqueSkillNames);
        const existingByName = new Map((existing ?? []).map((r) => [r.name.toLowerCase(), r.id] as const));
        const toInsert = uniqueSkillNames.filter((n) => !existingByName.has(n)).map((name) => ({ name }));
        
        let insertedIds: string[] = [];
        if (toInsert.length) {
          const { data: inserted, error: insErr } = await supabase.from('skills').insert(toInsert).select('id');
          if (insErr) console.warn('Could not insert new skills:', insErr.message);
          else insertedIds = (inserted ?? []).map(r => r.id);
        }

        const allSkillIds = [...Array.from(existingByName.values()), ...insertedIds];
        if (allSkillIds.length) {
          const linkRows = allSkillIds.map((skill_id) => ({ project_id: projectId, skill_id }));
          const { error: lerr } = await supabase.from('project_skills').insert(linkRows);
          if (lerr) throw lerr;
        }
      }

      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
        navigate(`/founder-dashboard`); // Navigate to dashboard after posting
      }, 1800);

    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      setError(msg);
      console.error('Post project failed:', e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-black min-h-screen flex flex-col text-white">
      <div className="container mx-auto px-4 pt-6"><BackButton to="/founder-dashboard" text="Back to Dashboard" /></div>
      {showToast && (
        <Toast message="Project posted successfully!" type="success" duration={1500} onClose={() => setShowToast(false)} />
      )}
      <main className="flex-1 px-4 py-12">
        <div className="max-w-3xl mx-auto">
          {error && <p className="text-red-500 bg-red-900/50 border border-red-700 p-3 rounded-lg mb-6">{error}</p>}
          {!isMentor && (
             <div className="text-yellow-400 bg-yellow-900/50 border border-yellow-700 p-3 rounded-lg mb-6">
                <p>You are not registered as a Founder/Mentor. Please update your role in your profile if you wish to post a project.</p>
             </div>
          )}
          <ProjectForm onSubmit={onSubmit} isSubmitting={isSubmitting} />
        </div>
      </main>
    </div>
  );
};

export default PostProject;
