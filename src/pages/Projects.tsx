import React, { useState, useEffect } from 'react';
import { Search, Filter, Briefcase, Clock, Users, Code, ArrowUpDown, ChevronDown, ChevronUp } from 'lucide-react';
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
    imageUrl: 'https://via.placeholder.com/400x200/007bff/ffffff?text=E-Commerce',
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
    imageUrl: 'https://via.placeholder.com/400x200/28a745/ffffff?text=Dashboard',
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
    imageUrl: 'https://via.placeholder.com/400x200/ffc107/000000?text=AI+Chatbot',
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
    imageUrl: 'https://via.placeholder.com/400x200/dc3545/ffffff?text=Social+Media',
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
    imageUrl: 'https://via.placeholder.com/400x200/6f42c1/ffffff?text=Blockchain',
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
    imageUrl: 'https://via.placeholder.com/400x200/20c997/ffffff?text=Mobile+Game',
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
  const [filtersOpen, setFiltersOpen] = useState(true); // State for filter sidebar visibility
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
      <div className="min-h-screen bg-black py-12">
        <div className="container mx-auto px-4">
          <div className="mb-10 text-center">
            <h1 className="text-5xl font-extrabold text-white mb-4 leading-tight">Discover Impactful <span className="text-custom-cyan">Projects</span></h1>
            <p className="text-xl text-neutral-300 max-w-2xl mx-auto">
              Find real-world projects to work on, gain valuable experience, and collaborate with innovative startups.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Toggle button for filters (mobile/tablet only) */}
            <button
              className="flex items-center justify-center gap-2 p-3 mb-4 lg:hidden bg-neutral-800 rounded-lg text-custom-cyan font-semibold focus:outline-none focus:ring-2 focus:ring-custom-cyan/50 transition-all duration-200"
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
              <Card className="h-fit bg-neutral-900 border border-neutral-800 shadow-lg">
                <div className="space-y-8">
                  <div>
                    <h3 className="text-xl font-bold mb-5 flex items-center text-white">
                      <Filter className="h-6 w-6 mr-3 text-custom-cyan" />
                      Project Filters
                    </h3>
                    <Input 
                      placeholder="Search projects..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      leftIcon={<Search className="h-5 w-5 text-neutral-400" />}
                      className="bg-neutral-800 border-neutral-700 text-white placeholder-neutral-500 focus:border-custom-cyan focus:ring-custom-cyan/30"
                    />
                  </div>
                  {/* Sort Options */}
                  <div className="pt-4 border-t border-neutral-800">
                    <h4 className="font-semibold mb-4 flex items-center text-white">
                      <ArrowUpDown className="h-5 w-5 mr-3 text-custom-cyan" />
                      Sort By
                    </h4>
                    <div className="space-y-3">
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
                    <h4 className="font-semibold mb-4 flex items-center text-white">
                      <Code className="h-5 w-5 mr-3 text-custom-cyan" />
                      Skills
                    </h4>
                    <div className="space-y-3 max-h-48 overflow-y-auto custom-scrollbar pr-2">
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
                    <h4 className="font-semibold mb-4 flex items-center text-white">
                      <Briefcase className="h-5 w-5 mr-3 text-custom-cyan"/>
                      Difficulty
                    </h4>
                    <div className="space-y-3">
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
                    <h4 className="font-semibold mb-4 flex items-center text-white">
                      <Clock className="h-5 w-5 mr-3 text-custom-cyan" />
                      Duration
                    </h4>
                    <div className="space-y-3">
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
                    className="w-full border-custom-cyan text-custom-cyan hover:bg-custom-cyan hover:text-black transition-colors duration-200 py-2.5"
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
            <div className="lg:col-span-3">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
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
                <div className="flex justify-center items-center py-20">
                  <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-custom-cyan"></div>
                </div>
              ) : (
                <>
                  {filteredProjects.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredProjects.map((project) => (
                        <ProjectCard key={project.id} project={project} />
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-neutral-400">
                      <img src="/path/to/no-projects-found.svg" alt="No projects found" className="w-32 h-32 mb-6 opacity-70" /> {/* Placeholder for an SVG icon */}
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
