import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import MFAVerifyInput from '../../components/mfa/MFAVerifyInput';
import Logo from '../../assets/DevLift Logo.svg';
import { Shield, LogOut } from 'lucide-react';

const MFAVerify: React.FC = () => {
  const navigate = useNavigate();
  const { session, profile, signOut } = useAuth();
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [factorId, setFactorId] = useState<string | null>(null);

  useEffect(() => {
    // Check if user needs MFA verification
    const checkMFAStatus = async () => {
      if (!session) {
        navigate('/sign-in', { replace: true });
        return;
      }

      // Check AAL using the proper async method
      const { data: aalData, error: aalError } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();

      if (aalError) {
        console.error('Error getting AAL:', aalError);
      }

      console.log('MFAVerify - AAL data:', aalData);

      // User already verified MFA (currentLevel is aal2)
      if (aalData?.currentLevel === 'aal2') {
        console.log('Already at aal2, redirecting to dashboard');
        const role = profile?.role;
        const dest = role === 'mentor' || role === 'founder' ? '/founder-dashboard' : '/student-dashboard';
        navigate(dest, { replace: true });
        return;
      }

      // Get the user's MFA factors
      const { data: factors } = await supabase.auth.mfa.listFactors();
      const verifiedFactor = factors?.totp?.find((f) => f.status === 'verified');

      console.log('Verified factor:', verifiedFactor);

      if (verifiedFactor) {
        setFactorId(verifiedFactor.id);
      } else {
        // No verified MFA factor found, redirect to sign in
        console.log('No verified factor, redirecting to sign-in');
        navigate('/sign-in', { replace: true });
      }
    };

    checkMFAStatus();
  }, [session, profile, navigate]);

  const handleVerifyCode = async (code: string) => {
    if (!factorId) {
      setError('MFA factor not found. Please sign in again.');
      return;
    }

    try {
      setVerifying(true);
      setError(null);

      // Create challenge
      const { data: challengeData, error: challengeError } = await supabase.auth.mfa.challenge({
        factorId,
      });

      if (challengeError) throw challengeError;

      // Verify code
      const { data: verifyData, error: verifyError } = await supabase.auth.mfa.verify({
        factorId,
        challengeId: challengeData.id,
        code,
      });

      if (verifyError) throw verifyError;

      console.log('✅ MFA verification successful', verifyData);

      // CRITICAL: The verify response contains new tokens, but we need to explicitly
      // set them to ensure the session is upgraded to aal2
      if (verifyData.access_token && verifyData.refresh_token) {
        const { error: sessionError } = await supabase.auth.setSession({
          access_token: verifyData.access_token,
          refresh_token: verifyData.refresh_token,
        });

        if (sessionError) {
          console.error('Error setting session:', sessionError);
          throw sessionError;
        }

        // Give the auth state listener time to process the new session
        await new Promise(resolve => setTimeout(resolve, 300));
      }

      // Verify AAL has been upgraded
      const { data: aalData } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
      console.log('AAL after verification:', aalData);

      // Get user role and redirect
      const { data: userRes } = await supabase.auth.getUser();
      const userId = userRes.user?.id;
      let dest = '/projects';

      if (userId) {
        const { data: prof } = await supabase
          .from('users')
          .select('role')
          .eq('id', userId)
          .maybeSingle();

        const role = (prof as { role?: string } | null)?.role;
        if (role === 'mentor' || role === 'founder') {
          dest = '/founder-dashboard';
        } else if (role) {
          dest = '/student-dashboard';
        }
      }

      console.log('Redirecting to:', dest);
      navigate(dest, { replace: true });
    } catch (err: any) {
      console.error('MFA verification error:', err);
      setError(err.message || 'Invalid code. Please try again.');
      setVerifying(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/sign-in', { replace: true });
  };

  return (
    <div className="h-screen bg-black relative overflow-hidden flex items-center justify-center">
      {/* Background decorative elements */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute -right-10 -top-10 h-72 w-72 rounded-full bg-custom-cyan opacity-60 blur-3xl"></div>
        <div className="absolute left-1/4 top-32 h-48 w-48 rounded-full bg-custom-purple opacity-60 blur-3xl"></div>
        <div className="absolute left-1/20 bottom-1 h-48 w-48 rounded-full bg-white opacity-60 blur-3xl"></div>
        <div className="absolute right-1/3 bottom-0 h-64 w-64 rounded-full bg-custom-orange opacity-60 blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10 py-12">
        <div className="max-w-md mx-auto">
          {/* Logo */}
          <div className="text-center mb-8">
            <img src={Logo} alt="Logo" className="w-48 mx-auto h-auto pb-5" />
          </div>

          {/* Card */}
          <div className="rounded-xl border border-[#232336] bg-[#0b0b10] p-8 shadow-lg">
            {/* Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-custom-cyan/10 rounded-full flex items-center justify-center">
                <Shield className="w-8 h-8 text-custom-cyan" />
              </div>
            </div>

            {/* Title */}
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-white mb-2">Two-Factor Authentication</h1>
              <p className="text-neutral-400 text-sm">
                Enter the 6-digit code from your authenticator app
              </p>
            </div>

            {/* MFA Input */}
            <div className="mb-6">
              <MFAVerifyInput
                onComplete={handleVerifyCode}
                loading={verifying}
                error={error}
              />
            </div>

            {/* Help text */}
            <div className="text-center text-sm text-neutral-500 mb-6">
              Lost access to your authenticator?{' '}
              <button
                onClick={handleLogout}
                className="text-custom-cyan hover:underline"
              >
                Sign in with a different account
              </button>
            </div>

            {/* Logout button */}
            <button
              onClick={handleLogout}
              disabled={verifying}
              className="w-full flex items-center justify-center gap-2 bg-[#232336] text-white py-2 rounded-lg hover:bg-[#2a2a3e] transition-colors disabled:opacity-50"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>

          <div className="text-center mt-6">
            <p className="text-neutral-500 text-xs">Made by a Student - Jieson Delafuente</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MFAVerify;
