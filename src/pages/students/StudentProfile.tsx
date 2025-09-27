import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { getUserReviewsReceived, getUserRatingSummary } from '../../lib/feedback';
import { useAuth } from '../../contexts/AuthContext';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import BackButton from '../../components/common/BackButton';
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

const StudentProfile: React.FC = () => {
  const { id: paramId } = useParams();
  const { session } = useAuth();
  const userId = paramId || session?.user?.id || '';

  const [profile, setProfile] = React.useState({
    name: 'Student',
    avatar_url: 'https://api.dicebear.com/7.x/identicon/svg?seed=student',
    bio: 'Aspiring developer passionate about web and AI.',
    skills: ['React', 'Node.js', 'Python'],
    completedProjects: [] as { id: string; title: string }[],
    reviews: [] as ReviewItem[],
    avg: null as number | null,
    count: 0,
  });

  React.useEffect(() => {
    let active = true;
    if (!userId) return;
    (async () => {
      // Load reviews, summary, and user profile concurrently
      const [reviewsRes, summaryRes, userRes] = await Promise.all([
        getUserReviewsReceived(userId),
        getUserRatingSummary(userId),
        supabase.from('users').select('full_name, avatar_url').eq('id', userId).maybeSingle(),
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
      const user = userRes.data as { full_name?: string | null; avatar_url?: string | null } | null;
      setProfile(p => ({
        ...p,
        name: user?.full_name || p.name,
        avatar_url: user?.avatar_url || p.avatar_url,
        reviews: mapped,
        avg: summary?.avg_rating ?? null,
        count: summary?.reviews_count ?? 0,
      }));
    })();
    return () => { active = false; };
  }, [userId]);

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <main className="pt-24 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="mb-4">
            {paramId && session?.user?.id && session.user.id !== paramId ? (
              <BackButton to={`/students/${session.user.id}`} text="Back to My Profile" className="px-2 py-1" />
            ) : (
              <BackButton to="/student-dashboard" text="Back to Dashboard" className="px-2 py-1" />
            )}
          </div>
          <div className="bg-neutral-900 rounded-lg p-8">
            <div className="flex items-center gap-6 mb-6">
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
              <h2 className="text-xl font-semibold text-custom-cyan mb-2">Completed Projects</h2>
              <ul className="list-disc list-inside text-neutral-300">
                {profile.completedProjects.map(p => (
                  <li key={p.id}>{p.title}</li>
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

export default StudentProfile;