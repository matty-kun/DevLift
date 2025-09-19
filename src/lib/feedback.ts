import { supabase } from './supabase';
import type { Review, ReviewWithUsers, UserRatingSummary } from '../types';

// Contract:
// - rating: 1..5 integer
// - Only one review per reviewer->reviewee per project (upsert)
// - Both students and mentors can review each other after engagement (accepted application)

export async function addOrUpdateReview(input: {
  projectId: string;
  revieweeId: string;
  rating: number;
  feedback?: string;
}): Promise<{ data: Review | null; error: string | null }>{
  const { data: { user }, error: authErr } = await supabase.auth.getUser();
  if (authErr || !user) return { data: null, error: 'Not authenticated' };
  const payload = {
    project_id: input.projectId,
    reviewer_id: user.id,
    reviewee_id: input.revieweeId,
    rating: Math.max(1, Math.min(5, Math.round(input.rating))),
    feedback: input.feedback ?? null,
  };
  const { data, error } = await supabase
    .from('reviews')
    .upsert(payload, { onConflict: 'project_id,reviewer_id,reviewee_id' })
    .select()
    .single();
  return { data: (data as Review) ?? null, error: error?.message ?? null };
}

export async function getProjectReviews(projectId: string): Promise<{ data: ReviewWithUsers[]; error: string | null }>{
  type RowUser = { id: string; full_name?: string | null; avatar_url?: string | null };
  type Row = Review & { reviewer: RowUser | RowUser[] | null; reviewee: RowUser | RowUser[] | null };
  const { data, error } = await supabase
    .from('reviews')
    .select('id, project_id, reviewer_id, reviewee_id, rating, feedback, created_at, updated_at, reviewer:reviewer_id(id, full_name, avatar_url), reviewee:reviewee_id(id, full_name, avatar_url)')
    .eq('project_id', projectId)
    .order('created_at', { ascending: false });
  const rows: ReviewWithUsers[] | undefined = (data as Row[] | null)?.map((r) => ({
    id: r.id,
    project_id: r.project_id,
    reviewer_id: r.reviewer_id,
    reviewee_id: r.reviewee_id,
    rating: r.rating,
    feedback: r.feedback,
    created_at: r.created_at,
    updated_at: r.updated_at,
    reviewer: Array.isArray(r.reviewer) ? r.reviewer[0] : r.reviewer,
    reviewee: Array.isArray(r.reviewee) ? r.reviewee[0] : r.reviewee,
  }));
  return { data: rows ?? [], error: error?.message ?? null };
}

export async function getUserReviewsReceived(userId: string): Promise<{ data: (ReviewWithUsers & { project?: { id: string; title?: string | null; status?: string | null } | null })[]; error: string | null }>{
  type RowUser = { id: string; full_name?: string | null; avatar_url?: string | null };
  type RowProject = { id: string; title?: string | null; status?: string | null; created_at?: string };
  type Row = Review & { reviewer: RowUser | RowUser[] | null; project: RowProject | RowProject[] | null };
  const { data, error } = await supabase
    .from('reviews')
    .select('id, project_id, reviewer_id, reviewee_id, rating, feedback, created_at, updated_at, reviewer:reviewer_id(id, full_name, avatar_url), project:project_id(id, title, status)')
    .eq('reviewee_id', userId)
    .order('created_at', { ascending: false });
  const rows: (ReviewWithUsers & { project?: { id: string; title?: string | null; status?: string | null } | null })[] | undefined = (data as Row[] | null)?.map((r) => ({
    id: r.id,
    project_id: r.project_id,
    reviewer_id: r.reviewer_id,
    reviewee_id: r.reviewee_id,
    rating: r.rating,
    feedback: r.feedback,
    created_at: r.created_at,
    updated_at: r.updated_at,
    reviewer: Array.isArray(r.reviewer) ? r.reviewer[0] : r.reviewer,
    project: Array.isArray(r.project) ? r.project[0] : r.project,
  }));
  return { data: rows ?? [], error: error?.message ?? null };
}

export async function getMyReviewForProject(projectId: string, otherUserId: string): Promise<{ data: Review | null; error: string | null }>{
  const { data: { user }, error: authErr } = await supabase.auth.getUser();
  if (authErr || !user) return { data: null, error: 'Not authenticated' };
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .match({ project_id: projectId, reviewer_id: user.id, reviewee_id: otherUserId })
    .maybeSingle();
  return { data: (data as Review) ?? null, error: error?.message ?? null };
}

export async function getUserRatingSummary(userId: string): Promise<{ data: UserRatingSummary | null; error: string | null }>{
  const { data, error } = await supabase
    .from('user_ratings_summary')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();
  return { data: (data as UserRatingSummary) ?? null, error: error?.message ?? null };
}

export function subscribeToProjectReviews(projectId: string, cb: (payload: { type: 'INSERT'|'UPDATE'|'DELETE'; new?: Review; old?: Review }) => void) {
  const channel = supabase
    .channel(`reviews:${projectId}`)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'reviews', filter: `project_id=eq.${projectId}` }, (payload) => {
      cb({ type: payload.eventType as 'INSERT'|'UPDATE'|'DELETE', new: payload.new as Review, old: payload.old as Review });
    })
    .subscribe();
  return () => { supabase.removeChannel(channel); };
}
