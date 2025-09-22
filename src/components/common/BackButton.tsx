import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

interface BackButtonProps {
  to: string;
  text: string;
  className?: string;
}

const BackButton: React.FC<BackButtonProps> = ({ to, text, className = '' }) => {
  return (
    <Link
      to={to}
      className={`inline-flex items-center gap-2 text-sm font-medium text-custom-cyan hover:text-custom-purple transition-colors ${className}`}
    >
      <ArrowLeft className="w-4 h-4" /> {text}
    </Link>
  );
};

export default BackButton;