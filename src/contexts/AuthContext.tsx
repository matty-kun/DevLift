/* eslint react-refresh/only-export-components: "off" */
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Session as SupabaseSession, AuthChangeEvent } from '@supabase/supabase-js';

type Session = SupabaseSession | null;

type Profile = {
	id: string;
	role?: 'student' | 'founder' | 'admin'; // Removed 'mentor'
	full_name?: string;
	bio?: string; // Added bio
	avatar_url?: string | null;
	onboarding_completed?: boolean;
	onboarding_step?: number;
};

type AuthContextType = {
	session: Session | null;
	profile: Profile | null;
	loading: boolean; // session loading
	profileLoading: boolean; // profile (users row) loading
	signUp: (email: string, password: string, role?: string, fullName?: string) => Promise<void>;
	signIn: (email: string, password: string) => Promise<void>;
	signInWithProvider: (provider: 'google' | 'facebook' | 'github') => Promise<void>;
	signOut: () => Promise<void>;
	setUserRole: (role: 'student' | 'founder') => Promise<void>;
	refreshProfile: () => Promise<void>;
	checkMFAStatus: () => { currentLevel: string; nextLevel: string; needsVerification: boolean };
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [session, setSession] = useState<Session | null>(null);
	const [profile, setProfile] = useState<Profile | null>(null);
	const [loading, setLoading] = useState(true);
	const [profileLoading, setProfileLoading] = useState(true);

	// Bootstrap session
		useEffect(() => {
		let mounted = true;
		(async () => {
			const { data } = await supabase.auth.getSession();
			if (!mounted) return;
				setSession(data.session ?? null);
			setLoading(false);
		})();
			const { data: sub } = supabase.auth.onAuthStateChange(async (
				event: AuthChangeEvent,
				newSession: SupabaseSession | null
			) => {
				setSession(newSession);

				// Log login event when user signs in (non-blocking)
				if (event === 'SIGNED_IN' && newSession?.user) {
					// Run login tracking in background without blocking sign-in
					(async () => {
						try {
							// Get user agent from browser
							const userAgent = navigator.userAgent;

							// Fetch IP and location from ipapi.co (free, no API key needed)
							let ipAddress = null;
							let location = null;

							try {
								const ipResponse = await fetch('https://ipapi.co/json/');
								if (ipResponse.ok) {
									const ipData = await ipResponse.json();
									ipAddress = ipData.ip || null;

									// Format location as "City, Region, Country"
									const parts = [];
									if (ipData.city) parts.push(ipData.city);
									if (ipData.region) parts.push(ipData.region);
									if (ipData.country_name) parts.push(ipData.country_name);
									location = parts.length > 0 ? parts.join(', ') : null;
								}
							} catch (ipError) {
								console.warn('Failed to fetch IP location:', ipError);
								// Continue without IP/location data
							}

							// Call the database function to log the login
							const { error } = await supabase.rpc('log_login_event', {
								p_user_id: newSession.user.id,
								p_ip_address: ipAddress,
								p_user_agent: userAgent,
								p_location: location
							});

							if (error) {
								console.error('Failed to log login event:', error);
							}
						} catch (error) {
							console.error('Failed to log login event:', error);
						}
					})();
				}
		});
		return () => {
			mounted = false;
			sub.subscription.unsubscribe();
		};
	}, []);

	// Load profile when session changes
	useEffect(() => {
		let active = true;
		setProfileLoading(true);
		const load = async () => {
			if (!session?.user) {
				setProfile(null);
				setProfileLoading(false);
				return;
			}
			const { data, error } = await supabase
				.from('users')
				.select('id, role, full_name, avatar_url, onboarding_completed, onboarding_step')
				.eq('id', session.user.id)
				.maybeSingle();
			if (!active) return;
			if (error) {
				// If profile row doesn't exist yet, keep null; app can handle
				setProfile(null);
				setProfileLoading(false);
				return;
			}
			const prof = (data as Profile) ?? null;
			if (prof) setProfile(prof); else {
				// Do NOT auto-create when no metadata role (OAuth first login) – onboarding will handle.
				const metaRole = (session.user.user_metadata as { role?: string } | undefined)?.role;
				if (metaRole) {
					try {
						const mappedRole = metaRole === 'founder' ? 'founder' : 'student';
						const fallbackName = (session.user.user_metadata as { full_name?: string } | undefined)?.full_name
							|| (session.user.email?.split('@')[0] ?? 'User');
						await supabase.from('users').insert({ id: session.user.id, role: mappedRole, full_name: fallbackName });
						const { data: reload } = await supabase
							.from('users')
							.select('id, role, full_name, avatar_url, onboarding_completed, onboarding_step')
							.eq('id', session.user.id)
							.maybeSingle();
						setProfile((reload as Profile) ?? null);
					} catch { /* ignore */ }
				} else {
					setProfile(null);
				}
			}

			// Reconcile role with auth user metadata ONLY if DB role is missing.
			// This avoids overwriting a deliberate DB role (e.g., changing 'founder' -> 'mentor').
			try {
				const metaRole = (session.user.user_metadata as { role?: string } | undefined)?.role;
				if (metaRole && (!prof?.role || prof.role.trim().length === 0)) {
					await supabase
						.from('users')
						.update({ role: metaRole })
						.eq('id', session.user.id);
					// optimistic update
					setProfile((p) => (p ? { ...p, role: metaRole } : p));
				}
			} catch {
				// ignore; RLS or other issues will just keep existing role
			}
			setProfileLoading(false);
		};
		load();
		return () => {
			active = false;
		};
		}, [session?.user?.id]); // Only depend on user ID, not the entire user object

		const signUp = async (
			email: string,
			password: string,
			role?: string,
			fullName?: string,
		) => {
			// Derive safe display name (we never store email in public.users)
			const safeName = (fullName && fullName.trim().length > 0)
				? fullName.trim()
				: (email.includes('@') ? email.split('@')[0] : email);
			// Map founder -> founder (no longer mapping to mentor)
			const mappedRole = role === 'founder' ? 'founder' : (role || 'student');
			const { data: signUpData, error } = await supabase.auth.signUp({
				email,
				password,
				options: {
					emailRedirectTo: `${window.location.origin}/sign-in`,
					data: { role: mappedRole, full_name: safeName },
				},
			});
			if (error) throw error;
			// If signup immediately returns a session/user (no email confirmation required),
			// proactively create profile row (id, role, full_name only). Ignore conflicts.
			try {
				if (signUpData?.user) {
					await supabase.from('users').insert({
						id: signUpData.user.id,
						role: mappedRole,
						full_name: safeName,
					});
				}
			} catch {
				// Ignore (could be email-confirm flow or RLS until session established)
			}
		};

	const signIn = async (email: string, password: string) => {
		const { error } = await supabase.auth.signInWithPassword({
			email,
			password,
		});
		if (error) throw error;
	};

	const checkMFAStatus = React.useCallback(() => {
		const { currentLevel, nextLevel } = supabase.auth.mfa.getAuthenticatorAssuranceLevel();
		return {
			currentLevel,
			nextLevel,
			needsVerification: currentLevel === 'aal1' && nextLevel === 'aal2',
		};
	}, []);

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

	const setUserRole = React.useCallback(async (role: 'student' | 'founder') => {
		if (!session?.user) return;
		const mapped = role; // No longer mapping founder to mentor
		await supabase.from('users').upsert({ id: session.user.id, role: mapped }, { onConflict: 'id' });
		try { await supabase.auth.updateUser({ data: { role: mapped } }); } catch { /* ignore */ }
		setProfile(p => p ? { ...p, role: mapped } : { id: session.user!.id, role: mapped });
	}, [session?.user]);

	const refreshProfile = React.useCallback(async () => {
		if (!session?.user) return;
		setProfileLoading(true);
		const { data, error } = await supabase
			.from('users')
			.select('id, role, full_name, avatar_url, onboarding_completed, onboarding_step')
			.eq('id', session.user.id)
			.maybeSingle();
		if (error) {
			console.error('Error refreshing profile:', error);
			setProfile(null);
		} else {
			setProfile((data as Profile) ?? null);
		}
		setProfileLoading(false);
	}, [session?.user]);

	const value = useMemo<AuthContextType>(() => ({ session, profile, loading, profileLoading, signUp, signIn, signInWithProvider, signOut, setUserRole, refreshProfile, checkMFAStatus }), [session, profile, loading, profileLoading, setUserRole, refreshProfile, checkMFAStatus]);

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
	const ctx = useContext(AuthContext);
	if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
	return ctx;
};

