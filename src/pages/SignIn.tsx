import { useState, FormEvent } from "react";
import { FaGoogle, FaFacebook, FaGithub } from "react-icons/fa";
import Logo from "../assets/DevLift Logo.svg"; // adjust path if needed

const SignInForm: React.FC = () => {
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log("Form submitted");
  };

  return (
    <div className="min-h-screen bg-black flex justify-center items-center relative overflow-hidden font-sans">
      {/* Background decorative elements */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute -right-10 -top-10 h-72 w-72 rounded-full bg-custom-cyan opacity-60 blur-3xl"></div>
        <div className="absolute left-1/4 top-32 h-48 w-48 rounded-full bg-custom-purple opacity-60 blur-3xl"></div>
        <div className="absolute left-1/20 bottom-1 h-48 w-48 rounded-full bg-white opacity-60 blur-3xl"></div>
        <div className="absolute right-1/3 bottom-0 h-64 w-64 rounded-full bg-custom-orange opacity-60 blur-3xl"></div>
      </div>

      {/* Wrapper */}
      <div className="bg-black rounded-2xl p-8 w-[400px] shadow-medium animate-fade-in-up z-10 relative">
        <form onSubmit={handleSubmit}>
          {/* Logo */}
          <div className="text-center relative h-[120px]">
            <h3 className="hidden font-bold text-[1.6rem] tracking-wide">
              <span className="text-custom-cyan">sign</span>
              <span className="text-white">in</span>
            </h3>
            <img
              src={Logo}
              alt="Logo"
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-auto"
            />
          </div>

          {/* Username */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Username or email"
              required
              className="w-full p-3 border border-[#232336] rounded-md bg-black text-custom-orange text-base transition duration-200 focus:border-custom-purple focus:bg-[#0302025f] outline-none"
            />
          </div>

          {/* Password */}
          <div className="mb-4">
            <input
              type="password"
              placeholder="Password"
              required
              className="w-full p-3 border border-[#232336] rounded-md bg-black text-white text-base transition duration-200 focus:border-custom-purple focus:bg-[#0302025f] outline-none"
            />
          </div>

          {/* Remember me */}
          <div className="flex justify-between items-center text-[0.97rem] mb-4 text-neutral-300">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
                className="accent-custom-cyan"
              />
              <span className="text-white">Remember me</span>
            </label>
            <a href="#" className="text-custom-cyan hover:underline">
              Forgot password?
            </a>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-hero-gradient text-white border-none py-3 rounded-md text-lg font-bold cursor-pointer mb-3 transition duration-200 shadow-md hover:brightness-110"
          >
            Sign in
          </button>

          {/* Register link */}
          <div className="text-center text-[0.98rem]">
            <p className="text-white">
              Don't have an account?{" "}
              <a href="#" className="text-custom-cyan hover:underline">
                Sign up
              </a>
            </p>
          </div>

          {/* Social media */}
          <div className="text-center text-[0.98rem] mt-4">
            <p className="text-neutral-300 mb-2">Or sign in with</p>
            <div className="flex justify-center gap-4">
              <a
                href="#"
                title="Sign in with Google"
                className="text-neutral-300 text-[1.7rem] w-10 h-10 flex items-center justify-center rounded-full bg-[#232336] border border-[#232336] hover:bg-custom-orange hover:text-white hover:border-[#d3480c] transition"
              >
                <FaGoogle />
              </a>
              <a
                href="#"
                title="Sign in with Facebook"
                className="text-neutral-300 text-[1.7rem] w-10 h-10 flex items-center justify-center rounded-full bg-[#232336] border border-[#232336] hover:bg-custom-orange hover:text-white hover:border-[#d3480c] transition"
              >
                <FaFacebook />
              </a>
              <a
                href="#"
                title="Sign in with GitHub"
                className="text-neutral-300 text-[1.7rem] w-10 h-10 flex items-center justify-center rounded-full bg-[#232336] border border-[#232336] hover:bg-custom-orange hover:text-white hover:border-[#d3480c] transition"
              >
                <FaGithub />
              </a>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignInForm;
