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
  const [availableSkills, setAvailableSkills] = useState<string[]>([]);
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

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const { data, error } = await supabase.from('skills').select('name');
        if (error) throw error;
        setAvailableSkills(data.map((s: { name: string }) => s.name));
      } catch (err) {
        console.error('Error fetching skills:', err);
      }
    };
    fetchSkills();
  }, []);

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

      console.log('[PostProject] Submitting project:', {
        title: data.title,
        description: data.description,
        mentor_id: session.user.id,
        difficulty: data.difficulty,
        duration_weeks: durationWeeks,
        max_students: data.maxStudents,
        skills: data.skills,
      });

      // Upload header image if provided
      let headerImageUrl: string | null = null;
      if (data.projectImage) {
        const fileExt = data.projectImage.name.split('.').pop();
        const fileName = `${session.user.id}-${Date.now()}.${fileExt}`;
        const filePath = `project-headers/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('project_images')
          .upload(filePath, data.projectImage, { upsert: true });

        if (uploadError) {
          console.error('[PostProject] Error uploading image:', uploadError);
          throw uploadError;
        }

        const { data: urlData } = supabase.storage
          .from('project_images')
          .getPublicUrl(filePath);
        headerImageUrl = urlData.publicUrl;
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
          header_image_url: headerImageUrl,
        })
        .select('id')
        .single();
      if (perr) {
        console.error('[PostProject] Error inserting project:', perr);
        throw perr;
      }

      const projectId = project?.id as string;
      console.log('[PostProject] New project ID:', projectId);

      // skills is always a string[]
      const cleanedSkills = data.skills.map((s: string) => s.trim()).filter(Boolean);
      console.log('[PostProject] Cleaned skills:', cleanedSkills);

      if (cleanedSkills.length > 0) {
        const uniqueSkillNames = Array.from(new Set(cleanedSkills.map((s: string) => s.trim().toLowerCase())));
        console.log('[PostProject] Unique skill names (lowercase):', uniqueSkillNames);
        // Fetch all skills and match case-insensitively
        const { data: allSkills, error: skillFetchError } = await supabase
          .from('skills')
          .select('id, name');
        if (skillFetchError) {
          console.error('[PostProject] Error fetching skills:', skillFetchError);
        }
        // Map skill name (lowercase) to id
        const skillNameToId = new Map((allSkills ?? []).map((r: { id: string, name: string }) => [r.name.trim().toLowerCase(), r.id]));
        const allSkillIds = uniqueSkillNames.map((name) => skillNameToId.get(name)).filter(Boolean);
        console.log('[PostProject] Skill IDs to link:', allSkillIds);
        if (allSkillIds.length) {
          const linkRows = allSkillIds.map((skill_id) => ({ project_id: projectId, skill_id }));
          console.log('[PostProject] Linking skills to project:', linkRows);
          const { error: lerr } = await supabase.from('project_skills').insert(linkRows);
          if (lerr) {
            console.error('[PostProject] Error linking skills:', lerr);
            throw lerr;
          }
        } else {
          console.warn('[PostProject] No skill IDs found to link.');
        }
      } else {
        console.warn('[PostProject] No skills provided for project.');
      }

      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
        navigate(`/founder-dashboard`);
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
      <div className="container mx-auto px-4 pt-6">
        <BackButton to="/founder-dashboard" text="Back to Dashboard" />
      </div>
      {showToast && (
        <Toast
          message="Project posted successfully!"
          type="success"
          duration={1500}
          onClose={() => setShowToast(false)}
        />
      )}
      <main className="flex-1 px-4 py-12">
        <div className="max-w-3xl mx-auto">
          {error && (
            <p className="text-red-500 bg-red-900/50 border border-red-700 p-3 rounded-lg mb-6">{error}</p>
          )}
          {!isMentor ? (
            <div className="text-yellow-400 bg-yellow-900/50 border border-yellow-700 p-3 rounded-lg mb-6">
              <p>
                You are not registered as a Founder/Mentor. Please update your role in your profile if you wish to
                post a project.
              </p>
            </div>
          ) : (
            <ProjectForm onSubmit={onSubmit} isSubmitting={isSubmitting} availableSkills={availableSkills} />
          )}
        </div>
      </main>
    </div>
  );
};

export default PostProject;
