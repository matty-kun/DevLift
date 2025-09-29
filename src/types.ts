export interface Project {
  id: string;
  title: string;
  description: string;
  mentorId: string;
  mentor?: { id: string; full_name?: string | null; avatar_url?: string | null } | null;
  skills: string[];
  duration: string;
  status: 'open' | 'in-progress' | 'completed';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  maxStudents: number;
  assignedStudents: string[];
  applicants: string[];
  createdAt: Date;
  imageUrl: string;
}

export interface Review {
  id: string;
  project_id: string;
  reviewer_id: string;
  reviewee_id: string;
  rating: number; // 1..5
  feedback: string | null;
  created_at: string;
  updated_at: string;
}

export interface ReviewWithUsers extends Review {
  reviewer?: { id: string; full_name?: string | null; avatar_url?: string | null } | null;
  reviewee?: { id: string; full_name?: string | null; avatar_url?: string | null } | null;
}

export interface UserRatingSummary {
  user_id: string;
  avg_rating: number | null;
  reviews_count: number;
  last_review_at: string | null;
}
