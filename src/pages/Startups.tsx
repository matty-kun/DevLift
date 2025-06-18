import React, { useState } from 'react';
import Card from '../components/common/Card';
import ProjectCard from '../components/projects/ProjectCard';
import { Project } from '../types';

// Define a Startup type (for now, reuse Project type for demo purposes)
type Startup = Omit<Project, 'mentorId' | 'difficulty' | 'maxStudents' | 'assignedStudents' | 'applicants' | 'deadline'> & {
  founder: string;
  website: string;
  industry: string;
};

const sampleStartups: Startup[] = [
  {
    id: 's1',
    title: 'FinTech Innovations',
    description: 'Building the next-gen payment platform for emerging markets.',
    founder: 'Alice Johnson',
    website: 'https://fintechinnov.com',
    industry: 'FinTech',
    skills: ['React', 'Node.js', 'Payments'],
    duration: '12 months',
    status: 'open',
    createdAt: new Date(),
  },
  {
    id: 's2',
    title: 'HealthSync',
    description: 'A platform connecting patients and doctors for seamless telemedicine.',
    founder: 'Dr. Mark Lee',
    website: 'https://healthsync.com',
    industry: 'HealthTech',
    skills: ['React Native', 'Firebase', 'UX'],
    duration: '6 months',
    status: 'open',
    createdAt: new Date(),
  },
  {
    id: 's3',
    title: 'EduLift',
    description: 'Personalized learning journeys for K-12 students using AI.',
    founder: 'Priya Patel',
    website: 'https://edulift.ai',
    industry: 'EdTech',
    skills: ['Python', 'AI', 'Data Science'],
    duration: '9 months',
    status: 'open',
    createdAt: new Date(),
  },
];

const Startups: React.FC = () => {
  const [startups] = useState<Startup[]>(sampleStartups);

  return (
    <div className="min-h-screen bg-black py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-neutral-50 mb-4">Featured Startups</h1>
          <p className="text-xl text-neutral-50">Discover innovative startups looking for student collaborators.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {startups.map((startup) => (
            <Card key={startup.id} className="h-full">
              <h3 className="text-xl font-semibold text-neutral-50 mb-2">{startup.title}</h3>
              <p className="text-neutral-400 mb-2">{startup.description}</p>
              <div className="mb-2">
                <span className="text-custom-cyan font-medium">Founder:</span> {startup.founder}
              </div>
              <div className="mb-2">
                <span className="text-custom-orange font-medium">Industry:</span> {startup.industry}
              </div>
              <div className="mb-2">
                <span className="text-custom-purple font-medium">Website:</span> <a href={startup.website} target="_blank" rel="noopener noreferrer" className="underline text-custom-cyan hover:text-custom-purple">{startup.website}</a>
              </div>
              <div className="flex flex-wrap gap-2 mb-2">
                {startup.skills.map((skill, idx) => (
                  <span key={idx} className="bg-custom-cyan/10 text-custom-cyan px-2 py-1 rounded text-xs font-medium">{skill}</span>
                ))}
              </div>
              <div className="text-neutral-300 text-sm">Duration: {startup.duration}</div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Startups;


