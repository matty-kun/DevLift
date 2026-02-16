import React, { useState, useRef, useEffect } from 'react';
import { Search as SearchIcon, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SearchProps {
  collapsed?: boolean;
}

const Search: React.FC<SearchProps> = ({ collapsed = false }) => {
  const [query, setQuery] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

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
        if (collapsed) {
          setIsExpanded(true);
        }
        inputRef.current?.focus();
      }
      if (e.key === 'Escape' && collapsed) {
        setIsExpanded(false);
        inputRef.current?.blur();
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (collapsed && formRef.current && !formRef.current.contains(e.target as Node)) {
        setIsExpanded(false);
      }
    };

    window.addEventListener('keydown', handleKeydown);
    if (collapsed) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      window.removeEventListener('keydown', handleKeydown);
      if (collapsed) {
        document.removeEventListener('mousedown', handleClickOutside);
      }
    };
  }, [collapsed]);

  if (collapsed && !isExpanded) {
    return (
      <button
        type="button"
        onClick={() => setIsExpanded(true)}
        className="p-2 rounded-full hover:bg-neutral-800 transition-colors"
        aria-label="Open search"
      >
        <SearchIcon className="h-4 w-4 text-neutral-400" />
      </button>
    );
  }

  return (
    <form ref={formRef} onSubmit={handleSearch} className={`relative ${collapsed ? 'w-full absolute right-0 top-0 z-10' : 'w-full'}`}>
      <label htmlFor="search-input" className="sr-only">Search</label>
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2">
          <SearchIcon className="h-4 w-4 text-neutral-400" aria-hidden="true" />
        </div>
        <input
          ref={inputRef}
          id="search-input"
          type="search"
          placeholder="Search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className={`block w-full bg-neutral-800/50 border border-transparent rounded-full py-1.5 pl-7 pr-3 text-sm text-white placeholder:text-neutral-400 focus:bg-neutral-800 focus:border-custom-cyan focus:outline-none focus:ring-1 focus:ring-custom-cyan transition-all duration-300 ${
            collapsed ? 'bg-neutral-800' : ''
          }`}
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
