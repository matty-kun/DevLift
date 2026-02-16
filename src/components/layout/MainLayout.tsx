import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Navbar from './Navbar';
import AccountActions from './AccountActions';
import Footer from './Footer';

interface MainLayoutProps {
  actionButtons?: React.ReactNode;
  showNavLinks?: boolean;
  showFooter?: boolean;
}

const MainLayout: React.FC<MainLayoutProps> = ({ actionButtons, showNavLinks, showFooter = true }) => {
  const { session } = useAuth();
  const location = useLocation();
  const isHomepage = location.pathname === '/';

  const finalActionButtons = actionButtons !== undefined ? actionButtons : (session ? <AccountActions /> : undefined);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar actionButtons={finalActionButtons} showNavLinks={showNavLinks} />
      <main className={`flex-grow ${isHomepage ? '' : 'pt-24'}`}>
        <Outlet />
      </main>
      {showFooter && <Footer />}
    </div>
  );
};

export default MainLayout;
