import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../common/Button';
import Toast from '../common/Toast';
import { formatDistanceToNow } from 'date-fns';
import { Shield, ShieldCheck } from 'lucide-react';
import type { Factor } from '@supabase/supabase-js';
import MFAEnrollDialog from '../mfa/MFAEnrollDialog';
import MFAFactorsList from '../mfa/MFAFactorsList';

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
  const { session, signOut } = useAuth();
  const [mfaFactors, setMfaFactors] = useState<Factor[]>([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' as 'success' | 'error' | 'info' });

  // State for 2FA enrollment modal
  const [showEnrollDialog, setShowEnrollDialog] = useState(false);

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
    loadMfaFactors();
  }, [session]);

  const loadMfaFactors = async () => {
    if (!session?.user) return;

    try {
      const { data } = await supabase.auth.mfa.listFactors();
      setMfaFactors(data?.all || []);
    } catch (error) {
      console.error('Error loading MFA factors:', error);
    }
  };

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

  const handleEnrollSuccess = () => {
    setToast({ show: true, message: '2FA enabled successfully!', type: 'success' });
    loadMfaFactors();
  };

  const handleUnenroll = async (factorId: string) => {
    try {
      setLoading(true);

      // Check if we need AAL2 (MFA verification) to unenroll - MUST be async
      const { data: aalData, error: aalError } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();

      if (aalError) {
        console.error('Error getting AAL:', aalError);
      }

      console.log('Current AAL for unenroll:', aalData);

      if (aalData?.currentLevel !== 'aal2') {
        setToast({
          show: true,
          message: 'For security, you must verify your 2FA code before removing it. Please sign out and sign in again with MFA verification.',
          type: 'error',
        });
        setLoading(false);
        return;
      }

      const { error } = await supabase.auth.mfa.unenroll({ factorId });

      if (error) throw error;

      setToast({ show: true, message: '2FA factor removed. Signing out for security...', type: 'info' });

      // Sign out for security after removing MFA
      setTimeout(async () => {
        await signOut();
      }, 2000);
    } catch (error: any) {
      setToast({ show: true, message: `Error removing 2FA: ${error.message}`, type: 'error' });
    } finally {
      setLoading(false);
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

      <h2 className="text-2xl font-bold text-white mb-6">Security Settings</h2>

      {/* Two-Factor Authentication Section */}
      <div className="bg-neutral-900 p-8 rounded-lg mb-8">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            {mfaFactors.length > 0 ? (
              <ShieldCheck className="w-6 h-6 text-green-500" />
            ) : (
              <Shield className="w-6 h-6 text-neutral-500" />
            )}
            <div>
              <h3 className="text-xl font-semibold text-white">Two-Factor Authentication (2FA)</h3>
              {mfaFactors.length > 0 && (
                <span className="text-sm text-green-500">Enabled</span>
              )}
            </div>
          </div>
        </div>

        <p className="text-neutral-400 mb-6">
          Add an extra layer of security to your account by enabling 2FA. This requires a verification code from your authenticator app in addition to your password.
        </p>

        {/* MFA Factors List */}
        <div className="mb-6">
          <MFAFactorsList factors={mfaFactors} onUnenroll={handleUnenroll} />
        </div>

        {/* Enable Button - only show if no factors enrolled */}
        {mfaFactors.length === 0 && (
          <Button
            onClick={() => setShowEnrollDialog(true)}
            disabled={loading}
            variant="primary"
            size="lg"
          >
            Enable Two-Factor Authentication
          </Button>
        )}

        {/* Info message if already enrolled */}
        {mfaFactors.length > 0 && (
          <div className="bg-green-500/10 border border-green-500 text-green-400 px-4 py-3 rounded-lg">
            <p className="text-sm">
              ✅ Two-Factor Authentication is active. Your account is protected with an additional security layer.
            </p>
          </div>
        )}
      </div>

      {/* MFA Enrollment Dialog */}
      <MFAEnrollDialog
        isOpen={showEnrollDialog}
        onClose={() => setShowEnrollDialog(false)}
        onSuccess={handleEnrollSuccess}
      />

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
