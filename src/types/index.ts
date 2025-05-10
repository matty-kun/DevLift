export type UserRole = 'student' | 'mentor';

export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    avatar?: string;
    bio?: string;
    location?: string;
    skills?: string[];
    createdAt: Date;
}

export interface Student extends User {
    role: 'student';
    education?: Education[];
    experience?: Experience[];
    projects?: string[];
    applications?: string[];
}

export interface Mentor extends User {
    role: 'mentor';
    company?: string;
    position?: string;
    expertise?: string[];
    projects?: string[];
}

export interface Education {
    id: string;
    institution: string;
    degree: string;
    field: string;
    startDate: Date;
    endDate?: Date;
    current: boolean;
    description?: string;
}

export interface Experience {
    id: string;
    company: string;
    position: string;
    startDate: Date;
    endDate?: Date;
    current: boolean;
    description?: string;
}

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
    deadline?: Date;
}

export interface Application {
    id: string; 
    projectedId: string;
    studentId: string;
    coverLetter: string;
    status: 'pending' | 'accepted' | 'rejected';
    createdAt: Date;
}

export interface Message {
    id: string;
    senderId: string;
    receiverId: string;
    content: string;
    read: boolean;
    createdAt: Date;
}

