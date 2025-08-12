import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
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



function App() {
  return (
    <Router>
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/projects" element={<UnderConstruction />} />
            <Route path="/projects/:id" element={<UnderConstruction />} />
            <Route path="/startups" element={<UnderConstruction />} />
            <Route path="/startups/:id" element={<StartupDetails />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/about" element={<About />} />
            <Route path="/community" element={<UnderConstruction />} />

            <Route path="/founder-dashboard" element={<UnderConstruction />} />
            <Route path="/post-project" element={<UnderConstruction />} />

            <Route path="/student-dashboard" element={<UnderConstruction />} />
            <Route path="/settings" element={<UnderConstruction />} />

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
        <Footer />
        <SpeedInsights />
        <Analytics />
    </Router>
  );
}

export default App;