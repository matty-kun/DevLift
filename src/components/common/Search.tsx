import React, { useState, useRef, useEffect } from 'react';
import { Search as SearchIcon, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Search: React.FC = () => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      setQuery('');
      inputRef.current?.blur();
    }
  };

  const clearSearch = () => {
    setQuery('');
    inputRef.current?.focus();
  };

  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  }, []);

  return (
    <form onSubmit={handleSearch} className="relative w-full max-w-md mx-auto">
      <label htmlFor="search-input" className="sr-only">Search</label>
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <SearchIcon className="h-5 w-5 text-neutral-400" aria-hidden="true" />
        </div>
        <input
          ref={inputRef}
          id="search-input"
          type="search"
          placeholder="Search projects, people, startups..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="block w-full bg-neutral-800/50 border border-transparent rounded-full py-2 pl-10 pr-4 text-white placeholder:text-neutral-400 focus:bg-neutral-800 focus:border-custom-cyan focus:outline-none focus:ring-1 focus:ring-custom-cyan sm:text-sm transition-all duration-300"
        />
        {query && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            <button type="button" onClick={clearSearch} className="text-neutral-400 hover:text-white">
              <X className="h-5 w-5" />
              <span className="sr-only">Clear search</span>
            </button>
          </div>
        )}
        
      </div>
    </form>
  );
};

export default Search;
