import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Sparkles, ArrowRight } from 'lucide-react';
import Button from '../common/Button';

interface CompletionStageProps {
  role: 'student' | 'founder';
  fullName: string;
  onComplete: () => void;
}

const CompletionStage: React.FC<CompletionStageProps> = ({ role, fullName, onComplete }) => {
  // Confetti animation
  const confettiColors = ['#19c3f7', '#7b2ff2', '#f74a19'];
  const confettiPieces = Array.from({ length: 30 });

  useEffect(() => {
    // Auto-redirect after 3 seconds
    const timer = setTimeout(() => {
      onComplete();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="relative min-h-[500px] flex flex-col items-center justify-center text-center space-y-6"
    >
      {/* Confetti Animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {confettiPieces.map((_, i) => (
          <motion.div
            key={i}
            initial={{
              x: '50%',
              y: '50%',
              rotate: 0,
              opacity: 1,
            }}
            animate={{
              x: `${Math.random() * 100}%`,
              y: `${Math.random() * 100}%`,
              rotate: Math.random() * 360,
              opacity: 0,
            }}
            transition={{
              duration: 1 + Math.random() * 0.5,
              ease: 'easeOut',
            }}
            className="absolute w-3 h-3 rounded-full"
            style={{
              backgroundColor: confettiColors[Math.floor(Math.random() * confettiColors.length)],
            }}
          />
        ))}
      </div>

      {/* Success Icon */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
      >
        <div className="relative">
          <div className="absolute inset-0 bg-custom-cyan/20 blur-2xl rounded-full" />
          <CheckCircle className="h-24 w-24 text-custom-cyan relative z-10" />
        </div>
      </motion.div>

      {/* Success Message */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="space-y-3"
      >
        <h1 className="text-4xl font-bold text-white">
          Welcome aboard, {fullName}! <Sparkles className="inline h-8 w-8 text-custom-orange" />
        </h1>
        <p className="text-xl text-neutral-400">
          Your profile is all set up and ready to go!
        </p>
      </motion.div>

      {/* Role-specific Message */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="bg-gradient-to-r from-custom-cyan/10 via-custom-purple/10 to-custom-orange/10
                   border border-custom-cyan/30 rounded-lg p-6 max-w-lg"
      >
        <p className="text-neutral-300">
          {role === 'student' ? (
            <>
              🎓 You're all set to explore exciting projects and connect with mentors.
              Start browsing opportunities and apply to projects that match your interests!
            </>
          ) : (
            <>
              🚀 You're ready to post projects and find talented students to collaborate with.
              Create your first project or explore the community!
            </>
          )}
        </p>
      </motion.div>

      {/* Call to Action */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="pt-4"
      >
        <Button
          onClick={onComplete}
          variant="primary"
          size="lg"
          rightIcon={<ArrowRight className="h-5 w-5" />}
          className="shadow-lg shadow-custom-cyan/30"
        >
          Go to Dashboard
        </Button>
        <p className="text-xs text-neutral-500 mt-3">Redirecting automatically in 3 seconds...</p>
      </motion.div>
    </motion.div>
  );
};

export default CompletionStage;
