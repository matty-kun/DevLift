import React, { useState } from 'react';

import { Link, useNavigate, useLocation } from 'react-router-dom';

import Button from '../common/Button';
import sign from '../../assets/DevLift Sign.svg';
import Avatar from '../common/Avatar';

const Navbar: React.FC = () => {
  const [isAvatarMenuOpen, setIsAvatarMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <header className="fixed top-0 left-0 w-full z-50">
      <div className="mx-5 md:mx-20 px-3 py-1 mt-4 rounded-full bg-black/70 backdrop-blur-xl border border-neutral-700 flex flex-row items-center justify-between shadow-xl">
        {/* Logo */}
        <div className="flex items-center">
          <Link to="/" className="flex items-center" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <img src={sign} alt="DevLift Sign" className="h-8 w-auto" />
            <span className="text-custom-cyan text-2xl font-bold">Dev<span className="text-custom-orange">Lift</span></span>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;