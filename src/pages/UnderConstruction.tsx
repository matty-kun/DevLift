import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Rocket, Undo2, ArrowLeft } from 'lucide-react';

const UnderConstruction: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white flex flex-col items-center justify-center p-4 overflow-hidden">
      <div className="absolute inset-0 particle-background"></div>
      <div className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto">
        <Rocket className="w-28 h-28 md:w-36 md:h-36 mb-8 text-custom-cyan animate-float transform -rotate-45" />
        <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-4">
          Guys, we have a page!
        </h1>
        <p className="text-lg text-gray-400 mb-12 max-w-2xl">
          Well, almost. Our dev team is currently fueling up the rockets. This area is off-limits to earthlings for now, but it's going to be out of this world!
        </p>

        

        <button
          onClick={() => navigate('/')}
          className="bg-custom-cyan text-black font-bold px-8 py-3 rounded-lg shadow-lg hover:bg-custom-orange hover:text-white transition-all duration-300 flex items-center"
        >
          <Undo2 className="w-5 h-5 mr-2" />
          Abort Mission & Go Home
        </button>
      </div>
    </div>
  );
};

export default UnderConstruction;
