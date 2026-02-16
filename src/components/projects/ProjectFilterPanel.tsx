import React from 'react';
import { Filter, Briefcase, Clock, Code, ArrowUpDown, X } from 'lucide-react';

import Button from '../common/Button';
import Card from '../common/Card';

interface ProjectFilterPanelProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  
  sortBy: string;
  setSortBy: (sort: string) => void;
  skills: string[];
  selectedSkills: string[];
  setSelectedSkills: (skills: string[]) => void;
  difficulties: string[];
  selectedDifficulty: string[];
  setSelectedDifficulty: (difficulty: string[]) => void;
  durations: string[];
  selectedDuration: string[];
  setSelectedDuration: (duration: string[]) => void;
  clearAllFilters: () => void;
}

const ProjectFilterPanel: React.FC<ProjectFilterPanelProps> = ({
  isOpen,
  setIsOpen,
  sortBy,
  setSortBy,
  skills,
  selectedSkills,
  setSelectedSkills,
  difficulties,
  selectedDifficulty,
  setSelectedDifficulty,
  durations,
  selectedDuration,
  setSelectedDuration,
  clearAllFilters,
}) => {
  return (
    <div
      id="filters-panel"
      className={`transition-all duration-300 ${isOpen ? 'lg:col-span-1' : 'w-0 h-0 overflow-hidden'}`}
    >
      <Card className="h-fit bg-neutral-900 border border-neutral-800 shadow-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold flex items-center text-white">
            <Filter className="h-6 w-6 mr-3 text-custom-cyan" />
            Filters
          </h3>
          <Button variant="ghost" size="md" onClick={() => setIsOpen(false)}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        <div className="space-y-6">
          
          {/* Sort Options */}
          <div className="pt-4 border-t border-neutral-800">
            <h4 className="font-semibold mb-3 flex items-center text-white">
              <ArrowUpDown className="h-5 w-5 mr-3 text-custom-cyan" />
              Sort By
            </h4>
            <div className="space-y-2">
              <label className="flex items-center cursor-pointer group">
                <input
                  type="radio"
                  name="sort"
                  value="newest"
                  checked={sortBy === 'newest'}
                  onChange={() => setSortBy('newest')}
                  className="form-radio h-4 w-4 text-custom-cyan border-neutral-600 bg-neutral-700 focus:ring-custom-cyan transition-colors duration-200"
                />
                <span className="ml-3 text-neutral-300 group-hover:text-white transition-colors duration-200">Newest First</span>
              </label>
              <label className="flex items-center cursor-pointer group">
                <input
                  type="radio"
                  name="sort"
                  value="oldest"
                  checked={sortBy === 'oldest'}
                  onChange={() => setSortBy('oldest')}
                  className="form-radio h-4 w-4 text-custom-cyan border-neutral-600 bg-neutral-700 focus:ring-custom-cyan transition-colors duration-200"
                />
                <span className="ml-3 text-neutral-300 group-hover:text-white transition-colors duration-200">Oldest First</span>
              </label>
            </div>
          </div>
          {/* Skills Filter */}
          <div className="pt-4 border-t border-neutral-800">
            <h4 className="font-semibold mb-3 flex items-center text-white">
              <Code className="h-5 w-5 mr-3 text-custom-cyan" />
              Skills
            </h4>
            <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar pr-2">
              {skills.map((skill) => (
                <label key={skill} className="flex items-center cursor-pointer group">
                  <input
                    type="checkbox"
                    className="form-checkbox h-4 w-4 rounded text-custom-cyan border-neutral-600 bg-neutral-700 focus:ring-custom-cyan transition-colors duration-200"
                    checked={selectedSkills.includes(skill)}
                    onChange={((e) => {
                      if (e.target.checked) {
                        setSelectedSkills([...selectedSkills, skill]);
                      } else {
                        setSelectedSkills(selectedSkills.filter(s => s !== skill));
                      }
                    })}
                  />
                  <span className="ml-3 text-neutral-300 group-hover:text-white transition-colors duration-200">{skill}</span>
                </label>
              ))}
            </div>
          </div>
          {/* Difficulty Filter */}
          <div className="pt-4 border-t border-neutral-800">
            <h4 className="font-semibold mb-3 flex items-center text-white">
              <Briefcase className="h-5 w-5 mr-3 text-custom-cyan"/>
              Difficulty
            </h4>
            <div className="space-y-2">
              {difficulties.map((difficulty) => (
                <label key={difficulty} className="flex items-center cursor-pointer group">
                  <input
                    type="checkbox"
                    className="form-checkbox h-4 w-4 rounded text-custom-cyan border-neutral-600 bg-neutral-700 focus:ring-custom-cyan transition-colors duration-200"
                    checked={selectedDifficulty.includes(difficulty)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedDifficulty([...selectedDifficulty, difficulty]);
                      } else {
                        setSelectedDifficulty(selectedDifficulty.filter(d => d !== difficulty));
                      }
                    }}
                  />
                  <span className="ml-3 text-neutral-300 group-hover:text-white transition-colors duration-200 capitalize">{difficulty}</span>
                </label>
              ))}
            </div>
          </div>
          {/* Duration Filter */}
          <div className="pt-4 border-t border-neutral-800">
            <h4 className="font-semibold mb-3 flex items-center text-white">
              <Clock className="h-5 w-5 mr-3 text-custom-cyan" />
              Duration
            </h4>
            <div className="space-y-2">
              {durations.map((duration) => (
                <label key={duration} className="flex items-center cursor-pointer group">
                  <input
                    type="checkbox"
                    className="form-checkbox h-4 w-4 rounded text-custom-cyan border-neutral-600 bg-neutral-700 focus:ring-custom-cyan transition-colors duration-200"
                    checked={selectedDuration.includes(duration)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedDuration([...selectedDuration, duration]);
                      } else {
                        setSelectedDuration(selectedDuration.filter(d => d !== duration));
                      }
                    }}
                  />
                  <span className="ml-3 text-neutral-300 group-hover:text-white transition-colors duration-200">{duration}</span>
                </label>
              ))}
            </div>
          </div>
          <Button
            variant="outline"
            className="w-full border-custom-orange text-custom-orange hover:bg-custom-orange hover:text-white transition-colors duration-200 py-2.5 mt-4"
            onClick={clearAllFilters}
          >
            Clear All Filters
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ProjectFilterPanel;