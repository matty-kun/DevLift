import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Projects from './pages/Projects';
import ProjectDetails from './pages/ProjectDetails';
// import Profile from './pages/Profile';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import Startups from './pages/Startups';
import StartupDetails from './pages/StartupDetails';
import FounderDashboard from './pages/FounderDashboard';
import StudentDashboard from './pages/StudentDashboard';
// import Dashboard from './pages/Dashboard';
// import Messages from './pages/Messages';
// import Settings from './ pages/Settings';


function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-black">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/:id" element={<ProjectDetails />} />
            <Route path="/startups" element={<Startups />} />
            <Route path="/startups/:id" element={<StartupDetails />} />
            <Route path="/founder-dashboard" element={<FounderDashboard />} />
            <Route path="/student-dashboard" element={<StudentDashboard />} />
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
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/sign-up" element={<SignUp />} />
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
      </div>
    </Router>
  );
}

export default App;