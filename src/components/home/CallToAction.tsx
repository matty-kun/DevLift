import React from 'react';
import Button from '../common/Button';
import { Link } from 'react-router-dom';

const CallToAction: React.FC = () => {
  return (
    <section className="py-20 bg-black text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-100">Ready to Build Something Real?</h2>
          <p className="mt-6 text-xl text-primary-100 max-w-2xl mx-auto">
            Join a community where students and startup founders collaborate to build innovative products and gain real-world experience.
          </p>
          
          <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/sign-up">
              <Button 
                size="lg" 
                variant="accent"
                className="shadow-lg hover:shadow-xl transition-shadow px-8"
              >
                Apply as Student
              </Button>
            </Link>
            <Link to="/sign-up">
              <Button 
                size="lg" 
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20 hover:border-white/30 shadow-lg hover:shadow-xl transition-shadow px-8"
              >
                Join as Founder
              </Button>
            </Link>
          </div>
          <p className="mt-6 text-primary-200">
            No long-term commitment. Start with a single project and grow from there.
          </p>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute left-0 bottom-0 w-full h-1/4 overflow-hidden">
        <div className="absolute -bottom-12 -right-12 h-48 w-48 rounded-full bg-accent-500 opacity-10 blur-3xl"></div>
        <div className="absolute -bottom-8 left-1/4 h-40 w-40 rounded-full bg-white opacity-5 blur-3xl"></div>
      </div>
    </section>
  );
};

export default CallToAction;