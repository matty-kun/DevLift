import React, { useState } from 'react';

import { Link, useNavigate, useLocation } from 'react-router-dom';

import { Menu, X } from 'lucide-react';
import Button from '../common/Button';
import sign from '../../assets/DevLift Sign.svg';
import Avatar from '../common/Avatar';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAvatarMenuOpen, setIsAvatarMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();


  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  return (
    <header className="fixed top-0 left-0 w-full z-50">
      <div className="mx-5 md:mx-20 px-3 py-1 mt-4 rounded-full bg-black/70 backdrop-blur-xl border border-neutral-700 flex flex-col md:flex-row items-center space-y-4 md:space-y-0 shadow-xl">
        {/* Logo */}
        <div className="flex-1 flex justify-start">
          <Link to="/" className="flex items-center" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <img src={sign} alt="DevLift Sign" className="h-8 w-auto" />
            <span className="text-custom-cyan text-2xl font-bold hidden sm:inline">Dev<span className="text-custom-orange">Lift</span></span>
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
        <div className="md:hidden bg-gray-900 border-t border-gray-800 py-4 animate-fade-in mt-4 rounded-xl mx-4">
          <div className="container mx-auto px-4 flex flex-col space-y-3">
            <Link 
              to="/projects" 
              className="px-4 py-2 text-white hover:text-custom-cyan hover:bg-gray-800 rounded-lg transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Projects
            </Link>
            <Link 
              to="/about" 
              className="px-4 py-2 text-white hover:text-custom-cyan hover:bg-gray-800 rounded-lg transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <Link 
              to="/startups" 
              className="px-4 py-2 text-white hover:text-custom-cyan hover:bg-gray-800 rounded-lg transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Startups
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;