import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

const Onboarding: React.FC = () => {
  const navigate = useNavigate();
  const { session } = useAuth();
  const [submitting, setSubmitting] = useState(false);

  const choose = async (role: 'student' | 'founder') => {
    if (!session?.user?.id) return;
    setSubmitting(true);
    try {
      // Upsert profile row with chosen role if missing; otherwise update only role
      const { error } = await supabase
        .from('users')
        .upsert({ id: session.user.id, role }, { onConflict: 'id' });
      if (error) throw error;
      navigate(role === 'founder' ? '/founder-dashboard' : '/student-dashboard', { replace: true });
    } catch (e) {
      console.error(e);
      alert('Failed to save your role');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-neutral-900 border border-neutral-800 rounded-xl p-6">
        <h1 className="text-2xl font-bold mb-4">Choose your role</h1>
        <p className="text-neutral-400 mb-6">We couldn't detect your role from the provider. Pick how you want to use DevLift.</p>
        <div className="grid grid-cols-1 gap-3">
          <button disabled={submitting} onClick={() => choose('student')} className="bg-custom-cyan text-black px-4 py-2 rounded hover:brightness-110 disabled:opacity-60">I'm a Student</button>
          <button disabled={submitting} onClick={() => choose('founder')} className="bg-custom-orange text-black px-4 py-2 rounded hover:brightness-110 disabled:opacity-60">I'm a Founder</button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
