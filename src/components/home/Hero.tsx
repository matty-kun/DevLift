import React, { useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import Button from '../common/Button';
import { Link } from 'react-router-dom';
import Navbar from '../layout/Navbar'; // adjust the import path as needed
import { motion } from 'framer-motion';

const textVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
};

const Hero: React.FC = () => {

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://tally.so/widgets/embed.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <section className="relative">
      <Navbar />
      {/* Background decorative elements */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute -right-10 -top-10 h-72 w-72 rounded-full bg-custom-cyan opacity-60 blur-3xl"></div>
        <div className="absolute left-1/4 top-32 h-48 w-48 rounded-full bg-custom-purple opacity-60 blur-3xl"></div>
        <div className="absolute left-1/20 bottom-1 h-48 w-48 rounded-full bg-white opacity-60 blur-3xl"></div>
        <div className="absolute right-1/3 bottom-0 h-64 w-64 rounded-full bg-custom-orange opacity-50 blur-3xl"></div>
      </div>

      <div className="container mx-auto min-h-screen px-4 py-20 md:py-32 relative z-10 flex flex-col items-center justify-center">
        <div className="w-full max-w-5xl text-center mx-auto">
          <motion.h1
            className="text-5xl md:text-7xl lg:text-8xl font-extrabold text-white leading-tight whitespace-nowrap"
            variants={textVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
          >
            <span className="text-custom-cyan">Experience </span>
            <span className="text-white">&gt;</span>
            <span className="text-custom-orange"> Degrees</span>
          </motion.h1>
          <motion.p
            className="mt-8 text-2xl md:text-3xl text-white/80 font-medium max-w-3xl mx-auto"
            variants={textVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            transition={{ delay: 0.2 }}
          >
            Because skills, not grades, get you hired.
          </motion.p>
          <motion.div
            className="mt-8 flex flex-col sm:flex-row gap-4 justify-center"
            variants={textVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            transition={{ delay: 0.4 }}
          >
            <Button 
              size="lg" 
              variant="primary"
              className="border-2 border-custom-cyan shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-105 active:scale-95"
              rightIcon={<ArrowRight className="ml-1 h-5 w-5" />}
              data-tally-open="3X6BNe"
              data-tally-layout="modal"
              data-tally-width="600"
              data-tally-emoji-text="🚀"
              data-tally-emoji-animation="wave"
            >
              Join as Student
            </Button>

            <Button 
              size="lg" 
              variant="outline"
              className="border-2 border-custom-orange text-custom-orange hover:bg-custom-orange hover:text-white shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-105 active:scale-95"
              data-tally-open="3X6BNe"
              data-tally-layout="modal"
              data-tally-width="600"
              data-tally-emoji-text="🚀"
              data-tally-emoji-animation="wave"
            >
              I'm a Founder
            </Button>
          </motion.div>

          <motion.div
            className="mt-10 grid grid-cols-3 gap-x-6"
            variants={textVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            transition={{ delay: 0.6 }}
          >
            <div className="text-center">
              <p className="text-3xl font-bold text-custom-cyan">0+</p>
              <p className="mt-1 text-sm text-white/70">Interested Students</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-custom-purple">0+</p>
              <p className="mt-1 text-sm text-white/70">Interested Founders</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-custom-orange">0+</p>
              <p className="mt-1 text-sm text-white/70">Startups</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;