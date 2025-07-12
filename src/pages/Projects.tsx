import React, { useState, useEffect } from 'react';
import { Search, Filter, Briefcase, Clock, Users, Code, ArrowUpDown, ChevronDown, ChevronUp } from 'lucide-react';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import ProjectCard from '../components/projects/ProjectCard';
import { Project } from '../types';

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

  // Fetch projects from Supabase
  useEffect(() => {
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

  // Filter projects based on search and filters
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

  // Get unique skills from all projects
  const skills = Array.from(new Set(projects.flatMap(project => project.skills)));
  const difficulties = ['beginner', 'intermediate', 'advanced'];
  const durations = ['4-6 weeks', '6-8 weeks', '8-12 weeks', '12+ weeks'];

  // Handle load more
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
            background-color: #000000;  /* black */
          }
        `}
      </style>
      <div className="min-w-screen bg-black py-12">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-neutral-50 mb-4">Browse Projects</h1>
            <p className="text-xl text-neutral-50">
              Find real-world projects to work on and gain valuable experience.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Toggle button for filters (mobile/tablet only) */}
            <button
              className="flex items-center gap-2 mb-4 lg:hidden text-custom-cyan font-semibold focus:outline-none"
              onClick={() => setFiltersOpen((open) => !open)}
              aria-expanded={filtersOpen}
              aria-controls="filters-panel"
            >
              <Filter className="h-5 w-5" />
              Filters
              {filtersOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
            </button>
            {/* Collapsible filter sidebar */}
            <div
              id="filters-panel"
              className={`lg:col-span-1 h-fit transition-all duration-300 overflow-hidden ${filtersOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0 pointer-events-none'} lg:max-h-full lg:opacity-100 lg:pointer-events-auto`}
            >
              <Card className="h-fit">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center">
                      <Filter className="h-5 w-5 mr-2 text-custom-cyan" />
                      Filters
                    </h3>
                    <Input 
                      placeholder="Search projects..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      leftIcon={<Search className="h-5 w-5 text-custom-cyan" />}
                    />
                  </div>

                  {/* Sort Options */}
                  <div>
                    <h4 className="font-medium mb-2 flex items-center">
                      <ArrowUpDown className="h-4 w-4 mr-2 text-custom-cyan" />
                      Sort By
                    </h4>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input 
                          type="radio" 
                          name="sort" 
                          value="newest"
                          checked={sortBy === 'newest'}
                          onChange={() => setSortBy('newest')}
                          className="form-radio text-custom-cyan focus:ring-custom-cyan"
                        />
                        <span className="ml-2 text-neutral-50">Newest First</span>
                      </label>
                      <label className="flex items-center">
                        <input 
                          type="radio" 
                          name="sort" 
                          value="oldest"
                          checked={sortBy === 'oldest'}
                          onChange={() => setSortBy('oldest')}
                          className="form-radio text-custom-cyan focus:ring-custom-cyan"
                        />
                        <span className="ml-2 text-neutral-50">Oldest First</span>
                      </label>
                    </div>
                  </div>

                  {/* Skills Filter */}
                  <div>
                    <h4 className="font-medium mb-2 flex items-center">
                      <Code className="h-4 w-4 mr-2 text-custom-cyan" />
                      Skills
                    </h4>
                    <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar">
                      {skills.map((skill) => (
                        <label key={skill} className="flex items-center">
                          <input 
                            type="checkbox" 
                            className="form-checkbox rounded text-custom-cyan focus:ring-custom-cyan" 
                            checked={selectedSkills.includes(skill)} 
                            onChange={((e) => {
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
                      <Briefcase className="h-4 w-4 mr-2 text-custom-cyan"/>
                      Difficulty
                    </h4>
                    <div className="space-y-2">
                      {difficulties.map((difficulty) => (
                        <label key={difficulty} className="flex items-center">
                          <input 
                            type="checkbox"
                            className="form-checkbox rounded text-custom-cyan focus:ring-custom-cyan"
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
                      <Clock className="h-4 w-4 mr-2 text-custom-cyan" />
                      Duration
                    </h4>
                    <div className="space-y-2">
                      {durations.map((duration) => (
                        <label key={duration} className="flex items-center">
                          <input 
                            type="checkbox" 
                            className="form-checkbox rounded text-custom-cyan focus:ring-custom-cyan"
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
                    className="w-full border-custom-cyan text-custom-cyan hover:bg-custom-cyan hover:text-white transition-colors duration-200"
                    onClick={() => {
                      setSelectedSkills([]);
                      setSelectedDifficulty([]);
                      setSelectedDuration([]);
                      setSearchQuery('');
                      setSortBy('newest');
                    }}
                  >
                    Clear Filters
                  </Button>
                </div>
              </Card>
            </div>
            
            <div className="lg:col-span-3">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <Users className="h-5 w-5 text-custom-cyan mr-2" />
                  <span className="text-neutral-50">
                    {filteredProjects.length} {filteredProjects.length === 1 ? 'Project' : 'Projects'} Available
                  </span>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-error-100 text-error-800 p-4 rounded-lg mb-6">
                  {error}
                </div>
              )}

              {/* Loading State for Initial Load */}
              {loading && page === 1 && (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-custom-cyan"></div>
                </div>
              )}

              {/* Projects Grid */}
              {!loading || page > 1 ? (
                <>
                  {filteredProjects.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredProjects.map((project) => (
                        <ProjectCard key={project.id} project={project} />
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12">
                      <p className="text-xl text-neutral-50 mb-4">No projects match your filters</p>
                      <Button 
                        variant="primary"
                        onClick={() => {
                          setSelectedSkills([]);
                          setSelectedDifficulty([]);
                          setSelectedDuration([]);
                          setSearchQuery('');
                        }}
                      >
                        Clear All Filters
                      </Button>
                    </div>
                  )}

                  {/* Load More Button */}
                  {hasMore && filteredProjects.length > 0 && (
                    <div className="flex justify-center mt-8">
                      <Button 
                        variant="outline"
                        className="border-custom-purple text-custom-purple hover:bg-custom-purple hover:text-white transition-colors duration-200"
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
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Projects;
