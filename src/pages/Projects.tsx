import React, { useState, useEffect } from 'react';
import { Search, Filter, Briefcase, Clock, Users, Code, ArrowUpDown, Zap, X } from 'lucide-react';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import ProjectCard from '../components/projects/ProjectCard';
import { supabase } from '../lib/supabase';
import { Project } from '../types';

// Helper to map DB status to UI status
const mapStatus = (s: string | null): Project['status'] => {
  if (!s) return 'open';
  if (s === 'in_progress') return 'in-progress';
  if (s === 'completed') return 'completed';
  return 'open';
};

const defaultImage = (title: string) =>
  `https://source.unsplash.com/800x600/?technology,${encodeURIComponent(title)}`;

type ProjectRow = {
  id: string;
  title: string;
  description: string;
  mentor_id: string;
  status: 'open' | 'in_progress' | 'completed' | null;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration_weeks: number | null;
  max_students: number | null;
  header_image_url?: string | null;
  created_at: string;
};

type ProjectSkillRow = {
  project_id: string;
  skills: { name: string } | null;
};

type ApplicationRow = {
  project_id: string;
  student_id: string | null;
  status: 'pending' | 'accepted' | 'rejected';
};

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
        const start = (page - 1) * projectsPerPage;
        const end = start + projectsPerPage - 1;

        let query = supabase
          .from('projects')
          .select(
            'id, title, description, mentor_id, status, difficulty, duration_weeks, max_students, header_image_url, created_at',
            { count: 'exact' }
          );

        query = query.order('created_at', { ascending: sortBy !== 'newest' });
        query = query.range(start, end);

  type QueryResult = { data: ProjectRow[] | null; error: { message?: string } | null; count: number | null };
  const { data, error, count } = await query as unknown as QueryResult;
        if (error) throw error;
  const rows: ProjectRow[] = data ?? [];
        const ids = rows.map(r => r.id);

        // Fetch skills per project
        const skillsMap = new Map<string, string[]>();
        if (ids.length) {
          const { data: ps } = await supabase
            .from('project_skills')
            .select('project_id, skills(name)')
            .in('project_id', ids);
          (ps as ProjectSkillRow[] | null)?.forEach((row) => {
            const name = row.skills?.name;
            if (!name) return;
            const list = skillsMap.get(row.project_id) ?? [];
            list.push(name);
            skillsMap.set(row.project_id, list);
          });
        }

        // Fetch application counts (total and accepted)
        const acceptedMap = new Map<string, string[]>();
        const applicantsMap = new Map<string, string[]>();
        if (ids.length) {
          const { data: apps } = await supabase
            .from('applications')
            .select('project_id, student_id, status')
            .in('project_id', ids);
          (apps as ApplicationRow[] | null)?.forEach((a) => {
            const pid = a.project_id;
            const sid = a.student_id;
            const applicants = applicantsMap.get(pid) ?? [];
            applicants.push(sid ?? '');
            applicantsMap.set(pid, applicants);
            if (a.status === 'accepted') {
              const acc = acceptedMap.get(pid) ?? [];
              acc.push(sid ?? '');
              acceptedMap.set(pid, acc);
            }
          });
        }

        const mapped: Project[] = rows.map((r) => ({
          id: r.id,
          title: r.title,
          description: r.description,
          mentorId: r.mentor_id,
          skills: skillsMap.get(r.id) ?? [],
          duration: `${r.duration_weeks ?? 0} weeks`,
          status: mapStatus(r.status),
          difficulty: r.difficulty,
          maxStudents: r.max_students ?? 0,
          assignedStudents: acceptedMap.get(r.id) ?? [],
          applicants: applicantsMap.get(r.id) ?? [],
          createdAt: new Date(r.created_at),
          imageUrl: r.header_image_url ?? defaultImage(r.title),
        }));

        setProjects(prev => page === 1 ? mapped : [...prev, ...mapped]);
        const total = count ?? 0;
        setHasMore(end + 1 < total);
        setLoading(false);
      } catch (e) {
        console.error(e);
        setError('Failed to fetch projects.');
        setLoading(false);
      }
    };
    fetchProjects();
  }, [page, sortBy]);

  const filteredProjects = projects.filter(project => {
    const matchesSearch = !searchQuery || 
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      project.description.toLowerCase().includes(searchQuery.toLowerCase()) || 
      project.skills.some((skill: string) => skill.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesSkills = selectedSkills.length === 0 || 
      selectedSkills.some(skill => project.skills.includes(skill));

    const matchesDifficulty = selectedDifficulty.length === 0 || 
      selectedDifficulty.includes(project.difficulty);

    const weeks = parseInt(project.duration, 10) || 0;
    const matchesDuration = selectedDuration.length === 0 || selectedDuration.some((range) => {
      if (range.includes('12+')) return weeks >= 12;
      const m = range.match(/(\d+)-(\d+)/);
      if (!m) return true;
      const min = parseInt(m[1], 10);
      const max = parseInt(m[2], 10);
      return weeks >= min && weeks <= max;
    });

    return matchesSearch && matchesSkills && matchesDifficulty && matchesDuration;
  });

  const skills = Array.from(new Set(projects.flatMap(project => project.skills)));
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
