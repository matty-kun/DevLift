import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { User, Settings, Bell, Shield, Building } from 'lucide-react';
import AccountSettings from '../components/settings/AccountSettings';
import NotificationSettings from '../components/settings/NotificationSettings';
import SecuritySettings from '../components/settings/SecuritySettings';
import StartupSettings from '../components/settings/StartupSettings';

type TabType = 'account' | 'notifications' | 'security' | 'startup';

const tabs: { id: TabType; label: string; icon: React.FC<{ size?: number }> }[] = [
  { id: 'account', label: 'Account', icon: User },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'startup', label: 'Startup', icon: Building }
];

const SettingsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<TabType>('account');

  useEffect(() => {
    const tab = searchParams.get('tab') as TabType;
    if (tab && tabs.some(t => t.id === tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const handleTabChange = (tab: TabType) => {
    setSearchParams({ tab });
    setActiveTab(tab);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <main className="pt-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Settings className="text-custom-cyan" />
              Settings
            </h1>
            <p className="text-neutral-400 mt-2">Manage your account settings and preferences</p>
          </div>

          {/* Tabs */}
          <div className="bg-neutral-900 rounded-lg overflow-hidden">
            <div className="border-b border-neutral-800">
              <nav className="flex overflow-x-auto">
                {tabs.map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => handleTabChange(id)}
                    className={`flex items-center gap-2 px-6 py-4 font-medium border-b-2 transition-colors whitespace-nowrap ${
                      activeTab === id
                        ? 'border-custom-cyan text-custom-cyan'
                        : 'border-transparent text-neutral-400 hover:text-white'
                    }`}
                  >
                    <Icon size={20} />
                    {label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Content */}
            <div className="p-6">
              {activeTab === 'account' && <AccountSettings />}
              {activeTab === 'notifications' && <NotificationSettings />}
              {activeTab === 'security' && <SecuritySettings />}
              {activeTab === 'startup' && <StartupSettings />}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SettingsPage;