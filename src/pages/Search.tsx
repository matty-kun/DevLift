import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Project, Person, Startup } from '../types';
import ProjectCard from '../components/projects/ProjectCard';
import PersonCard from '../components/common/PersonCard';
import FilterBar from '../components/search/FilterBar';
import StartupCard from '../components/common/StartupCard';

const SearchPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [projects, setProjects] = useState<Project[]>([]);
  const [people, setPeople] = useState<Person[]>([]);
  const [startups, setStartups] = useState<Startup[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('all');
  const [difficulty, setDifficulty] = useState('all');
  const [duration, setDuration] = useState('all');
  const [role, setRole] = useState('all');
  const [industry, setIndustry] = useState('all');

  useEffect(() => {
    const fetchProjects = async () => {
      let queryBuilder = supabase.from('projects').select('*');
      if (query) {
        queryBuilder = queryBuilder.textSearch('title', query, { type: 'websearch' });
      }
      if (difficulty !== 'all') {
        queryBuilder = queryBuilder.eq('difficulty', difficulty);
      }
      // Duration filter is more complex and requires mapping '1-4 weeks' to a range query.
      // This is a simplified example.
      const { data, error } = await queryBuilder;
      if (error) {
        console.error('Error fetching projects:', error);
        return [];
      } 
      return data as Project[];
    }

    const fetchPeople = async () => {
      let queryBuilder = supabase.from('users').select('id, full_name, role, avatar_url');
      if (query) {
        queryBuilder = queryBuilder.textSearch('full_name', query, { type: 'websearch' });
      }
      if (role !== 'all') {
        queryBuilder = queryBuilder.eq('role', role);
      }
      const { data, error } = await queryBuilder;
      if (error) {
        console.error('Error fetching people:', error);
        return [];
      }
      const formattedPeople = data.map((person: { id: string; full_name: string; role: string; avatar_url: string; }) => ({ ...person, name: person.full_name }));
      return formattedPeople as Person[];
    }

    const fetchStartups = async () => {
      let queryBuilder = supabase.from('startups').select('*');
      if (query) {
        queryBuilder = queryBuilder.textSearch('name', query, { type: 'websearch' });
      }
      // Industry filter would be added here if the 'startups' table had an 'industry' column.
      const { data, error } = await queryBuilder;
      if (error) {
        console.error('Error fetching startups:', error);
        return [];
      }
      return data as Startup[];
    }

    const fetchResults = async () => {
      if (!query) {
        setLoading(false);
        return;
      }

      setLoading(true);

      const [projects, people, startups] = await Promise.all([
        (category === 'all' || category === 'projects') ? fetchProjects() : Promise.resolve([]),
        (category === 'all' || category === 'people') ? fetchPeople() : Promise.resolve([]),
        (category === 'all' || category === 'startups') ? fetchStartups() : Promise.resolve([]),
      ]);

      setProjects(projects);
      setPeople(people);
      setStartups(startups);

      setLoading(false);
    };

    fetchResults();
  }, [query, category, difficulty, duration, role, industry]);

  return (
    <div className="min-h-screen bg-black text-white pt-24">
      <FilterBar 
        category={category} 
        setCategory={setCategory}
        difficulty={difficulty}
        setDifficulty={setDifficulty}
        duration={duration}
        setDuration={setDuration}
        role={role}
        setRole={setRole}
        industry={industry}
        setIndustry={setIndustry}
      />
      <div className="container mx-auto px-4 mt-8">
        <h1 className="text-3xl font-bold mb-8">Search Results for "{query}"</h1>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="space-y-12">
            {(category === 'all' || category === 'projects') && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Projects</h2>
                {projects.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {projects.map(project => (
                      <ProjectCard key={project.id} project={project} />
                    ))}
                  </div>
                ) : (
                  <p>No projects found.</p>
                )}
              </div>
            )}

            {(category === 'all' || category === 'people') && (
              <div>
                <h2 className="text-2xl font-bold mb-4">People</h2>
                {people.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {people.map(person => (
                      <PersonCard key={person.id} person={person} />
                    ))}
                  </div>
                ) : (
                  <p>No people found.</p>
                )}
              </div>
            )}

            {(category === 'all' || category === 'startups') && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Startups</h2>
                {startups.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {startups.map(startup => (
                      <StartupCard key={startup.id} startup={startup} />
                    ))}
                  </div>
                ) : (
                  <p>No startups found.</p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
