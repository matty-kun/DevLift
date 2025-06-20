import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import Avatar from '../components/common/Avatar';
import { Project } from '../types';

// Sample data with founderName and startupLogo for demo
const sampleProjects: (Project & { founderName: string; startupLogo?: string })[] = [
  {
    id: '1',
    title: 'E-Commerce Mobile App Development',
    description: 'Build a fully functional e-commerce app using React Native with payment integration, product catalog, and user authentication.',
    mentorId: 'mentor1',
    founderName: 'Alice Johnson',
    startupLogo: 'https://via.placeholder.com/64x64.png?text=Logo',
    skills: ['React Native', 'JavaScript', 'Firebase', 'Redux'],
    duration: '8 weeks',
    status: 'open',
    difficulty: 'intermediate',
    maxStudents: 3,
    assignedStudents: [],
    applicants: [],
    createdAt: new Date(),
  },
  {
    id: '2',
    title: 'Data Visualization Dashboard',
    description: 'Design and develop an interactive dashboard to visualize complex datasets for a healthcare organization using modern web technologies.',
    mentorId: 'mentor2',
    founderName: 'Priya Patel',
    startupLogo: 'https://via.placeholder.com/64x64.png?text=Logo',
    skills: ['React', 'D3.js', 'TypeScript', 'Tailwind CSS'],
    duration: '6 weeks',
    status: 'open',
    difficulty: 'advanced',
    maxStudents: 2,
    assignedStudents: ['student1'],
    applicants: ['student1', 'student2', 'student3'],
    createdAt: new Date(),
  },
  {
    id: '3',
    title: 'AI Chatbot Integration',
    description: 'Implement a conversational AI chatbot into an existing platform to improve customer service and automate repetitive tasks.',
    mentorId: 'mentor3',
    founderName: 'Mark Lee',
    startupLogo: 'https://via.placeholder.com/64x64.png?text=Logo',
    skills: ['Python', 'NLP', 'Machine Learning', 'API Integration'],
    duration: '10 weeks',
    status: 'in-progress',
    difficulty: 'advanced',
    maxStudents: 4,
    assignedStudents: ['student4', 'student5'],
    applicants: ['student4', 'student5', 'student6', 'student7'],
    createdAt: new Date(),
  },
  {
    id: '4',
    title: 'Social Media Analytics Tool',
    description: 'Create a web application that analyzes social media data and provides insights using data visualization and machine learning.',
    mentorId: 'mentor4',
    founderName: 'Lucas Green',
    startupLogo: 'https://via.placeholder.com/64x64.png?text=Logo',
    skills: ['React', 'Python', 'Data Analysis', 'Machine Learning'],
    duration: '12 weeks',
    status: 'open',
    difficulty: 'intermediate',
    maxStudents: 3,
    assignedStudents: [],
    applicants: [],
    createdAt: new Date(),
  },
  {
    id: '5',
    title: 'Blockchain Wallet Integration',
    description: 'Integrate cryptocurrency wallet functionality into an existing web application using Web3 technologies.',
    mentorId: 'mentor5',
    founderName: 'Satoshi Nakamoto',
    startupLogo: 'https://via.placeholder.com/64x64.png?text=Logo',
    skills: ['Web3.js', 'Solidity', 'React', 'TypeScript'],
    duration: '8 weeks',
    status: 'open',
    difficulty: 'advanced',
    maxStudents: 2,
    assignedStudents: [],
    applicants: [],
    createdAt: new Date(),
  },
  {
    id: '6',
    title: 'Mobile Game Development',
    description: 'Build a casual mobile game using Unity and implement core gameplay mechanics, UI, and monetization features.',
    mentorId: 'mentor6',
    founderName: 'Jane Doe',
    startupLogo: 'https://via.placeholder.com/64x64.png?text=Logo',
    skills: ['Unity', 'C#', 'Game Design', 'UI/UX'],
    duration: '10 weeks',
    status: 'open',
    difficulty: 'intermediate',
    maxStudents: 4,
    assignedStudents: [],
    applicants: [],
    createdAt: new Date(),
  },
];

const ProjectDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const project = sampleProjects.find((p) => p.id === id);

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <p>Project not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <Link to="/projects" className="text-custom-cyan hover:text-custom-purple mb-4 inline-block">&larr; Back to Projects</Link>
        <Card className="mb-8 text-white">
          <div className="flex items-center gap-4 mb-4">
            <Avatar size="xxl" src={project.startupLogo || 'https://via.placeholder.com/64x64.png?text=Logo'} alt="Startup Logo" />
            <div>
              <h1 className="text-3xl font-bold">{project.title}</h1>
              <div className="flex gap-2 mt-2">
                <Badge variant="primary">{project.status === 'open' ? 'Open to Apply' : project.status === 'in-progress' ? 'In Progress' : 'Completed'}</Badge>
                <Badge variant="secondary">{project.difficulty.charAt(0).toUpperCase() + project.difficulty.slice(1)}</Badge>
              </div>
              <div className="mt-2 text-custom-orange font-medium text-sm">Founder: {project.founderName}</div>
            </div>
          </div>
          <p className="mb-4">{project.description}</p>
          <div className="mb-4">
            <span className="text-custom-cyan font-medium">Mentor ID:</span> {project.mentorId}
          </div>
          <div className="mb-4">
            <span className="text-custom-orange font-medium">Duration:</span> {project.duration}
          </div>
          <div className="mb-4">
            <span className="text-custom-purple font-medium">Max Students:</span> {project.maxStudents}
          </div>
          <div className="mb-4">
            <span className="text-custom-cyan font-medium">Skills:</span>
            <div className="flex flex-wrap gap-2 mt-1">
              {project.skills.map((skill) => (
                <Badge key={skill} variant="primary" size="sm">{skill}</Badge>
              ))}
            </div>
          </div>
          <div className="mb-4">
            <span className="text-custom-orange font-medium">Assigned Students:</span> {project.assignedStudents.length}
          </div>
          <div className="mb-4">
            <span className="text-custom-purple font-medium">Applicants:</span> {project.applicants.length}
          </div>
          <div className="text-neutral-400 text-sm mb-6">
            Posted on: {project.createdAt.toLocaleDateString()}
          </div>
          <button
            className="w-full bg-custom-cyan text-black font-semibold py-3 rounded-lg mt-2 hover:bg-custom-cyan/90 transition-colors text-lg"
            onClick={() => alert('Application submitted!')}
          >
            Apply
          </button>
        </Card>
      </div>
    </div>
  );
};

export default ProjectDetails;