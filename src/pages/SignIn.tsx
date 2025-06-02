import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Mail, Lock } from 'lucide-react';
import Card from '../components/common/Card';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { useAuth } from '../contexts/AuthContext';
import { it } from 'date-fns/locale';

interface SignInFormData {
    email: string;
    password: string;
}

const SignIn: React.FC = () => {
    const { signIn } = useAuth();
    const navigate = useNavigate();
    const { register, handlesSubmit, formState: { errors, isSubmitting }} = useForm<SignInFormData>();

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
                    <form onSumbit={handlesSubmit(onSubmit)} className="space-y-6">
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

                      
                    </form>
                </Card>
            </div>
          </div>
        </div>
    )
}