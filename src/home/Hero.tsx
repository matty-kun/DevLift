import React from 'react';
import { ArrowRight } from 'lucide-react';
import Button from '../components/common/Button';

const Hero: React.FC = () => {
  return (
    <section className="relative bg-gradient-to-b from-neutral-50 to-neutral-100 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute -right-10 -top-10 h-72 w-72 rounded-full bg-primary-100 opacity-60 blur-3xl"></div>
        <div className="absolute left-1/4 top-32 h-48 w-48 rounded-full bg-secondary-100 opacity-60 blur-3xl"></div>
        <div className="absolute right-1/3 bottom-0 h-64 w-64 rounded-full bg-accent-100 opacity-50 blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-900 leading-tight animate-fade-in">
              Build Real Products with <span className="text-primary-600">Startup Founders</span>
            </h1>
            <p className="mt-6 text-xl text-neutral-700 animate-fade-in" style={{animationDelay: '100ms'}}>
              Connect with innovative startup founders, work on real products, and gain invaluable experience while making a real impact in the startup ecosystem.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 animate-fade-in" style={{animationDelay: '200ms'}}>
              <Button 
                size="lg" 
                variant="primary"
                rightIcon={<ArrowRight className="ml-1 h-5 w-5" />}
              >
                Join as Student
              </Button>
              <Button 
                size="lg" 
                variant="outline"
              >
                I'm a Founder
              </Button>
            </div>

            <div className="mt-10 grid grid-cols-3 gap-x-6 animate-fade-in" style={{animationDelay: '300ms'}}>
              <div className="text-center">
                <p className="text-3xl font-bold text-primary-600">50+</p>
                <p className="mt-1 text-sm text-neutral-600">Active Startups</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-primary-600">200+</p>
                <p className="mt-1 text-sm text-neutral-600">Projects Completed</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-primary-600">1K+</p>
                <p className="mt-1 text-sm text-neutral-600">Student Builders</p>
              </div>
            </div>
          </div>

          <div className="relative lg:h-[500px] animate-fade-in" style={{animationDelay: '400ms'}}>
            <div className="absolute top-0 right-0 w-full h-full rounded-2xl bg-white shadow-medium overflow-hidden">
              <img 
                src="https://images.pexels.com/photos/7439141/pexels-photo-7439141.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                alt="Startup collaboration" 
                className="w-full h-full object-cover opacity-90"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 w-64 rounded-xl bg-white shadow-medium p-4 transform rotate-2 animate-pulse-slow">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-success-100 flex items-center justify-center">
                  <span className="text-success-600 font-bold">✓</span>
                </div>
                <div>
                  <p className="text-sm font-medium">Project Launched!</p>
                  <p className="text-xs text-neutral-500">AI Feature Integration</p>
                </div>
              </div>
            </div>
            <div className="absolute top-6 -right-6 w-56 rounded-xl bg-white shadow-medium p-4 transform -rotate-3 animate-pulse-slow">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-accent-100 flex items-center justify-center">
                  <span className="text-accent-600 font-bold">🚀</span>
                </div>
                <div>
                  <p className="text-sm font-medium">New Startup Joined!</p>
                  <p className="text-xs text-neutral-500">HealthTech Platform</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;