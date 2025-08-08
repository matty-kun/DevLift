export interface Project {
  id: string;
  title: string;
  description: string;
  mentorId: string;
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
