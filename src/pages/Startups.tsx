import React, { useState, useMemo } from 'react';
import Card from '../components/common/Card';
import { Project } from '../types';
import Avatar from '../components/common/Avatar';
import { Link } from 'react-router-dom';
import Input from '../components/common/Input';
import Button from '../components/common/Button';

// Define a Startup type (for now, reuse Project type for demo purposes)
type Startup = Omit<Project, 'mentorId' | 'difficulty' | 'maxStudents' | 'assignedStudents' | 'applicants' | 'deadline'> & {
  founder: string;
  website: string;
  industry: string;
  avatar?: string;
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
        avatar: 'https://via.placeholder.com/150/1D3557/FFFFFF/?text=FI',
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
        avatar: 'https://via.placeholder.com/150/2A9D8F/FFFFFF/?text=HS',
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
        avatar: 'https://via.placeholder.com/150/E76F51/FFFFFF/?text=EL',
      },
      {
        id: 's4',
        title: 'GreenTech Solutions',
        description: 'Developing IoT-powered solutions for sustainable agriculture and smart farming.',
        founder: 'Lucas Green',
        website: 'https://greentech.com',
        industry: 'AgriTech',
        skills: ['IoT', 'Python', 'Cloud'],
        duration: '8 months',
        status: 'open',
        createdAt: new Date(),
        avatar: 'https://via.placeholder.com/150/228B22/FFFFFF/?text=GS',
      },
      {
        id: 's5',
        title: 'SafeNet',
        description: 'Cybersecurity platform protecting small businesses from online threats.',
        founder: 'Maya Lin',
        website: 'https://safenet.io',
        industry: 'Cybersecurity',
        skills: ['Security', 'Node.js', 'React'],
        duration: '10 months',
        status: 'open',
        createdAt: new Date(),
        avatar: 'https://via.placeholder.com/150/FFB300/FFFFFF/?text=SN',
      },
      {
        id: 's6',
        title: 'TravelNest',
        description: 'Personalized travel planning using AI and real-time data.',
        founder: 'Carlos Rivera',
        website: 'https://travelnest.ai',
        industry: 'TravelTech',
        skills: ['AI', 'Data Science', 'UX'],
        duration: '7 months',
        status: 'open',
        createdAt: new Date(),
        avatar: 'https://via.placeholder.com/150/7b2ff2/FFFFFF/?text=TN',
      },
];

const Startups: React.FC = () => {
  const [startups] = useState<Startup[]>(sampleStartups);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('All');

  const industries = useMemo(() => ['All', ...new Set(startups.map(s => s.industry))], [startups]);

  const filteredStartups = useMemo(() => {
    return startups.filter(startup => {
      const matchesIndustry = selectedIndustry === 'All' || startup.industry === selectedIndustry;
      const matchesSearch = startup.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            startup.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            startup.founder.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesIndustry && matchesSearch;
    });
  }, [startups, searchTerm, selectedIndustry]);

  return (
    <div className="min-h-screen bg-black text-neutral-50 py-12">
      <div className="container mx-auto px-4">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-custom-purple via-custom-cyan to-custom-orange mb-4">
            Featured Startups
          </h1>
          <p className="text-xl text-neutral-300">Discover innovative startups looking for student collaborators.</p>
        </header>

        <div className="mb-8 flex flex-col md:flex-row gap-4 items-center">
          <Input
            type="text"
            placeholder="Search by name, founder, or keyword..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-1/2 bg-neutral-900 border-neutral-700"
          />
          <div className="relative w-full md:w-auto">
            <select
              value={selectedIndustry}
              onChange={(e) => setSelectedIndustry(e.target.value)}
              className="w-full md:w-auto appearance-none bg-neutral-900 border border-neutral-700 text-neutral-50 py-2 px-4 pr-8 rounded-md focus:outline-none focus:ring-2 focus:ring-custom-cyan"
            >
              {industries.map(industry => (
                <option key={industry} value={industry}>{industry}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-neutral-400">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredStartups.map((startup) => (
            <Link to={`/startups/${startup.id}`} key={startup.id} className="group block">
              <Card className="h-full bg-neutral-900/50 backdrop-blur-sm border border-neutral-800 rounded-lg overflow-hidden shadow-lg hover:shadow-custom-cyan/20 transition-all duration-300 transform hover:-translate-y-1">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                        <Avatar src={startup.avatar} alt={startup.title} size="xl" className="border-2 border-neutral-700 group-hover:border-custom-cyan transition-all duration-300" />
                        <div>
                            <h3 className="text-2xl font-bold text-neutral-50 group-hover:text-custom-cyan transition-colors duration-300">{startup.title}</h3>
                            <p className="text-sm text-custom-purple font-medium">{startup.industry}</p>
                        </div>
                    </div>
                  </div>
                  <p className="text-neutral-300 mb-4 h-20 overflow-hidden">{startup.description}</p>
                  <div className="mb-4">
                    <span className="text-neutral-400 font-medium">Founder:</span> <span className="text-neutral-100">{startup.founder}</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {startup.skills.map((skill, idx) => (
                      <span key={idx} className="bg-custom-cyan/10 text-custom-cyan px-2 py-1 rounded-full text-xs font-medium">{skill}</span>
                    ))}
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="text-neutral-400 text-sm">
                      Duration: {startup.duration}
                    </div>
                    <Button variant='outline' size='sm' className="border-custom-cyan text-custom-cyan group-hover:bg-custom-cyan group-hover:text-white transition-colors duration-300">
                        View Details
                    </Button>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
        {filteredStartups.length === 0 && (
            <div className="text-center py-16">
                <h2 className="text-2xl font-semibold text-neutral-400">No startups found.</h2>
                <p className="text-neutral-500 mt-2">Try adjusting your search or filters.</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default Startups;
