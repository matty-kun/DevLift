import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { User, Bell, Shield, Mail, Building } from 'lucide-react'; // Added Building
import Toast from '../../components/common/Toast';
import BackButton from '../../components/common/BackButton';

// Import placeholder components
import AccountSettings from '../../components/settings/AccountSettings';
import NotificationSettings from '../../components/settings/NotificationSettings';
import SecuritySettings from '../../components/settings/SecuritySettings';
import StartupSettings from '../../components/settings/StartupSettings'; // Added StartupSettings

const ProfileSettings = () => {
  const { session, profile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [fullName, setFullName] = useState('');
  const [bio, setBio] = useState('');
  const [position, setPosition] = useState(''); // Renamed from currentPosition
  const [industry, setIndustry] = useState('');
  const [school, setSchool] = useState(''); // Renamed from education
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [birthDay, setBirthDay] = useState('');
  const [birthMonth, setBirthMonth] = useState('');
  const [birthYear, setBirthYear] = useState('');
  const [website, setWebsite] = useState('');
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' as 'success' | 'error' });

  useEffect(() => {
    console.log('ProfileSettings useEffect - profile:', profile);
    if (profile) {
      setFullName(profile.full_name || '');
      setBio(session?.user?.user_metadata?.bio || '');
      setPosition(session?.user?.user_metadata?.position || ''); // Renamed from current_position
      setIndustry(session?.user?.user_metadata?.industry || '');
      setSchool(session?.user?.user_metadata?.school || ''); // Renamed from education
      setCountry(session?.user?.user_metadata?.country || '');
      setCity(session?.user?.user_metadata?.city || '');
      setPhoneNumber(session?.user?.user_metadata?.phone_number || '');

      const userBirthday = session?.user?.user_metadata?.birthday;
      if (userBirthday) {
        const [year, month, day] = userBirthday.split('-');
        setBirthDay(day || '');
        setBirthMonth(month || '');
        setBirthYear(year || '');
      }
      setWebsite(session?.user?.user_metadata?.website || '');
    }
    setLoading(false);
  }, [profile, session]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    console.log('handleUpdateProfile - Submitting data:', {
      full_name: fullName,
      bio,
      position,
      industry,
      school,
      country,
      city,
      phone_number: phoneNumber,
      birthday: birthYear && birthMonth && birthDay ? `${birthYear}-${birthMonth.padStart(2, '0')}-${birthDay.padStart(2, '0')}` : '',
      website,
    });

    try {
      const birthdayString = birthYear && birthMonth && birthDay
        ? `${birthYear}-${birthMonth.padStart(2, '0')}-${birthDay.padStart(2, '0')}`
        : '';

      // Update public.users table
      const { error: profileUpdateError } = await supabase
        .from('users')
        .update({
          full_name: fullName,
        })
        .eq('id', session?.user?.id);

      if (profileUpdateError) {
        throw profileUpdateError;
      }

      // Update auth.users.user_metadata
      const { data, error: authUpdateError } = await supabase.auth.updateUser({
        data: {
          bio,
          position,
          industry,
          school,
          country,
          city,
          phone_number: phoneNumber,
          birthday: birthdayString,
          website,
        },
      });

      if (authUpdateError) {
        console.error('Supabase auth update error:', authUpdateError);
        setToast({ show: true, message: `Error: ${authUpdateError.message}`, type: 'error' });
      } else if (data.user) {
        console.log('Supabase update successful. New user data:', data.user);
        setToast({ show: true, message: 'Profile updated successfully!', type: 'success' });
      }
    } catch (error: any) {
      console.error('Profile update caught error:', error);
      setToast({ show: true, message: `Error updating profile: ${error.message}`, type: 'error' });
    }
    setLoading(false);
  };

  if (loading) {
      return <div>Loading...</div>
  }

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
        <form onSubmit={handleUpdateProfile}>
          <div className="mb-6">
            <Input
              label="Full Name"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-neutral-400 mb-2">Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full p-3 border border-neutral-700 rounded-md bg-neutral-800 text-white focus:ring-2 focus:ring-custom-cyan transition"
              rows={4}
            />
          </div>

          <h3 className="text-xl font-semibold text-white mb-4 mt-8">Current Position</h3>
          <div className="mb-6">
            <Input
              label="Position"
              type="text"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <Input
              label="Industry"
              type="text"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
            />
          </div>

          <h3 className="text-xl font-semibold text-white mb-4 mt-8">Education</h3>
          <div className="mb-6">
            <Input
              label="School"
              type="text"
              value={school}
              onChange={(e) => setSchool(e.target.value)}
            />
          </div>

          <h3 className="text-xl font-semibold text-white mb-4 mt-8">Location</h3>
          <div className="mb-6">
            <Input
              label="Country/Region"
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <Input
              label="City"
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>

          <h3 className="text-xl font-semibold text-white mb-4 mt-8">Contact Information</h3>
          <div className="mb-6">
            <Input
              label="Phone Number"
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>

          <h3 className="text-xl font-semibold text-white mb-4 mt-8">Birthday</h3>
          <div className="mb-6 flex gap-4">
            <Input
              label="Day"
              type="number"
              placeholder="DD"
              value={birthDay}
              onChange={(e) => setBirthDay(e.target.value)}
              min="1"
              max="31"
            />
            <Input
              label="Month"
              type="number"
              placeholder="MM"
              value={birthMonth}
              onChange={(e) => setBirthMonth(e.target.value)}
              min="1"
              max="12"
            />
            <Input
              label="Year"
              type="number"
              placeholder="YYYY"
              value={birthYear}
              onChange={(e) => setBirthYear(e.target.value)}
              min="1900"
              max={new Date().getFullYear().toString()}
            />
          </div>
          <div className="mb-6">
            <Input
              label="Website URL"
              type="url"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
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

          <Button type="submit" disabled={loading} variant="primary" size="lg">
            {loading ? 'Saving...' : 'Save Changes'}
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
      <BackButton to="/founder-dashboard" text="Back to Dashboard" />
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