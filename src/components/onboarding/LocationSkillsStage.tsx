import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Tag } from 'lucide-react';
import Input from '../common/Input';
import MultiSelectTagsInput from '../common/MultiSelectTagsInput';
import { supabase } from '../../lib/supabase';

interface LocationSkillsStageProps {
  location?: string;
  skills: string[];
  onLocationChange?: (value: string) => void;
  onSkillsChange?: (skills: string[]) => void;
}

const LocationSkillsStage: React.FC<LocationSkillsStageProps> = ({
  location,
  skills,
  onLocationChange,
  onSkillsChange,
}) => {
  const [availableSkills, setAvailableSkills] = useState<string[]>([]);

  useEffect(() => {
    const fetchSkills = async () => {
      const { data } = await supabase.from('skills').select('name');
      if (data) {
        setAvailableSkills(data.map((s) => s.name));
      }
    };
    fetchSkills();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-white">Location & Skills</h2>
        <p className="text-neutral-400">Help others find you and understand your expertise</p>
        <p className="text-sm text-neutral-500">(Optional - you can skip this step)</p>
      </div>

      <div className="space-y-6 mt-8">
        {/* Location */}
        <div>
          <Input
            label="Location"
            type="text"
            placeholder="e.g., San Francisco, CA or Remote"
            value={location || ''}
            onChange={(e) => onLocationChange?.(e.target.value)}
            leftIcon={<MapPin className="h-5 w-5" />}
            helperText="This helps you connect with nearby collaborators"
          />
        </div>

        {/* Skills */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            <div className="flex items-center gap-2">
              <Tag className="h-4 w-4" />
              <span>Skills & Interests</span>
            </div>
          </label>
          <MultiSelectTagsInput
            selectedTags={skills}
            onChange={onSkillsChange || (() => {})}
            availableTags={availableSkills}
            placeholder="Type to add skills (e.g., React, Python, Design...)"
          />
          <p className="text-xs text-neutral-500 mt-2">
            Add skills you're proficient in or interested in learning
          </p>
        </div>

        {/* Popular Skills Suggestions */}
        {skills.length === 0 && (
          <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4">
            <p className="text-sm font-medium text-neutral-300 mb-3">Popular skills:</p>
            <div className="flex flex-wrap gap-2">
              {['JavaScript', 'Python', 'React', 'Node.js', 'UI/UX Design', 'Machine Learning'].map((skill) => (
                <button
                  key={skill}
                  onClick={() => onSkillsChange?.([...skills, skill])}
                  className="px-3 py-1 text-sm bg-neutral-800 text-neutral-300 rounded-full
                           hover:bg-custom-cyan hover:text-black transition-colors"
                >
                  + {skill}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="bg-custom-purple/10 border border-custom-purple/30 rounded-lg p-4 mt-6">
        <p className="text-sm text-custom-purple text-center">
          🎯 Adding skills helps match you with relevant projects and collaborators!
        </p>
      </div>
    </motion.div>
  );
};

export default LocationSkillsStage;
