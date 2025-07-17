import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Button from '../common/Button';
import ProjectCard from '../projects/ProjectCard';
import devliftLogo from '../../assets/DevLift Logo.svg';
import { motion } from 'framer-motion';

const textVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.2, // Stagger delay for each card
      duration: 0.6,
    },
  }),
};

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
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.5 }}
                >
                    <motion.h2
                      className="text-3xl md:text-4xl font-bold text-neutral-50"
                      variants={textVariants}
                    >Sample Featured Projects</motion.h2>
                    <motion.p
                      className="mt-3 text-xl text-neutral-400 max-w-2xl"
                      variants={textVariants}
                      transition={{ delay: 0.2 }}
                    >
                      Here’s a preview of the project layout.
                    </motion.p>
                </motion.div>
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ delay: 0.4 }}
                >
                  <Link to="/projects">
                    <Button
                        variant="outline"
                        rightIcon={<ArrowRight className="h-4 w-4"/>}
                        className="mt-4 md:mt-0 hover:border-custom-cyan/70 hover:text-custom-cyan"
                    >
                        View All Projects
                    </Button>
                  </Link>
                </motion.div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredProjects.map((project, index) => (
                    <motion.div
                      key={project.id}
                      variants={cardVariants}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, amount: 0.5 }}
                      custom={index}
                    >
                      <ProjectCard project={project} />
                    </motion.div>
                ))}
            </div>
        </div>
    </section>
  );
};

export default FeaturedProjects;