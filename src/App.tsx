import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Projects from './pages/Projects';
import ProjectDetails from './pages/founders/ProjectDetails';
// import Profile from './pages/Profile';
import SignUp from './pages/auth/SignUp';
import SignIn from './pages/auth/SignIn';
import Startups from './pages/founders/Startups';
import StartupDetails from './pages/founders/StartupDetails';
import Resources from './pages/students/Resources';
import About from './pages/About';
import CommunityPage from './pages/Community';
import FounderDashboard from './pages/founders/FounderDashboard';
import PostProject from './pages/founders/PostProject';
import StudentDashboard from './pages/students/StudentDashboard';
import Settings from './pages/auth/Settings';
import UnderConstruction from './pages/UnderConstruction';
// import Dashboard from './pages/Dashboard';
// import Messages from './pages/Messages';

import { SpeedInsights } from "@vercel/speed-insights/react";
import { Analytics } from "@vercel/analytics/react";



import { useAuth } from './contexts/AuthContext';

function PrivateRoute({ children }: { children: React.ReactElement }) {
  const { session, loading } = useAuth();
  if (loading) return <div className="min-h-screen bg-black text-white flex items-center justify-center">Loading…</div>;
  if (!session) return <SignIn />;
  return children;
}

function App() {
  return (
    <Router>
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/projects" element={<PrivateRoute><Projects /></PrivateRoute>} />
            <Route path="/projects/:id" element={<PrivateRoute><ProjectDetails /></PrivateRoute>} />
            <Route path="/startups" element={<PrivateRoute><Startups /></PrivateRoute>} />
            <Route path="/startups/:id" element={<StartupDetails />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/about" element={<About />} />
            <Route path="/community" element={<UnderConstruction />} />

            <Route path="/founder-dashboard" element={<PrivateRoute><FounderDashboard/></PrivateRoute>} />
            <Route path="/post-project" element={<PrivateRoute><PostProject /></PrivateRoute>} />

            <Route path="/student-dashboard" element={<PrivateRoute><StudentDashboard /></PrivateRoute>} />
            <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />

            {/* <Route 
              path="/projects" 
              element={
                <PrivateRoute>
                  <Projects />
                </PrivateRoute>
              } 
            /> */}
            {/* <Route 
              path="/projects/:id" 
              element={
                <PrivateRoute>
                  <ProjectDetails />
                </PrivateRoute>
              } 
            /> */}

            {/* <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} /> */}
            {/* <Route 
              path="/profile" 
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              } 
            />            */}
          </Routes>
        </main>
  {/* <Footer /> */}
  {/* <SpeedInsights /> */}
  {/* <Analytics /> */}
        
        <SpeedInsights />
        <Analytics />
    </Router>
  );
}

export default App;