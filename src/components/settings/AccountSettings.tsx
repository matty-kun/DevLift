import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext'; // Import useAuth
import { useNavigate } from 'react-router-dom';
import { ArrowRightLeft } from 'lucide-react';
import Button from '../common/Button';
import Input from '../common/Input';
import Toast from '../common/Toast';
import Modal from '../common/Modal';

const AccountSettings: React.FC = () => {
  const { session, profile, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [emailUpdateLoading, setEmailUpdateLoading] = useState(false);
  const [backupEmail, setBackupEmail] = useState(session?.user?.user_metadata?.backup_email || '');
  const [backupEmailLoading, setBackupEmailLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' as 'success' | 'error' });

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordLoading(true);

    if (newPassword !== confirmNewPassword) {
      setToast({ show: true, message: 'New passwords do not match.', type: 'error' });
      setPasswordLoading(false);
      return;
    }

    // First, verify the current password by trying to sign in with it.
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: session!.user.email!,
      password: currentPassword,
    });

    if (signInError) {
      setToast({ show: true, message: `Incorrect current password. Please try again.`, type: 'error' });
    } else {
      // If current password is correct, update to the new password.
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) {
        setToast({ show: true, message: `Error changing password: ${updateError.message}`, type: 'error' });
      } else {
        setToast({ show: true, message: 'Password updated successfully!', type: 'success' });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
      }
    }
    setPasswordLoading(false);
  };

  const handleEmailUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailUpdateLoading(true);

    if (!newEmail) {
      setToast({ show: true, message: 'Please enter a new email address.', type: 'error' });
      setEmailUpdateLoading(false);
      return;
    }

    const { error } = await supabase.auth.updateUser({
      email: newEmail,
    });

    if (error) {
      setToast({ show: true, message: `Error updating email: ${error.message}`, type: 'error' });
    } else {
      setToast({ show: true, message: 'Email update initiated. Please check your new email for a confirmation link.', type: 'success' });
      setNewEmail('');
    }
    setEmailUpdateLoading(false);
  };

  const handleBackupEmailUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setBackupEmailLoading(true);

    if (!backupEmail) {
      setToast({ show: true, message: 'Please enter a backup email address.', type: 'error' });
      setBackupEmailLoading(false);
      return;
    }

    const { error } = await supabase.auth.updateUser({
      data: { backup_email: backupEmail },
    });

    if (error) {
      setToast({ show: true, message: `Error updating backup email: ${error.message}`, type: 'error' });
    } else {
      setToast({ show: true, message: 'Backup email updated successfully!', type: 'success' });
    }
    setBackupEmailLoading(false);
  };

  const handleRoleSwitch = async () => {
    const newRole = profile?.role === 'student' ? 'founder' : 'student';

    const { error } = await supabase
      .from('users')
      .update({ role: newRole })
      .eq('id', session!.user.id);

    if (error) {
      setToast({ show: true, message: `Error switching role: ${error.message}`, type: 'error' });
    } else {
      await refreshProfile();
      setToast({ show: true, message: `Successfully switched to ${newRole}!`, type: 'success' });

      // Navigate to the appropriate dashboard
      setTimeout(() => {
        navigate(newRole === 'founder' ? '/founder-dashboard' : '/student-dashboard');
      }, 1500);
    }
  };

  const handleDeleteAccount = async () => {
    setDeleteLoading(true);

    const { error } = await supabase.functions.invoke('delete-user', {
      method: 'POST',
    });

    if (error) {
      setToast({ show: true, message: `Error deleting account: ${error.message}`, type: 'error' });
      setDeleteLoading(false);
    } else {
      setToast({ show: true, message: 'Account deleted successfully.', type: 'success' });
      // Sign out the user
      await supabase.auth.signOut();
      // Redirect to home page
      navigate('/');
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

      <h2 className="text-2xl font-bold text-white mb-6">Account Settings</h2>

      {/* Email Address Section */}
      <div className="bg-neutral-900 p-8 rounded-lg mb-8">
        <h3 className="text-xl font-semibold text-white mb-4">Primary Email Address</h3>
        <p className="text-neutral-400 mb-4">Your current primary email address is: <span className="font-medium text-white">{session?.user?.email || 'N/A'}</span></p>
        <form onSubmit={handleEmailUpdate}>
          <div className="mb-6">
            <Input
              label="New Primary Email Address"
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              required
            />
          </div>
          <Button type="submit" disabled={emailUpdateLoading} variant="primary" size="lg">
            {emailUpdateLoading ? 'Updating...' : 'Update Primary Email'}
          </Button>
        </form>
      </div>

      {/* Backup Email Address Section */}
      <div className="bg-neutral-900 p-8 rounded-lg mb-8">
        <h3 className="text-xl font-semibold text-white mb-4">Backup Email Address</h3>
        <p className="text-neutral-400 mb-4">Your current backup email address is: <span className="font-medium text-white">{session?.user?.user_metadata?.backup_email || 'N/A'}</span></p>
        <form onSubmit={handleBackupEmailUpdate}>
          <div className="mb-6">
            <Input
              label="Backup Email Address"
              type="email"
              value={backupEmail}
              onChange={(e) => setBackupEmail(e.target.value)}
            />
          </div>
          <Button type="submit" disabled={backupEmailLoading} variant="primary" size="lg">
            {backupEmailLoading ? 'Updating...' : 'Update Backup Email'}
          </Button>
        </form>
      </div>

      {/* Password Change Section */}
      <div className="bg-neutral-900 p-8 rounded-lg mb-8">
        <h3 className="text-xl font-semibold text-white mb-4">Change Password</h3>
        <form onSubmit={handlePasswordChange}>
          <div className="mb-6">
            <Input
              label="Current Password"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <Input
              label="New Password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <Input
              label="Confirm New Password"
              type="password"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" disabled={passwordLoading} variant="primary" size="lg">
            {passwordLoading ? 'Changing...' : 'Change Password'}
          </Button>
        </form>
      </div>

      {/* Role Switcher Section */}
      <div className="bg-neutral-900 p-8 rounded-lg mb-8">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <ArrowRightLeft className="h-5 w-5" />
          Switch Role
        </h3>
        <p className="text-neutral-400 mb-4">
          Current role: <span className="font-medium text-white capitalize">{profile?.role || 'N/A'}</span>
        </p>
        <p className="text-neutral-400 mb-6">
          Switch between Student and Founder roles to access different features and dashboards.
        </p>
        <Button
          onClick={handleRoleSwitch}
          variant="primary"
          size="lg"
          leftIcon={<ArrowRightLeft className="h-4 w-4" />}
        >
          Switch to {profile?.role === 'student' ? 'Founder' : 'Student'}
        </Button>
      </div>

      {/* Delete Account Section */}
      <div className="bg-red-900/20 border border-red-700 p-8 rounded-lg">
        <h3 className="text-xl font-semibold text-red-400 mb-4">Danger Zone</h3>
        <p className="text-neutral-400 mb-6">Permanently delete your account and all associated data. This action cannot be undone.</p>
        <Button onClick={() => setShowDeleteModal(true)} variant="secondary" size="lg" className="bg-red-600 hover:bg-red-700 focus:ring-red-500">
          Delete Account
        </Button>
      </div>

      {/* Delete Account Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Confirm Account Deletion"
      >
        <p className="text-neutral-300 mb-6">Are you sure you want to delete your account? All your data will be permanently removed. This action cannot be undone.</p>
        <div className="flex justify-end gap-4">
          <Button onClick={() => setShowDeleteModal(false)} variant="outline">
            Cancel
          </Button>
          <Button onClick={handleDeleteAccount} variant="secondary" className="bg-red-600 hover:bg-red-700 focus:ring-red-500" disabled={deleteLoading}>
            {deleteLoading ? 'Deleting...' : 'Delete My Account'}
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default AccountSettings;
