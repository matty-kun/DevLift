import React from 'react';
import Button from '../common/Button';
import { Link } from 'react-router-dom';
import { ArrowRight, User, Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';

const textVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
};

const CallToAction: React.FC = () => {
  return (
    <section className="relative bg-black text-white py-24 sm:py-32 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(42,157,143,0.1)_0%,_rgba(0,0,0,0)_70%)]"></div>
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black to-transparent"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <motion.h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight"
            variants={textVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: "some" }}
          >
            Your Future Won’t Wait. Start Building It.
          </motion.h1>
          <motion.p
            className="mt-6 text-xl text-white/80"
            variants={textVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: "some" }}
            transition={{ delay: 0.2 }}
          >
            Stop waiting for permission. Start building your legacy.
          </motion.p>
          
          <motion.div
            className="mt-12 flex flex-col sm:flex-row gap-6 justify-center items-center"
            variants={textVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: "some" }}
            transition={{ delay: 0.4 }}
          >
            <Button 
              size="lg" 
              variant="accent"
              className="w-full sm:w-auto group flex items-center justify-center gap-x-2 shadow-lg hover:shadow-accent-500/40 transition-all duration-300 transform hover:-translate-y-1"
              data-tally-open="3X6BNe"
              data-tally-layout="modal"
              data-tally-width="800"
              data-tally-emoji-text="🎓"
              data-tally-emoji-animation="wave"
            >
              <User className="w-5 h-5" />
              <span>Apply as Student</span>
              <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="w-full sm:w-auto group flex items-center justify-center gap-x-2 bg-neutral-800/50 border-neutral-700 text-white hover:bg-neutral-800 hover:border-neutral-600 shadow-lg hover:shadow-primary-500/30 transition-all duration-300 transform hover:-translate-y-1"
              data-tally-open="3q8YD8"
              data-tally-layout="modal"
              data-tally-width="800"
              data-tally-emoji-text="🚀"
              data-tally-emoji-animation="wave"
            >
              <Briefcase className="w-5 h-5" />
              <span>Join as Founder</span>
              <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Button>
          </motion.div>
          <motion.p
            className="mt-8 text-sm text-neutral-400"
            variants={textVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: "some" }}
            transition={{ delay: 0.6 }}
          >
            No long-term commitment. Start with a single project and grow from there.
          </motion.p>
        </div>
      </div>
      
      {/* More decorative elements */}
      <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2">
        <div className="w-96 h-96 rounded-full bg-gradient-to-br from-primary-600 to-transparent opacity-10 blur-3xl"></div>
      </div>
      <div className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2">
        <div className="w-96 h-96 rounded-full bg-gradient-to-tl from-accent-500 to-transparent opacity-10 blur-3xl"></div>
      </div>
    </section>
  );
};

export default CallToAction;