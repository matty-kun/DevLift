// New file content for testing
import { supabase } from './src/lib/supabase.ts';

async function testAuth() {
  const { data, error } = await supabase.auth.signInWithPassword({ email: 'test@example.com', password: 'testpassword' });  // Use a test user if available
  console.log('Auth Data:', data, 'Auth Error:', error);
}

testAuth(); 