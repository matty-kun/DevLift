import React, { useMemo, useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';

import Navbar from '../../components/layout/Navbar';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import ImageUpload from '../../components/common/ImageUpload';
import { Book, Briefcase, Clock, Code, Cpu, Users, Zap } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { useNavigate } from 'react-router-dom';
import Toast from '../../components/common/Toast';

interface PostProjectFormData {
  title: string;
  description: string;
  skills: string;
  duration: string; // we will parse number of weeks from this string (e.g., "6 weeks")
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  maxStudents: number;

  projectImage?: File | null;
}

const PostProject: React.FC = () => {
  const [showToast, setShowToast] = useState(false);
  const navigate = useNavigate();
  const { session, profile } = useAuth();
  const isMentor = useMemo(() => {
    const meta = (session?.user?.user_metadata as { role?: string } | undefined)?.role;
    return profile?.role === 'founder' || meta === 'founder';
  }, [profile?.role, session?.user?.user_metadata]);

  // Log the detected role(s) in the console whenever auth/profile changes
  useEffect(() => {
    const metaRole = (session?.user?.user_metadata as { role?: string } | undefined)?.role;
    const resolvedRole = profile?.role ?? metaRole ?? 'unknown';
    // Compact log for quick inspection in DevTools
    console.log('[PostProject] role check:', {
      profileRole: profile?.role ?? null,
      metaRole: metaRole ?? null,
      resolvedRole,
      isMentor,
    });
  }, [profile?.role, session?.user?.user_metadata, isMentor]);

  const { control, register, handleSubmit, formState: { errors, isSubmitting }, reset, setError } = useForm<PostProjectFormData>({
    defaultValues: {
      projectImage: null,
    },
  });

  const onSubmit = async (data: PostProjectFormData) => {
    try {
      if (!session?.user) {
        navigate('/sign-in');
        return;
      }
      if (!isMentor) {
        alert('Only mentors can post projects.');
        return;
      }

      // parse duration weeks from free text like "6 weeks"
      const m = data.duration.match(/\d+/);
      const durationWeeks = m ? parseInt(m[0], 10) : NaN;
      if (!Number.isFinite(durationWeeks) || durationWeeks <= 0) {
        setError('duration', { type: 'validate', message: 'Enter a number like "6" or "6 weeks"' });
        return;
      }

      // insert project
      const insertPayload = {
        title: data.title.trim(),
        description: data.description.trim(),
        mentor_id: session.user.id,
        difficulty: data.difficulty,
        duration_weeks: durationWeeks,
        max_students: data.maxStudents,
      } as const;

      const { data: project, error: perr } = await supabase
        .from('projects')
        .insert(insertPayload)
        .select('id')
        .single();
      if (perr) throw perr;

      const projectId = project?.id as string;

      // skills handling: split comma-separated values, upsert into skills, then link
      const rawSkills = data.skills.split(',').map(s => s.trim()).filter(Boolean);
      const uniqueSkillNames = Array.from(new Set(rawSkills.map(s => s.toLowerCase())));
      if (uniqueSkillNames.length > 0) {
        // fetch existing skills by name
        const { data: existing, error: selErr } = await supabase
          .from('skills')
          .select('id, name')
          .in('name', uniqueSkillNames);
        if (selErr) throw selErr;
        const existingByName = new Map((existing ?? []).map((r) => [r.name.toLowerCase(), r.id] as const));

        const toInsert = uniqueSkillNames
          .filter((n) => !existingByName.has(n.toLowerCase()))
          .map((name) => ({ name }));
        let insertedIds: string[] = [];
        if (toInsert.length) {
          const { data: inserted, error: insErr } = await supabase
            .from('skills')
            .insert(toInsert)
            .select('id, name');
          if (insErr) {
            // If RLS forbids inserting new skills, continue with only existing skills
            console.warn('Skipping new skill insert due to RLS:', insErr?.message);
            insertedIds = [];
          } else {
            insertedIds = (inserted ?? []).map((r) => r.id);
          }
        }

        const allSkillIds = [
          ...Array.from(existingByName.values()),
          ...insertedIds,
        ];
        if (allSkillIds.length) {
          const linkRows = allSkillIds.map((sid: string) => ({ project_id: projectId, skill_id: sid }));
          const { error: lerr } = await supabase.from('project_skills').insert(linkRows);
          if (lerr) throw lerr;
        }
      }

      reset();
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
        navigate(`/projects/${projectId}`);
      }, 1800);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      console.error('Post project failed:', e);
      alert(msg || 'Failed to post project');
    }
  };

  return (
    <div className="bg-black min-h-screen flex flex-col text-white">
      {showToast && (
        <Toast message="Project posted successfully!" type="success" duration={1500} onClose={() => setShowToast(false)} />
      )}
      <main className="flex-1 px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <Card className="bg-neutral-900 border border-custom-cyan shadow-lg shadow-custom-cyan/10">
            <div className="text-center mb-8">
              <Briefcase className="mx-auto h-12 w-12 text-custom-cyan" />
              <h1 className="text-4xl font-bold text-custom-cyan mt-4">Post a New Project</h1>
              <p className="text-neutral-400 mt-2">Fill in the details below to get your project in front of talented students.</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              <Controller
                name="projectImage"
                control={control}
                render={({ field }) => (
                  <ImageUpload
                    label="Project Header Image"
                    onFileChange={(file: File | null) => field.onChange(file)}
                  />
                )}
              />
              <Input
                label="Project Title"
                placeholder="e.g., AI-Powered Code Review Assistant"
                leftIcon={<Book className="w-4 h-4" />}
                {...register('title', { required: 'Project title is required' })}
                error={errors.title?.message}
              />
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-1.5">Description</label>
                <textarea
                  className="w-full rounded-lg border border-gray-700 bg-gray-900 text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-custom-cyan/50 focus:border-custom-cyan min-h-[120px] transition"
                  placeholder="Provide a detailed description of your project, its goals, and what students will learn."
                  {...register('description', { required: 'Description is required' })}
                />
                {errors.description && <p className="mt-1.5 text-sm text-red-500">{errors.description.message}</p>}
              </div>
              <Input
                label="Required Skills"
                placeholder="e.g., React, TypeScript, UI/UX, Supabase"
                leftIcon={<Code className="w-4 h-4" />}
                {...register('skills', { required: 'At least one skill is required' })}
                error={errors.skills?.message}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Estimated Duration"
                  placeholder="e.g., 6 weeks"
                  leftIcon={<Clock className="w-4 h-4" />}
                  {...register('duration', { required: 'Duration is required' })}
                  error={errors.duration?.message}
                />
                <div>
                  <label className="flex items-center text-sm font-medium text-neutral-300 mb-1.5">
                    <Zap className="w-4 h-4 mr-2" />
                    Difficulty
                  </label>
                  <select
                    className="w-full rounded-lg border border-gray-700 bg-gray-900 text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-custom-cyan/50 focus:border-custom-cyan transition"
                    {...register('difficulty', { required: 'Difficulty is required' })}
                    defaultValue=""
                  >
                    <option value="" disabled>Select difficulty level</option>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                  {errors.difficulty && <p className="mt-1.5 text-sm text-red-500">{errors.difficulty.message}</p>}
                </div>
              </div>
              <Input
                label="Max Students"
                type="number"
                min={1}
                placeholder="Enter the maximum number of students"
                leftIcon={<Users className="w-4 h-4" />}
                {...register('maxStudents', { 
                  required: 'Max students is required', 
                  min: { value: 1, message: 'At least 1 student' },
                  valueAsNumber: true,
                })}
                error={errors.maxStudents?.message}
              />
              {!isMentor && (
                <p className="text-yellow-400 text-sm -mt-4">Note: Only mentors can post projects.</p>
              )}
              <Button
                type="submit"
                variant="primary"
                className="w-full flex items-center justify-center gap-2"
                isLoading={isSubmitting}
                disabled={!isMentor || isSubmitting}
              >
                <Cpu className="w-5 h-5" />
                {isSubmitting ? 'Submitting...' : 'Post Project'}
              </Button>
            </form>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default PostProject;
