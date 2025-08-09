/* eslint react-refresh/only-export-components: "off" */
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Session as SupabaseSession, AuthChangeEvent } from '@supabase/supabase-js';

type Session = SupabaseSession | null;

type Profile = {
	id: string;
	role?: string; // 'student' | 'mentor' | 'founder' | 'admin' | ... (db enum may vary per migration)
	full_name?: string;
	avatar_url?: string | null;
};

type AuthContextType = {
	session: Session | null;
	profile: Profile | null;
	loading: boolean;
	signUp: (email: string, password: string, role?: string, fullName?: string) => Promise<void>;
	signIn: (email: string, password: string) => Promise<void>;
	signInWithProvider: (provider: 'google' | 'facebook' | 'github') => Promise<void>;
	signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [session, setSession] = useState<Session | null>(null);
	const [profile, setProfile] = useState<Profile | null>(null);
	const [loading, setLoading] = useState(true);

	// Bootstrap session
		useEffect(() => {
		let mounted = true;
		(async () => {
			const { data } = await supabase.auth.getSession();
			if (!mounted) return;
				setSession(data.session ?? null);
			setLoading(false);
		})();
			const { data: sub } = supabase.auth.onAuthStateChange((
				_event: AuthChangeEvent,
				newSession: SupabaseSession | null
			) => {
				setSession(newSession);
		});
		return () => {
			mounted = false;
			sub.subscription.unsubscribe();
		};
	}, []);

	// Load profile when session changes
	useEffect(() => {
		let active = true;
		const load = async () => {
			if (!session?.user) {
				setProfile(null);
				return;
			}
			const { data, error } = await supabase
				.from('users')
				.select('id, role, full_name, avatar_url')
				.eq('id', session.user.id)
				.maybeSingle();
			if (!active) return;
			if (error) {
				// If profile row doesn't exist yet, keep null; app can handle
				setProfile(null);
				return;
			}
			setProfile((data as Profile) ?? null);
		};
		load();
		return () => {
			active = false;
		};
		}, [session?.user?.id, session?.user]);

		const signUp = async (
			email: string,
			password: string,
			role?: string,
			fullName?: string,
		) => {
			const { error } = await supabase.auth.signUp({
				email,
				password,
				options: {
					data: {
						// pass metadata for DB trigger to consume if present
						...(role ? { role } : {}),
						...(fullName ? { full_name: fullName } : {}),
					},
				},
			});
			if (error) throw error;
		};

		const signIn = async (email: string, password: string) => {
		const { error } = await supabase.auth.signInWithPassword({
			email,
			password,
		});
		if (error) throw error;
	};

	const signOut = async () => {
		await supabase.auth.signOut();
	};

	const signInWithProvider = async (provider: 'google' | 'facebook' | 'github') => {
		const redirectTo = `${window.location.origin}/sign-in`;
		const scopes = provider === 'github' ? 'read:user user:email' : provider === 'google' ? 'email profile' : 'email';
		const { error } = await supabase.auth.signInWithOAuth({
			provider,
			options: { redirectTo, scopes }
		});
		if (error) throw error;
	};

		const value = useMemo<AuthContextType>(() => ({ session, profile, loading, signUp, signIn, signInWithProvider, signOut }), [session, profile, loading]);

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
	const ctx = useContext(AuthContext);
	if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
	return ctx;
};

