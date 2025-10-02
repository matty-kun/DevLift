import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../common/Button';
import Toast from '../common/Toast';

const NotificationSettings: React.FC = () => {
  const { session } = useAuth();
  const [loading, setLoading] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState({
    newApplications: false,
    newMessages: false,
    platformUpdates: false,
  });
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' as 'success' | 'error' });

  useEffect(() => {
    const fetchNotificationSettings = async () => {
      if (session?.user?.id) {
        // Assuming notification settings are stored in user_metadata or a separate table
        // For now, we'll use user_metadata for simplicity.
        setEmailNotifications({
          newApplications: session.user.user_metadata.notifications?.newApplications || false,
          newMessages: session.user.user_metadata.notifications?.newMessages || false,
          platformUpdates: session.user.user_metadata.notifications?.platformUpdates || false,
        });
      }
      setLoading(false);
    };

    fetchNotificationSettings();
  }, [session?.user?.id]);

  const handleToggle = (key: keyof typeof emailNotifications) => {
    setEmailNotifications((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!session?.user?.id) {
      setToast({ show: true, message: 'User not authenticated.', type: 'error' });
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.updateUser({
      data: { notifications: emailNotifications },
    });

    if (error) {
      setToast({ show: true, message: `Error saving settings: ${error.message}`, type: 'error' });
    } else {
      setToast({ show: true, message: 'Notification settings saved successfully!', type: 'success' });
    }
    setLoading(false);
  };

  if (loading) {
    return <div>Loading...</div>;
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

      <h2 className="text-2xl font-bold text-white mb-6">Notification Settings</h2>

      <div className="bg-neutral-900 p-8 rounded-lg">
        <form onSubmit={handleSaveSettings}>
          <div className="mb-6">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-lg text-white">Email me about new project applications</span>
              <input
                type="checkbox"
                className="sr-only peer"
                checked={emailNotifications.newApplications}
                onChange={() => handleToggle('newApplications')}
              />
              <div className="relative w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-custom-cyan rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-custom-cyan"></div>
            </label>
          </div>

          <div className="mb-6">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-lg text-white">Email me about new messages</span>
              <input
                type="checkbox"
                className="sr-only peer"
                checked={emailNotifications.newMessages}
                onChange={() => handleToggle('newMessages')}
              />
              <div className="relative w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-custom-cyan rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-custom-cyan"></div>
            </label>
          </div>

          <div className="mb-6">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-lg text-white">Email me about platform updates and announcements</span>
              <input
                type="checkbox"
                className="sr-only peer"
                checked={emailNotifications.platformUpdates}
                onChange={() => handleToggle('platformUpdates')}
              />
              <div className="relative w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-custom-cyan rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-custom-cyan"></div>
            </label>
          </div>

          <Button type="submit" disabled={loading} variant="primary" size="lg">
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default NotificationSettings;
