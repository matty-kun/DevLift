import React, { useState } from 'react';
import { Search, Filter, Briefcase, Clock, Users, Code  } from 'lucide-react';
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
      <div className="min-h-screen black py-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-neutral-50 mb-4">Browse Projects</h1>
            <p className="text-xl text-neutral-50">
              Find real-world projects to work on and gain valuable experience.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Filters Sidebar */}
            <Card className="lg:col-span-1 h-fit">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mg-4 flex items-center">
                    <Filter className="h-5 w-5 mr-2" />
                    Filters
                  </h3>
                  <Input 
                    placeholder="Search projects..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    leftIcon={<Search className="h-5 w-5" />}
                  />
                </div>

                {/* Skills Filter */}
                <div>
                  <h4 className="font-medium mb-2 flex items-center">
                    <Code className="h-4 w-4 mr-2" />
                      Skills
                  </h4>
                  <div className="space-y-2">
                    {skills.map((skill) => (
                      <label key={skill} className="flex items-center">
                        <input type="checkbox" className="form-checkbox rounded text-primary-600 focus:ring-primary-500" checked={selectedSkills.includes(skill)} onChange={((e) => {
                          if (e.target.checked) {
                            setSelectedSkills([...selectedSkills, skill]);
                          } else {
                            setSelectedSkills(selectedSkills.filter(s => s !== skill));
                          }
                        })} 
                        />
                        <span className="ml-2 text-neutral-50">{skill}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Difficulty Filter */}
                <div>
                  <h4 className="font-medium mb-2 flex items-center">
                    <Briefcase className="h-4 w-4 mr-2"/>
                    Difficulty
                  </h4>
                  <div className="space-y-2">
                    {difficulties.map((difficulty) => (
                      <label key={difficulty} className="flex items-center">
                        <input 
                          type="checkbox"
                          className="form-checkbox rounded text-primary-600 focus:ring-primary-500"
                          checked={selectedDifficulty.includes(difficulty)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedDifficulty([...selectedDifficulty, difficulty]);
                            } else {
                              setSelectedDifficulty(selectedDifficulty.filter(d => d !== difficulty));
                            }
                          }}
                        />
                        <span className="ml-2 text-neutral-50 capitalize">{difficulty}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Duration Filter */}
                <div>
                  <h4 className="font-medium mb-2 flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    Duration
                  </h4>
                  <div className="space-y-2">
                    {durations.map((duration) => (
                      <label key={duration} className="flex items-center">
                        <input 
                          type="checkbox" 
                          className="form-checkbox rounded text-primary-600 focus:ring-primary-500"
                          checked={selectedDuration.includes(duration)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedDuration([...selectedDuration, duration]);
                            } else {
                              setSelectedDuration(selectedDuration.filter(d => d !== duration));
                            }
                          }}
                      />
                      <span className="ml-2 text-neutral-50">{duration}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <Button 
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setSelectedSkills([]);
                    setSelectedDifficulty([]);
                    setSelectedDuration([]);
                    setSearchQuery('');
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            </Card>
            
            {/* Projects Grid */}
            <div className="lg:col-span-3">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <Users className="h-5 w-5 text-neutral-600 mr-2" />
                  <span className="text-neutral-600">
                    {filteredProjects.length} {filteredProjects.length === 1 ? 'Project' : 'Projects'} Available
                  </span>
                </div>
                <div className="flex gap-2">
                  {selectedSkills.length > 0 && (
                    <Badge variant="primary">
                      {selectedSkills.length} {selectedSkills.length === 1 ? 'Skill' : 'Skills'}
                    </Badge>
                  )}
                  {selectedDifficulty.length > 0 && (
                    <Badge variant="warning">
                      {selectedDifficulty.length} {selectedDifficulty.length === 1 ? 'Difficulty' : 'Difficulties'}
                    </Badge>
                  )}
                  {selectedDuration.length > 0 && (
                    <Badge variant="success">
                      {selectedDuration.length} {selectedDuration.length === 1 ? 'Duration' : 'Durations'}
                    </Badge>
                  )}
                </div>
              </div>

              {filteredProjects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredProjects.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                  ))}
                </div>
              ) : (
                <Card className="text-center py-12">
                  <h3 className="text-xl font-semibold text-neutral-900 mb-2">No Projects Found</h3>
                  <p className="text-neutral-600">
                    Try adjusting your filter or search criteria to find more projects.
                  </p>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    );
};

export default Projects;
