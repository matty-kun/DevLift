import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

export async function testAuth() {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email: 'testing@example.com', password: 'testpassword' });
    console.log('Auth Test Result:', { data, error });
    return { data, error };
  } catch (err) {
    console.error('Auth Test Error:', err);
    return { error: err };
  }
}