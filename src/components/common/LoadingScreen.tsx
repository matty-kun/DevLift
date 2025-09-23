import React from 'react';
import sign from '../../assets/DevLift Sign.svg';

const LoadingScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
      <img src={sign} alt="DevLift Logo" className="h-16 w-16 animate-fade-in-out" />
    </div>
  );
};

export default LoadingScreen;
