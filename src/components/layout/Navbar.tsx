import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import sign from '../../assets/DevLift Sign.svg';
import { LayoutDashboard, Briefcase, Users, Building, Book } from 'lucide-react';
import Tooltip from '../common/Tooltip';
import { useAuth } from '../../contexts/AuthContext';
import Search from '../common/Search';

interface NavbarProps {
  actionButtons?: React.ReactNode;
  showNavLinks?: boolean;
}

const navLinks = [
  { href: '/founder-dashboard', text: 'Dashboard', icon: LayoutDashboard },
  { href: '/projects', text: 'Projects', icon: Briefcase },
  { href: '/people', text: 'People', icon: Users },
  { href: '/startups', text: 'Startups', icon: Building },
  { href: '/resources', text: 'Resources', icon: Book },
];

const Navbar: React.FC<NavbarProps> = ({ actionButtons, showNavLinks = false }) => {
  const location = useLocation();
  const { session } = useAuth();

  return (
    <header className="fixed top-0 left-0 w-full z-50">
      <div className="relative flex items-center justify-between mx-auto max-w-7xl px-6 py-3 mt-2 rounded-lg bg-black/80 backdrop-blur-xl border-b border-neutral-700 shadow-xl">
          <div className="flex items-center flex-1">
            <div className="flex items-center gap-4 flex-shrink-0">
              {/* Logo */}
              <Link to="/" className="flex items-center" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                <img src={sign} alt="DevLift Sign" className="h-8 w-auto" />
                {(!session || location.pathname === '/') && 
                  <span className="font-headings text-custom-cyan text-2xl font-bold ml-2">
                    Dev<span className="text-custom-orange">Lift</span>
                  </span>
                }
              </Link>
              
              {/* Search */}
              {session && location.pathname !== '/' && (
                <>
                  {/* Hidden on smaller screens */}
                  <div className="hidden md:block w-48 lg:w-56">
                    <Search />
                  </div>
                  {/* Shown on smaller screens */}
                  <div className="md:hidden">
                    <Search collapsed />
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Centered Navigation */}
          {showNavLinks && (
            <nav className="absolute left-1/2 -translate-x-1/2">
              <ul className="flex items-center gap-8">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = location.pathname.startsWith(link.href);
                  return (
                    <li key={link.href}>
                      <Tooltip text={link.text}>
                        <Link 
                          to={link.href} 
                          className={`p-3 rounded-md transition-colors ${isActive ? 'text-custom-cyan bg-neutral-800' : 'text-neutral-400 hover:text-white hover:bg-neutral-800'}`}>
                          <Icon className={`h-6 w-6`} />
                        </Link>
                      </Tooltip>
                    </li>
                  );
                })}
              </ul>
            </nav>
          )}

          {/* Action Buttons */}
          <div className="flex-shrink-0">
            {actionButtons && (
              <div className="hidden md:flex items-center gap-4">
                {actionButtons}
              </div>
            )}
          </div>
      </div>
    </header>
  );
};

export default Navbar;
