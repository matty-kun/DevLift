import React, { useState } from "react";
import { useForm } from 'react-hook-form';
import { FaGoogle, FaFacebook, FaGithub } from "react-icons/fa";
import { Mail, Lock } from 'lucide-react';
import Logo from "../assets/DevLift Logo.svg"; 
import Card from '../components/common/Card';
import Input from '../components/common/Input';
import Button from '../components/common/Button'; 

interface SignInFormData {
    email: string;
    password: string;
} 

const SignInForm: React.FC = () => {
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<SignInFormData>();
    const [error, setError] = useState<string | null>(null);
    const [rememberMe, setRememberMe] = useState(false); // Keep rememberMe state

    const onSubmit = async (data: SignInFormData) => {
        try {
            setError(null);
            console.log('Form submitted with data:', data);
            // Add actual sign-in logic here
        } catch (err) {
            setError('Sign-in failed. Please check your credentials.');
            console.error('Sign-in error:', err);
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
            <img
              src={Logo}
              alt="Logo"
              className="w-48 mx-auto h-auto -mt-10 pb-5"
            />
            <p className="text-white text-lg h-auto -mt-20">Your journey to innovation starts here.</p>
          </div>
          <Card>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

              {/* Username */}
              <div className="mb-4">
                <Input
                    label="Username or email"
                    type="text"
                    leftIcon={<Mail className="h-5 w-5" />}
                    error={errors.email?.message}
                    {...register('email', {
                        required: 'Email is required',
                        pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: 'Invalid email address'
                        }
                    })}
                />
              </div>

              {/* Password */}
              <div className="mb-4">
                <Input
                    label="Password"
                    type="password"
                    leftIcon={<Lock className="h-5 w-5" />}
                    error={errors.password?.message}
                    {...register('password', {
                        required: 'Password is required',
                        minLength: {
                            value: 7,
                            message: 'Password must be at least 7 characters'
                        }
                    })}
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
          {error && (
                  <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-2 rounded-lg">
                      {error}
                  </div>
              )}

          <Button
            type="submit"
            variant="primary"
            className="w-full mb-4"
          >
            Sign in
          </Button>

              {/* Register link */}
          <div className="text-center text-[0.98rem] mb-4">
                <p className="text-white">
                  Don't have an account?{" "}
                  <a href="sign-up" className="text-custom-cyan hover:underline">
                    Sign up
                  </a>
                </p>
              </div>

              {/* Social media */}
              <div className="text-center text-[0.98rem]">
                <p className="text-neutral-300 mb-2">Or sign in with</p>
                <div className="flex justify-center gap-3">
                  <a
                    href="#"
                    title="Sign in with Google"
                    className="text-neutral-300 text-[1.5rem] w-9 h-9 flex items-center justify-center rounded-full bg-[#232336] border border-[#232336] hover:bg-custom-orange hover:text-white hover:border-[#d3480c] transition"
                  >
                    <FaGoogle />
                  </a>
                  <a
                    href="#"
                    title="Sign in with Facebook"
                    className="text-neutral-300 text-[1.5rem] w-9 h-9 flex items-center justify-center rounded-full bg-[#232336] border border-[#232336] hover:bg-custom-orange hover:text-white hover:border-[#d3480c] transition"
                  >
                    <FaFacebook />
                  </a>
                  <a
                    href="#"
                    title="Sign in with GitHub"
                    className="text-neutral-300 text-[1.5rem] w-9 h-9 flex items-center justify-center rounded-full bg-[#232336] border border-[#232336] hover:bg-custom-orange hover:text-white hover:border-[#d3480c] transition"
                  >
                    <FaGithub />
                  </a>
                </div>
              </div>
            </form>
        <div className="text-center mt-4">
            <p className="text-neutral-500 text-xs">
              Made by a Student - Jieson Delafuente
            </p>
      </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SignInForm;