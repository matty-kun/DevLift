import React from 'react';
import { Rocket, Users, Code, Award } from 'lucide-react';

const HowItWorks: React.FC = () => {
  const steps = [
    {
      icon: <Rocket className="h-10 w-10 text-custom-orange" />,
      title: 'Discover',
      description: 'DevLift gives you access to startup ventures where your skills matter. This is where ambition meets opportunity, and every project is a chance to work on something meaningful.',
    },
    {
      icon: <Users className="h-10 w-10 text-custom-orange" />,
      title: 'Apply',
      description: 'Step into real roles that align with your passion. No classroom simulations. Choose how you contribute and gain clarity by doing work that shapes your future.',
    },
    {
      icon: <Code className="h-10 w-10 text-custom-orange" />,
      title: 'Build',
      description: 'Work with founders and mentors to build real products—not just practice. Learn through real-world experience, guided by those actually building companies, and become one of them.',
    },
    {
      icon: <Award className="h-10 w-10 text-custom-orange" />,
      title: 'Grow',
      description: 'Build a portfolio that proves your skills and a network that opens real doors. Every project is career fuel—DevLift doesn’t just prepare you, it launches you.',
    },
  ];

  return (
    <section className="py-20 md:py-28 bg-black">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white leading-tight">
            <span className="text-white">How DevLift Works</span>
          </h2>
          <p className="mt-4 text-xl md:text-2xl text-neutral-300 font-medium">
            Projects over promises. Skills over slides. Your journey to real-world impact starts here.
          </p>
        </div>

        <div className="relative">
          {/* Connecting line */}
          <div className="hidden lg:block absolute top-24 left-0 w-full h-0.5 bg-custom-purple z-0"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div 
                key={index} 
                                className="relative bg-gradient-to-br from-gray-900 to-black rounded-xl shadow-lg p-8 z-10 transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-2xl border border-gray-800 hover:border-custom-cyan"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="p-3 border border-custom-purple rounded-full mb-4">
                    {step.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">{step.title}</h3>
                  <p className="text-custom-cyan">{step.description}</p>
                </div>
                <div className="hidden lg:flex absolute top-6 -left-3 h-8 w-8 rounded-full bg-custom-purple text-white font-medium items-center justify-center border-4 border-custom-purple">
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