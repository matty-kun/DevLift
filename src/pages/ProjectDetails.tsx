import React from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import  { Project } from "../types";
import Badge from '../components/common/Badge';
import Avatar from '../components/common/Avatar';
import Button from '../components/common/Button';
import Card from '../components/common/Card';

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
];


const getStatusVariant = (status: Project['status']) => {
    switch(status) {
        case 'open':
            return 'success';
        case 'in-progress':
            return 'warning';
        case 'completed':
            return 'neutral';
        default:
            return 'neutral'
    }
};

const getDifficultyVariant = (difficulty: Project['difficulty']) => {
    switch(difficulty){
      case 'beginner':
        return 'success';
      case 'intermediate':
        return 'warning';
      case 'advanced':
        return 'error';
      default:
        return 'neutral';
    }
};

const ProjectDetails: React.FC = () => {
    const { id } = useParams<{id: string}>();
    const project = projects.find((p) => p.id === id);

    if (!project) {
        return <div className="text-center mt-10">Project not found.</div>
    }

    return (
        <div className="container mx-auto py-16 px-2 max-w-4xl">
          <Card variant="hover" className="p-10 md:p-16 shadow-2xl">
            <div className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <h1 className="text-4xl md:text-5xl font-extrabold text-neutral-900">{project.title}</h1>
              <div className="flex gap-3">
                  <Badge variant={getStatusVariant(project.status)} size="lg">
                    {project.status === 'open'
                    ? 'Open to Apply'
                    : project.status === 'in-progress'
                    ? 'In-Progress'
                    : ' Completed'}
                  </Badge>
                  <Badge variant={getDifficultyVariant(project.difficulty)} size="lg">
                    {project.difficulty.charAt(0).toUpperCase() + project.difficulty.slice(1)}
                  </Badge>
              </div>
            </div>

            <p className="mb-8 text-neutral-700 text-2xl">{project.description}</p>
            
            <div className="flex items-center mb-10">
              <Avatar 
                size="lg"
                src="https://scontent.fmnl13-4.fna.fbcdn.net/v/t39.30808-6/491735833_122150289098510211_1844929196717859260_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeHBQz1kRr3s63fGFIp-OrAs_LDTfT_5S-r8sNN9P_lL6r7rbR6FiLS8WPAFgX1IIfpF2lEx0h-afdlRDOvmU2GH&_nc_ohc=33lezZmZ4KwQ7kNvwGntsa6&_nc_oc=Adn-I6baQtJxg2_O58hdaOvtC7Hu69of-Xy6D0xjI2Y8QRN6d67fQDssUoSnjjimKaY&_nc_pt=1&_nc_zt=23&_nc_ht=scontent.fmnl13-4.fna&_nc_gid=Hmpms_vrDYfoxefPYFYEMA&oh=00_AfIF-Jym0-3CMxGLXsNHm2HLZFjX5cLjCctyaW3BEKh_aw&oe=68333D95"
                alt="Mentor Name"
              />

              <div className="ml-4">
                <div className="text-lg font-semibold text-neutral-900">Mentor Name</div>
                <div className="text-base text-neutral-500">Senior Developer</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-10 text-lg">
              <div>
                <span className="font-semibold text-neutral-800">Duration: </span> {project.duration}
              </div>
              <div>
                <span className="font-semibold text-neutral-800">Max Students:</span> {project.maxStudents}
              </div>
              <div>
                <span className="font-semibold text-neutral-800">Assigned:</span> {project.assignedStudents.length}
              </div>
              <div>
                <span className="font-semibold text-neutral-800">Applicants:</span> {project.applicants.length}
              </div>
            </div>

            <div className="mb-10">
              <span className="font-semibold text-neutral-800 text-lg">Skills:</span>
              <div className="flex flex-wrap gap-3 mt-3">
                {project.skills.map((skills, idx) => (
                  <Badge key={idx} variant="primary" size="lg">
                    {skills}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex justify-between">
              <Link to="/projects">
                <Button variant="outline" size="lg">Back to Projects</Button>
              </Link>
              <Button variant="primary" size="lg">Apply to Project</Button>
            </div>
          </Card>
        </div>
    );
};

export default ProjectDetails;