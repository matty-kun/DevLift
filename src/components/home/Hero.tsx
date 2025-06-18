import React from 'react';
import { ArrowRight } from 'lucide-react';
import Button from '../common/Button';
import { Link } from 'react-router-dom';

const Hero: React.FC = () => {
  return (
    <section className="relative bg-black overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute -right-10 -top-10 h-72 w-72 rounded-full bg-custom-cyan opacity-60 blur-3xl"></div>
        <div className="absolute left-1/4 top-32 h-48 w-48 rounded-full bg-custom-purple opacity-60 blur-3xl"></div>
        <div className="absolute right-1/3 bottom-0 h-64 w-64 rounded-full bg-custom-orange opacity-50 blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 py-16 md:py-24 relative z-10 flex items-center justify-center">
        <div className="max-w-2xl text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight animate-fade-in">
            Build Real Products with <span className="text-custom-orange">Startup Founders</span>
          </h1>
          <p className="mt-6 text-xl text-white/80 animate-fade-in" style={{animationDelay: '100ms'}}>
            Connect with innovative startup founders, work on real products, and gain invaluable experience while making a real impact in the startup ecosystem.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{animationDelay: '200ms'}}>
            <Link to="/sign-up">
              <Button 
                size="lg" 
                variant="primary"
                className="border-2 border-custom-cyan"
                rightIcon={<ArrowRight className="ml-1 h-5 w-5" />}
              >
                Join as Student
              </Button>
            </Link>

            <Link to="/sign-up">
              <Button 
                size="lg" 
                variant="outline"
                className="border-2 border-custom-orange text-custom-orange hover:bg-custom-orange hover:text-white"
              >
                I'm a Founder
              </Button>
            </Link>
          </div>

          <div className="mt-10 grid grid-cols-3 gap-x-6 animate-fade-in" style={{animationDelay: '300ms'}}>
            <div className="text-center">
              <p className="text-3xl font-bold text-custom-cyan">0+</p>
              <p className="mt-1 text-sm text-white/70">Active Startups</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-custom-purple">0+</p>
              <p className="mt-1 text-sm text-white/70">Projects Completed</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-custom-orange">0+</p>
              <p className="mt-1 text-sm text-white/70">Student Builders</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;