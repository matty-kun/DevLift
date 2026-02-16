import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/common/Button';
import { Building, Globe, MapPin, Users, Briefcase, Calendar } from 'lucide-react';

interface StartupProfile {
  id: string;
  name: string;
  logo_url: string;
  description: string;
  industry: string;
  location: string;
  website: string;
  founded_date: string;
  team_size: number;
  stage: string;
  founder_id: string;
  founder: {
    id: string;
    full_name: string;
    avatar_url: string;
  };
}

const StartupProfile: React.FC = () => {
  const { id } = useParams();
  const { session } = useAuth();
  const [profile, setProfile] = useState<StartupProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const isOwner = profile?.founder_id === session?.user?.id;

  useEffect(() => {
    const fetchStartupProfile = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('startups')
          .select(`
            *,
            founder:founder_id (
              id,
              full_name,
              avatar_url
            )
          `)
          .eq('id', id)
          .single();

        if (error) throw error;
        setProfile(data);
      } catch (error) {
        console.error('Error fetching startup profile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchStartupProfile();
    }
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white">
        <main className="pt-8 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-neutral-900 rounded-lg p-8 animate-pulse">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                <div className="w-32 h-32 bg-neutral-800 rounded-lg" />
                <div className="flex-1">
                  <div className="h-8 bg-neutral-800 rounded w-3/4 mb-4" />
                  <div className="h-4 bg-neutral-800 rounded w-1/2 mb-2" />
                  <div className="h-4 bg-neutral-800 rounded w-2/3" />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-black text-white">
        <main className="pt-8 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-2xl font-bold text-neutral-400">Startup not found</h1>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <main className="pt-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-neutral-900 rounded-lg p-6 sm:p-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-8">
              <img
                src={profile.logo_url || 'https://via.placeholder.com/128?text=Logo'}
                alt={`${profile.name} logo`}
                className="w-32 h-32 object-cover rounded-lg border-2 border-custom-cyan"
              />
              <div className="flex-1 text-center sm:text-left">
                <h1 className="text-3xl font-bold mb-2">{profile.name}</h1>
                <p className="text-neutral-400 mb-4">{profile.description}</p>
                {isOwner && (
                  <Button 
                    as="link" 
                    to="/settings?tab=startup" 
                    variant="outline" 
                    size="sm"
                  >
                    Edit Startup Profile
                  </Button>
                )}
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
              <div className="flex items-center gap-3">
                <Building className="text-custom-cyan" size={20} />
                <div>
                  <div className="text-sm text-neutral-400">Industry</div>
                  <div>{profile.industry}</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <MapPin className="text-custom-orange" size={20} />
                <div>
                  <div className="text-sm text-neutral-400">Location</div>
                  <div>{profile.location}</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Globe className="text-custom-purple" size={20} />
                <div>
                  <div className="text-sm text-neutral-400">Website</div>
                  <a 
                    href={profile.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-custom-cyan"
                  >
                    {(() => {
                      try {
                        return new URL(profile.website.startsWith('http') ? profile.website : `https://${profile.website}`).hostname;
                      } catch {
                        return profile.website;
                      }
                    })()}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Users className="text-custom-green" size={20} />
                <div>
                  <div className="text-sm text-neutral-400">Team Size</div>
                  <div>{profile.team_size} members</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Calendar className="text-custom-blue" size={20} />
                <div>
                  <div className="text-sm text-neutral-400">Founded</div>
                  <div>{new Date(profile.founded_date).getFullYear()}</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Briefcase className="text-custom-red" size={20} />
                <div>
                  <div className="text-sm text-neutral-400">Stage</div>
                  <div className="capitalize">{profile.stage}</div>
                </div>
              </div>
            </div>

            {/* Founder Section */}
            <div className="border-t border-neutral-800 pt-6">
              <h2 className="text-xl font-semibold mb-4">Founder</h2>
              <div className="flex items-center gap-4">
                <img
                  src={profile.founder.avatar_url || 'https://via.placeholder.com/64?text=Avatar'}
                  alt={profile.founder.full_name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-custom-cyan"
                />
                <div>
                  <h3 className="font-medium">{profile.founder.full_name}</h3>
                  <Button
                    as="link"
                    to={`/founders/${profile.founder.id}`}
                    variant="link"
                    className="text-custom-cyan hover:text-custom-cyan/80"
                  >
                    View Profile
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StartupProfile;