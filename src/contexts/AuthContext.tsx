import React, { createContext, useContext, useState, useEffect } from 'react';

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

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const [userProfile, setUserProfileState] = useState<UserProfile>(() => {
        const savedProfile = localStorage.getItem('userProfile');
        return savedProfile ? JSON.parse(savedProfile) : {};
    });

    useEffect(() => {
        localStorage.setItem('userProfile', JSON.stringify(userProfile));
    }, [userProfile]);

    const setUserProfile = (profile: UserProfile) => {
        setUserProfileState(prev => ({ ...prev, ...profile }));
    };

    return (
        <AuthContext.Provider value={{ loading, userProfile, setUserProfile }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
