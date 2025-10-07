import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import PersonCard from '../components/common/PersonCard';
import Input from '../components/common/Input';
import { Search, GraduationCap, Briefcase, Users } from 'lucide-react';

interface User {
  id: string;
  full_name: string;
  avatar_url: string;
  role: string;
  bio: string;
  skills: string[];
  position?: string;
  school?: string;
  avg_rating?: number;
  reviews_count?: number;
}

const People: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [sortOption, setSortOption] = useState<string>('name-asc'); // Default sort by name A-Z
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        // Get user profiles with ratings
        const { data, error } = await supabase
          .from('users')
          .select(`
            id,
            full_name,
            avatar_url,
            role,
            bio,
            position,
            company
          `)
          .order('role');

        if (error) {
          console.error('Error fetching users from Supabase:', error.message || error);
          throw error;
        }

        const formattedUsers = data.map(user => ({
          id: user.id,
          full_name: user.full_name,
          avatar_url: user.avatar_url,
          role: user.role,
          bio: user.bio,
          skills: [], // Skills will be fetched separately from user_skills table if needed
          position: user.position,
          school: user.company, // Using company field as school equivalent
          // avg_rating and reviews_count are no longer fetched directly via this query
        }));

        setUsers(formattedUsers);
      } catch (error) {
        console.error('Error in fetchUsers:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredAndSortedUsers = users.filter(user => {
    const matchesSearch = user.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.bio?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.skills?.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  }).sort((a, b) => {
    switch (sortOption) {
      case 'name-asc':
        return a.full_name.localeCompare(b.full_name);
      case 'name-desc':
        return b.full_name.localeCompare(a.full_name);
      default:
        return 0;
    }
  });

  const roleStats = {
    student: users.filter(u => u.role === 'student').length,
    founder: users.filter(u => u.role === 'founder').length,
    total: users.length
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">People</h1>
          <p className="text-neutral-400">Connect with founders and students in the DevLift community</p>
        </div>

        {/* Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
                <Input
                  type="text"
                  placeholder="Search by name, bio, or skills..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-full bg-neutral-900"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setRoleFilter('all')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                  roleFilter === 'all' 
                    ? 'bg-neutral-800 text-white' 
                    : 'text-neutral-400 hover:bg-neutral-800/50'
                }`}
              >
                <Users size={20} />
                <span>All ({roleStats.total})</span>
              </button>
              <button
                onClick={() => setRoleFilter('founder')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                  roleFilter === 'founder' 
                    ? 'bg-neutral-800 text-white' 
                    : 'text-neutral-400 hover:bg-neutral-800/50'
                }`}
              >
                <Briefcase size={20} />
                <span>Founders ({roleStats.founder})</span>
              </button>
              <button
                onClick={() => setRoleFilter('student')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                  roleFilter === 'student' 
                    ? 'bg-neutral-800 text-white' 
                    : 'text-neutral-400 hover:bg-neutral-800/50'
                }`}
              >
                <GraduationCap size={20} />
                <span>Students ({roleStats.student})</span>
              </button>
            </div>
            <div className="relative">
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="block w-full sm:w-auto px-4 py-2 pr-8 rounded-lg bg-neutral-900 border border-neutral-700 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-custom-cyan"
              >
                <option value="name-asc">Name (A-Z)</option>
                <option value="name-desc">Name (Z-A)</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-neutral-400">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-neutral-900 rounded-lg p-6 animate-pulse">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-neutral-800 rounded-full" />
                  <div className="flex-1">
                    <div className="h-4 bg-neutral-800 rounded w-3/4 mb-2" />
                    <div className="h-3 bg-neutral-800 rounded w-1/2" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-3 bg-neutral-800 rounded w-full" />
                  <div className="h-3 bg-neutral-800 rounded w-5/6" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAndSortedUsers.map((user) => (
                <PersonCard
                  key={user.id}
                  person={user}
                  onClick={() => navigate(user.role === 'founder' ? `/founders/${user.id}` : `/people/${user.id}`)}
                  className="cursor-pointer hover:border-neutral-700 transition-colors"
                />
              ))}
            </div>
            {filteredAndSortedUsers.length === 0 && (
              <div className="text-center py-12">
                <p className="text-neutral-400">No users found matching your search criteria.</p>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default People;
