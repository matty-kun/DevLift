import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Projects from './pages/Projects';
import ProjectDetails from './pages/founders/ProjectDetails';
import SignUp from './pages/auth/SignUp';
import SignIn from './pages/auth/SignIn';
import MFAVerify from './pages/auth/MFAVerify';
import Startups from './pages/founders/Startups';
import Resources from './pages/students/Resources';
import About from './pages/About';
import FounderDashboard from './pages/founders/FounderDashboard';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import PostProject from './pages/founders/PostProject';
import EditProject from './pages/founders/EditProject';
import StudentDashboard from './pages/students/StudentDashboard';
import StudentProfile from './pages/students/StudentProfile';
import SearchPage from './pages/Search';
import FounderProfile from './pages/founders/FounderProfile';
import Settings from './pages/auth/Settings';
import UnderConstruction from './pages/UnderConstruction';
import Applications from './pages/founders/Applications';
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Analytics } from "@vercel/analytics/react";
import { useAuth } from './contexts/AuthContext';
import Onboarding from './pages/Onboarding';
import LoadingScreen from './components/common/LoadingScreen';
import MainLayout from './components/layout/MainLayout';
import StartupProfile from './pages/startups/StartupProfile';
import People from './pages/People'; // New import
import MFAProtectedRoute from './components/auth/MFAProtectedRoute';

import AccountActions from './components/layout/AccountActions';

// Legacy PrivateRoute - kept for backwards compatibility but not used
// Use MFAProtectedRoute instead
function PrivateRoute({ children }: { children: React.ReactElement }) {
  const { session, loading, profile, profileLoading } = useAuth();
  if (loading || profileLoading) return <LoadingScreen />;
  if (!session) return <Navigate to="/sign-in" replace />;

  // Redirect to onboarding if user has no role OR hasn't completed onboarding
  const needsOnboarding = !profile?.role || profile?.onboarding_completed === false;
  if (needsOnboarding) return <Navigate to="/onboarding" replace />;

  return children;
}

const App: React.FC = () => {
  const homeActionButtons = null;

  return (
    <Router>
      <Routes>
        {/* Public routes with public layout */}
        <Route element={<MainLayout actionButtons={homeActionButtons} showNavLinks={false} showFooter={true}><Outlet /></MainLayout>}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
        </Route>

        {/* Auth routes without layout */}
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/mfa-verify" element={<MFAVerify />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Onboarding route without layout (to prevent remounting) */}
        <Route path="/onboarding" element={<Onboarding />} />

        {/* Private routes with main layout - NOW MFA PROTECTED */}
        <Route element={<MainLayout actionButtons={<AccountActions />} showNavLinks={true} showFooter={true}><Outlet /></MainLayout>}>
          <Route path="/projects" element={<MFAProtectedRoute><Projects /></MFAProtectedRoute>} />
          <Route path="/projects/:id" element={<MFAProtectedRoute><ProjectDetails /></MFAProtectedRoute>} />
          <Route path="/startups" element={<MFAProtectedRoute><Startups /></MFAProtectedRoute>} />
          <Route path="/startups/:id" element={<MFAProtectedRoute><StartupProfile /></MFAProtectedRoute>} />
          <Route path="/resources" element={<MFAProtectedRoute><Resources /></MFAProtectedRoute>} />
          <Route path="/community" element={<MFAProtectedRoute><UnderConstruction /></MFAProtectedRoute>} />
          <Route path="/projects/:id/applications" element={<MFAProtectedRoute><Applications /></MFAProtectedRoute>} />
          <Route path="/founder-dashboard" element={<MFAProtectedRoute><FounderDashboard /></MFAProtectedRoute>} />
          <Route path="/founders/post-project" element={<MFAProtectedRoute><PostProject /></MFAProtectedRoute>} />
          <Route path="/founders/projects/:projectId/edit" element={<MFAProtectedRoute><EditProject /></MFAProtectedRoute>} />
          <Route path="/student-dashboard" element={<MFAProtectedRoute><StudentDashboard /></MFAProtectedRoute>} />
          <Route path="/settings" element={<MFAProtectedRoute><Settings /></MFAProtectedRoute>} />
          <Route path="/people/:id" element={<MFAProtectedRoute><StudentProfile /></MFAProtectedRoute>} />
          <Route path="/founders/:id" element={<MFAProtectedRoute><FounderProfile /></MFAProtectedRoute>} />
          <Route path="/search" element={<MFAProtectedRoute><SearchPage /></MFAProtectedRoute>} />
          <Route path="/people" element={<MFAProtectedRoute><People /></MFAProtectedRoute>} />
        </Route>
      </Routes>
      <SpeedInsights />
      <Analytics />
    </Router>
  );
}

export default App;
