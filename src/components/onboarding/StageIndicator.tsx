import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface StageIndicatorProps {
  currentStage: number;
  totalStages: number;
}

const StageIndicator: React.FC<StageIndicatorProps> = ({ currentStage, totalStages }) => {
  return (
    <div className="flex items-center justify-center gap-3 mb-8">
      {Array.from({ length: totalStages }).map((_, index) => {
        const stageNumber = index + 1;
        const isCompleted = stageNumber < currentStage;
        const isCurrent = stageNumber === currentStage;

        return (
          <React.Fragment key={stageNumber}>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              <div
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm
                  transition-all duration-300
                  ${isCompleted ? 'bg-custom-cyan text-black' : ''}
                  ${isCurrent ? 'bg-custom-purple text-white ring-4 ring-custom-purple/30' : ''}
                  ${!isCompleted && !isCurrent ? 'bg-neutral-800 text-neutral-500 border border-neutral-700' : ''}
                `}
              >
                {isCompleted ? (
                  <Check className="w-5 h-5" />
                ) : (
                  stageNumber
                )}
              </div>

              {/* Progress Line */}
              {index < totalStages - 1 && (
                <div className="absolute left-10 top-1/2 -translate-y-1/2 w-8 md:w-12 h-0.5 bg-neutral-800">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: isCompleted ? '100%' : '0%' }}
                    transition={{ duration: 0.3 }}
                    className="h-full bg-custom-cyan"
                  />
                </div>
              )}
            </motion.div>
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default StageIndicator;
