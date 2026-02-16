import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Briefcase } from 'lucide-react';

interface WelcomeStageProps {
  selectedRole: 'student' | 'founder' | null;
  onRoleSelect: (role: 'student' | 'founder') => void;
}

const WelcomeStage: React.FC<WelcomeStageProps> = ({ selectedRole, onRoleSelect }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold">
          Welcome to <span className="text-custom-cyan">Dev</span><span className="text-custom-orange">Lift</span>
        </h1>
        <p className="text-neutral-400 text-lg">Let's get you started! First, tell us about yourself.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
        <motion.button
          onClick={() => onRoleSelect('student')}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`
            group relative overflow-hidden border-2 rounded-xl p-8 text-left transition-all duration-300
            ${selectedRole === 'student'
              ? 'border-custom-purple bg-custom-purple/10 shadow-lg shadow-custom-purple/20'
              : 'border-neutral-700 bg-neutral-900 hover:border-custom-purple/50'
            }
          `}
        >
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-4">
              <div className={`
                p-3 rounded-lg transition-colors
                ${selectedRole === 'student' ? 'bg-custom-purple' : 'bg-neutral-800 group-hover:bg-custom-purple/20'}
              `}>
                <User className={`h-8 w-8 ${selectedRole === 'student' ? 'text-white' : 'text-custom-purple'}`} />
              </div>
              <h2 className="text-2xl font-bold text-white">I'm a Student</h2>
            </div>
            <p className="text-neutral-400 leading-relaxed">
              Find real-world projects, learn by building, and collaborate with experienced mentors to grow your skills.
            </p>
          </div>

          <AnimatePresence mode="wait">
            {selectedRole === 'student' && (
              <motion.div
                key="student-check"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 180 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                className="absolute top-4 right-4 bg-custom-purple text-white rounded-full p-1"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>

        <motion.button
          onClick={() => onRoleSelect('founder')}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`
            group relative overflow-hidden border-2 rounded-xl p-8 text-left transition-all duration-300
            ${selectedRole === 'founder'
              ? 'border-custom-orange bg-custom-orange/10 shadow-lg shadow-custom-orange/20'
              : 'border-neutral-700 bg-neutral-900 hover:border-custom-orange/50'
            }
          `}
        >
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-4">
              <div className={`
                p-3 rounded-lg transition-colors
                ${selectedRole === 'founder' ? 'bg-custom-orange' : 'bg-neutral-800 group-hover:bg-custom-orange/20'}
              `}>
                <Briefcase className={`h-8 w-8 ${selectedRole === 'founder' ? 'text-white' : 'text-custom-orange'}`} />
              </div>
              <h2 className="text-2xl font-bold text-white">I'm a Founder</h2>
            </div>
            <p className="text-neutral-400 leading-relaxed">
              Post innovative projects, get help from talented students, and mentor the next generation of builders.
            </p>
          </div>

          <AnimatePresence mode="wait">
            {selectedRole === 'founder' && (
              <motion.div
                key="founder-check"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 180 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                className="absolute top-4 right-4 bg-custom-orange text-white rounded-full p-1"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      <p className="text-center text-neutral-600 text-sm mt-4">
        Not sure? Start as a student—you can always change your role later in settings.
      </p>
    </motion.div>
  );
};

export default WelcomeStage;
