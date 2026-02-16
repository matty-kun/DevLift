import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import LoadingScreen from '../common/LoadingScreen';

interface MFAProtectedRouteProps {
  children: React.ReactElement;
}

/**
 * MFA-aware route protection wrapper
 * Ensures users with enrolled MFA must verify before accessing protected routes
 */
const MFAProtectedRoute: React.FC<MFAProtectedRouteProps> = ({ children }) => {
  const { session, loading, profile, profileLoading } = useAuth();
  const [mfaChecking, setMfaChecking] = useState(true);
  const [needsMFAVerification, setNeedsMFAVerification] = useState(false);

  useEffect(() => {
    const checkMFARequirement = async () => {
      if (!session) {
        setMfaChecking(false);
        return;
      }

      try {
        // Check if user has enrolled MFA factors
        const { data: factors } = await supabase.auth.mfa.listFactors();
        const hasVerifiedFactor = factors?.totp?.some((f) => f.status === 'verified');

        if (hasVerifiedFactor) {
          // User has MFA enrolled, check their authenticator assurance level
          const { data: aalData, error: aalError } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();

          if (aalError) {
            console.error('Error getting AAL:', aalError);
          }

          console.log('MFAProtectedRoute - AAL check:', aalData);

          // If current level is aal1 and next level is aal2, they need to verify MFA
          if (aalData?.currentLevel === 'aal1' && aalData?.nextLevel === 'aal2') {
            console.log('MFA required but not verified - redirecting to MFA verify');
            setNeedsMFAVerification(true);
          } else if (aalData?.currentLevel !== 'aal2') {
            // Fallback: if we can't determine AAL properly but they have MFA enrolled
            console.log('AAL unclear, checking session directly');
            const { data: { session: currentSession } } = await supabase.auth.getSession();
            const currentAAL = currentSession?.user?.aal;

            if (!currentAAL || currentAAL === 'aal1') {
              console.log('MFA required but not verified - redirecting to MFA verify');
              setNeedsMFAVerification(true);
            }
          }
        }
      } catch (error) {
        console.error('Error checking MFA requirement:', error);
      } finally {
        setMfaChecking(false);
      }
    };

    checkMFARequirement();
  }, [session]);

  // Show loading while checking auth and MFA status
  if (loading || profileLoading || mfaChecking) {
    return <LoadingScreen />;
  }

  // Not authenticated - redirect to sign in
  if (!session) {
    return <Navigate to="/sign-in" replace />;
  }

  // Needs MFA verification - redirect to MFA page
  if (needsMFAVerification) {
    return <Navigate to="/mfa-verify" replace />;
  }

  // Check onboarding status
  const needsOnboarding = !profile?.role || profile?.onboarding_completed === false;
  if (needsOnboarding) {
    return <Navigate to="/onboarding" replace />;
  }

  // All checks passed - render the protected content
  return children;
};

export default MFAProtectedRoute;
