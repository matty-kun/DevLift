import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, SkipForward } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import Button from '../components/common/Button';
import LoadingScreen from '../components/common/LoadingScreen';

// Stage Components
import StageIndicator from '../components/onboarding/StageIndicator';
import WelcomeStage from '../components/onboarding/WelcomeStage';
import BasicProfileStage from '../components/onboarding/BasicProfileStage';
import ProfessionalStage from '../components/onboarding/ProfessionalStage';
import LocationSkillsStage from '../components/onboarding/LocationSkillsStage';
import CompletionStage from '../components/onboarding/CompletionStage';

const TOTAL_STAGES = 5;

const NewOnboarding: React.FC = () => {
  const navigate = useNavigate();
  const { session, profile, refreshProfile } = useAuth();

  const [currentStage, setCurrentStage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [selectedRole, setSelectedRole] = useState<'student' | 'founder' | null>(null);
  const [fullName, setFullName] = useState('');
  const [bio, setBio] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [school, setSchool] = useState('');
  const [company, setCompany] = useState('');
  const [position, setPosition] = useState('');
  const [website, setWebsite] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [location, setLocation] = useState('');
  const [skills, setSkills] = useState<string[]>([]);

  // Load existing data if available
  useEffect(() => {
    if (session?.user) {
      const metadata = session.user.user_metadata;
      setFullName(metadata?.full_name || profile?.full_name || '');
      setBio(profile?.bio || '');
      setAvatarPreview(profile?.avatar_url || null);

      if (profile?.role && !selectedRole) {
        setSelectedRole(profile.role as 'student' | 'founder');
      }
    }
  }, [session, profile, selectedRole]);

  // Check if already onboarded
  useEffect(() => {
    const checkOnboarding = async () => {
      if (!session?.user?.id) return;

      const { data } = await supabase
        .from('users')
        .select('onboarding_completed, role')
        .eq('id', session.user.id)
        .single();

      if (data?.onboarding_completed && data?.role) {
        const dest = data.role === 'founder' ? '/founder-dashboard' : '/student-dashboard';
        navigate(dest, { replace: true });
      }
    };

    checkOnboarding();
  }, [session, navigate]);

  const canProceed = () => {
    const result = (() => {
      switch (currentStage) {
        case 1:
          return selectedRole !== null;
        case 2:
          return fullName.trim().length > 0;
        case 3:
        case 4:
          return true; // Optional stages
        case 5:
          return false; // Completion stage - no next button
        default:
          return false;
      }
    })();
    console.log('🔍 canProceed check:', { currentStage, selectedRole, fullName, result });
    return result;
  };

  const uploadAvatar = async (): Promise<string | null> => {
    if (!avatarFile || !session?.user?.id) return null;

    const fileExt = avatarFile.name.split('.').pop();
    const fileName = `${session.user.id}-${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, avatarFile, { upsert: true });

    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
    return data.publicUrl;
  };

  const saveStageData = async () => {
    if (!session?.user?.id) {
      console.log('⚠️ No session/user ID, skipping save');
      return;
    }

    console.log('💾 Saving stage data...', { currentStage, selectedRole });
    setLoading(true);
    setError(null);

    try {
      let avatarUrl = avatarPreview;

      // Upload avatar if changed
      if (avatarFile) {
        const uploaded = await uploadAvatar();
        if (uploaded) avatarUrl = uploaded;
      }

      // Prepare update data
      const updateData: Record<string, unknown> = {
        id: session.user.id,
        onboarding_step: currentStage,
      };

      if (currentStage >= 1 && selectedRole) {
        updateData.role = selectedRole;
      }

      if (currentStage >= 2) {
        updateData.full_name = fullName;
        updateData.bio = bio;
        if (avatarUrl) updateData.avatar_url = avatarUrl;
      }

      if (currentStage >= 3) {
        if (selectedRole === 'student' && school) {
          // Store school in user_metadata
          await supabase.auth.updateUser({
            data: { school }
          });
        } else if (selectedRole === 'founder') {
          updateData.company = company;
          updateData.position = position;
          updateData.website = website;
        }
        updateData.linkedin_url = linkedinUrl;
        updateData.github_url = githubUrl;
      }

      if (currentStage >= 4) {
        updateData.location = location;
      }

      // Update user profile
      console.log('📝 Updating user profile with data:', updateData);
      const { error: updateError } = await supabase
        .from('users')
        .upsert(updateData, { onConflict: 'id' });

      if (updateError) {
        console.error('❌ Database update error:', updateError);
        throw updateError;
      }
      console.log('✅ User profile updated successfully');

      // Save skills separately if any
      if (skills.length > 0 && currentStage >= 4) {
        // First, ensure skills exist in skills table
        for (const skillName of skills) {
          await supabase
            .from('skills')
            .upsert({ name: skillName }, { onConflict: 'name', ignoreDuplicates: true });
        }

        // Get skill IDs
        const { data: skillData } = await supabase
          .from('skills')
          .select('id, name')
          .in('name', skills);

        if (skillData) {
          // Delete existing user skills
          await supabase
            .from('user_skills')
            .delete()
            .eq('user_id', session.user.id);

          // Insert new user skills
          const userSkills = skillData.map(s => ({
            user_id: session.user.id,
            skill_id: s.id,
          }));

          await supabase.from('user_skills').insert(userSkills);
        }
      }

      await refreshProfile();
    } catch (err) {
      console.error('Error saving stage data:', err);
      setError('Failed to save data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleNext = async () => {
    console.log('🚀 handleNext called', { currentStage, selectedRole, fullName });

    if (!canProceed()) {
      console.log('❌ Cannot proceed - validation failed');
      return;
    }

    console.log('✅ Validation passed, saving stage data...');
    await saveStageData();
    console.log('💾 Stage data saved');

    if (currentStage < TOTAL_STAGES) {
      console.log(`➡️ Moving to stage ${currentStage + 1}`);
      setCurrentStage(currentStage + 1);
    }
  };

  const handleBack = () => {
    if (currentStage > 1) {
      setCurrentStage(currentStage - 1);
    }
  };

  const handleSkip = async () => {
    await saveStageData();
    if (currentStage < TOTAL_STAGES) {
      setCurrentStage(currentStage + 1);
    }
  };

  const handleComplete = async () => {
    if (!session?.user?.id) return;

    setLoading(true);

    try {
      // Mark onboarding as completed
      await supabase
        .from('users')
        .update({
          onboarding_completed: true,
          onboarding_step: TOTAL_STAGES
        })
        .eq('id', session.user.id);

      await refreshProfile();

      // Navigate to dashboard
      const dest = selectedRole === 'founder' ? '/founder-dashboard' : '/student-dashboard';
      navigate(dest, { replace: true });
    } catch (err) {
      console.error('Error completing onboarding:', err);
      setError('Failed to complete onboarding. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!session) {
    return <LoadingScreen />;
  }

  const isOptionalStage = currentStage === 3 || currentStage === 4;

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden flex items-center justify-center">
      {/* Background decorative elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute -right-10 -top-10 h-72 w-72 rounded-full bg-custom-cyan opacity-20 blur-3xl"></div>
        <div className="absolute left-1/4 top-32 h-48 w-48 rounded-full bg-custom-purple opacity-20 blur-3xl"></div>
        <div className="absolute left-1/20 bottom-1 h-48 w-48 rounded-full bg-white opacity-10 blur-3xl"></div>
        <div className="absolute right-1/3 bottom-0 h-64 w-64 rounded-full bg-custom-orange opacity-20 blur-3xl"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          {/* Progress Indicator */}
          {currentStage < TOTAL_STAGES && (
            <StageIndicator currentStage={currentStage} totalStages={TOTAL_STAGES} />
          )}

          {/* Stage Content */}
          <motion.div
            layout
            transition={{ layout: { duration: 0.3, ease: "easeInOut" } }}
            className="bg-[#0b0b10] border border-[#232336] rounded-2xl p-8 md:p-12 shadow-2xl min-h-[500px]"
          >
            <AnimatePresence mode="wait">
              {currentStage === 1 && (
                <WelcomeStage
                  key="welcome"
                  selectedRole={selectedRole}
                  onRoleSelect={setSelectedRole}
                />
              )}

              {currentStage === 2 && (
                <BasicProfileStage
                  key="basic"
                  fullName={fullName}
                  bio={bio}
                  avatarFile={avatarFile}
                  avatarPreview={avatarPreview}
                  onFullNameChange={setFullName}
                  onBioChange={setBio}
                  onAvatarChange={(file) => {
                    setAvatarFile(file);
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setAvatarPreview(reader.result as string);
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
              )}

              {currentStage === 3 && selectedRole && (
                <ProfessionalStage
                  key="professional"
                  role={selectedRole}
                  school={school}
                  company={company}
                  position={position}
                  website={website}
                  linkedinUrl={linkedinUrl}
                  githubUrl={githubUrl}
                  onSchoolChange={setSchool}
                  onCompanyChange={setCompany}
                  onPositionChange={setPosition}
                  onWebsiteChange={setWebsite}
                  onLinkedinChange={setLinkedinUrl}
                  onGithubChange={setGithubUrl}
                />
              )}

              {currentStage === 4 && (
                <LocationSkillsStage
                  key="location"
                  location={location}
                  skills={skills}
                  onLocationChange={setLocation}
                  onSkillsChange={setSkills}
                />
              )}

              {currentStage === 5 && selectedRole && (
                <CompletionStage
                  key="completion"
                  role={selectedRole}
                  fullName={fullName}
                  onComplete={handleComplete}
                />
              )}
            </AnimatePresence>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg"
              >
                {error}
              </motion.div>
            )}

            {/* Navigation Buttons */}
            {currentStage < TOTAL_STAGES && (
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-neutral-800">
                <div>
                  {currentStage > 1 && (
                    <Button
                      onClick={handleBack}
                      variant="ghost"
                      leftIcon={<ArrowLeft className="h-4 w-4" />}
                      disabled={loading}
                    >
                      Back
                    </Button>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  {isOptionalStage && (
                    <Button
                      onClick={handleSkip}
                      variant="ghost"
                      rightIcon={<SkipForward className="h-4 w-4" />}
                      disabled={loading}
                    >
                      Skip
                    </Button>
                  )}

                  <Button
                    onClick={handleNext}
                    variant="primary"
                    rightIcon={<ArrowRight className="h-4 w-4" />}
                    disabled={!canProceed() || loading}
                    isLoading={loading}
                  >
                    {currentStage === TOTAL_STAGES - 1 ? 'Finish' : 'Next'}
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default NewOnboarding;
