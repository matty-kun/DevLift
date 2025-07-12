import { createContext, useContext } from 'react';

interface UserProfile {
    name?: string;
    email?: string;
    userType?: 'student' | 'founder';
    resume?: string;  // For simple text or URL to CV
    skills?: string[];  // Array of strings for skills
    links?: { name: string; url: string }[];  // Array of objects for links
    projects?: { title: string; status: string; role: string }[];  // Array of objects for projects
}

interface AuthContextType {
    loading: boolean;
    userProfile: UserProfile;
    setUserProfile: (profile: UserProfile) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};