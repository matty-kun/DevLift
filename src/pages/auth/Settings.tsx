import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import ImageUpload from '../../components/common/ImageUpload';
import { User, Bell, Shield, Mail } from 'lucide-react';
import Toast from '../../components/common/Toast';
import BackButton from '../../components/common/BackButton';

// Import placeholder components
import AccountSettings from '../../components/settings/AccountSettings';
import NotificationSettings from '../../components/settings/NotificationSettings';
import SecuritySettings from '../../components/settings/SecuritySettings';

const ProfileSettings = () => {
  const { user, setUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [fullName, setFullName] = useState('');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' as 'success' | 'error' });

  useEffect(() => {
    if (user) {
      setFullName(user.user_metadata.full_name || '');
      setBio(user.user_metadata.bio || '');
      setAvatarUrl(user.user_metadata.avatar_url || '');
    }
    setLoading(false);
  }, [user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { data, error } = await supabase.auth.updateUser({
      data: { full_name: fullName, bio, avatar_url: avatarUrl },
    });

    if (error) {
      setToast({ show: true, message: `Error: ${error.message}`, type: 'error' });
    } else if (data.user) {
      setUser(data.user);
      setToast({ show: true, message: 'Profile updated successfully!', type: 'success' });
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
            <ImageUpload
              onUpload={(url) => setAvatarUrl(url)}
              currentImageUrl={avatarUrl}
            />
          </div>
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
          <Button type="submit" disabled={loading} variant="primary" size="lg">
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </form>
      </div>
    </div>
  );
}

const Settings = () => {
  const [activeCategory, setActiveCategory] = useState('Profile');

  const categories = [
    { name: 'Profile', icon: User },
    { name: 'Account', icon: Mail },
    { name: 'Notifications', icon: Bell },
    { name: 'Security', icon: Shield },
  ];

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