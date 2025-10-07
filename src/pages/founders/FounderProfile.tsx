import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { getUserReviewsReceived, getUserRatingSummary } from '../../lib/feedback';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/common/Button';
import { Briefcase, Building, GraduationCap, Globe, Link as LinkIcon, MapPin } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { ReviewWithUsers } from '../../types';
import ProjectCard from '../../components/projects/ProjectCard';

const FounderProfile: React.FC = () => {
  const { id: paramId } = useParams();
  const { session } = useAuth();
  const userId = paramId || session?.user.id || '';
  const isOwnProfile = userId && session?.user?.id === userId;

  const [profile, setProfile] = React.useState({
    name: 'Founder',
    avatar_url: 'https://api.dicebear.com/7.x/identicon/svg?seed=founder',
    bio: 'Visionary entrepreneur changing the world.',
    skills: ['Leadership', 'Product Management', 'Fundraising'],
    postedProjects: [] as { id: string; title: string }[],
    reviews: [] as ReviewWithUsers[],
    avg: null as number | null,
    count: 0,
    position: '',
    industry: '',
    school: '',
    location: '',
    website: '',
    role: '',
  });

  // Load basic profile data from users table
  React.useEffect(() => {
    let active = true;
    if (!userId) return;
    (async () => {
      const { data: userData, error } = await supabase
        .from('users')
        .select('full_name, avatar_url, bio')
        .eq('id', userId)
        .maybeSingle();
      if (error) {
        console.error('Error fetching user profile:', error);
        return;
      }
      if (userData && active) {
        setProfile(p => ({
          ...p,
          name: userData.full_name || p.name,
          avatar_url: userData.avatar_url || p.avatar_url,
          bio: userData.bio || p.bio
        }));
      }
    })();
    return () => { active = false; };
  }, [userId]);

  // Load additional profile data
  React.useEffect(() => {
    let active = true;
    if (!userId) return;
    (async () => {
      // Load reviews, summary, skills and projects concurrently
      const [reviewsRes, summaryRes, skillsRes, projectsRes] = await Promise.all([
        getUserReviewsReceived(userId),
        getUserRatingSummary(userId),
        supabase.from('user_skills').select('skills(name)').eq('user_id', userId),
        supabase
          .from('projects')
          .select('id, title, description, tech_stack, status, duration_weeks, difficulty, created_at')
          .eq('mentor_id', userId)
          .order('created_at', { ascending: false })
          .limit(3)
      ]);
      
      if (!active) return;
      
      const { data: reviews } = reviewsRes;
      const { data: summary } = summaryRes;
      const skills = skillsRes.data?.map(s => s.skills?.name).filter(Boolean) || [];
      const postedProjects = projectsRes.data || [];
      
      console.log('Projects response:', projectsRes);
      console.log('Posted projects:', postedProjects);

      // Get location from session user metadata if available
      const location = session?.user?.user_metadata ? 
        [session.user.user_metadata.city, session.user.user_metadata.country].filter(Boolean).join(', ') : 
        '';

      if (active) {
        setProfile(p => ({
          ...p,
          skills,
          postedProjects,
          reviews: reviews || [],
          avg: summary?.avg_rating ?? null,
          count: summary?.reviews_count ?? 0,
          location
        }));
      }
    })();
    return () => { active = false; };
  }, [userId, session]);

  return (
    <div className="min-h-screen bg-black text-white">
      <main className="pt-4 sm:pt-8 px-3 sm:px-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-neutral-900 rounded-lg p-4 sm:p-8">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 mb-6">
              <img
                src={profile.avatar_url}
                alt={profile.name}
                className="h-24 w-24 sm:h-20 sm:w-20 rounded-full object-cover border-4 border-custom-cyan"
              />
              <div className="text-center sm:text-left flex-grow">
                <h1 className="text-2xl sm:text-3xl font-bold">{profile.name}</h1>
                <p className="text-neutral-400 mt-2">{profile.bio}</p>
                {profile.count > 0 && (
                  <div className="mt-2 text-sm text-neutral-300">
                    Average Rating: <span className="text-yellow-400 font-semibold">{profile.avg?.toFixed(2)}</span> ({profile.count} reviews)
                  </div>
                )}
              </div>
              <div className="w-full sm:w-auto sm:ml-auto mt-4 sm:mt-0">
                {isOwnProfile && (
                  <Button as="link" to="/settings" variant="outline" size="sm" className="w-full sm:w-auto">Edit Profile</Button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {profile.position && (
                <div className="flex items-center gap-2">
                  <Briefcase className="text-custom-cyan" size={20} />
                  <span>{profile.position}</span>
                </div>
              )}
              {profile.industry && (
                <div className="flex items-center gap-2">
                  <Building className="text-custom-orange" size={20} />
                  <span>{profile.industry}</span>
                </div>
              )}
              {profile.school && (
                <div className="flex items-center gap-2">
                  <GraduationCap className="text-custom-purple" size={20} />
                  <span>{profile.school}</span>
                </div>
              )}
              {profile.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="text-custom-green" size={20} />
                  <span>{profile.location}</span>
                </div>
              )}
              {profile.website && (
                <div className="flex items-center gap-2">
                  <Globe className="text-custom-blue" size={20} />
                  <a href={profile.website} target="_blank" rel="noopener noreferrer" className="hover:text-custom-blue">
                    {new URL(profile.website).hostname}
                  </a>
                </div>
              )}
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Skills & Expertise</h2>
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill, i) => (
                  <span key={i} className="px-3 py-1 rounded-full bg-neutral-800 text-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Posted Projects</h2>
                {profile.postedProjects.length > 3 && (
                  <Button
                    as="link"
                    to={`/projects?mentor=${userId}`}
                    variant="outline"
                    size="sm"
                  >
                    View All Projects
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {profile.postedProjects.map(project => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    showMentor={false}
                    className="w-full"
                  />
                ))}
                {profile.postedProjects.length === 0 && (
                  <div className="col-span-full py-8">
                    <p className="text-neutral-400 text-center">No projects posted yet.</p>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4">Reviews</h2>
              <div className="space-y-6">
                {profile.reviews.map(review => (
                  <div key={review.id} className="p-4 rounded-lg bg-neutral-800">
                    <div className="flex justify-between items-start mb-2">
                      <div className="font-medium">{review.reviewer?.full_name || review.reviewer_id}</div>
                      <div className="text-yellow-400">{review.rating}/5</div>
                    </div>
                    {review.feedback && (
                      <p className="text-neutral-300">{review.feedback}</p>
                    )}
                    {review.project && (
                      <div className="mt-2 text-sm text-neutral-400">
                        Project: {review.project.title || 'Untitled Project'}
                      </div>
                    )}
                  </div>
                ))}
                {profile.reviews.length === 0 && (
                  <p className="text-neutral-400">No reviews yet.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default FounderProfile;