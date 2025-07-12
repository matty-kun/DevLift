<<<<<<< HEAD
import React, { createContext, useState, useEffect } from 'react';
=======
import React, { useState, useEffect } from 'react';
import { AuthContext } from '../hooks/useAuth';
>>>>>>> project-details

interface UserProfile {
    name?: string;
    email?: string;
    userType?: 'student' | 'founder';
    resume?: string;  // For simple text or URL to CV
    skills?: string[];  // Array of strings for skills
    links?: { name: string; url: string }[];  // Array of objects for links
    projects?: { title: string; status: string; role: string }[];  // Array of objects for projects
}

<<<<<<< HEAD
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

=======
>>>>>>> project-details
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [loading] = useState(true);
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
