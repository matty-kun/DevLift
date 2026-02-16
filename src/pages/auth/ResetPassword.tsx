import React, { useState, useEffect, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, CheckCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import Logo from '../../assets/DevLift Logo.svg';

const ResetPassword: React.FC = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [validToken, setValidToken] = useState<boolean | null>(null);

  useEffect(() => {
    // Check if we have a valid session (from reset token)
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        setValidToken(false);
        setError('Invalid or expired reset link. Please request a new one.');
      } else {
        setValidToken(true);
      }
    };

    checkSession();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (password.length < 7) {
      setError('Password must be at least 7 characters long');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) throw error;

      setSuccess(true);

      // Redirect to sign in after 3 seconds
      setTimeout(() => {
        navigate('/sign-in', { replace: true });
      }, 3000);
    } catch (err: unknown) {
      const hasMessage = (e: unknown): e is { message: string } =>
        typeof e === 'object' && e !== null && 'message' in e && typeof (e as { message: unknown }).message === 'string';
      setError(hasMessage(err) ? err.message : 'Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Show loading state while checking token
  if (validToken === null) {
    return (
      <div className="h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-custom-cyan mx-auto"></div>
          <p className="text-neutral-400 mt-4">Verifying reset link...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-black relative overflow-y-hidden flex items-center justify-center">
      {/* Background decorative elements */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute -right-10 -top-10 h-72 w-72 rounded-full bg-custom-cyan opacity-60 blur-3xl"></div>
        <div className="absolute left-1/4 top-32 h-48 w-48 rounded-full bg-custom-purple opacity-60 blur-3xl"></div>
        <div className="absolute left-1/20 bottom-1 h-48 w-48 rounded-full bg-white opacity-60 blur-3xl"></div>
        <div className="absolute right-1/3 bottom-0 h-64 w-64 rounded-full bg-custom-orange opacity-60 blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10 py-12">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <img src={Logo} alt="DevLift Logo" className="w-48 mx-auto h-auto pb-5" />
            {success ? (
              <>
                <div className="flex justify-center mb-4">
                  <div className="bg-custom-cyan/20 p-3 rounded-full">
                    <CheckCircle className="w-12 h-12 text-custom-cyan" />
                  </div>
                </div>
                <h1 className="text-3xl font-bold text-white mb-2">Password Reset Successful!</h1>
                <p className="text-neutral-400">You can now sign in with your new password.</p>
              </>
            ) : (
              <>
                <h1 className="text-3xl font-bold text-white mb-2">Set New Password</h1>
                <p className="text-neutral-400">Choose a strong password for your account.</p>
              </>
            )}
          </div>

          {/* Card wrapper */}
          <div className="rounded-xl border border-[#232336] bg-[#0b0b10] p-6 shadow-lg">
            {!validToken ? (
              // Invalid Token State
              <div className="space-y-4">
                <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg">
                  {error}
                </div>
                <button
                  onClick={() => navigate('/forgot-password')}
                  className="w-full bg-custom-cyan text-black border-none py-3 rounded-md text-base font-bold cursor-pointer transition duration-200 shadow-md hover:brightness-110"
                >
                  Request New Reset Link
                </button>
              </div>
            ) : success ? (
              // Success State
              <div className="space-y-4">
                <div className="bg-custom-cyan/10 border border-custom-cyan/30 rounded-lg p-4">
                  <p className="text-sm text-neutral-300 text-center">
                    Redirecting to sign in page in 3 seconds...
                  </p>
                </div>
                <button
                  onClick={() => navigate('/sign-in')}
                  className="w-full bg-custom-cyan text-black border-none py-3 rounded-md text-base font-bold cursor-pointer transition duration-200 shadow-md hover:brightness-110"
                >
                  Sign In Now
                </button>
              </div>
            ) : (
              // Reset Form
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* New Password */}
                <div className="mb-3">
                  <label className="block text-sm font-medium text-white mb-2">New Password</label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
                      <Lock className="h-5 w-5" />
                    </div>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter new password"
                      required
                      minLength={7}
                      className="w-full pl-11 pr-4 py-3 border border-[#232336] rounded-md bg-black text-white text-base transition duration-200 focus:border-custom-purple focus:bg-[#0302025f] outline-none"
                    />
                  </div>
                  <p className="text-xs text-neutral-500 mt-1">Must be at least 7 characters</p>
                </div>

                {/* Confirm Password */}
                <div className="mb-3">
                  <label className="block text-sm font-medium text-white mb-2">Confirm Password</label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
                      <Lock className="h-5 w-5" />
                    </div>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm your password"
                      required
                      className="w-full pl-11 pr-4 py-3 border border-[#232336] rounded-md bg-black text-white text-base transition duration-200 focus:border-custom-purple focus:bg-[#0302025f] outline-none"
                    />
                  </div>
                </div>

                {/* Password Strength Indicator */}
                {password.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className={`h-1 flex-1 rounded-full transition-colors ${
                        password.length < 7 ? 'bg-red-500' :
                        password.length < 10 ? 'bg-yellow-500' :
                        'bg-green-500'
                      }`} />
                      <div className={`h-1 flex-1 rounded-full transition-colors ${
                        password.length < 10 ? 'bg-neutral-700' : 'bg-green-500'
                      }`} />
                      <div className={`h-1 flex-1 rounded-full transition-colors ${
                        password.length < 14 ? 'bg-neutral-700' : 'bg-green-500'
                      }`} />
                    </div>
                    <p className="text-xs text-neutral-400">
                      {password.length < 7 ? 'Weak password' :
                       password.length < 10 ? 'Good password' :
                       'Strong password'}
                    </p>
                  </div>
                )}

                {error && (
                  <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-2 rounded-lg">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-custom-cyan text-black border-none py-3 rounded-md text-base font-bold cursor-pointer transition duration-200 shadow-md hover:brightness-110 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? 'Resetting...' : 'Reset Password'}
                </button>
              </form>
            )}
          </div>

          <div className="text-center mt-6">
            <p className="text-neutral-500 text-xs">Made by a Student - Jieson Delafuente</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
