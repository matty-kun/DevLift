import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

export type UserType = 'student' | 'founder';

interface AuthContextType {
    user: User | null;
    userType: UserType | null;
    loading: boolean;
    signIn: (email: string, password: string) => Promise<void>;
    signUp: (email: string, password: string, userType: UserType) => Promise<void>;
    signOut: () => Promise<void>;
    updateUserType: (userType: UserType) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [userType, setUserType] = useState<UserType | null>(null);
    const [loading, setLoading] = useState(true);

    // Load user type from local storage
    useEffect(() => {
        const loadUserType = async () => {
            if (user) {
                try {
                    // First try to get from Supabase
                    const { data, error } = await supabase
                        .from('user_profiles')
                        .select('user_type')
                        .eq('id', user.id)
                        .single();
                    
                    if (data && data.user_type) {
                        setUserType(data.user_type as UserType);
                        // Cache in localStorage
                        localStorage.setItem('userType', data.user_type);
                    } else {
                        // Fallback to localStorage
                        const storedUserType = localStorage.getItem('userType') as UserType | null;
                        if (storedUserType) {
                            setUserType(storedUserType);
                        }
                    }
                } catch (error) {
                    console.error('Error loading user type:', error);
                }
            } else {
                setUserType(null);
            }
        };

        loadUserType();
    }, [user]);

    useEffect(() => {
        // Check active sessions and sets the user
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
            setLoading(false);
        });
    

        // Listen for changes on auth state
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const signIn = async (email: string, password: string) => {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
    };

    const signUp = async (email: string, password: string, userType: UserType) => {
        const { data, error } = await supabase.auth.signUp({ 
            email, 
            password,
            options: {
                data: {
                    user_type: userType
                }
            }
        });
        
        if (error) throw error;
        
        if (data.user) {
            // Store user type in a separate table for easier querying
            await supabase.from('user_profiles').upsert({
                id: data.user.id,
                user_type: userType,
                created_at: new Date().toISOString(),
            });
            
            // Also store in localStorage for quick access
            localStorage.setItem('userType', userType);
            setUserType(userType);
        }
    };

    const updateUserType = async (newUserType: UserType) => {
        if (!user) throw new Error('User must be logged in to update user type');
        
        const { error } = await supabase
            .from('user_profiles')
            .upsert({
                id: user.id,
                user_type: newUserType,
                updated_at: new Date().toISOString(),
            });
            
        if (error) throw error;
        
        localStorage.setItem('userType', newUserType);
        setUserType(newUserType);
    };

    const signOut = async () => {
        localStorage.removeItem('userType');
        setUserType(null);
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
    };

    return (
        <AuthContext.Provider value={{ user, userType, loading, signIn, signUp, signOut, updateUserType }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
