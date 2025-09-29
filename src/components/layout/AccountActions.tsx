import React, { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Settings, LogOut, Mail, Plus } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Dropdown from '../common/Dropdown';
import Tooltip from '../common/Tooltip';
import NotificationsBell from '../common/NotificationsBell';

const AccountActions: React.FC = () => {
  const { session, profile, signOut } = useAuth();
  const navigate = useNavigate();

  const founderName = useMemo(() => profile?.full_name || session?.user?.email?.split('@')[0] || 'Founder', [profile?.full_name, session?.user?.email]);
  const avatarUrl = profile?.avatar_url;

  const handleSignOut = async () => { 
    await signOut(); 
    navigate('/sign-in', { replace: true }); 
  };

  return (
    <div className="flex items-center gap-4">
      <Tooltip text="Post New Project">
        <Link to="/founders/post-project" className="flex items-center gap-2 relative bg-neutral-900 px-4 py-2 rounded-full hover:bg-neutral-800 transition-colors" aria-label="Post New Project">
          <Plus className="h-5 w-5 text-custom-cyan" />
          <span className="text-sm font-semibold text-custom-cyan">POST</span>
        </Link>
      </Tooltip>
      <Tooltip text="Notifications">
        <NotificationsBell />
      </Tooltip>
      <Tooltip text="Messages">
        <button className="relative bg-neutral-900 p-2 rounded-full hover:bg-neutral-800 transition-colors" aria-label="Messages">
          <Mail className="h-6 w-6 text-custom-purple" />
        </button>
      </Tooltip>
      <Tooltip text="Account">
        <Dropdown
          trigger={
            <button className="relative bg-neutral-900 p-2 rounded-full hover:bg-neutral-800 transition-colors">
              {avatarUrl ? (
                <img src={avatarUrl} alt={founderName} className="h-6 w-6 rounded-full object-cover" />
              ) : (
                <User className="h-6 w-6 text-custom-cyan" />
              )}
            </button>
          }
        >
          <Link to={`/founders/${session?.user?.id}`} className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-neutral-700">
            <User className="h-4 w-4" />
            Profile
          </Link>
          <Link to="/settings" className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-neutral-700">
            <Settings className="h-4 w-4" />
            Settings
          </Link>
          <button onClick={handleSignOut} className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-neutral-700">
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </Dropdown>
      </Tooltip>
    </div>
  );
};

export default AccountActions;
