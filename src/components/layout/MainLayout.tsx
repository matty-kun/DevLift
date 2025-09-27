import React from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Navbar from './Navbar';
import AccountActions from './AccountActions';

const MainLayout: React.FC = () => {
  const { session } = useAuth();

  return (
    <div className="bg-black min-h-screen">
      <Navbar actionButtons={session ? <AccountActions /> : undefined} showNavLinks={true} />
      <main className="pt-24">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
