import React from 'react';
import { Rocket, Users, Code, Award } from 'lucide-react';

const HowItWorks: React.FC = () => {
  const steps = [
    {
      icon: <Rocket className="h-10 w-10 text-custom-orange" />,
      title: 'Discover',
      description: 'DevLift gives you access to early-stage ventures where your skills matter. This is where ambition meets opportunity, and every project is a chance to work on something meaningful.',
    },
    {
      icon: <Users className="h-10 w-10 text-custom-orange" />,
      title: 'Apply',
      description: 'Step into real roles that align with your passion. No classroom simulations. You choose how you want to contribute. Get clarity on your future by doing the work that will define it.',
    },
    {
      icon: <Code className="h-10 w-10 text-custom-orange" />,
      title: 'Build',
      description: 'Work side-by-side with founders and mentors to build real products, not just practice ones. This is where learning becomes transformation. Gain mentorship from people actually building companies, and become one of them.',
    },
    {
      icon: <Award className="h-10 w-10 text-custom-orange" />,
      title: 'Grow',
      description: 'Craft a portfolio that speaks louder than any diploma, and build a network that opens real doors. Each project adds to your proof of skill. DevLift doesn’t just prepare you for your career, it propels you into it.',
    },
  ];

  return (
    <section className="py-16 bg-black">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white">Discover. Apply. Build. Grow. Repeat.</h2>
          <p className="mt-4 text-xl text-neutral-400">
            Projects over promises. Skills over slides.
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