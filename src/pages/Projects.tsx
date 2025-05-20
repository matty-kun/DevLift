import React from 'react';
import ProjectCard from '../components/projects/ProjectCard';

const projects = [
  {
    id: 1,
    title: "Expense Tracker",
    description: "Track your expenses easily.",
    mentor: "Jane Doe",
    applicants: 5,
  },
  {
    id: 2,
    title: "Budget App",
    description: "Manage your budget efficiently.",
    mentor: "John Smith",
    applicants: 3,
  },
];

const Projects: React.FC = () => (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Projects</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((project) => (
            <ProjectCard key={project.id} project={project}/>
        ))}
      </div>
    </div>
);

export default Projects;
