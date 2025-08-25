import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { User, Briefcase } from 'lucide-react';

const Onboarding: React.FC = () => {
	const { setUserRole, profile, session, loading } = useAuth();
	const navigate = useNavigate();

	React.useEffect(() => {
		if (loading) return;
		if (!session) {
			navigate('/sign-in', { replace: true });
			return;
		}
		if (profile?.role) {
			// Already have role, redirect accordingly
			navigate(profile.role === 'mentor' ? '/founder-dashboard' : '/student-dashboard', { replace: true });
		}
	}, [loading, session, profile?.role, navigate]);

	const choose = async (role: 'student' | 'founder') => {
		await setUserRole(role);
		navigate(role === 'founder' ? '/founder-dashboard' : '/student-dashboard', { replace: true });
	};

	return (
		<div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
			<div className="max-w-lg w-full space-y-8">
				<div className="text-center space-y-2">
					<h1 className="text-3xl font-bold"><span className="text-custom-cyan">Choose</span> Your Role</h1>
					<p className="text-neutral-400 text-sm">Tell us how you want to use the platform. You can request changes later.</p>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<button onClick={() => choose('student')} className="group border border-neutral-700 rounded-xl p-6 text-left hover:border-custom-purple transition bg-neutral-900">
						<User className="h-8 w-8 text-custom-purple mb-4" />
						<h2 className="font-semibold mb-1">I'm a Student</h2>
						<p className="text-xs text-neutral-400 leading-relaxed">Find real projects, learn by building, and collaborate with mentors.</p>
					</button>
					<button onClick={() => choose('founder')} className="group border border-neutral-700 rounded-xl p-6 text-left hover:border-custom-orange transition bg-neutral-900">
						<Briefcase className="h-8 w-8 text-custom-orange mb-4" />
						<h2 className="font-semibold mb-1">I'm a Founder / Mentor</h2>
						<p className="text-xs text-neutral-400 leading-relaxed">Post startup ideas, get student help, and mentor future builders.</p>
					</button>
				</div>
				<p className="text-center text-neutral-600 text-xs">Need help deciding? Start as a student—you can mentor later.</p>
			</div>
		</div>
	);
};

export default Onboarding;
