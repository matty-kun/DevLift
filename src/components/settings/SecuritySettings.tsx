import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../common/Button';
import Toast from '../common/Toast';
import Modal from '../common/Modal';
import Input from '../common/Input';

const SecuritySettings: React.FC = () => {
  const { session } = useAuth();
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' as 'success' | 'error' | 'info' });

  // State for 2FA enrollment modal
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [mfaSecret, setMfaSecret] = useState<string | null>(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [factorId, setFactorId] = useState<string | null>(null);
  const [challengeId, setChallengeId] = useState<string | null>(null);

  useEffect(() => {
    const check2FAStatus = async () => {
      if (session?.user) {
        const { data } = await supabase.auth.mfa.listFactors();
        if (data && data.totp.length > 0) {
          setIs2FAEnabled(true);
        }
      }
    };
    check2FAStatus();
  }, [session]);

  // Placeholder for recent login activity
  const recentLogins = [
    { id: 1, device: 'Chrome on Windows', location: 'New York, USA', time: '2025-09-30 10:30 AM' },
    { id: 2, device: 'Firefox on Mac', location: 'London, UK', time: '2025-09-29 03:15 PM' },
  ];

  const handleEnable2FA = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.mfa.enroll({
        factorType: 'totp',
      });

      if (error) throw error;

      setFactorId(data.id);
      setMfaSecret(data.totp.secret);
      setQrCode(data.totp.qr_code);
      setShow2FAModal(true);
    } catch (error: any) {
      setToast({ show: true, message: `Error enabling 2FA: ${error.message}`, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleVerify2FA = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!factorId || !verificationCode) return;
    setLoading(true);

    try {
      // First, challenge the factor
      const { data: challengeData, error: challengeError } = await supabase.auth.mfa.challenge({ factorId });
      if (challengeError) throw challengeError;

      // Then, verify the code against the challenge
      const { error: verifyError } = await supabase.auth.mfa.verify({
        factorId,
        challengeId: challengeData.id,
        code: verificationCode,
      });

      if (verifyError) throw verifyError;

      setToast({ show: true, message: '2FA enabled successfully!', type: 'success' });
      setIs2FAEnabled(true);
      setShow2FAModal(false);
      setQrCode(null);
      setMfaSecret(null);
      setVerificationCode('');
    } catch (error: any) {
      setToast({ show: true, message: `Error verifying code: ${error.message}`, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleDisable2FA = async () => {
    // This would involve listing factors and unenrolling them.
    // For now, we'll just show a placeholder message.
    setToast({
      show: true,
      message: 'Disabling 2FA is not yet implemented.',
      type: 'info',
    });
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
          onClick={is2FAEnabled ? handleDisable2FA : handleEnable2FA}
          disabled={loading}
          variant={is2FAEnabled ? 'danger' : 'primary'}
          size="lg"
        >
          {loading ? 'Processing...' : is2FAEnabled ? 'Disable 2FA' : 'Enable 2FA'}
        </Button>
      </div>

      {/* 2FA Enrollment Modal */}
      <Modal isOpen={show2FAModal} onClose={() => setShow2FAModal(false)} title="Enable Two-Factor Authentication">
        <div className="text-center">
          <p className="text-neutral-300 mb-4">Scan the QR code with your authenticator app (e.g., Google Authenticator, Authy).</p>
          {qrCode && (
            <div className="bg-white p-4 rounded-lg inline-block mb-4" dangerouslySetInnerHTML={{ __html: qrCode }} />
          )}
          <p className="text-neutral-400 text-sm mb-4">
            Or manually enter this secret key:
            <code className="block bg-neutral-800 p-2 rounded-md mt-2 text-custom-cyan font-mono">{mfaSecret}</code>
          </p>
          <form onSubmit={handleVerify2FA}>
            <Input
              label="Verification Code"
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              placeholder="Enter the 6-digit code"
              required
              className="text-center"
            />
            <div className="flex justify-end gap-4 mt-6">
              <Button type="button" onClick={() => setShow2FAModal(false)} variant="outline">
                Cancel
              </Button>
              <Button type="submit" variant="primary" disabled={loading}>
                {loading ? 'Verifying...' : 'Verify & Enable'}
              </Button>
            </div>
          </form>
        </div>
      </Modal>

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
