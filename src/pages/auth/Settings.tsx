import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext'; // Added refreshProfile
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { User, Bell, Shield, Mail, Building } from 'lucide-react'; // Added Building
import Toast from '../../components/common/Toast';
import MultiSelectTagsInput from '../../components/common/MultiSelectTagsInput';
import BackButton from '../../components/common/BackButton';
import ImageUpload from '../../components/common/ImageUpload';

// Import placeholder components
import AccountSettings from '../../components/settings/AccountSettings';
import NotificationSettings from '../../components/settings/NotificationSettings';
import SecuritySettings from '../../components/settings/SecuritySettings';
import StartupSettings from '../../components/settings/StartupSettings'; // Added StartupSettings

interface ProfileFormData {
  fullName: string;
  bio: string;
  skills: string[];
  position: string;
  industry: string;
  school: string;
  country: string;
  city: string;
  phoneNumber: string;
  birthDay: string;
  birthMonth: string;
  birthYear: string;
  website: string;
}

const ProfileSettings = () => {
  const { session, profile, refreshProfile } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableSkills, setAvailableSkills] = useState<string[]>([]);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' as 'success' | 'error' });

  const { control, register, handleSubmit, reset, formState: { errors } } = useForm<ProfileFormData>();

  useEffect(() => {
    if (profile && session) {
      const userBirthday = session?.user?.user_metadata?.birthday;
      let year = '', month = '', day = '';
      if (userBirthday) {
        [year, month, day] = userBirthday.split('-');
      }

      const fetchUserSkills = async () => {
        if (!session?.user?.id) return [];
        const { data, error } = await supabase
          .from('user_skills')
          .select('skills(name)')
          .eq('user_id', session.user.id);
        if (error) {
          console.error('Error fetching user skills:', error);
          return [];
        }
        return data ? data.map((s: any) => s.skills.name) : [];
      };

      const populateForm = async () => {
        const userSkills = await fetchUserSkills();
        reset({
          fullName: session?.user?.user_metadata?.full_name || profile.full_name || '',
          bio: profile.bio || '',
          skills: userSkills,
          position: session?.user?.user_metadata?.position || '',
          industry: session?.user?.user_metadata?.industry || '',
          school: session?.user?.user_metadata?.school || '',
          country: session?.user?.user_metadata?.country || '',
          city: session?.user?.user_metadata?.city || '',
          phoneNumber: session?.user?.user_metadata?.phone_number || '',
          website: session?.user?.user_metadata?.website || '',
          birthDay: day,
          birthMonth: month,
          birthYear: year,
        });
      };

      const fetchAllSkills = async () => {
        const { data } = await supabase.from('skills').select('name');
        if (data) setAvailableSkills(data.map(s => s.name));
      };

      populateForm();
      fetchAllSkills();
    }
  }, [profile, session, reset]);

  const onSubmit: SubmitHandler<ProfileFormData> = async (data) => {
    setIsSubmitting(true);

    try {
      const birthdayString = data.birthYear && data.birthMonth && data.birthDay
        ? `${data.birthYear}-${data.birthMonth.padStart(2, '0')}-${data.birthDay.padStart(2, '0')}`
        : '';

      // Upload avatar if changed
      let avatarUrl = profile?.avatar_url;
      if (avatarFile) {
        const fileExt = avatarFile.name.split('.').pop();
        const fileName = `${session!.user.id}-${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(filePath, avatarFile, { upsert: true });

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(filePath);
        avatarUrl = urlData.publicUrl;
      }

      // Update auth.users.user_metadata first
      const { data: authUpdateData, error: authUpdateError } = await supabase.auth.updateUser({
        data: {
          full_name: data.fullName, // Also update full_name in metadata
          position: data.position,
          industry: data.industry,
          school: data.school,
          country: data.country,
          city: data.city,
          phone_number: data.phoneNumber,
          birthday: birthdayString,
          website: data.website,
        },
      });

      if (authUpdateError) throw authUpdateError;

      // Then, update public.users table
      const { error: profileUpdateError } = await supabase
        .from('users')
        .update({ // This table should contain bio
          // full_name is in user_metadata now, but we can update both for consistency
          full_name: data.fullName,
          bio: data.bio,
          avatar_url: avatarUrl,
        })
        .eq('id', session!.user!.id);

      if (profileUpdateError) {
        throw profileUpdateError;
      }

      // Then, update user_skills table
      // 1. Delete existing skills for the user
      const { error: deleteSkillsError } = await supabase.from('user_skills').delete().eq('user_id', session!.user!.id);
      if (deleteSkillsError) throw deleteSkillsError;

      // 2. Insert new skills
      if (data.skills.length > 0) {
        const { data: skillsData, error: skillsError } = await supabase
          .from('skills')
          .select('id, name')
          .in('name', data.skills);

        if (skillsError) throw skillsError;

        const skillsToInsert = skillsData.map(skill => ({ user_id: session!.user!.id, skill_id: skill.id }));
        const { error: insertSkillsError } = await supabase.from('user_skills').insert(skillsToInsert);
        if (insertSkillsError) throw insertSkillsError;
      }

      // If both are successful, show success and refresh
      setToast({ show: true, message: 'Profile updated successfully!', type: 'success' });
      await refreshProfile(); // Refresh the profile in the auth context
      
    } catch (error: any) {
      setToast({ show: true, message: `Error updating profile: ${error.message}`, type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      {toast.show && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}
      <h2 className="text-2xl font-bold text-white mb-6">Profile Settings</h2>
      <div className="bg-neutral-900 p-8 rounded-lg">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-6">
            <ImageUpload
              label="Profile Picture"
              onFileChange={setAvatarFile}
              currentImageUrl={profile?.avatar_url || undefined}
              variant="circle"
            />
          </div>
          <div className="mb-6">
            <Input
              label="Full Name"
              type="text"
              {...register('fullName', { required: 'Full name is required' })}
              error={errors.fullName?.message}
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-neutral-400 mb-2">Bio</label>
            <textarea
              {...register('bio')}
              className="w-full p-3 border border-neutral-700 rounded-md bg-neutral-800 text-white focus:ring-2 focus:ring-custom-cyan transition"
              rows={4}
            />
          </div>

          <div className="mb-6">
            <Controller
              name="skills"
              control={control}
              defaultValue={[]}
              render={({ field }) => (
                <MultiSelectTagsInput
                  label="Skills"
                  availableOptions={availableSkills}
                  selectedOptions={field.value}
                  onChange={field.onChange}
                  placeholder="Add your skills..."
                />
              )}
            />
          </div>

          <h3 className="text-xl font-semibold text-white mb-4 mt-8">Current Position</h3>
          <div className="mb-6">
            <Input
              label="Position"
              type="text"
              {...register('position')}
            />
          </div>
          <div className="mb-6">
            <Input
              label="Industry"
              type="text"
              {...register('industry')}
            />
          </div>

          <h3 className="text-xl font-semibold text-white mb-4 mt-8">Education</h3>
          <div className="mb-6">
            <Input
              label="School"
              type="text"
              {...register('school')}
            />
          </div>

          <h3 className="text-xl font-semibold text-white mb-4 mt-8">Location</h3>
          <div className="mb-6">
            <Input
              label="Country/Region"
              type="text"
              {...register('country')}
            />
          </div>
          <div className="mb-6">
            <Input
              label="City"
              type="text"
              {...register('city')}
            />
          </div>

          <h3 className="text-xl font-semibold text-white mb-4 mt-8">Contact Information</h3>
          <div className="mb-6">
            <Input
              label="Phone Number"
              type="tel"
              {...register('phoneNumber')}
            />
          </div>

          <h3 className="text-xl font-semibold text-white mb-4 mt-8">Birthday</h3>
          <div className="mb-6 flex gap-4">
            <Input
              label="Day"
              type="number"
              placeholder="DD"
              {...register('birthDay')}
              min="1"
              max="31"
            />
            <Input
              label="Month"
              type="number"
              placeholder="MM"
              {...register('birthMonth')}
              min="1"
              max="12"
            />
            <Input
              label="Year"
              type="number"
              placeholder="YYYY"
              {...register('birthYear')}
              min="1900"
              max={new Date().getFullYear().toString()}
            />
          </div>
          <div className="mb-6">
            <Input
              label="Website URL"
              type="url"
              {...register('website')}
            />
          </div>
          <div className="mb-6">
            <Input
              label="Email"
              type="email"
              value={session?.user?.email || ''} // Display only, not editable here
              disabled
            />
          </div>

          <Button type="submit" disabled={isSubmitting} variant="primary" size="lg">
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </Button>
        </form>
      </div>
    </div>
  );
}

const Settings = () => {
  const { session, profile } = useAuth(); // Destructure session and profile from useAuth
  const [activeCategory, setActiveCategory] = useState('Profile');

  const baseCategories = [
    { name: 'Profile', icon: User },
    { name: 'Account', icon: Mail },
    { name: 'Notifications', icon: Bell },
    { name: 'Security', icon: Shield },
  ];

  const founderCategories = profile?.role === 'founder'
    ? [...baseCategories, { name: 'Startup', icon: Building }]
    : baseCategories;

  const categories = founderCategories; // Use the conditionally built categories array

  const renderContent = () => {
    switch (activeCategory) {
      case 'Profile':
        return <ProfileSettings />;
      case 'Account':
        return <AccountSettings />;
      case 'Notifications':
        return <NotificationSettings />;
      case 'Security':
        return <SecuritySettings />;
      case 'Startup': // Added Startup case
        return <StartupSettings />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4 text-white">
      <div className="flex flex-col md:flex-row gap-12 mt-4">
        <aside className="w-full md:w-1/4">
          <h1 className="text-3xl font-bold mb-8">Settings</h1>
          <nav className="space-y-2">
            {categories.map(cat => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.name;
              return (
                <button 
                  key={cat.name}
                  onClick={() => setActiveCategory(cat.name)}
                  className={`w-full flex items-center gap-3 p-3 rounded-md text-left transition-colors text-lg ${isActive ? 'bg-custom-cyan/10 text-custom-cyan font-semibold' : 'hover:bg-neutral-800 text-neutral-400'}`}>
                  <Icon className={`h-5 w-5 ${isActive ? 'text-custom-cyan' : 'text-neutral-500'}`} />
                  {cat.name}
                </button>
              )
            })}
          </nav>
        </aside>
        <main className="w-full md:w-3/4">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default Settings;