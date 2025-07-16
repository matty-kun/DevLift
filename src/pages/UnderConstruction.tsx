import React from 'react';
import { useNavigate } from 'react-router-dom';
import sign from '../assets/DevLift Sign.svg';
import { Rocket } from 'lucide-react';

const UnderConstruction: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white px-4">
      <div className="flex flex-col items-center">
        <div className="relative mb-6">
          <img src={sign} alt="DevLift Sign" className="h-16 w-16 animate-bounce drop-shadow-lg" />
          <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-5xl animate-pulse">
            🚧
          </span>
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-custom-cyan mb-2 animate-fade-in text-center">
          Oops! This page is still in the startup garage
        </h1>
        <p className="text-lg text-custom-purple mb-8 text-center max-w-xl animate-fade-in delay-200">
          We're working hard to launch this feature. Check back soon or explore other parts of DevLift!
        </p>
        <Rocket className="h-12 w-12 text-custom-orange animate-spin mb-6" />
        <button
          onClick={() => navigate('/')}
          className="bg-custom-cyan text-black font-bold px-6 py-3 rounded-lg shadow-lg hover:bg-custom-orange hover:text-white transition-all duration-300 animate-fade-in delay-300"
        >
          Back to Home
        </button>
      </div>
      <div className="mt-12 text-neutral-500 text-sm animate-blink">
        <span className="mr-2">&gt;_</span> DevLift Team is building something awesome here!
      </div>
    </div>
  );
};

export default UnderConstruction;

// Tailwind animations (add to tailwind.config.js if not present):
// animate-fade-in, animate-blink, animate-bounce, animate-spin 