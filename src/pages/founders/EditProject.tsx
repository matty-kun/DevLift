import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import BackButton from '../../components/common/BackButton';
import Toast from '../../components/common/Toast';
import ProjectForm, { ProjectFormData } from '../../components/founders/ProjectForm';
import { SubmitHandler } from 'react-hook-form';
import LoadingScreen from '../../components/common/LoadingScreen';
import Modal from '../../components/common/Modal';
import StarRating from '../../components/common/StarRating';
import { addOrUpdateReview } from '../../lib/feedback';
import { Link } from 'react-router-dom';

type User = { id: string; full_name: string };

const EditProject: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { session } = useAuth();

  const [initialData, setInitialData] = useState<Partial<ProjectFormData> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [availableSkills, setAvailableSkills] = useState<string[]>([]);

  // State for project status and feedback modal
  const [projectStatus, setProjectStatus] = useState<'open' | 'in_progress' | 'completed' | null>(null);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbacks, setFeedbacks] = useState<{ studentId: string; rating: number; review: string }[]>([]);
  const [studentNames, setStudentNames] = useState<Record<string, string>>({});
  const [applications, setApplications] = useState<{ project_id: string; student_id: string | null; status: 'pending' | 'accepted' | 'rejected' }[]>([]);

  useEffect(() => {
    const fetchProject = async () => {
      if (!projectId) {
        setLoading(false);
        setError('No project ID provided.');
        return;
      }

      try {
        // Fetch project details
        const { data: projectData, error: projectError } = await supabase
          .from('projects')
          .select('*')
          .eq('id', projectId)
          .single();

        if (projectError) throw projectError;
        if (!projectData) throw new Error('Project not found.');

        // Check if the current user is the owner
        if (session?.user?.id !== projectData.mentor_id) {
          setError('You are not authorized to edit this project.');
          setLoading(false);
          return;
        }

        setProjectStatus(projectData.status);

        // Fetch applications for the feedback modal
        const { data: appsData, error: appsError } = await supabase
          .from('applications')
          .select('project_id, student_id, status')
          .eq('project_id', projectId);
        if (appsError) throw appsError;
        setApplications(appsData || []);

        // Fetch associated skills
        const { data: skillsData, error: skillsError } = await supabase
          .from('project_skills')
          .select('skills(name)')
          .eq('project_id', projectId);

        if (skillsError) throw skillsError;

        // skillsData is array of { skills: { name: string }[] | null }
        const skillsArr = skillsData
          ? skillsData
              .map(s => s.skills)
              .filter(Boolean)
              .flat()
              .map(skill => skill.name)
              .filter(Boolean)
          : [];

        setInitialData({
          title: projectData.title,
          description: projectData.description,
          difficulty: projectData.difficulty,
          duration: `${projectData.duration_weeks} weeks`,
          maxStudents: projectData.max_students,
          skills: skillsArr,
        });

      } catch (e: unknown) {
        setError((e as Error).message || 'Failed to fetch project data.');
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [projectId, session]);

  useEffect(() => {
    const fetchAllSkills = async () => {
      try {
        const { data, error } = await supabase.from('skills').select('name');
        if (error) throw error;
        setAvailableSkills(data.map(s => s.name));
      } catch (err) {
        console.error('Error fetching all skills:', err);
      }
    };
    fetchAllSkills();
  }, []); // Run once on mount

  // Fetch student names for feedback modal
  useEffect(() => {
    if (!showFeedbackModal) return;
    const accepted = applications.filter(a => a.status === 'accepted');
    const ids = accepted.map(a => a.student_id).filter(Boolean);
    if (ids.length === 0) return;
    (async () => {
      const { data, error } = await supabase
        .from('users')
        .select('id, full_name')
        .in('id', ids as string[]);
      if (!error && data) {
        const nameMap: Record<string, string> = {};
        data.forEach((u: User) => {
          nameMap[u.id] = u.full_name || u.id;
        });
        setStudentNames(prev => ({ ...prev, ...nameMap }));
      }
    })();
  }, [showFeedbackModal, applications]);

  const handleMarkCompleted = async () => {
    if (!projectId) return;
    setProjectStatus('completed'); // Optimistic update
    setShowFeedbackModal(true);
    const { error } = await supabase.from('projects').update({ status: 'completed' }).eq('id', projectId);
    if (error) {
      setProjectStatus('in_progress'); // Revert on failure
      alert('Failed to mark project as completed.');
    }
  };

  const handleUnmarkCompleted = async () => {
    if (!projectId) return;
    setProjectStatus('in_progress'); // Optimistic update
    const { error } = await supabase.from('projects').update({ status: 'in_progress' }).eq('id', projectId);
    if (error) {
      setProjectStatus('completed'); // Revert on failure
      alert('Failed to re-open project.');
    }
  };

  const onSubmit: SubmitHandler<ProjectFormData> = async (data) => {
    if (!projectId) return;
    setIsSubmitting(true);
    setError(null);

    try {
      const m = data.duration.match(/\d+/);
      const durationWeeks = m ? parseInt(m[0], 10) : NaN;
      if (!Number.isFinite(durationWeeks) || durationWeeks <= 0) {
        throw new Error('Please enter a valid duration, like "6 weeks".');
      }

      // Update project details
      const { error: updateError } = await supabase
        .from('projects')
        .update({
          title: data.title.trim(),
          description: data.description.trim(),
          difficulty: data.difficulty,
          duration_weeks: durationWeeks,
          max_students: data.maxStudents,
        })
        .eq('id', projectId);

      if (updateError) throw updateError;

      // Handle skill updates
      const currentSkills = initialData?.skills || [];
      const newSkills = data.skills || [];

      const skillsToAdd = newSkills.filter(skill => !currentSkills.includes(skill));
      const skillsToRemove = currentSkills.filter(skill => !newSkills.includes(skill));

      // Fetch IDs for skills to add
      let skillIdsToAdd: string[] = [];
      if (skillsToAdd.length > 0) {
        const { data: fetchedSkills, error: fetchSkillsError } = await supabase
          .from('skills')
          .select('id')
          .in('name', skillsToAdd);
        if (fetchSkillsError) console.error('Error fetching skills to add:', fetchSkillsError);
        skillIdsToAdd = (fetchedSkills || []).map(s => s.id);
      }

      // Delete skills no longer associated
      if (skillsToRemove.length > 0) {
        const { data: fetchedSkillsToRemove, error: fetchRemoveSkillsError } = await supabase
          .from('skills')
          .select('id')
          .in('name', skillsToRemove);
        if (fetchRemoveSkillsError) console.error('Error fetching skills to remove:', fetchRemoveSkillsError);
        const skillIdsToRemove = (fetchedSkillsToRemove || []).map(s => s.id);

        if (skillIdsToRemove.length > 0) {
          const { error: deleteError } = await supabase
            .from('project_skills')
            .delete()
            .eq('project_id', projectId)
            .in('skill_id', skillIdsToRemove);
          if (deleteError) throw deleteError;
        }
      }

      // Add new skill associations
      if (skillIdsToAdd.length > 0) {
        const linkRows = skillIdsToAdd.map(skill_id => ({ project_id: projectId, skill_id }));
        const { error: insertError } = await supabase
          .from('project_skills')
          .insert(linkRows);
        if (insertError) throw insertError;
      }

      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
        navigate('/founder-dashboard');
      }, 1800);

    } catch (e: unknown) {
      setError((e as Error).message || 'Failed to update project.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="bg-black min-h-screen flex flex-col text-white">
      <div className="container mx-auto px-4 pt-6"><BackButton to="/founder-dashboard" text="Back to Dashboard" /></div>
      {showToast && (
        <Toast message="Project updated successfully!" type="success" duration={1500} onClose={() => setShowToast(false)} />
      )}
      <main className="flex-1 px-4 py-12">
        <div className="max-w-3xl mx-auto">
          {error && <p className="text-red-500 bg-red-900/50 border border-red-700 p-3 rounded-lg mb-6">{error}</p>}
          {initialData ? (
            <ProjectForm 
              onSubmit={onSubmit} 
              initialData={initialData} 
              isSubmitting={isSubmitting} 
              isEditMode={true} 
              disabled={projectStatus === 'completed'}
              availableSkills={availableSkills}
            />
          ) : (
            !error && <p>Loading form...</p>
          )}

          {/* Project Status Management */}
          <div className="mt-12 pt-8 border-t border-neutral-800">
            <h2 className="text-2xl font-bold text-custom-orange mb-4">Project Status</h2>
            {projectStatus === 'completed' ? (
              <div className="flex flex-col items-center">
                <p className="text-neutral-400 mb-4">This project is marked as completed.</p>
                <button 
                  onClick={handleUnmarkCompleted}
                  className="bg-custom-cyan text-black font-semibold px-6 py-2 rounded-lg hover:bg-custom-cyan/80 transition-colors"
                >
                  Re-open Project
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <p className="text-neutral-400 mb-4">Once the project is finished, mark it as completed to leave feedback.</p>
                <button 
                  onClick={handleMarkCompleted}
                  className="bg-custom-purple text-white font-semibold px-6 py-2 rounded-lg hover:bg-custom-purple/80 transition-colors"
                >
                  Mark as Completed
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Feedback Modal */}
      <Modal isOpen={showFeedbackModal} onClose={() => setShowFeedbackModal(false)} title="Leave Feedback for Students">
          <form
            onSubmit={async e => {
              e.preventDefault();
              if (!projectId) { setShowFeedbackModal(false); return; }
              const accepted = applications.filter(a => a.status === 'accepted');
              const pairs = accepted.map((a, idx) => ({ studentId: a.student_id || '', rating: feedbacks[idx]?.rating || 0, review: feedbacks[idx]?.review || '' }));
              const results = await Promise.all(pairs
                .filter(p => p.studentId && p.rating > 0)
                .map(p => addOrUpdateReview({ projectId: projectId, revieweeId: p.studentId, rating: p.rating, feedback: p.review }))
              );
              const errs = results.filter(r => r.error);
              setShowFeedbackModal(false);
              if (errs.length) {
                alert(`Some reviews failed to submit: ${errs.map(e => e.error).join('; ')}`);
              } else {
                alert('Feedback submitted!');
              }
            }}
          >
            {projectId && (
              <>
                <div className="font-semibold mb-4 text-center text-lg">
                  {initialData?.title || projectId}
                </div>
                {applications.filter(a => a.status === 'accepted').length === 0 ? (
                  <div className="text-neutral-400">No accepted students to review.</div>
                ) : (
                  applications.filter(a => a.status === 'accepted').map((a, idx) => (
                    <div key={a.student_id} className="mb-8 p-4 bg-neutral-800 rounded-lg">
                      <div className="font-semibold mb-2 text-center text-custom-cyan text-base">
                        {a.student_id ? (
                          <Link to={`/students/${a.student_id}`} className="hover:underline">
                            {studentNames[a.student_id] || a.student_id}
                          </Link>
                        ) : (
                          studentNames[a.student_id || ''] || a.student_id
                        )}
                      </div>
                      <label className="block text-sm mb-1 text-center">Rating:</label>
                      <div className="flex justify-center mb-2">
                        <StarRating
                          value={feedbacks[idx]?.rating || 0}
                          onChange={val => {
                            setFeedbacks(fb => {
                              const arr = [...fb];
                              arr[idx] = { ...arr[idx], studentId: a.student_id || '', rating: val, review: arr[idx]?.review || '' };
                              return arr;
                            });
                          }}
                        />
                      </div>
                      <label className="block text-sm mb-1">Feedback:</label>
                      <textarea
                        className="w-full bg-neutral-900 border border-neutral-700 rounded p-2 text-sm"
                        rows={2}
                        value={feedbacks[idx]?.review || ''}
                        onChange={e => {
                          const val = e.target.value;
                          setFeedbacks(fb => {
                            const arr = [...fb];
                            arr[idx] = { ...arr[idx], studentId: a.student_id || '', rating: arr[idx]?.rating || 0, review: val };
                            return arr;
                          });
                        }}
                      />
                    </div>
                  ))
                )}
              </>
            )}
            <button
              type="submit"
              className="w-full bg-custom-cyan text-black font-semibold py-2 rounded-lg mt-2 hover:bg-custom-cyan/90 transition-colors"
            >
              Submit Feedback
            </button>
          </form>
        </Modal>
    </div>
  );
};

export default EditProject;
