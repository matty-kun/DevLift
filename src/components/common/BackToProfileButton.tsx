import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

interface BackToProfileButtonProps {
  className?: string;
  to?: string;
}

// Navigates user back to their appropriate dashboard or to a custom profile page if 'to' is provided
const BackToProfileButton: React.FC<BackToProfileButtonProps> = ({ className = '', to }) => {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const target = (profile?.role === 'mentor' || profile?.role === 'founder') ? '/founder-dashboard' : '/student-dashboard';

  if (to) {
    return (
      <Link
        to={to}
        className={`inline-flex items-center gap-2 text-sm font-medium text-custom-cyan hover:text-custom-purple transition-colors ${className}`}
      >
        <ArrowLeft className="w-4 h-4" /> Back to Profile
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={() => navigate(target)}
      className={`inline-flex items-center gap-2 text-sm font-medium text-custom-cyan hover:text-custom-purple transition-colors ${className}`}
    >
      <ArrowLeft className="w-4 h-4" /> Back to Profile
    </button>
  );
};

export default BackToProfileButton;
