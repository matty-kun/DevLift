import React, { useState } from 'react';
import Button from '../common/Button';
import Toast from '../common/Toast';

const SecuritySettings: React.FC = () => {
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' as 'success' | 'error' });

  // Placeholder for recent login activity
  const recentLogins = [
    { id: 1, device: 'Chrome on Windows', location: 'New York, USA', time: '2025-09-30 10:30 AM' },
    { id: 2, device: 'Firefox on Mac', location: 'London, UK', time: '2025-09-29 03:15 PM' },
  ];

  const handleToggle2FA = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIs2FAEnabled(!is2FAEnabled);
      setToast({ show: true, message: `Two-Factor Authentication ${is2FAEnabled ? 'disabled' : 'enabled'} successfully!`, type: 'success' });
      setLoading(false);
    }, 1500);
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

      <h2 className="text-2xl font-bold text-white mb-6">Security Settings</h2>

      {/* Two-Factor Authentication Section */}
      <div className="bg-neutral-900 p-8 rounded-lg mb-8">
        <h3 className="text-xl font-semibold text-white mb-4">Two-Factor Authentication (2FA)</h3>
        <p className="text-neutral-400 mb-4">
          Add an extra layer of security to your account by enabling 2FA. This requires a verification code from your phone in addition to your password.
        </p>
        <Button
          onClick={handleToggle2FA}
          disabled={loading}
          variant={is2FAEnabled ? 'danger' : 'primary'}
          size="lg"
        >
          {loading ? 'Processing...' : is2FAEnabled ? 'Disable 2FA' : 'Enable 2FA'}
        </Button>
      </div>

      {/* Recent Login Activity Section */}
      <div className="bg-neutral-900 p-8 rounded-lg">
        <h3 className="text-xl font-semibold text-white mb-4">Recent Login Activity</h3>
        <p className="text-neutral-400 mb-4">Review your recent login sessions.</p>
        <div className="space-y-4">
          {recentLogins.map((login) => (
            <div key={login.id} className="flex justify-between items-center bg-neutral-800 p-4 rounded-md">
              <div>
                <p className="text-white font-medium">{login.device}</p>
                <p className="text-neutral-400 text-sm">{login.location}</p>
              </div>
              <p className="text-neutral-400 text-sm">{login.time}</p>
            </div>
          ))}
          {recentLogins.length === 0 && (
            <p className="text-neutral-400">No recent login activity found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SecuritySettings;
