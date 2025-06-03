import React from 'react';
import { Rocket, Users, Code, Award } from 'lucide-react';

const HowItWorks: React.FC = () => {
  const steps = [
    {
      icon: <Rocket className="h-10 w-10 text-primary-600" />,
      title: 'Match with Startups',
      description: 'Get matched with innovative startups based on your skills, interests, and availability.',
    },
    {
      icon: <Users className="h-10 w-10 text-primary-600" />,
      title: 'Direct Collaboration',
      description: 'Work directly with founders on specific features, improvements, or research tasks.',
    },
    {
      icon: <Code className="h-10 w-10 text-primary-600" />,
      title: 'Build Real Products',
      description: 'Contribute to actual products being used by real customers in the market.',
    },
    {
      icon: <Award className="h-10 w-10 text-primary-600" />,
      title: 'Grow Your Portfolio',
      description: 'Gain verified startup experience and build a portfolio of real-world achievements.',
    },
  ];

  return (
    <section className="py-16 bg-black">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white">How It Works</h2>
          <p className="mt-4 text-xl text-custom-cyan">
            A simple process to connect students with real startup opportunities and hands-on experience.
          </p>
        </div>

        <div className="relative">
          {/* Connecting line */}
          <div className="hidden lg:block absolute top-24 left-0 w-full h-0.5 bg-custom-purple z-0"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div 
                key={index} 
                className="relative bg-black rounded-xl shadow-soft p-6 z-10 transition-transform hover:-translate-y-1 border border-custom-cyan"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="p-3 bg-custom-orange rounded-full mb-4">
                    {step.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">{step.title}</h3>
                  <p className="text-custom-cyan">{step.description}</p>
                </div>
                <div className="hidden lg:flex absolute top-6 -left-3 h-8 w-8 rounded-full bg-custom-purple text-white font-medium items-center justify-center border-4 border-custom-orange">
                  {index + 1}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;