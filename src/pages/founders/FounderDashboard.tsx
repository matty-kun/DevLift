import React from 'react';
import { Link } from 'react-router-dom';
import { Bell, User } from 'lucide-react';

const FounderDashboard: React.FC = () => {
  // Placeholder data
  const founderName = "Alex"; // Replace with real data later
  const recentActivity = [
    "You posted a new project: AI Chatbot",
    "3 students applied to 'Landing Page Redesign'",
    "Project 'Landing Page Redesign' marked as completed"
  ];
  const projects = [
    { name: "AI Chatbot", status: "Open", applicants: 2 },
    { name: "Landing Page Redesign", status: "Completed", applicants: 3 }
  ];

  return (
    <div className="min-h-screen bg-black text-white px-4 py-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="bg-neutral-800 rounded-full p-2">
              <User className="h-8 w-8 text-custom-cyan" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-custom-cyan">Welcome, {founderName}!</h1>
              <p className="text-neutral-400 text-sm">Here's your founder dashboard.</p>
            </div>
          </div>
          <button className="relative bg-neutral-900 p-2 rounded-full hover:bg-neutral-800 transition-colors">
            <Bell className="h-6 w-6 text-custom-orange" />
            {/* Notification dot */}
            <span className="absolute top-1 right-1 h-2 w-2 bg-custom-orange rounded-full"></span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-neutral-900 rounded-lg p-6 shadow">
            <div className="text-2xl font-bold text-custom-cyan">2</div>
            <div className="text-neutral-400">Projects Posted</div>
          </div>
          <div className="bg-neutral-900 rounded-lg p-6 shadow">
            <div className="text-2xl font-bold text-custom-orange">5</div>
            <div className="text-neutral-400">Applications</div>
          </div>
          <div className="bg-neutral-900 rounded-lg p-6 shadow">
            <div className="text-2xl font-bold text-custom-purple">3</div>
            <div className="text-neutral-400">Active Students</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <Link
            to="/post-project"
            className="bg-gradient-to-r from-custom-cyan to-custom-purple text-black font-semibold px-6 py-3 rounded shadow hover:scale-105 transition-transform duration-200"
          >
            + Post New Project
          </Link>
          <Link
            to="/projects"
            className="bg-neutral-900 text-custom-cyan border border-custom-cyan px-6 py-3 rounded hover:bg-custom-cyan hover:text-black transition-colors duration-200"
          >
            View All Projects
          </Link>
          <Link
            to="/applications"
            className="bg-neutral-900 text-custom-orange border border-custom-orange px-6 py-3 rounded hover:bg-custom-orange hover:text-black transition-colors duration-200"
          >
            View Applications
          </Link>
        </div>

        {/* Recent Activity */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-custom-cyan">Recent Activity</h2>
          <ul className="bg-neutral-900 rounded-lg p-6 text-neutral-300 space-y-2">
            {recentActivity.length === 0 ? (
              <li className="text-neutral-500">No recent activity yet.</li>
            ) : (
              recentActivity.map((activity, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <span className="h-2 w-2 bg-custom-cyan rounded-full inline-block"></span>
                  {activity}
                </li>
              ))
            )}
          </ul>
        </div>

        {/* Your Projects */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-custom-cyan">Your Projects</h2>
          <div className="bg-neutral-900 rounded-lg p-6">
            {projects.length === 0 ? (
              <p className="text-neutral-400">
                No projects posted yet.{" "}
                <Link to="/post-project" className="text-custom-cyan hover:underline">
                  Post your first project!
                </Link>
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-left">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 text-neutral-400">Project</th>
                      <th className="px-4 py-2 text-neutral-400">Status</th>
                      <th className="px-4 py-2 text-neutral-400">Applicants</th>
                      <th className="px-4 py-2 text-neutral-400">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projects.map((project, idx) => (
                      <tr key={idx} className="border-t border-neutral-800">
                        <td className="px-4 py-2">{project.name}</td>
                        <td className="px-4 py-2">
                          <span
                            className={`px-2 py-1 rounded text-xs font-semibold ${
                              project.status === "Open"
                                ? "bg-custom-cyan text-black"
                                : "bg-custom-purple text-white"
                            }`}
                          >
                            {project.status}
                          </span>
                        </td>
                        <td className="px-4 py-2">{project.applicants}</td>
                        <td className="px-4 py-2 space-x-2">
                          <button className="text-custom-cyan hover:underline">View</button>
                          <button className="text-custom-orange hover:underline">Edit</button>
                          <button className="text-red-500 hover:underline">Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Resources */}
        <div>
          <h2 className="text-xl font-semibold mb-4 text-custom-cyan">Resources for Founders</h2>
          <div className="bg-neutral-900 rounded-lg p-6 flex flex-col sm:flex-row gap-4">
            <a
              href="#"
              className="text-custom-cyan hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              How to Write a Great Project Description
            </a>
            <a
              href="#"
              className="text-custom-purple hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Tips for Attracting Student Talent
            </a>
            <a
              href="#"
              className="text-custom-orange hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              FAQ for Startup Founders
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FounderDashboard;