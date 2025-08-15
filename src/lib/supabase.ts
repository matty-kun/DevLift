import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

if (!supabaseUrl || !supabaseAnonKey) {
	throw new Error('Missing Supabase configuration. Ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set.');
}

// Dynamic storage that can switch between sessionStorage and localStorage
// based on a small flag we control in the app (DEVLIFT_AUTH_STORAGE: 'session' | 'local').
const STORAGE_FLAG_KEY = 'DEVLIFT_AUTH_STORAGE';
const STORAGE_MODE_SESSION = 'session';
const resolveStorage = (): Storage =>
	(typeof window !== 'undefined' && window.localStorage.getItem(STORAGE_FLAG_KEY) === STORAGE_MODE_SESSION)
		? window.sessionStorage
		: window.localStorage;

const dynamicStorage = {
	getItem(key: string) {
		return resolveStorage().getItem(key);
	},
	setItem(key: string, value: string) {
		resolveStorage().setItem(key, value);
	},
	removeItem(key: string) {
		resolveStorage().removeItem(key);
	},
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
	auth: {
		persistSession: true,
		autoRefreshToken: true,
		detectSessionInUrl: true,
		storage: dynamicStorage,
		storageKey: 'devlift.auth',
	},
});