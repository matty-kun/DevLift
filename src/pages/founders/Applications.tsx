import React, { useState } from 'react';
import { MessageSquare, MoreHorizontal, Download, Users, Clock } from 'lucide-react';

const Applications: React.FC = () => {
  const [selectedStudent, setSelectedStudent] = useState(0);

  const applications = [
    {
      id: '1',
      studentName: 'Student Name',
      role: 'Developer',
      description: 'Lorem ipsum dolor sit amet consectetur adipiscing elit',
      appliedDate: '2 days ago',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg'
    },
    {
      id: '2',
      studentName: 'Student Name',
      role: 'Designer',
      description: 'Lorem ipsum dolor sit amet consectetur adipiscing elit',
      appliedDate: '3 days ago',
      avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg'
    },
    {
      id: '3',
      studentName: 'Student Name',
      role: 'Full Stack',
      description: 'Lorem ipsum dolor sit amet consectetur adipiscing elit',
      appliedDate: '5 days ago',
      avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg'
    },
    {
      id: '4',
      studentName: 'Student Name',
      role: 'Backend Dev',
      description: 'Lorem ipsum dolor sit amet consectetur adipiscing elit',
      appliedDate: '1 week ago',
      avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg'
    },
    {
      id: '5',
      studentName: 'Student Name',
      role: 'Data Analyst',
      description: 'Lorem ipsum dolor sit amet consectetur adipiscing elit',
      appliedDate: '1 week ago',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg'
    }
  ];

  const projects = [
    { name: 'Project Name', type: 'Web App', students: '0/4 students', duration: '4 weeks' },
    { name: 'Project Name', type: 'Mobile App', students: '0/4 students', duration: '4 weeks' },
    { name: 'Project Name', type: 'API Service', students: '0/4 students', duration: '4 weeks' }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="border-b border-gray-800 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center">
            <div className="flex items-center space-x-2 bg-gray-900 rounded-full px-6 py-2 border border-gray-700">
              <div className="w-6 h-6 bg-orange-500 rounded flex items-center justify-center">
                <span className="text-white text-sm font-bold">D</span>
              </div>
              <span className="text-cyan-400 font-semibold">DevLift</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Left Column */}
          <div className="col-span-4">
            {/* Project Info Card */}
            <div className="bg-gray-900 rounded-lg p-4 mb-6 border border-gray-800">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-orange-500 rounded flex items-center justify-center">
                  <span className="text-white text-sm font-bold">P</span>
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-white font-medium">Project Name</span>
                  </div>
                  <p className="text-gray-400 text-sm">Startup Name</p>
                  <p className="text-gray-500 text-xs">Last updated 1 day</p>
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="flex space-x-2 mb-4">
              <button className="bg-yellow-500 text-black px-4 py-2 rounded-lg text-sm font-medium">
                Sort by some ▼
              </button>
              <button className="bg-yellow-500 text-black px-4 py-2 rounded-lg text-sm font-medium">
                Ratings ▼
              </button>
            </div>

            {/* Applications List */}
            <h2 className="text-white text-lg font-bold mb-4">100 Project Applications</h2>
            
            <div className="space-y-3">
              {applications.map((app, index) => (
                <div
                  key={app.id}
                  className={`bg-gray-900 rounded-lg p-4 border cursor-pointer transition-colors ${
                    selectedStudent === index ? 'border-cyan-500' : 'border-gray-800 hover:border-gray-700'
                  }`}
                  onClick={() => setSelectedStudent(index)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <img
                        src={app.avatar}
                        alt={app.studentName}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="text-white font-medium">{app.studentName}</h3>
                        <p className="text-gray-400 text-sm">{app.role}</p>
                        <p className="text-gray-500 text-xs mt-1">{app.description}</p>
                        <p className="text-gray-500 text-xs mt-1">{app.appliedDate}</p>
                      </div>
                    </div>
                    <div className="text-cyan-500">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column */}
          <div className="col-span-8">
            {/* Student Profile Card */}
            <div className="bg-gray-900 rounded-lg p-6 mb-6 border border-gray-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-orange-500 rounded flex items-center justify-center">
                    <span className="text-white text-sm font-bold">S</span>
                  </div>
                  <div>
                    <h2 className="text-white text-xl font-bold">Student Name</h2>
                    <p className="text-gray-400">Role</p>
                    <p className="text-gray-500 text-sm mt-1">Lorem ipsum dolor sit amet consectetur adipiscing elit</p>
                    <p className="text-gray-600 text-xs mt-1">Last updated 1 day</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-2">
                    <MessageSquare className="w-4 h-4" />
                    <span>Message</span>
                  </button>
                  <button className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-medium border border-gray-700">
                    More...
                  </button>
                </div>
              </div>
            </div>

            {/* Insights Card */}
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <h3 className="text-white text-lg font-bold mb-6">Insights from Profile</h3>
              
              {/* Projects Taken */}
              <div className="mb-6">
                <h4 className="text-white font-medium mb-4">Projects Taken</h4>
                <div className="space-y-3">
                  {projects.map((project, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-orange-500 rounded flex items-center justify-center">
                          <span className="text-white text-sm font-bold">P</span>
                        </div>
                        <div>
                          <p className="text-white font-medium">{project.name}</p>
                          <p className="text-gray-400 text-sm">{project.type}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4 text-sm">
                        <div className="flex items-center space-x-1 text-cyan-400">
                          <Users className="w-4 h-4" />
                          <span>{project.students}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-orange-400">
                          <Clock className="w-4 h-4" />
                          <span>{project.duration}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Education */}
              <div className="mb-6">
                <h4 className="text-white font-medium mb-4">Education</h4>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-orange-500 rounded flex items-center justify-center">
                    <span className="text-white text-sm font-bold">C</span>
                  </div>
                  <div>
                    <p className="text-white font-medium">Currently Studying</p>
                    <p className="text-gray-400 text-sm">Computer Science</p>
                  </div>
                </div>
              </div>

              {/* Resume Section */}
              <div className="mb-6">
                <h4 className="text-white font-medium mb-4">Resume / Curriculum Vitae</h4>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400"></span>
                  <button className="flex items-center space-x-2 text-gray-400 hover:text-white">
                    <Download className="w-4 h-4" />
                    <span className="text-sm">Download</span>
                  </button>
                </div>
              </div>

              {/* Action Button */}
              <button className="w-full bg-cyan-500 hover:bg-cyan-600 text-white py-3 rounded-lg font-medium">
                See full profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Applications;