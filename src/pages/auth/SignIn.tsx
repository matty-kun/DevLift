
import { useState, useEffect, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { supabase } from "../../lib/supabase";
import { FaGoogle, FaFacebook, FaGithub } from "react-icons/fa";
import Logo from "../../assets/DevLift Logo.svg";
// cleaned unused imports


const SignInForm: React.FC = () => {
  const navigate = useNavigate();
  const { signIn, signInWithProvider, session, profile, loading: authLoading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // If already authenticated when component mounts, redirect away from sign-in automatically.
  // BUT: Check for MFA requirement first!
  // DISABLED: This conflicts with the onSubmit MFA check, causing race conditions
  // The onSubmit handler will handle all redirects after sign-in
  useEffect(() => {
    // Do nothing - let onSubmit handle redirects
    // This prevents race conditions between useEffect and onSubmit
  }, []);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await signIn(email.trim(), password);

      // CRITICAL: Wait for session to be fully established
      await new Promise(resolve => setTimeout(resolve, 200));

      // Check if user has MFA factors and needs verification
      const { data: factors } = await supabase.auth.mfa.listFactors();
      console.log('MFA Factors:', factors);

      const hasVerifiedFactor = factors?.totp?.some((f) => f.status === 'verified');
      console.log('Has verified factor:', hasVerifiedFactor);

      if (hasVerifiedFactor) {
        // Check AAL using the proper async method
        const { data: aalData, error: aalError } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();

        if (aalError) {
          console.error('Error getting AAL:', aalError);
        }

        console.log('SignIn - AAL data:', aalData);

        // User has MFA enrolled but hasn't verified this session
        if (aalData?.currentLevel === 'aal1' && aalData?.nextLevel === 'aal2') {
          console.log('Redirecting to MFA verify - needs aal2');
          navigate('/mfa-verify', { replace: true });
          return;
        }
      }

      // Optional role-based redirect
      const { data: userRes } = await supabase.auth.getUser();
      const userId = userRes.user?.id;
      let dest = "/projects";
      if (userId) {
        const { data: prof } = await supabase
          .from("users")
          .select("role")
          .eq("id", userId)
          .maybeSingle();
        const role = (prof as { role?: string } | null)?.role;
        if (!role) dest = '/onboarding';
        else if (role === "mentor" || role === "founder") dest = "/founder-dashboard"; else dest = "/student-dashboard";
      }
      navigate(dest, { replace: true });
    } catch (err: unknown) {
      const hasMessage = (e: unknown): e is { message: string } =>
        typeof e === "object" && e !== null && "message" in e && typeof (e as { message: unknown }).message === "string";
      setError(hasMessage(err) ? err.message : "Unable to sign in");
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
          <div className="text-center mb-8">
            <img src={Logo} alt="Logo" className="w-48 mx-auto h-auto -mt-10 pb-5" />
            <p className="text-white text-lg h-auto -mt-20">Your journey to innovation starts here.</p>
          </div>

          {/* Card wrapper */}
          <div className="rounded-xl border border-[#232336] bg-[#0b0b10] p-6 shadow-lg">
            <form onSubmit={onSubmit} className="space-y-4">
              {/* Email */}
              <div className="mb-3">
                <label className="block">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    required
                    className="w-full p-3 border border-[#232336] rounded-md bg-black text-white text-base transition duration-200 focus:border-custom-purple focus:bg-[#0302025f] outline-none"
                  />
                </label>
              </div>

              {/* Password */}
              <div className="mb-3">
                <label className="block">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                    className="w-full p-3 border border-[#232336] rounded-md bg-black text-white text-base transition duration-200 focus:border-custom-purple focus:bg-[#0302025f] outline-none"
                  />
                </label>
              </div>

              {/* Remember me */}
              <div className="flex justify-between items-center text-[0.97rem] mb-1 text-neutral-300">
        <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={rememberMe}
          onChange={() => setRememberMe((v: boolean) => !v)}
                    className="accent-custom-cyan"
                  />
                  <span className="text-white">Remember me</span>
                </label>
                <Link to="/forgot-password" className="text-custom-cyan hover:underline">
                  Forgot password?
                </Link>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-2 rounded-lg">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-custom-cyan text-black border-none py-2 rounded-md text-base font-bold cursor-pointer mb-3 transition duration-200 shadow-md hover:brightness-110 disabled:opacity-60"
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>

              {/* Register link */}
              <div className="text-center text-[0.98rem] mb-3">
                <p className="text-white">
                  Don't have an account?{" "}
                  <Link to="/sign-up" className="text-custom-cyan hover:underline">
                    Sign up
                  </Link>
                </p>
              </div>

              {/* Social (UI only) */}
              <div className="text-center text-[0.98rem]">
                <p className="text-neutral-300 mb-2">Or sign in with</p>
                <div className="flex justify-center gap-3">
                  <button type="button" onClick={() => signInWithProvider('google')} title="Sign in with Google" className="text-neutral-300 text-[1.5rem] w-9 h-9 flex items-center justify-center rounded-full bg-[#232336] border border-[#232336] hover:bg-custom-orange hover:text-white hover:border-[#d3480c] transition">
                    <FaGoogle />
                  </button>
                  <button type="button" onClick={() => signInWithProvider('facebook')} title="Sign in with Facebook" className="text-neutral-300 text-[1.5rem] w-9 h-9 flex items-center justify-center rounded-full bg-[#232336] border border-[#232336] hover:bg-custom-orange hover:text-white hover:border-[#d3480c] transition">
                    <FaFacebook />
                  </button>
                  <button type="button" onClick={() => signInWithProvider('github')} title="Sign in with GitHub" className="text-neutral-300 text-[1.5rem] w-9 h-9 flex items-center justify-center rounded-full bg-[#232336] border border-[#232336] hover:bg-custom-orange hover:text-white hover:border-[#d3480c] transition">
                    <FaGithub />
                  </button>
                </div>
              </div>
            </form>

            <div className="text-center mt-6">
              <p className="text-neutral-500 text-xs">Made by a Student - Jieson Delafuente</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInForm;