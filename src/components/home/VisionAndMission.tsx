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
    className="bg-black/80 rounded-xl shadow-lg p-8 border border-custom-cyan mb-8"
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, amount: "some" }}
    variants={containerVariants}
  >
    <motion.div variants={itemVariants}>
      <h2 className="text-2xl font-semibold text-custom-orange mb-4 flex items-center">
        <Target className="w-6 h-6 mr-2" /> Our Mission
      </h2>
      <p className="text-white mb-8">
        To empower student-builders and startup founders to co-create real products, gain experience, and grow together through meaningful collaboration.
      </p>
    </motion.div>

    <motion.div variants={itemVariants}>
      <h2 className="text-2xl font-semibold text-custom-purple mb-4 mt-8 flex items-center">
        <Lightbulb className="w-6 h-6 mr-2" /> Our Vision
      </h2>
      <p className="text-white mb-8">
        To become the world's leading platform for building the next generation of innovators, creating a world where anyone with an idea can build and anyone with skills can grow - no matter where they start.
      </p>
    </motion.div>

    <motion.div variants={itemVariants}>
      <h2 className="text-2xl font-semibold text-custom-cyan mb-4 mt-8 flex items-center">
        <Sparkles className="w-6 h-6 mr-2" /> Core Values
      </h2>
      <motion.ul className="list-none pl-0 text-white space-y-6" variants={containerVariants}>
        <motion.li variants={itemVariants} className="flex items-start">
          <Rocket className="w-6 h-6 mr-3 text-custom-orange flex-shrink-0 mt-1" />
          <div>
            <span className="font-bold">Build with Purpose:</span> <span className="italic">We don't just ship features — we solve real problems. Every line of code, every message sent, and every project started has a reason behind it.</span>
          </div>
        </motion.li>
        <motion.li variants={itemVariants} className="flex items-start">
          <Brain className="w-6 h-6 mr-3 text-custom-purple flex-shrink-0 mt-1" />
          <div>
            <span className="font-bold">Grow through Action:</span> <span className="italic">We learn by doing. We believe that real growth happens through execution — building, failing, and iterating quickly.</span>
          </div>
        </motion.li>
        <motion.li variants={itemVariants} className="flex items-start">
          <Handshake className="w-6 h-6 mr-3 text-custom-cyan flex-shrink-0 mt-1" />
          <div>
            <span className="font-bold">Radical Collaboration:</span> <span className="italic">We create together, not just work together. Founders and students co-own outcomes, not just tasks.</span>
          </div>
        </motion.li>
        <motion.li variants={itemVariants} className="flex items-start">
          <Lightbulb className="w-6 h-6 mr-3 text-custom-orange flex-shrink-0 mt-1" />
          <div>
            <span className="font-bold">Be Resourceful, Be a Builder:</span> <span className="italic">We don't wait for perfect conditions. We solve problems with what we have — creatively and relentlessly.</span>
          </div>
        </motion.li>
        <motion.li variants={itemVariants} className="flex items-start">
          <ShieldCheck className="w-6 h-6 mr-3 text-custom-purple flex-shrink-0 mt-1" />
          <div>
            <span className="font-bold">Earn Trust, Always:</span> <span className="italic">We lead with transparency, respect, and honesty. Whether you're a founder, a student, or a teammate — we do what's right, even when it's hard.</span>
          </div>
        </motion.li>
      </motion.ul>
    </motion.div>
  </motion.div>
);

export default VisionAndMission;