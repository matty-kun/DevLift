import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Mail, Lock, User, Bell } from 'lucide-react';
import Card from '../components/common/Card';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Avatar from '../components/common/Avatar';
import ImageUpload from '../components/common/ImageUpload';

interface SettingsFormData {
    fullName: string;
    email: string;
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
}

const Settings: React.FC = () => {
    const { register, handleSubmit, watch, formState: { errors } } = useForm<SettingsFormData>({
        defaultValues: {
            fullName: 'Demo User',
            email: 'demo@example.com',
        }
    });

    const [profileImage, setProfileImage] = useState<File | null>(null);
    const newPassword = watch('newPassword');

    const onProfileSubmit = (data: SettingsFormData) => {
        console.log('Profile updated:', data);
        console.log('Profile image:', profileImage);
        // Here you would typically call an API to update the user's profile
    };

    const onPasswordSubmit = (data: SettingsFormData) => {
        console.log('Password change requested:', data);
        // Here you would typically call an API to change the password
    };

    const handleFileChange = (file: File | null) => {
        setProfileImage(file);
    };

    return (
        <div className="min-h-screen bg-black py-12">
            <div className="container mx-auto px-4">
                <div className="max-w-3xl mx-auto">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold text-white">Settings</h1>
                        <p className="mt-2 text-white">Manage your account and preferences</p>
                    </div>

                    {/* Profile Settings */}
                    <Card className="mb-8">
                        <h2 className="text-2xl font-semibold text-white mb-6 flex items-center">
                            <User className="h-6 w-6 mr-3 text-custom-cyan" />
                            Profile Information
                        </h2>
                        <form onSubmit={handleSubmit(onProfileSubmit)} className="space-y-6">
                            <div className="flex items-center space-x-6">
                                <Avatar src="https://randomuser.me/api/portraits/men/32.jpg" alt="Demo User" size="lg" />
                                <ImageUpload label="Upload new picture" onFileChange={handleFileChange} />
                            </div>
                            <div>
                                <Input
                                    label="Full Name"
                                    type="text"
                                    leftIcon={<User className="h-5 w-5" />}
                                    error={errors.fullName?.message}
                                    {...register('fullName', { required: 'Full name is required' })}
                                />
                            </div>
                            <div>
                                <Input
                                    label="Email Address"
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
                            <div className="flex justify-end">
                                <Button type="submit" variant="primary">Save Changes</Button>
                            </div>
                        </form>
                    </Card>

                    {/* Password Settings */}
                    <Card className="mb-8">
                        <h2 className="text-2xl font-semibold text-white mb-6 flex items-center">
                            <Lock className="h-6 w-6 mr-3 text-custom-cyan" />
                            Change Password
                        </h2>
                        <form onSubmit={handleSubmit(onPasswordSubmit)} className="space-y-6">
                            <div>
                                <Input
                                    label="Current Password"
                                    type="password"
                                    leftIcon={<Lock className="h-5 w-5" />}
                                    {...register('currentPassword')}
                                />
                            </div>
                            <div>
                                <Input
                                    label="New Password"
                                    type="password"
                                    leftIcon={<Lock className="h-5 w-5" />}
                                    error={errors.newPassword?.message}
                                    {...register('newPassword', {
                                        minLength: {
                                            value: 7,
                                            message: 'Password must be at least 7 characters'
                                        }
                                    })}
                                />
                            </div>
                            <div>
                                <Input
                                    label="Confirm New Password"
                                    type="password"
                                    leftIcon={<Lock className="h-5 w-5" />}
                                    error={errors.confirmPassword?.message}
                                    {...register('confirmPassword', {
                                        validate: value => value === newPassword || 'Passwords do not match'
                                    })}
                                />
                            </div>
                            <div className="flex justify-end">
                                <Button type="submit" variant="primary">Update Password</Button>
                            </div>
                        </form>
                    </Card>

                    {/* Notification Settings */}
                    <Card>
                        <h2 className="text-2xl font-semibold text-white mb-6 flex items-center">
                            <Bell className="h-6 w-6 mr-3 text-custom-cyan" />
                            Notifications
                        </h2>
                        <div className="space-y-4">
                           <div className="flex items-center justify-between p-4 bg-neutral-900 rounded-lg">
                               <div>
                                   <h3 className="font-medium text-white">Project Updates</h3>
                                   <p className="text-sm text-gray-400">Get notified about new comments and updates on your projects.</p>
                               </div>
                               <label className="switch">
                                 <input type="checkbox" defaultChecked />
                                 <span className="slider round"></span>
                               </label>
                           </div>
                           <div className="flex items-center justify-between p-4 bg-neutral-900 rounded-lg">
                               <div>
                                   <h3 className="font-medium text-white">Community Alerts</h3>
                                   <p className="text-sm text-gray-400">Receive notifications for new posts and replies in the community.</p>
                               </div>
                               <label className="switch">
                                 <input type="checkbox" defaultChecked />
                                 <span className="slider round"></span>
                               </label>
                           </div>
                           <div className="flex items-center justify-between p-4 bg-neutral-900 rounded-lg">
                               <div>
                                   <h3 className="font-medium text-white">Newsletter</h3>
                                   <p className="text-sm text-gray-400">Subscribe to our weekly newsletter.</p>
                               </div>
                               <label className="switch">
                                 <input type="checkbox" />
                                 <span className="slider round"></span>
                               </label>
                           </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

// Basic CSS for the toggle switch - you might want to move this to your main CSS file
const styles = `
.switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
}
.switch input { 
  opacity: 0;
  width: 0;
  height: 0;
}
.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: .4s;
}
.slider:before {
  position: absolute;
  content: "";
  height: 26px;
  width: 26px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: .4s;
}
input:checked + .slider {
  background-color: #2196F3;
}
input:focus + .slider {
  box-shadow: 0 0 1px #2196F3;
}
input:checked + .slider:before {
  transform: translateX(26px);
}
.slider.round {
  border-radius: 34px;
}
.slider.round:before {
  border-radius: 50%;
}
`;

const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);


export default Settings;
