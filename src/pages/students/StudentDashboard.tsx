import React from 'react';
import { Bell, BookOpen, ClipboardList, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import Footer from '../components/layout/Footer';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import Avatar from '../components/common/Avatar';
import ProjectCard from '../components/projects/ProjectCard';
import { Project } from '../types';

// Mock student data
const studentName = 'Jordan';
const studentAvatar = 'https://randomuser.me/api/portraits/men/32.jpg';
const studentSkills = ['React', 'TypeScript', 'UI/UX', 'Node.js'];
const recentActivity = [
  'You applied to "AI Chatbot Integration"',
  'Project "Data Visualization Dashboard" assigned to you',
  'Feedback received for "E-Commerce Mobile App"',
];

// Mock projects (reuse sampleProjects structure)
const assignedProjects: Project[] = [
  {
    id: '2',
    title: 'Data Visualization Dashboard',
    description: 'Design and develop an interactive dashboard to visualize complex datasets for a healthcare organization using modern web technologies.',
    mentorId: 'mentor2',
    skills: ['React', 'D3.js', 'TypeScript', 'Tailwind CSS'],
    duration: '6 weeks',
    status: 'in-progress',
    difficulty: 'advanced',
    maxStudents: 2,
    assignedStudents: ['student1'],
    applicants: ['student1', 'student2', 'student3'],
    createdAt: new Date(),
  },
];
const applications: Project[] = [
  {
    id: '1',
    title: 'AI Chatbot Integration',
    description: 'Implement a conversational AI chatbot into an existing platform to improve customer service and automate repetitive tasks.',
    mentorId: 'mentor3',
    skills: ['Python', 'NLP', 'Machine Learning', 'API Integration'],
    duration: '10 weeks',
    status: 'open',
    difficulty: 'advanced',
    maxStudents: 4,
    assignedStudents: ['student4', 'student5'],
    applicants: ['student4', 'student5', 'student6', 'student7'],
    createdAt: new Date(),
  },
];

const resources = [
  {
    name: 'freeCodeCamp',
    url: 'https://www.freecodecamp.org/',
    description: 'Interactive coding lessons and projects for web development, data science, and more.',
    color: 'cyan',
  },
  {
    name: 'MDN Web Docs',
    url: 'https://developer.mozilla.org/',
    description: 'Comprehensive documentation and guides for HTML, CSS, JavaScript, and web APIs.',
    color: 'purple',
  },
  {
    name: 'Fireship (YouTube)',
    url: 'https://www.youtube.com/c/Fireship',
    description: 'High-energy, concise programming tutorials and tech overviews.',
    color: 'orange',
  },
];

const StudentDashboard: React.FC = () => {
  return (
    <div className="bg-black min-h-screen flex flex-col">
      <main className="flex-1 px-4 py-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Avatar src={studentAvatar} alt={studentName} size="lg" />
              <div>
                <h1 className="text-2xl font-bold text-custom-cyan">Welcome, {studentName}!</h1>
                <p className="text-neutral-400 text-sm">Here's your student dashboard.</p>
              </div>
            </div>
            <button className="relative bg-neutral-900 p-2 rounded-full hover:bg-neutral-800 transition-colors">
              <Bell className="h-6 w-6 text-custom-orange" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-custom-orange rounded-full"></span>
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <Card className="flex flex-col items-center" variant="hover">
              <ClipboardList className="h-8 w-8 text-custom-cyan mb-2" />
              <div className="text-2xl font-bold text-custom-cyan">{applications.length}</div>
              <div className="text-neutral-400">Applications</div>
            </Card>
            <Card className="flex flex-col items-center" variant="hover">
              <BookOpen className="h-8 w-8 text-custom-orange mb-2" />
              <div className="text-2xl font-bold text-custom-orange">{assignedProjects.length}</div>
              <div className="text-neutral-400">Assigned Projects</div>
            </Card>
            <Card className="flex flex-col items-center" variant="hover">
              <Star className="h-8 w-8 text-custom-purple mb-2" />
              <div className="flex flex-wrap gap-1 justify-center mb-1">
                {studentSkills.map((skill) => (
                  <Badge key={skill} variant="primary" size="sm">{skill}</Badge>
                ))}
              </div>
              <div className="text-neutral-400">Skills</div>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <Link
              to="/projects"
              className="bg-gradient-to-r from-custom-cyan to-custom-purple text-black font-semibold px-6 py-3 rounded shadow hover:scale-105 transition-transform duration-200 text-center"
            >
              Browse Projects
            </Link>
            <Link
              to="/resources"
              className="bg-neutral-900 text-custom-cyan border border-custom-cyan px-6 py-3 rounded hover:bg-custom-cyan hover:text-black transition-colors duration-200 text-center"
            >
              Learning Resources
            </Link>
            <Link
              to="/startups"
              className="bg-neutral-900 text-custom-orange border border-custom-orange px-6 py-3 rounded hover:bg-custom-orange hover:text-black transition-colors duration-200 text-center"
            >
              Find Startups
            </Link>
          </div>

          {/* Recent Activity */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-custom-cyan">Recent Activity</h2>
            <ul className="bg-neutral-900 rounded-lg p-6 text-neutral-300 space-y-2">
              {recentActivity.length === 0 ? (
                <li className="text-neutral-500">No recent activity yet.</li>
              ) : (
                recentActivity.map((activity, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="h-2 w-2 bg-custom-cyan rounded-full inline-block"></span>
                    {activity}
                  </li>
                ))
              )}
            </ul>
          </div>

          {/* My Applications */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-custom-cyan">My Applications</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {applications.length === 0 ? (
                <Card className="text-neutral-400">You haven't applied to any projects yet.</Card>
              ) : (
                applications.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))
              )}
            </div>
          </div>

          {/* Assigned Projects */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-custom-cyan">Assigned Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {assignedProjects.length === 0 ? (
                <Card className="text-neutral-400">No projects assigned yet.</Card>
              ) : (
                assignedProjects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))
              )}
            </div>
          </div>

          {/* Resources */}
          <div>
            <h2 className="text-xl font-semibold mb-4 text-custom-cyan">Resources for Students</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {resources.map((res) => (
                <Card key={res.name} className="h-full text-white border border-custom-cyan hover:shadow-lg hover:-translate-y-2 transition-all duration-200">
                  <a href={res.url} target="_blank" rel="noopener noreferrer" className="block">
                    <h3 className={`text-xl font-bold mb-1 ${res.color === 'cyan' ? 'text-custom-cyan' : res.color === 'purple' ? 'text-custom-purple' : 'text-custom-orange'}`}>{res.name}</h3>
                    <p className="text-neutral-300">{res.description}</p>
                  </a>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default StudentDashboard;