import React, { useState, useEffect } from 'react';
import { Search, Filter, Briefcase, Clock, Users, Code, ArrowUpDown, ChevronDown, ChevronUp, Zap, X } from 'lucide-react';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import ProjectCard from '../components/projects/ProjectCard';
import { Project } from '../types';

// Sample project data (will be replaced with Supabase data)
const sampleProjects: Project[] = [
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
    imageUrl: 'https://images.unsplash.com/photo-1557821552-17105176677c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
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
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
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
    imageUrl: 'https://images.unsplash.com/photo-1555952494-efd681c5e36f?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
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
    imageUrl: 'https://images.unsplash.com/photo-1611162617213-6d22e525b39e?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
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
    imageUrl: 'https://images.unsplash.com/photo-1639322537228-f710d846310a?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
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
    imageUrl: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
];

const Projects: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string[]>([]);
  const [selectedDuration, setSelectedDuration] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>('newest');
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(true);
  const projectsPerPage = 6;

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        setError(null);
        await new Promise(resolve => setTimeout(resolve, 500));
        const start = (page - 1) * projectsPerPage;
        const end = start + projectsPerPage;
        const paginatedProjects = sampleProjects.slice(start, end);
        if (sortBy === 'newest') {
          paginatedProjects.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        } else if (sortBy === 'oldest') {
          paginatedProjects.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
        }
        setProjects(prev => page === 1 ? paginatedProjects : [...prev, ...paginatedProjects]);
        setHasMore(end < sampleProjects.length);
        setLoading(false);
      } catch {
        setError('Failed to fetch projects.');
        setLoading(true);
      }
    };
    fetchProjects();
  }, [page, sortBy]);

  const filteredProjects = projects.filter(project => {
    const matchesSearch = !searchQuery || 
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      project.description.toLowerCase().includes(searchQuery.toLowerCase()) || 
      project.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesSkills = selectedSkills.length === 0 || 
      selectedSkills.some(skill => project.skills.includes(skill));

    const matchesDifficulty = selectedDifficulty.length === 0 || 
      selectedDifficulty.includes(project.difficulty);

    const matchesDuration = selectedDuration.length === 0 || 
      selectedDuration.some(duration => project.duration.includes(duration));

    return matchesSearch && matchesSkills && matchesDifficulty && matchesDuration;
  });

  const skills = Array.from(new Set(sampleProjects.flatMap(project => project.skills)));
  const difficulties = ['beginner', 'intermediate', 'advanced'];
  const durations = ['4-6 weeks', '6-8 weeks', '8-12 weeks', '12+ weeks'];

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      setPage(prev => prev + 1);
    }
  };

  return (
    <>
      <style>
        {`
          .custom-scrollbar::-webkit-scrollbar {
            width: 8px;
            height: 8px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background-color: #19c3f7;  /* custom-cyan */
            border-radius: 4px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background-color: #0F172A;  /* neutral-900 */
          }
        `}
      </style>
      <div className="min-h-screen bg-black text-white py-12">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-custom-cyan to-custom-orange mb-4">
                Explore Real-World Projects
            </h1>
            <p className="text-xl text-neutral-300 max-w-3xl mx-auto">
              Dive into hands-on projects, collaborate with peers, and build a portfolio that stands out.
            </p>
          </div>

          <div className={`grid gap-8 transition-all duration-300 ${filtersOpen ? 'lg:grid-cols-4' : 'lg:grid-cols-1'}`}>
            <div
              id="filters-panel"
              className={`transition-all duration-300 ${filtersOpen ? 'lg:col-span-1' : 'w-0 h-0 overflow-hidden'}`}>
              <Card className="h-fit bg-neutral-900 border border-neutral-800 shadow-lg p-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold flex items-center text-white">
                      <Filter className="h-6 w-6 mr-3 text-custom-cyan" />
                      Filters
                    </h3>
                    <Button variant="ghost" size="md" onClick={() => setFiltersOpen(false)}>
                        <X className="h-5 w-5" />
                    </Button>
                </div>
                <div className="space-y-6">
                  <Input 
                    placeholder="Search projects..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    leftIcon={<Search className="h-5 w-5 text-neutral-400" />}
                    className="bg-neutral-800 border-neutral-700 text-white placeholder-neutral-500 focus:border-custom-cyan focus:ring-custom-cyan/30"
                  />
                  {/* Sort Options */}
                  <div className="pt-4 border-t border-neutral-800">
                    <h4 className="font-semibold mb-3 flex items-center text-white">
                      <ArrowUpDown className="h-5 w-5 mr-3 text-custom-cyan" />
                      Sort By
                    </h4>
                    <div className="space-y-2">
                      <label className="flex items-center cursor-pointer group">
                        <input 
                          type="radio" 
                          name="sort" 
                          value="newest"
                          checked={sortBy === 'newest'}
                          onChange={() => setSortBy('newest')}
                          className="form-radio h-4 w-4 text-custom-cyan border-neutral-600 bg-neutral-700 focus:ring-custom-cyan transition-colors duration-200"
                        />
                        <span className="ml-3 text-neutral-300 group-hover:text-white transition-colors duration-200">Newest First</span>
                      </label>
                      <label className="flex items-center cursor-pointer group">
                        <input 
                          type="radio" 
                          name="sort" 
                          value="oldest"
                          checked={sortBy === 'oldest'}
                          onChange={() => setSortBy('oldest')}
                          className="form-radio h-4 w-4 text-custom-cyan border-neutral-600 bg-neutral-700 focus:ring-custom-cyan transition-colors duration-200"
                        />
                        <span className="ml-3 text-neutral-300 group-hover:text-white transition-colors duration-200">Oldest First</span>
                      </label>
                    </div>
                  </div>
                  {/* Skills Filter */}
                  <div className="pt-4 border-t border-neutral-800">
                    <h4 className="font-semibold mb-3 flex items-center text-white">
                      <Code className="h-5 w-5 mr-3 text-custom-cyan" />
                      Skills
                    </h4>
                    <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar pr-2">
                      {skills.map((skill) => (
                        <label key={skill} className="flex items-center cursor-pointer group">
                          <input 
                            type="checkbox" 
                            className="form-checkbox h-4 w-4 rounded text-custom-cyan border-neutral-600 bg-neutral-700 focus:ring-custom-cyan transition-colors duration-200" 
                            checked={selectedSkills.includes(skill)} 
                            onChange={((e) => {
                              if (e.target.checked) {
                                setSelectedSkills([...selectedSkills, skill]);
                              } else {
                                setSelectedSkills(selectedSkills.filter(s => s !== skill));
                              }
                            })} 
                          />
                          <span className="ml-3 text-neutral-300 group-hover:text-white transition-colors duration-200">{skill}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  {/* Difficulty Filter */}
                  <div className="pt-4 border-t border-neutral-800">
                    <h4 className="font-semibold mb-3 flex items-center text-white">
                      <Briefcase className="h-5 w-5 mr-3 text-custom-cyan"/>
                      Difficulty
                    </h4>
                    <div className="space-y-2">
                      {difficulties.map((difficulty) => (
                        <label key={difficulty} className="flex items-center cursor-pointer group">
                          <input 
                            type="checkbox"
                            className="form-checkbox h-4 w-4 rounded text-custom-cyan border-neutral-600 bg-neutral-700 focus:ring-custom-cyan transition-colors duration-200"
                            checked={selectedDifficulty.includes(difficulty)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedDifficulty([...selectedDifficulty, difficulty]);
                              } else {
                                setSelectedDifficulty(selectedDifficulty.filter(d => d !== difficulty));
                              }
                            }}
                          />
                          <span className="ml-3 text-neutral-300 group-hover:text-white transition-colors duration-200 capitalize">{difficulty}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  {/* Duration Filter */}
                  <div className="pt-4 border-t border-neutral-800">
                    <h4 className="font-semibold mb-3 flex items-center text-white">
                      <Clock className="h-5 w-5 mr-3 text-custom-cyan" />
                      Duration
                    </h4>
                    <div className="space-y-2">
                      {durations.map((duration) => (
                        <label key={duration} className="flex items-center cursor-pointer group">
                          <input 
                            type="checkbox" 
                            className="form-checkbox h-4 w-4 rounded text-custom-cyan border-neutral-600 bg-neutral-700 focus:ring-custom-cyan transition-colors duration-200"
                            checked={selectedDuration.includes(duration)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedDuration([...selectedDuration, duration]);
                              } else {
                                setSelectedDuration(selectedDuration.filter(d => d !== duration));
                              }
                            }}
                          />
                          <span className="ml-3 text-neutral-300 group-hover:text-white transition-colors duration-200">{duration}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <Button 
                    variant="outline"
                    className="w-full border-custom-orange text-custom-orange hover:bg-custom-orange hover:text-white transition-colors duration-200 py-2.5 mt-4"
                    onClick={() => {
                      setSelectedSkills([]);
                      setSelectedDifficulty([]);
                      setSelectedDuration([]);
                      setSearchQuery('');
                      setSortBy('newest');
                    }}
                  >
                    Clear All Filters
                  </Button>
                </div>
              </Card>
            </div>
            <div className={`${filtersOpen ? 'lg:col-span-3' : 'lg:col-span-4'}`}>
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                        {!filtersOpen && (
                            <Button variant="ghost" size="md" onClick={() => setFiltersOpen(true)} className="mr-4">
                                <Filter className="h-5 w-5" />
                            </Button>
                        )}
                        <Users className="h-6 w-6 text-custom-cyan mr-2" />
                        <span className="text-xl font-semibold text-white">
                            {filteredProjects.length} {filteredProjects.length === 1 ? 'Project' : 'Projects'} Available
                        </span>
                    </div>
                </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-900/20 text-red-400 p-4 rounded-lg mb-6 border border-red-700">
                  {error}
                </div>
              )}

              {/* Loading State for Initial Load */}
              {loading && page === 1 ? (
                <div className={`grid grid-cols-1 md:grid-cols-2 ${filtersOpen ? 'lg:grid-cols-2 xl:grid-cols-3' : 'lg:grid-cols-3'} gap-8`}>
                    {[...Array(6)].map((_, i) => (
                        <Card key={i} className="bg-neutral-900 p-5 rounded-xl animate-pulse">
                            <div className="h-40 bg-neutral-800 rounded-lg mb-4"></div>
                            <div className="h-6 w-3/4 bg-neutral-800 rounded mb-3"></div>
                            <div className="h-4 w-full bg-neutral-800 rounded mb-1"></div>
                            <div className="h-4 w-5/6 bg-neutral-800 rounded mb-4"></div>
                            <div className="flex gap-2 mb-4">
                                <div className="h-6 w-20 bg-neutral-800 rounded-full"></div>
                                <div className="h-6 w-24 bg-neutral-800 rounded-full"></div>
                            </div>
                            <div className="flex justify-between items-center mt-4 pt-4 border-t border-neutral-800">
                                <div className="flex items-center">
                                    <div className="h-10 w-10 bg-neutral-800 rounded-full"></div>
                                    <div className="ml-3">
                                        <div className="h-4 w-24 bg-neutral-800 rounded"></div>
                                        <div className="h-3 w-16 bg-neutral-800 rounded mt-1"></div>
                                    </div>
                                </div>
                                <div className="h-9 w-28 bg-neutral-800 rounded-lg"></div>
                            </div>
                        </Card>
                    ))}
                </div>
              ) : (
                <>
                  {filteredProjects.length > 0 ? (
                    <div className={`grid grid-cols-1 md:grid-cols-2 ${filtersOpen ? 'lg:grid-cols-2 xl:grid-cols-3' : 'lg:grid-cols-3'} gap-8`}>
                      {filteredProjects.map((project) => (
                        <ProjectCard key={project.id} project={project} />
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-neutral-400">
                      <Zap className="w-20 h-20 mb-6 opacity-50 text-custom-orange" />
                      <p className="text-2xl font-semibold mb-3">No Projects Found</p>
                      <p className="text-lg mb-6 text-center max-w-md">Try adjusting your filters or search query. We're always adding new opportunities!</p>
                      <Button 
                        variant="primary"
                        onClick={() => {
                          setSelectedSkills([]);
                          setSelectedDifficulty([]);
                          setSelectedDuration([]);
                          setSearchQuery('');
                        }}
                        className="py-2.5 px-6"
                      >
                        Clear All Filters
                      </Button>
                    </div>
                  )}

                  {/* Load More Button */}
                  {hasMore && filteredProjects.length > 0 && (
                    <div className="flex justify-center mt-10">
                      <Button 
                        variant="outline"
                        className="border-custom-purple text-custom-purple hover:bg-custom-purple hover:text-white transition-colors duration-200 py-2.5 px-6"
                        onClick={handleLoadMore}
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-current mr-2"></div>
                            Loading...
                          </>
                        ) : (
                          'Load More Projects'
                        )}
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Projects;
