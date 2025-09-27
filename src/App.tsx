import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Projects from './pages/Projects';
import ProjectDetails from './pages/founders/ProjectDetails';
import SignUp from './pages/auth/SignUp';
import SignIn from './pages/auth/SignIn';
import Startups from './pages/founders/Startups';
import StartupDetails from './pages/founders/StartupDetails';
import Resources from './pages/students/Resources';
import About from './pages/About';
import FounderDashboard from './pages/founders/FounderDashboard';
import PostProject from './pages/founders/PostProject';
import EditProject from './pages/founders/EditProject';
import StudentDashboard from './pages/students/StudentDashboard';
import StudentProfile from './pages/students/StudentProfile';
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

function PrivateRoute({ children }: { children: React.ReactElement }) {
  const { session, loading, profile, profileLoading } = useAuth();
  if (loading || profileLoading) return <LoadingScreen />;
  if (!session) return <SignIn />;
  if (!profile?.role) return <Onboarding />;
  return children;
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />

        {/* Routes with Main Layout (Navbar with actions) */}
        <Route element={<MainLayout />}>
          <Route path="/onboarding" element={<PrivateRoute><Onboarding /></PrivateRoute>} />
          <Route path="/projects" element={<PrivateRoute><Projects /></PrivateRoute>} />
          <Route path="/projects/:id" element={<PrivateRoute><ProjectDetails /></PrivateRoute>} />
          <Route path="/startups" element={<PrivateRoute><Startups /></PrivateRoute>} />
          <Route path="/startups/:id" element={<StartupDetails />} />
          <Route path="/resources" element={<PrivateRoute><Resources /></PrivateRoute>} />
          <Route path="/about" element={<PrivateRoute><About /></PrivateRoute>} />
          <Route path="/community" element={<PrivateRoute><UnderConstruction /></PrivateRoute>} />
          <Route path="/projects/:id/applications" element={<PrivateRoute><Applications /></PrivateRoute>} />
          <Route path="/founder-dashboard" element={<PrivateRoute><FounderDashboard/></PrivateRoute>} />
          <Route path="/founders/post-project" element={<PrivateRoute><PostProject /></PrivateRoute>} />
          <Route path="/founders/projects/:projectId/edit" element={<PrivateRoute><EditProject /></PrivateRoute>} />
          <Route path="/student-dashboard" element={<PrivateRoute><StudentDashboard /></PrivateRoute>} />
          <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
          <Route path="/people/:id" element={<PrivateRoute><StudentProfile /></PrivateRoute>} />
          <Route path="/founders/:id" element={<PrivateRoute><FounderProfile /></PrivateRoute>} />
        </Route>
      </Routes>
      <SpeedInsights />
      <Analytics />
    </Router>
  );
}

export default App;
