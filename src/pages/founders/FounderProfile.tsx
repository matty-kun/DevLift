import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { getUserReviewsReceived, getUserRatingSummary } from '../../lib/feedback';
import { useAuth } from '../../contexts/AuthContext';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import BackButton from '../../components/common/BackButton';
import Button from '../../components/common/Button'; // Import Button
import { Briefcase, Building, GraduationCap, Globe, Link as LinkIcon, MapPin } from 'lucide-react';
import { supabase } from '../../lib/supabase';

type ReviewItem = {
  id: string;
  reviewerId?: string;
  reviewerName: string;
  rating: number;
  feedback: string | null;
  project?: { id: string; title?: string | null; status?: string | null } | null;
  created_at?: string;
};

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
    reviews: [] as ReviewItem[],
    avg: null as number | null,
    count: 0,
    position: '',
    industry: '',
    school: '',
    location: '',
    website: '',
    role: '',
  });

  React.useEffect(() => {
    let active = true;
    if (!userId) return;
    (async () => {
      // Load reviews, summary, user profile, skills and projects concurrently
      const [reviewsRes, summaryRes, publicUserRes, userRes, skillsRes, projectsRes] = await Promise.all([
        getUserReviewsReceived(userId),
        getUserRatingSummary(userId),
        supabase.from('users').select('full_name, bio').eq('id', userId).maybeSingle(),
        session?.user ? session.user : null, // Use existing session user data
        supabase.from('user_skills').select('skill').eq('user_id', userId),
        supabase.from('projects').select('id, title').eq('founder_id', userId),
      ]);
      const { data: reviews } = reviewsRes;
      const mapped: ReviewItem[] = (reviews || []).map(r => ({
        id: r.id,
        reviewerId: r.reviewer_id,
        reviewerName: r.reviewer?.full_name || r.reviewer?.id || 'Mentor',
        rating: r.rating,
        feedback: r.feedback || null,
        project: r.project,
        created_at: r.created_at,
      }));
      const { data: summary } = summaryRes;
      if (!active) return;
      const publicUser = publicUserRes.data;
      const user = userRes;
      const skills = skillsRes.data?.map(s => s.skill) || [];
      const postedProjects = projectsRes.data || [];
      const location = [user?.user_metadata?.city, user?.user_metadata?.country].filter(Boolean).join(', ');

      setProfile(p => ({
        name: publicUser?.full_name || user?.user_metadata?.full_name || 'Founder',
        avatar_url: user?.user_metadata?.avatar_url || 'https://api.dicebear.com/7.x/identicon/svg?seed=founder',
        bio: publicUser?.bio || user?.user_metadata?.bio || 'Visionary entrepreneur changing the world.',
        role: user?.user_metadata?.role || p.role,
        position: user?.user_metadata?.position || '',
        industry: user?.user_metadata?.industry || '',
        school: user?.user_metadata?.school || '',
        location: location,
        website: user?.user_metadata?.website || '', // This was missing the skills update
        skills,
        postedProjects,
        reviews: mapped,
        avg: summary?.avg_rating ?? null,
        count: summary?.reviews_count ?? 0,
      }));
    })(); // Removed supabase dependency from useEffect
    return () => { active = false; };
  }, [userId, session]);

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <main className="pt-24 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="mb-4">
            {paramId && session?.user && session.user.id !== paramId ? (
              <BackButton to={`/founders/${session.user.id}`} text="Back to My Profile" className="px-2 py-1" />
            ) : (
              <BackButton to="/founder-dashboard" text="Back to Dashboard" className="px-2 py-1" />
            )}
          </div>
          <div className="bg-neutral-900 rounded-lg p-8">
            <div className="flex items-start gap-6 mb-6">
              <img
                src={profile.avatar_url}
                alt={profile.name}
                className="h-20 w-20 rounded-full object-cover border-4 border-custom-cyan"
              />
              <div>
                <h1 className="text-3xl font-bold">{profile.name}</h1>
                <p className="text-neutral-400">{profile.bio}</p>
                {profile.count > 0 && (
                  <div className="mt-2 text-sm text-neutral-300">
                    Average Rating: <span className="text-yellow-400 font-semibold">{profile.avg?.toFixed(2)}</span> ({profile.count} reviews)
                  </div>
                )}
              </div>
              <div className="ml-auto">
                {isOwnProfile && (
                  <Button as="link" to="/settings" variant="outline" size="sm">Edit Profile</Button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 mb-6 text-neutral-300">
              {profile.position && (
                <div className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-custom-cyan" />
                  <span>{profile.position}</span>
                </div>
              )}
              {profile.industry && (
                <div className="flex items-center gap-2">
                  <Building className="h-5 w-5 text-custom-cyan" />
                  <span>{profile.industry}</span>
                </div>
              )}
              {profile.school && (
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-custom-cyan" />
                  <span>{profile.school}</span>
                </div>
              )}
              {profile.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-custom-cyan" />
                  <span>{profile.location}</span>
                </div>
              )}
              {profile.website && (
                <div className="flex items-center gap-2 md:col-span-2">
                  <LinkIcon className="h-5 w-5 text-custom-cyan" />
                  <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-custom-cyan hover:underline truncate">{profile.website}</a>
                </div>
              )}
            </div>

            <div className="mb-4">
              <h2 className="text-xl font-semibold text-custom-cyan mb-2">Skills</h2>
              <div className="flex flex-wrap gap-2">
                {profile.skills.map(skill => (
                  <span key={skill} className="bg-custom-cyan/20 text-custom-cyan px-3 py-1 rounded-full text-sm">{skill}</span>
                ))}
              </div>
            </div>
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-custom-cyan mb-2">Posted Projects</h2>
              <ul className="list-disc list-inside text-neutral-300">
                {profile.postedProjects.map(p => (
                  <li key={p.id}>
                    <Link to={`/projects/${p.id}`} className="hover:underline text-custom-cyan">{p.title}</Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-custom-cyan mb-2">Reviews</h2>
              {profile.reviews.length === 0 ? (
                <p className="text-neutral-400">No reviews yet.</p>
              ) : (
                <ul className="space-y-4">
                  {profile.reviews.map(r => (
                    <li key={r.id} className="bg-neutral-800 rounded p-4">
                      <div className="flex items-center gap-2 mb-1">
                        {r.reviewerId ? (
                          <Link to={`/students/${r.reviewerId}`} className="font-semibold text-custom-cyan hover:underline">{r.reviewerName}</Link>
                        ) : (
                          <span className="font-semibold">{r.reviewerName}</span>
                        )}
                        <span className="flex">
                          {/* Show stars */}
                          {Array.from({ length: 5 }, (_, i) => (
                            <svg
                              key={i}
                              className={`h-5 w-5 ${i < r.rating ? 'text-yellow-400 fill-yellow-400' : 'text-neutral-600'}`}
                              fill={i < r.rating ? 'currentColor' : 'none'}
                              viewBox="0 0 24 24"
                            >
                              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                            </svg>
                          ))}
                        </span>
                      </div>
                      {/* Meta: project and date */}
                      {(r.project || r.created_at) && (
                        <div className="text-xs text-neutral-400 mb-2 flex flex-wrap gap-3">
                          {r.project && (
                            <span>
                              Project: {r.project.title ? (
                                <Link className="text-custom-cyan hover:underline" to={`/projects/${r.project.id}`}>{r.project.title}</Link>
                              ) : (
                                <Link className="text-custom-cyan hover:underline" to={`/projects/${r.project.id}`}>{r.project.id}</Link>
                              )}
                              {r.project.status ? (
                                <span className="ml-2 inline-block rounded bg-neutral-700 px-2 py-0.5 text-[10px] uppercase tracking-wide">{r.project.status}</span>
                              ) : null}
                            </span>
                          )}
                          {r.created_at && (
                            <span>Reviewed: {new Date(r.created_at).toLocaleDateString()}</span>
                          )}
                        </div>
                      )}
                      {r.feedback && <div className="text-neutral-300">{r.feedback}</div>}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default FounderProfile;
