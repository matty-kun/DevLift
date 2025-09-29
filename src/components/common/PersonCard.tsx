import React from 'react';
import { Person } from '../../types';
import { Link } from 'react-router-dom';

interface PersonCardProps {
  person: Person;
}

const PersonCard: React.FC<PersonCardProps> = ({ person }) => {
  return (
    <Link to={`/people/${person.id}`} className="block bg-neutral-800 rounded-lg p-4 hover:bg-neutral-700 transition-colors">
      <div className="flex items-center">
        <img src={person.avatar_url} alt={person.name} className="w-12 h-12 rounded-full mr-4" />
        <div>
          <h3 className="text-lg font-bold">{person.name}</h3>
          <p className="text-neutral-400">{person.role}</p>
        </div>
      </div>
    </Link>
  );
};

export default PersonCard;
