import React from 'react';
import { motion } from 'framer-motion';
import { Building, GraduationCap, Briefcase, Globe, Linkedin, Github } from 'lucide-react';
import Input from '../common/Input';

interface ProfessionalStageProps {
  role: 'student' | 'founder';
  school?: string;
  company?: string;
  position?: string;
  website?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  onSchoolChange?: (value: string) => void;
  onCompanyChange?: (value: string) => void;
  onPositionChange?: (value: string) => void;
  onWebsiteChange?: (value: string) => void;
  onLinkedinChange?: (value: string) => void;
  onGithubChange?: (value: string) => void;
}

const ProfessionalStage: React.FC<ProfessionalStageProps> = ({
  role,
  school,
  company,
  position,
  website,
  linkedinUrl,
  githubUrl,
  onSchoolChange,
  onCompanyChange,
  onPositionChange,
  onWebsiteChange,
  onLinkedinChange,
  onGithubChange,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-white">Professional Details</h2>
        <p className="text-neutral-400">
          {role === 'student'
            ? 'Share your academic background'
            : 'Tell us about your work and company'
          }
        </p>
        <p className="text-sm text-neutral-500">(All fields are optional - skip if you prefer)</p>
      </div>

      <div className="space-y-4 mt-8">
        {role === 'student' ? (
          /* Student Fields */
          <div>
            <Input
              label="School / University"
              type="text"
              placeholder="e.g., University of California"
              value={school || ''}
              onChange={(e) => onSchoolChange?.(e.target.value)}
              leftIcon={<GraduationCap className="h-5 w-5" />}
            />
          </div>
        ) : (
          /* Founder/Mentor Fields */
          <>
            <div>
              <Input
                label="Company Name"
                type="text"
                placeholder="e.g., TechCorp Inc."
                value={company || ''}
                onChange={(e) => onCompanyChange?.(e.target.value)}
                leftIcon={<Building className="h-5 w-5" />}
              />
            </div>

            <div>
              <Input
                label="Position / Title"
                type="text"
                placeholder="e.g., Founder & CEO"
                value={position || ''}
                onChange={(e) => onPositionChange?.(e.target.value)}
                leftIcon={<Briefcase className="h-5 w-5" />}
              />
            </div>

            <div>
              <Input
                label="Website"
                type="url"
                placeholder="https://yourcompany.com"
                value={website || ''}
                onChange={(e) => onWebsiteChange?.(e.target.value)}
                leftIcon={<Globe className="h-5 w-5" />}
              />
            </div>
          </>
        )}

        {/* Social Links - for all roles */}
        <div className="pt-4 border-t border-neutral-800">
          <h3 className="text-sm font-medium text-neutral-300 mb-4">Social Profiles (Optional)</h3>

          <div className="space-y-4">
            <div>
              <Input
                label="LinkedIn"
                type="url"
                placeholder="https://linkedin.com/in/yourprofile"
                value={linkedinUrl || ''}
                onChange={(e) => onLinkedinChange?.(e.target.value)}
                leftIcon={<Linkedin className="h-5 w-5" />}
              />
            </div>

            <div>
              <Input
                label="GitHub"
                type="url"
                placeholder="https://github.com/yourusername"
                value={githubUrl || ''}
                onChange={(e) => onGithubChange?.(e.target.value)}
                leftIcon={<Github className="h-5 w-5" />}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-custom-cyan/10 border border-custom-cyan/30 rounded-lg p-4 mt-6">
        <p className="text-sm text-custom-cyan text-center">
          ✨ Adding professional details helps you build credibility and connect with the right people!
        </p>
      </div>
    </motion.div>
  );
};

export default ProfessionalStage;
