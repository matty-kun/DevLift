import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Mail, Lock } from 'lucide-react';
import Card from '../components/common/Card';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
// import { useAuth } from '../contexts/AuthContext';

interface SignInFormData {
    email: string;
    password: string;
}

const SignIn: React.FC = () => {
    // const { signIn } = useAuth();
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors, isSubmitting }} = useForm<SignInFormData>();
    const [error, setError] = useState<string | null>(null);

    const onSubmit = async (data: SignInFormData) => {
        try {
            setError(null);
            // Removed: await signIn(data.email, data.password);
            // Placeholder for frontend-only: console.log('Sign-in functionality is currently disabled');
            // Removed: navigate('/dashboard');
        } catch (err: any) {
            // Removed backend error handling
            console.log('Form submitted, but no action taken');
        }
    };

    return (
        <div className="min-h-screen bg-black py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-md mx-auto">
                <div className="text-center mb-8">
                  <h1 className="text-3xl font-bold text-white">Welcome Back!</h1>
                  <p className="mt-2 text-custom-cyan">Sign in to continue building with startups</p>
                </div>

                <Card>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                      <div>
                        <Input 
                          label="Email"
                          type="email"
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
                      
                      <div>
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

                      {error && (
                        <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-2 rounded-lg">
                          {error}
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <label className="flex items-center">
                          <input type="checkbox" className="form-checkbox rounded border-gray-600 bg-black text-custom-cyan focus:ring-custom-cyan" />
                          <span className="ml-2 text-sm text-white">Remember me</span>
                        </label>
                        <Link to="/forgot-password" className="text-sm text-custom-cyan hover:text-custom-purple">
                        Forgot password?
                        </Link>
                      </div>

                      <Button
                        type="submit"
                        variant="primary"
                        className="w-full"
                        isLoading={isSubmitting}
                      >
                        Sign In
                      </Button>
                    </form>

                    <div className="mt-6 text-center">
                      <p className="text-sm text-white">
                        Don't have an account?{' '}
                        <Link to="/sign-up" className="font-medium text-custom-cyan hover:text-custom-purple">
                          Sign up
                        </Link>
                      </p>
                    </div>
                </Card>
            </div>
          </div>
        </div>
    );
};

export default SignIn;