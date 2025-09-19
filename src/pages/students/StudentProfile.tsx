import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Star from '../../components/common/StarRating'; 

const mockProfile = {
  name: 'Jane Doe',
  avatar_url: 'https://api.dicebear.com/7.x/identicon/svg?seed=student',
  bio: 'Aspiring developer passionate about web and AI.',
  skills: ['React', 'Node.js', 'Python'],
  completedProjects: [
    { id: 1, title: 'AI Chatbot' },
    { id: 2, title: 'Portfolio Website' },
  ],
  reviews: [
    { id: 1, founder: 'Demo Founder', rating: 5, review: 'Great collaborator!' },
    { id: 2, founder: 'Another Founder', rating: 4, review: 'Solid work and communication.' },
  ],
};

const StudentProfile: React.FC = () => {
  // In real app, useParams to get student id and fetch data
  // const { id } = useParams();

  const profile = mockProfile;

  return (
    <div className="max-w-2xl mx-auto bg-neutral-900 rounded-lg p-8 mt-8 text-white">
      <div className="flex items-center gap-6 mb-6">
        <img
          src={profile.avatar_url}
          alt={profile.name}
          className="h-20 w-20 rounded-full object-cover border-4 border-custom-cyan"
        />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
          <div className="md:col-span-2 space-y-8">
            <ProjectsSection projects={profile.projects} />
            <ReviewsSection reviews={profile.reviews} />
          </div>
          
          <div className="space-y-8">
            <SkillsSection skills={profile.skills} />
          </div>
        </div>
      </div>
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-custom-cyan mb-2">Skills</h2>
        <div className="flex flex-wrap gap-2">
          {profile.skills.map(skill => (
            <span key={skill} className="bg-custom-cyan/20 text-custom-cyan px-3 py-1 rounded-full text-sm">{skill}</span>
          ))}
        </div>
      </div>
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-custom-cyan mb-2">Completed Projects</h2>
        <ul className="list-disc list-inside text-neutral-300">
          {profile.completedProjects.map(p => (
            <li key={p.id}>{p.title}</li>
          ))}
        </ul>
      </div>
      <div>
        <h2 className="text-xl font-semibold text-custom-cyan mb-2">Reviews</h2>
        {profile.reviews.length === 0 ? (
          <p className="text-neutral-400">No reviews yet.</p>
        ) : (
          <ul className="space-y-4">
            {profile.reviews.map(r => (
              <li key={r.id} className="bg-neutral-800 rounded p-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold">{r.founder}</span>
                  <span className="flex">
                    {/* Show stars */}
                    {Array.from({ length: 5 }, (_, i) => (
                      <svg
                        key={i}
                        className={`h-5 w-5 ${i < r.rating ? 'text-yellow-400 fill-yellow-400' : 'text-neutral-600'}`}
                        fill={i < r.rating ? 'currentColor' : 'none'}
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                    ))}
                  </span>
                </div>
                <div className="text-neutral-300">{r.review}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default StudentProfile;