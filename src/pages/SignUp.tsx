import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Mail, Lock, User, Briefcase } from 'lucide-react';
import Card from '../components/common/Card';
import Input from '../components/common/Input';
import Button from '../components/common/Button';

interface SignUpFormData {
    email: string;
    password: string;
    confirmPassword: string;
    school?: string;  // For students
    companyName?: string;  // For founders
    website?: string;  // For founders
}

const SignUp: React.FC = () => {
    const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<SignUpFormData>();
    const [error, setError] = useState<string | null>(null);
    const [userType, setUserType] = useState<'student' | 'founder' | null>(null);
    const password = watch('password');

    const onSubmit = async () => {
        try {
            setError(null);
            console.log('Form submitted, but no action taken');
        } catch {
            console.log('Form submitted, but no action taken');
        }
    };

    return (
        <div className="min-h-screen bg-black py-12">
            <div className="container mx-auto px-4">
                <div className="max-w-md mx-auto">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-white">Join <span className="text-custom-cyan">Dev</span><span className="text-custom-orange">Lift</span></h1>
                        <p className="mt-2 text-white">Create your account to get started</p>
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

                            <div>
                                <Input
                                    label="Confirm Password"
                                    type="password"
                                    leftIcon={<Lock className="h-5 w-5" />}
                                    error={errors.confirmPassword?.message}
                                    {...register('confirmPassword', {
                                        required: 'Please confirm your password',
                                        validate: value => value === password || 'Passwords do not match'
                                    })}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-white">I am joining as</label>
                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        type="button"
                                        className={`flex items-center justify-center p-4 rounded-lg border-2 transition-all 
                                            ${userType === 'student' ? 'border-custom-cyan text-custom-cyan bg-custom-cyan/10 shadow-lg' : 'border-gray-600 text-gray-400 hover:border-gray-400'}`}
                                        onClick={() => setUserType('student')}
                                    >
                                        <div className="flex flex-col items-center">
                                            <User className="h-6 w-6 mb-2" />
                                            <span>Student</span>
                                        </div>
                                    </button>
                                    <button
                                        type="button"
                                        className={`flex items-center justify-center p-4 rounded-lg border-2 transition-all 
                                            ${userType === 'founder' ? 'border-custom-orange text-custom-orange bg-custom-orange/10 shadow-lg' : 'border-gray-600 text-gray-400 hover:border-gray-400'}`}
                                        onClick={() => setUserType('founder')}
                                    >
                                        <div className="flex flex-col items-center">
                                            <Briefcase className="h-6 w-6 mb-2" />
                                            <span>Founder</span>
                                        </div>
                                    </button>
                                </div>
                            </div>

                            {error && (
                                <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-2 rounded-lg">
                                    {error}
                                </div>
                            )}

                            <Button
                                type="submit"
                                variant="primary"
                                className="w-full"
                                isLoading={isSubmitting}
                            >
                                Create Account
                            </Button>
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-sm text-white">
                                Already have an account?{' '}
                                <Link to="/sign-in" className="font-medium text-custom-cyan hover:text-custom-purple">
                                    Sign in
                                </Link>
                            </p>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default SignUp; 