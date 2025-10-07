import React from 'react';
import { GraduationCap, Briefcase, Star } from 'lucide-react';

interface Person {
  id: string;
  full_name: string;
  avatar_url: string;
  role: string;
  bio: string;
  skills: string[];
  position?: string;
  school?: string;
  avg_rating?: number | null;
  reviews_count?: number | null;
}

interface PersonCardProps {
  person: Person;
  onClick?: () => void;
  className?: string;
}

const PersonCard: React.FC<PersonCardProps> = ({ person, onClick, className = '' }) => {
  return (
    <div 
      onClick={onClick}
      className={`bg-neutral-900 border border-transparent rounded-lg p-6 hover:border-custom-cyan transition-colors ${className}`}
    >
      <div className="flex items-start gap-4 mb-4">
        <img 
          src={person.avatar_url || 'https://api.dicebear.com/7.x/identicon/svg'} 
          alt={person.full_name} 
          className="w-16 h-16 rounded-full object-cover border-2 border-custom-cyan"
        />
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold truncate">{person.full_name}</h3>
          <div className="flex items-center gap-2 text-sm text-neutral-400">
            {person.role === 'student' ? (
              <>
                <GraduationCap size={16} />
                <span>{person.school || 'Student'}</span>
              </>
            ) : (
              <>
                <Briefcase size={16} />
                <span>{person.position || 'Founder'}</span>
              </>
            )}
          </div>
          {person.reviews_count > 0 && (
            <div className="flex items-center gap-1 mt-1 text-sm">
              <Star size={14} className="text-yellow-400 fill-yellow-400" />
              <span className="font-medium">{person.avg_rating?.toFixed(1)}</span>
              <span className="text-neutral-400">({person.reviews_count})</span>
            </div>
          )}
        </div>
      </div>
      <p className="text-sm text-neutral-300 line-clamp-2 mb-4">{person.bio}</p>
      {person.skills?.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {person.skills.map((skill, i) => (
            <span key={i} className="px-2 py-1 text-xs rounded-full bg-neutral-800 text-neutral-300">
              {skill}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default PersonCard;
