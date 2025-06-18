import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Card from '../components/common/Card';

// Sample data for demonstration (in a real app, fetch by ID)
const sampleStartups = [
  {
    id: 's1',
    title: 'FinTech Innovations',
    description: 'Building the next-gen payment platform for emerging markets.',
    founder: 'Alice Johnson',
    website: 'https://fintechinnov.com',
    industry: 'FinTech',
    avatar: 'https://via.placeholder.com/64x64.png?text=Logo',
    projects: [
      {
        id: 'p1',
        title: 'Mobile Wallet App',
        description: 'A secure mobile wallet for digital payments.',
      },
      {
        id: 'p2',
        title: 'Payment Gateway API',
        description: 'API for seamless online transactions.',
      },
    ],
  },
  // ... add more startups as needed
];

const StartupDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const startup = sampleStartups.find((startup) => startup.id === id);

  if (!startup) {
    return (
        <div className="min-h-screen flex bg-black flex items-center justify-center text-white">
          <p>Startup not found.</p>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <Link to="/startups" className="text-custom-cyan hover:text-custom-purple mb-4 inline-block">&larr; Back to Startups</Link>
        <Card className="mb-8 text-white">
          <div className="flex items-center gap-4 mb-4">
            <img src={startup.avatar} alt={startup.title} className="w-20 h-20 rounded-full object-cover border border-neutral-200" />
            <div>
              <h1 className="text-3xl font-bold">{startup.title}</h1>
              <div className="text-custom-orange font-medium">{startup.industry}</div>
              <a href={startup.website} target="_blank" rel="noopener noreferrer" className="text-custom-cyan hover:text-custom-purple text-sm">{startup.website}</a>
            </div>
          </div>
          <p className="mb-4">{startup.description}</p>
          <div>
            <span className="text-custom-cyan font-medium">Founder:</span> {startup.founder}
          </div>
        </Card>
        <h2 className="text-2xl font-bold text-white mb-4">Projects Posted</h2>
        <div className="space-y-4">
          {startup.projects.map((project) => (
            <Card key={project.id} className="text-white flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold">{project.title}</h3>
                <p>{project.description}</p>
              </div>
              <Link
                to={`/projects/${project.id}`}
                className="ml-4 px-4 py-2 bg-custom-cyan text-black rounded-lg font-semibold 
                           hover:bg-white hover:text-black transition-colors duration-200 whitespace-nowrap"
              >
                View Details
              </Link>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};


export default StartupDetails;