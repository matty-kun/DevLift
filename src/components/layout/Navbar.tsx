import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import Button from '../common/Button';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-black/90 backdrop-blur-md border-b border-black">
      <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
        {/* Logo */}
        <div className="flex justify-start">
          <Link to="/" className="flex items-center">
            <span className="text-custom-cyan text-2xl font-bold">Dev<span className="text-custom-orange">Lift</span></span>
          </Link>
        </div>

        <nav className="flex justify-center flex-grow md:flex-none">
        <Link to="/" className="px-3 py-2 text-white hover:text-custom-cyan rounded-lg transition-colors">
            Home
          </Link>
          <Link to="/projects" className="px-3 py-2 text-white hover:text-custom-cyan rounded-lg transition-colors">
            Projects
          </Link>
          <Link to="/startups" className="px-3 py-2 text-white hover:text-custom-cyan rounded-lg transition-colors">
            Startups
          </Link>
          <Link to="/resources" className="px-3 py-2 text-white hover:text-custom-cyan rounded-lg transition-colors">
            Resources
          </Link>
          <Link to="/about" className="px-3 py-2 text-white hover:text-custom-cyan rounded-lg transition-colors">
            About
          </Link>
        </nav>

        {/* Right Side Menu - Keep as is or adjust if needed */}
        <div className="hidden md:flex justify-end space-x-4">
          <Link to="/sign-up">
            <Button variant="primary" size="sm">
              Get Started
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={toggleMenu}
            className="p-2 rounded-lg text-white hover:text-custom-cyan hover:bg-gray-800 transition-colors"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-gray-900 border-t border-gray-800 py-4 animate-fade-in">
          <div className="container mx-auto px-4 flex flex-col space-y-3">
            <Link 
              to="/projects" 
              className="px-4 py-2 text-white hover:text-custom-cyan hover:bg-gray-800 rounded-lg transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Browse Projects
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;