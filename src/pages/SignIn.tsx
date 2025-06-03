import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Mail, Lock } from 'lucide-react';
import Card from '../components/common/Card';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { useAuth } from '../contexts/AuthContext';

interface SignInFormData {
    email: string;
    password: string;
}

const SignIn: React.FC = () => {
    const { signIn } = useAuth();
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors, isSubmitting }} = useForm<SignInFormData>();

    const onSubmit = async (data: SignInFormData) => {
        try {
            await signIn(data.email, data.password)
            navigate('/dashboard');
        } catch (error) {
            console.error('Sign in failed:', error);
        }
    };

    return (
        <div className="min-h-screen bg-neutral-50 py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-md mx-auto">
                <div className="text-center mb-8">
                  <h1 className="text-3xl font-bold text-neutral-900">Welcome Back!</h1>
                  <p className="mt-2 text-neutral-600">Sign in to continue building with startups</p>
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
                              message: 'password must be at least 7 characters'
                            }
                          })}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <label className="flex items-center">
                          <input type="checkbox" className="form-checkbox rounded text-primary-600 focus:ring-primary-500" />
                          <span className="ml-2 text-sm text-neutral-600">Remember me</span>
                        </label>
                        <Link to="/forgot-password" className="text-sm text-primary-600 hover:text-primary-800">
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
                      <p className="text-sm text-neutral-600">
                        Don't have an account?{' '}
                        <Link to="/sign-up" className="font-medium text-primary-600 hover:text-primary-800">
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