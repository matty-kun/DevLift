import React from 'react';

interface FilterBarProps {
  category: string;
  setCategory: (category: string) => void;
  difficulty: string;
  setDifficulty: (difficulty: string) => void;
  duration: string;
  setDuration: (duration: string) => void;
  role: string;
  setRole: (role: string) => void;
  industry: string;
  setIndustry: (industry: string) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ 
  category, setCategory, 
  difficulty, setDifficulty, 
  duration, setDuration, 
  role, setRole, 
  industry, setIndustry 
}) => {
  const categories = ['all', 'projects', 'people', 'startups'];
  const difficulties = ['all', 'beginner', 'intermediate', 'advanced'];
  const durations = ['all', '1-4 weeks', '4-8 weeks', '8+ weeks'];
  const roles = ['all', 'student', 'mentor'];
  const industries = ['all', 'web dev', 'mobile dev', 'ai/ml', 'game dev'];

  return (
    <div className="bg-neutral-900 py-4">
      <div className="container mx-auto px-4">
        <div className="flex justify-center space-x-4">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                category === cat
                  ? 'bg-custom-cyan text-black'
                  : 'bg-neutral-800 text-white hover:bg-neutral-700'
              }`}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>
        <div className="mt-4 flex justify-center space-x-4">
            {category === 'projects' && (
                <>
                    <select value={difficulty} onChange={e => setDifficulty(e.target.value)} className="bg-neutral-800 text-white rounded-full px-4 py-2">
                        {difficulties.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                    <select value={duration} onChange={e => setDuration(e.target.value)} className="bg-neutral-800 text-white rounded-full px-4 py-2">
                        {durations.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                </>
            )}
            {category === 'people' && (
                <>
                    <select value={role} onChange={e => setRole(e.target.value)} className="bg-neutral-800 text-white rounded-full px-4 py-2">
                        {roles.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                </>
            )}
            {category === 'startups' && (
                <>
                    <select value={industry} onChange={e => setIndustry(e.target.value)} className="bg-neutral-800 text-white rounded-full px-4 py-2">
                        {industries.map(i => <option key={i} value={i}>{i}</option>)}
                    </select>
                </>
            )}
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
