import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../common/Button';
import Toast from '../common/Toast';
import Modal from '../common/Modal';
import Input from '../common/Input';
import { formatDistanceToNow } from 'date-fns';

interface AuditEvent {
  id: string;
  event_type: string;
  ip_address: string | null;
  user_agent: string | null;
  device: string | null;
  location: string | null;
  created_at: string;
}

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

  // State for recent login activity
  const [recentLogins, setRecentLogins] = useState<AuditEvent[]>([]);
  const [loadingLogins, setLoadingLogins] = useState(true);

  // Helper function to parse user agent
  const parseUserAgent = (userAgent: string | null) => {
    if (!userAgent) return { browser: 'Unknown Browser', os: 'Unknown OS' };

    // Extract browser
    let browser = 'Unknown Browser';
    if (userAgent.includes('Firefox')) browser = 'Firefox';
    else if (userAgent.includes('Edg')) browser = 'Edge';
    else if (userAgent.includes('Chrome')) browser = 'Chrome';
    else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) browser = 'Safari';
    else if (userAgent.includes('Opera') || userAgent.includes('OPR')) browser = 'Opera';

    // Extract OS
    let os = 'Unknown OS';
    if (userAgent.includes('Windows NT 10.0')) os = 'Windows 10/11';
    else if (userAgent.includes('Windows NT 6.3')) os = 'Windows 8.1';
    else if (userAgent.includes('Windows NT 6.2')) os = 'Windows 8';
    else if (userAgent.includes('Windows NT 6.1')) os = 'Windows 7';
    else if (userAgent.includes('Windows')) os = 'Windows';
    else if (userAgent.includes('Mac OS X')) {
      const match = userAgent.match(/Mac OS X ([0-9_]+)/);
      os = match ? `macOS ${match[1].replace(/_/g, '.')}` : 'macOS';
    }
    else if (userAgent.includes('Android')) os = 'Android';
    else if (userAgent.includes('iPhone') || userAgent.includes('iPad')) os = 'iOS';
    else if (userAgent.includes('Linux')) os = 'Linux';

    return { browser, os };
  };

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

  useEffect(() => {
    const fetchRecentLogins = async () => {
      if (!session?.user?.id) return;

      setLoadingLogins(true);
      try {
        const { data, error } = await supabase
          .from('audit_events')
          .select('*')
          .eq('user_id', session.user.id)
          .eq('event_type', 'login')
          .order('created_at', { ascending: false })
          .limit(10);

        if (error) throw error;
        setRecentLogins(data || []);
      } catch (error: any) {
        console.error('Error fetching login history:', error);
      } finally {
        setLoadingLogins(false);
      }
    };

    fetchRecentLogins();
  }, [session?.user?.id]);

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
        {loadingLogins ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-custom-cyan"></div>
            <p className="text-neutral-400 mt-2">Loading login history...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {recentLogins.map((login) => {
              const { browser, os } = parseUserAgent(login.user_agent);
              const displayText = `${browser} on ${os}`;

              return (
                <div key={login.id} className="flex justify-between items-start bg-neutral-800 p-4 rounded-md">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-white font-medium">
                        {displayText}
                      </p>
                      {login.ip_address && (
                        <span className="text-xs text-neutral-500 font-mono">
                          {login.ip_address}
                        </span>
                      )}
                    </div>
                    <p className="text-neutral-500 text-xs mb-1">
                      {login.device || 'Desktop'} Device
                    </p>
                    {login.location && (
                      <p className="text-neutral-400 text-sm">{login.location}</p>
                    )}
                  </div>
                  <p className="text-neutral-400 text-sm whitespace-nowrap ml-4">
                    {formatDistanceToNow(new Date(login.created_at), { addSuffix: true })}
                  </p>
                </div>
              );
            })}
            {recentLogins.length === 0 && (
              <p className="text-neutral-400 text-center py-4">
                No recent login activity found. Login events will appear here after your next sign-in.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SecuritySettings;
