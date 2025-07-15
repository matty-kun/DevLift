import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Button from '../common/Button';
import ProjectCard from '../projects/ProjectCard';
import { Project } from  '../../types';
import devliftLogo from '../../assets/DevLift Logo.svg';

const FeaturedProjects: React.FC = () => {
    // These are just Sample Project Data
  const featuredProjects: Project[] = [
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
      imageUrl: devliftLogo,
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
      imageUrl: devliftLogo,
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
      imageUrl: devliftLogo,
    },
  ];

  return (
    <section className="py-16 bg-black">
        <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
                <div>
                    <h2 className="text-3xl md:text-4xl font-bold text-neutral-50">Featured Projects</h2>
                    <p className="mt-3 text-xl text-neutral-400 max-w-2xl">
                        Real-world projects posted by industry professionals looking for talented students.
                    </p>
                </div>
                <Link to="/projects">
                  <Button
                      variant="outline"
                      rightIcon={<ArrowRight className="h-4 w-4"/>}
                      className="mt-4 md:mt-0 hover:border-custom-cyan/70 hover:text-custom-cyan"
                  >
                      View All Projects
                  </Button>
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredProjects.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                ))}
            </div>
        </div>
    </section>
  );
};

export default FeaturedProjects;