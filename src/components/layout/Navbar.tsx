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
    <header className="sticky top-0 z-50">
      <div className="container mx-auto px-6 py-1 mt-4 rounded-full bg-black/70 backdrop-blur-xl border border-neutral-700 flex flex-col md:flex-row items-center space-y-4 md:space-y-0 shadow-xl">
        {/* Logo */}
        <div className="flex-1 flex justify-start">
          <Link to="/" className="flex items-center">
            <img src={sign} alt="DevLift Sign" className="h-8 w-auto" />
            <span className="text-custom-cyan text-2xl font-bold hidden sm:inline">Dev<span className="text-custom-orange">Lift</span></span>
          </Link>
        </div>

        <nav className="flex-1 flex justify-center">
          <Link to="/projects" className="px-3 py-2 text-white hover:text-custom-cyan rounded-lg transition-colors">
            Projects
          </Link>
          <Link to="/community" className="px-3 py-2 text-white hover:text-custom-cyan rounded-lg transition-colors">
            Community
          </Link>
          <Link to="/startups" className="px-3 py-2 text-white hover:text-custom-cyan rounded-lg transition-colors">
            Startups
          </Link>
          <Link to="/about" className="px-3 py-2 text-white hover:text-custom-cyan rounded-lg transition-colors">
            About
          </Link>
        </nav>

        {/* Right Side Menu - Show Dashboard links on /projects, otherwise Get Started */}
        <div className="flex-1 hidden md:flex justify-end items-center space-x-4 relative">
          {location.pathname === '/projects' ? (
            <>
              <Link to="/student-dashboard">
                <Button variant="primary" size="sm">
                  Student Dashboard
                </Button>
              </Link>
              <div className="relative">
                <button onClick={() => setIsAvatarMenuOpen((open) => !open)} className="focus:outline-none">
                  <Avatar src="https://randomuser.me/api/portraits/men/32.jpg" alt="Demo User" size="sm" />
                </button>
                {isAvatarMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-neutral-900 border border-neutral-700 rounded-lg shadow-lg z-50 animate-fade-in">
                    <ul className="py-2 text-white">
                      <li>
                        <Link to="/settings" className="w-full text-left px-4 py-2 hover:bg-neutral-800 transition-colors block">Settings</Link>
                      </li>
                      <li>
                        <button className="w-full text-left px-4 py-2 hover:bg-neutral-800 transition-colors">Log Out</button>
                      </li>
                      <li>
                        <div className="px-4 py-2 text-neutral-400 cursor-default">Dark Mode / Light Mode</div>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </>
          ) : location.pathname === '/startups' ? (
            <>
              <Link to="/student-dashboard">
                <Button variant="primary" size="sm">
                  Student Dashboard
                </Button>
              </Link>
              <Link to="/founder-dashboard">
                <Button variant="secondary" size="sm">
                  Founder Dashboard
                </Button>
                
              </Link>
              <div className="relative">
                <button onClick={() => setIsAvatarMenuOpen((open) => !open)} className="focus:outline-none">
                  <Avatar src="https://randomuser.me/api/portraits/men/32.jpg" alt="Demo User" size="sm" />
                </button>
                {isAvatarMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-neutral-900 border border-neutral-700 rounded-lg shadow-lg z-50 animate-fade-in">
                    <ul className="py-2 text-white">
                      <li>
                        <Link to="/settings" className="w-full text-left px-4 py-2 hover:bg-neutral-800 transition-colors block">Settings</Link>
                      </li>
                      <li>
                        <button className="w-full text-left px-4 py-2 hover:bg-neutral-800 transition-colors">Log Out</button>
                      </li>
                      <li>
                        <div className="px-4 py-2 text-neutral-400 cursor-default">Dark Mode / Light Mode</div>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </>
          ) : (
            <Link to="/sign-up">
              <Button variant="primary" size="sm">
                Lezgooooo
              </Button>
            </Link>
          )}
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