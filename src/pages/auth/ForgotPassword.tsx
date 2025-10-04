import React, { useState, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import Logo from '../../assets/DevLift Logo.svg';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      setSuccess(true);
    } catch (err: unknown) {
      const hasMessage = (e: unknown): e is { message: string } =>
        typeof e === 'object' && e !== null && 'message' in e && typeof (e as { message: unknown }).message === 'string';
      setError(hasMessage(err) ? err.message : 'Failed to send reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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
          {/* Back to Sign In Link */}
          <Link
            to="/sign-in"
            className="inline-flex items-center gap-2 text-neutral-400 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Sign In
          </Link>

          <div className="text-center mb-8">
            <img src={Logo} alt="DevLift Logo" className="w-48 mx-auto h-auto pb-5" />
            {!success ? (
              <>
                <h1 className="text-3xl font-bold text-white mb-2">Forgot Password?</h1>
                <p className="text-neutral-400">No worries, we'll send you reset instructions.</p>
              </>
            ) : (
              <>
                <div className="flex justify-center mb-4">
                  <div className="bg-custom-cyan/20 p-3 rounded-full">
                    <CheckCircle className="w-12 h-12 text-custom-cyan" />
                  </div>
                </div>
                <h1 className="text-3xl font-bold text-white mb-2">Check your email</h1>
                <p className="text-neutral-400">We've sent password reset instructions to</p>
                <p className="text-white font-medium mt-1">{email}</p>
              </>
            )}
          </div>

          {/* Card wrapper */}
          <div className="rounded-xl border border-[#232336] bg-[#0b0b10] p-6 shadow-lg">
            {!success ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email */}
                <div className="mb-3">
                  <label className="block text-sm font-medium text-white mb-2">Email Address</label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
                      <Mail className="h-5 w-5" />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      required
                      className="w-full pl-11 pr-4 py-3 border border-[#232336] rounded-md bg-black text-white text-base transition duration-200 focus:border-custom-purple focus:bg-[#0302025f] outline-none"
                    />
                  </div>
                </div>

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
                  {loading ? 'Sending...' : 'Send Reset Instructions'}
                </button>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="bg-custom-cyan/10 border border-custom-cyan/30 rounded-lg p-4">
                  <p className="text-sm text-neutral-300 text-center">
                    📧 Didn't receive the email? Check your spam folder or{' '}
                    <button
                      onClick={() => {
                        setSuccess(false);
                        setEmail('');
                      }}
                      className="text-custom-cyan hover:underline font-medium"
                    >
                      try another email address
                    </button>
                  </p>
                </div>

                <Link
                  to="/sign-in"
                  className="block w-full bg-neutral-800 text-white border-none py-3 rounded-md text-base font-bold text-center hover:bg-neutral-700 transition duration-200"
                >
                  Back to Sign In
                </Link>
              </div>
            )}
          </div>

          {!success && (
            <div className="text-center mt-6">
              <p className="text-neutral-500 text-sm">
                Remember your password?{' '}
                <Link to="/sign-in" className="text-custom-cyan hover:underline">
                  Sign in
                </Link>
              </p>
            </div>
          )}

          <div className="text-center mt-6">
            <p className="text-neutral-500 text-xs">Made by a Student - Jieson Delafuente</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
