import React from 'react';
import { motion } from 'framer-motion';
import { Target, Lightbulb, Sparkles, Handshake, Rocket, Brain, ShieldCheck } from 'lucide-react';

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const VisionAndMission: React.FC = () => (
  <motion.div
    className="bg-black/80 rounded-xl shadow-lg p-8 border border-custom-cyan mb-8 text-center mx-auto"
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, amount: "some" }}
    variants={containerVariants}
  >
    <motion.div variants={itemVariants}>
      <h2 className="text-3xl font-semibold text-custom-orange mb-4 flex items-center justify-center">
        <Target className="w-6 h-6 mr-2" /> Our Mission
      </h2>
      <p className="text-lg text-white mb-8">
        To empower student-builders and startup founders to co-create real products, gain experience, and grow together through meaningful collaboration.
      </p>
    </motion.div>

    <motion.div variants={itemVariants}>
      <h2 className="text-3xl font-semibold text-custom-purple mb-4 mt-8 flex items-center justify-center">
        <Lightbulb className="w-6 h-6 mr-2" /> Our Vision
      </h2>
      <p className="text-lg text-white mb-8">
      To help build the next generation of innovators—creating a world where anyone with an idea can build, and anyone with skills can grow, no matter where they start.</p>
    </motion.div>
  </motion.div>
);

export default VisionAndMission;