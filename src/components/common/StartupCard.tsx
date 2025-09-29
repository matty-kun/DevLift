import React from 'react';
import { Startup } from '../../types';
import { Link } from 'react-router-dom';

interface StartupCardProps {
  startup: Startup;
}

const StartupCard: React.FC<StartupCardProps> = ({ startup }) => {
  return (
    <Link to={`/startups/${startup.id}`} className="block bg-neutral-800 rounded-lg p-4 hover:bg-neutral-700 transition-colors">
      <div className="flex items-center">
        <img src={startup.logo_url} alt={startup.name} className="w-12 h-12 rounded-lg mr-4" />
        <div>
          <h3 className="text-lg font-bold">{startup.name}</h3>
          <p className="text-neutral-400 truncate">{startup.description}</p>
        </div>
      </div>
    </Link>
  );
};

export default StartupCard;
