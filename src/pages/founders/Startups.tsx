import React, { useState, useMemo, useEffect } from 'react';
import Card from '../../components/common/Card';
import { Link } from 'react-router-dom';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { supabase } from '../../lib/supabase';
import { Startup } from '../../types';
 
type StartupWithDetails = Startup & {
  industry: string;
  founder: {
    full_name: string;
  } | null;
};

const Startups: React.FC = () => {
  const [startups, setStartups] = useState<StartupWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('All');

  const industries = useMemo(() => ['All', ...new Set(startups.map(s => s.industry).filter(Boolean))], [startups]);

  const filteredStartups = useMemo(() => {
    return startups.filter(startup => {
      const matchesIndustry = selectedIndustry === 'All' || startup.industry?.toLowerCase() === selectedIndustry.toLowerCase();
      const matchesSearch = startup.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            startup.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesIndustry && matchesSearch;
    });
  }, [startups, searchTerm, selectedIndustry]);

  useEffect(() => {
    const fetchStartups = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('startups')
        .select(`
          id,
          name,
          description,
          industry,
          website,
          logo_url,
          founder:founder_id ( full_name )
        `);

      if (error) {
        console.error('Error fetching startups:', error);
      } else if (data) {
        const transformedData = data.map(startup => ({
          ...startup,
          founder: Array.isArray(startup.founder) ? startup.founder[0] : startup.founder,
        }));
        setStartups(transformedData as StartupWithDetails[]);
      }
      setLoading(false);
    };

    fetchStartups();
  }, []);

  return (
    <div className="min-h-screen bg-black text-neutral-50 py-12">
      <div className="container mx-auto px-4">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-custom-purple via-custom-cyan to-custom-orange mb-4">
            Featured Startups
          </h1>
          <p className="text-xl text-neutral-300">Discover innovative startups looking for student collaborators.</p>
        </header>

        <div className="mb-8 flex flex-col md:flex-row gap-4 items-center">
          <Input
            type="text"
            placeholder="Search by name, founder, or keyword..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-1/2 bg-neutral-900 border-neutral-700"
          />
          <div className="relative w-full md:w-auto">
            <select
              value={selectedIndustry}
              onChange={(e) => setSelectedIndustry(e.target.value)}
              className="w-full md:w-auto appearance-none bg-neutral-900 border border-neutral-700 text-neutral-50 py-2 px-4 pr-8 rounded-md focus:outline-none focus:ring-2 focus:ring-custom-cyan"
            >
              {industries.map(industry => (
                <option key={industry} value={industry}>{industry}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-neutral-400">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-16">
            <p className="text-lg text-neutral-400">Loading startups...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredStartups.map((startup) => (
              <Link to={`/startups/${startup.id}`} key={startup.id} className="group block">
                <Card className="h-full bg-neutral-900/50 backdrop-blur-sm border border-neutral-800 rounded-lg overflow-hidden shadow-lg hover:shadow-custom-cyan/20 transition-all duration-300 transform hover:-translate-y-1">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <img src={startup.logo_url} alt={startup.name} className="h-16 w-16 object-contain bg-transparent p-0 m-0 rounded-md" />
                        <div>
                          <h3 className="text-2xl font-bold text-neutral-50 group-hover:text-custom-cyan transition-colors duration-300">{startup.name}</h3>
                          <p className="text-sm text-custom-purple font-medium">{startup.industry || 'N/A'}</p>
                        </div>
                      </div>
                    </div>
                    <p className="text-neutral-300 mb-4 h-20 overflow-hidden line-clamp-3">{startup.description}</p>
                    <div className="mb-4">
                      <span className="text-neutral-400 font-medium">Founder:</span> <span className="text-neutral-100">{startup.founder?.full_name || 'N/A'}</span>
                    </div>
                    {/* Skills can be added here if joined from projects */}
                    <div className="flex justify-end items-center mt-4">
                      <Button variant='outline' size='sm' className="border-custom-cyan text-custom-cyan group-hover:bg-custom-cyan group-hover:text-black transition-colors duration-300">
                          View Details
                      </Button>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
        {filteredStartups.length === 0 && (
            <div className="text-center py-16">
                <h2 className="text-2xl font-semibold text-neutral-400">No startups found.</h2>
                <p className="text-neutral-500 mt-2">Try adjusting your search or filters.</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default Startups;
