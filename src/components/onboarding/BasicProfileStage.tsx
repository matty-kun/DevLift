import React from 'react';
import { motion } from 'framer-motion';
import { User, Pencil } from 'lucide-react';
import Input from '../common/Input';
import ImageUpload from '../common/ImageUpload';

interface BasicProfileStageProps {
  fullName: string;
  bio: string;
  avatarFile: File | null;
  avatarPreview: string | null;
  onFullNameChange: (value: string) => void;
  onBioChange: (value: string) => void;
  onAvatarChange: (file: File | null) => void;
}

const BasicProfileStage: React.FC<BasicProfileStageProps> = ({
  fullName,
  bio,
  avatarFile,
  avatarPreview,
  onFullNameChange,
  onBioChange,
  onAvatarChange,
}) => {
  const charLimit = 200;
  const bioLength = bio.length;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-white">Create Your Profile</h2>
        <p className="text-neutral-400">Tell us a bit about yourself</p>
      </div>

      <div className="space-y-6 mt-8">
        {/* Avatar Upload */}
        <div>
          <ImageUpload
            label="Profile Picture (Optional)"
            onFileChange={onAvatarChange}
            currentImageUrl={avatarPreview || undefined}
            variant="circle"
          />
        </div>

        {/* Full Name */}
        <div>
          <Input
            label="Full Name"
            type="text"
            placeholder="Enter your full name"
            value={fullName}
            onChange={(e) => onFullNameChange(e.target.value)}
            leftIcon={<User className="h-5 w-5" />}
            required
          />
        </div>

        {/* Bio */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Bio (Optional)
          </label>
          <div className="relative">
            <div className="absolute left-3 top-3 text-neutral-400">
              <Pencil className="h-5 w-5" />
            </div>
            <textarea
              value={bio}
              onChange={(e) => {
                if (e.target.value.length <= charLimit) {
                  onBioChange(e.target.value);
                }
              }}
              placeholder="Tell us about yourself, your interests, or what you're working on..."
              rows={4}
              className="w-full pl-11 pr-4 py-3 rounded-lg border border-gray-700 bg-gray-900 text-white
                       focus:outline-none focus:ring-2 focus:ring-custom-cyan focus:border-custom-cyan
                       placeholder:text-neutral-500 resize-none"
            />
          </div>
          <div className="flex justify-between items-center mt-1">
            <p className="text-xs text-neutral-500">Share your story, goals, or what makes you unique</p>
            <p className={`text-xs ${bioLength > charLimit * 0.9 ? 'text-custom-orange' : 'text-neutral-500'}`}>
              {bioLength}/{charLimit}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 mt-6">
        <p className="text-sm text-neutral-400 text-center">
          💡 <span className="font-medium text-white">Pro tip:</span> A complete profile helps you connect better with others!
        </p>
      </div>
    </motion.div>
  );
};

export default BasicProfileStage;
