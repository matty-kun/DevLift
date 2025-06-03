import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, User, LogOut } from 'lucide-react';
import Button from '../common/Button';
import { useAuth } from '../../contexts/AuthContext';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-black/90 backdrop-blur-md border-b border-gray-800">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <span className="text-custom-cyan text-2xl font-bold">Dev<span className="text-custom-orange">Lift</span></span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-between space-x-1">
          <Link to="/projects" className="px-3 py-2 text-white hover:text-custom-cyan rounded-lg transition-colors">
            Browse Projects
          </Link>
          <Link to="/founders" className="px-3 py-2 text-white hover:text-custom-cyan rounded-lg transition-colors">
            Find Startups
          </Link>
          {user && (
            <Link to="/dashboard" className="px-3 py-2 text-white hover:text-custom-cyan rounded-lg transition-colors">
              Dashboard
            </Link>
          )}
        </nav>

        {/* Right Side Menu */}
        <div className="hidden md:flex items-center space-x-4">
          {user ? (
            <div className="flex items-center space-x-4">
              <Link to="/profile" className="flex items-center space-x-2 px-3 py-2 text-white hover:text-custom-cyan rounded-lg transition-colors">
                <div className="h-8 w-8 rounded-full bg-gray-700 flex items-center justify-center">
                  <User className="h-4 w-4 text-gray-300" />
                </div>
                <span>Profile</span>
              </Link>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleSignOut}
                className="border-gray-600 text-white hover:border-custom-orange hover:text-custom-orange"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          ) : (
            <>
              <Link to="/sign-in">
                <Button variant="outline" size="sm" className="border-gray-600 text-white hover:border-custom-cyan hover:text-custom-cyan">
                  Sign In
                </Button>
              </Link>
              <Link to="/sign-up">
                <Button variant="primary" size="sm">
                  Sign Up
                </Button>
              </Link>
            </>
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
        <div className="md:hidden bg-gray-900 border-t border-gray-800 py-4 animate-fade-in">
          <div className="container mx-auto px-4 flex flex-col space-y-3">
            <Link 
              to="/projects" 
              className="px-4 py-2 text-white hover:text-custom-cyan hover:bg-gray-800 rounded-lg transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Browse Projects
            </Link>
            <Link 
              to="/founders" 
              className="px-4 py-2 text-white hover:text-custom-cyan hover:bg-gray-800 rounded-lg transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Find Startups
            </Link>
            
            {user && (
              <Link 
                to="/dashboard" 
                className="px-4 py-2 text-white hover:text-custom-cyan hover:bg-gray-800 rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Dashboard
              </Link>
            )}
            
            <hr className="border-gray-700" />
            
            {user ? (
              <>
                <Link 
                  to="/profile" 
                  className="px-4 py-2 text-white hover:text-custom-cyan hover:bg-gray-800 rounded-lg transition-colors flex items-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User className="h-5 w-5 mr-2" />
                  Your Profile
                </Link>
                <button 
                  onClick={() => {
                    handleSignOut();
                    setIsMenuOpen(false);
                  }}
                  className="px-4 py-2 text-white hover:text-custom-orange hover:bg-gray-800 rounded-lg transition-colors text-left flex items-center"
                >
                  <LogOut className="h-5 w-5 mr-2" />
                  Sign Out
                </button>
              </>
            ) : (
              <div className="flex flex-col space-y-2 pt-2">
                <Link to="/sign-in" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="outline" fullWidth className="border-gray-600">
                    Sign In
                  </Button>
                </Link>
                <Link to="/sign-up" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="primary" fullWidth>
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;