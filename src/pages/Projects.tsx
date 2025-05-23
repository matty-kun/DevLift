import React, { useState } from 'react';
import { Search, Filter, Briefcase, Clock, User, Code  } from 'lucide-react';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Card from '../components/common/Card';
import ProjectCard from '../components/projects/ProjectCard';
import { Project } from '../types';

const Projects: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string[]>([]);
  const [selectedDuration, setSelectedDuration] = useState<string[]>([]);

  // Sample project data (in a real app, this would come from an API)

  const projects: Project[] = [
    {
      id: '1',
      title: 'E-Commerce Mobile App Development',
      description: 'Build a fully functional e-commerce app using React Native with payment integration, product catalog, and user authentication.',
      mentorId: 'mentor1',
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

  // Filter options
  const skills = Array.from(new Set(projects.flatMap(project => project.skills)));
  const difficulties = ['beginner', 'intermediate', 'advanced'];
  const durations = ['4-6 weeks', '6-8 weeks', '8-12 weeks', '12+ weeks'];

  // Filter projects based on search and filters
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) || project.description.toLowerCase().includes(searchQuery.toLowerCase()) || project.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesSkills = selectedSkills.length === 0 || selectedSkills.some(skill => project.skills.includes(skill));

    const matchesDifficulty = selectedDifficulty.length === 0 || selectedDifficulty.includes(project.difficulty);

    const matchesDuration = selectedDuration.length === 0 || selectedDuration.some(duration => project.duration.includes(duration));

    return matchesSearch && matchesSkills && matchesDifficulty && matchesDuration;
  });

    return (
      <div className="min-h-screen bg-neutral-50 py-12">
      </div>
    )

};
