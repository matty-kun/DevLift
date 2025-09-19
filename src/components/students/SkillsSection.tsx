import React, { useState } from 'react';
import Button from '../common/Button';

interface SkillsSectionProps {
  skills: string[];
}

const SkillsSection: React.FC<SkillsSectionProps> = ({ skills }) => {
  const [showAll, setShowAll] = useState(false);
  const visibleSkills = showAll ? skills : skills.slice(0, 5);

  return (
    <div className="mb-4">
      <h2 className="text-2xl font-semibold text-custom-cyan mb-3">Skills</h2>
      <div className="flex flex-wrap gap-2 items-center">
        {visibleSkills.map(skill => (
          <span key={skill} className="bg-custom-cyan/20 text-custom-cyan px-4 py-2 rounded-full text-md">{skill}</span>
        ))}
        {skills.length > 5 && (
          <Button variant="secondary" size="sm" onClick={() => setShowAll(!showAll)}>
            {showAll ? 'View Less' : 'View More'}
          </Button>
        )}
      </div>
    </div>
  );
};

export default SkillsSection;