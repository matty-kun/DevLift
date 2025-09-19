import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import ProfileHeader from '../../components/students/ProfileHeader';
import SkillsSection from '../../components/students/SkillsSection';
import ReviewsSection from '../../components/students/ReviewsSection';
import ProjectsSection from '../../components/students/ProjectsSection';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

const mockProfile = {
  name: 'Jane Doe',
  avatar_url: 'https://api.dicebear.com/7.x/identicon/svg?seed=student',
  bio: 'Aspiring developer passionate about web and AI.',
  skills: ['React', 'Node.js', 'Python', 'TypeScript', 'JavaScript', 'HTML', 'CSS', 'SQL'],
  reviews: [
    { id: 1, founder: 'Demo Founder', rating: 5, review: 'Jane is an exceptional talent. Her ability to quickly grasp complex concepts and deliver high-quality code is remarkable. A true team player and a pleasure to work with.' },
    { id: 2, founder: 'Another Founder', rating: 4, review: 'Solid work and communication. Jane consistently met deadlines and was receptive to feedback. I would recommend her for any web development project.' },
  ],
  projects: [
    {
      id: 1,
      title: 'AI Chatbot for Customer Service',
      description: 'A full-stack web application that uses machine learning to recommend movies.',
      liveUrl: '#',
      repoUrl: '#',
      status: 'Completed' as const,
    },
    {
      id: 2,
      title: 'E-commerce Platform for Local Artisans',
      description: 'A mobile app that helps users track their daily water intake.',
      liveUrl: '#',
      repoUrl: '#',
      status: 'Completed' as const,
    },
    {
      id: 3,
      title: 'DevLift',
      description: 'A platform to connect student developers with startups.',
      liveUrl: '#',
      repoUrl: '#',
      status: 'In Progress' as const,
    },
  ],
};

const StudentProfile: React.FC = () => {
  const [isContactModalOpen, setContactModalOpen] = useState(false);
  // In a real app, you would use useParams to get the student id and fetch data
  // const { id } = useParams();

  const profile = mockProfile;

  return (
    <div className="container mx-auto p-8 text-white">
      <div className="bg-neutral-900 rounded-2xl shadow-lg p-8">
        <ProfileHeader 
          name={profile.name} 
          avatar_url={profile.avatar_url} 
          bio={profile.bio} 
          onContact={() => setContactModalOpen(true)}
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

      <Modal isOpen={isContactModalOpen} onClose={() => setContactModalOpen(false)} title={`Contact ${profile.name}`}>
        <form>
          <div className="mb-4">
            <Input type="email" placeholder="Your Email" />
          </div>
          <div className="mb-4">
            <textarea 
              className="w-full bg-neutral-800 border border-neutral-700 rounded p-3 text-white placeholder-neutral-400 focus:border-custom-cyan focus:outline-none"
              placeholder="Your Message" 
              rows={4}
            />
          </div>
          <div className="flex justify-end gap-4">
            <Button variant="secondary" onClick={() => setContactModalOpen(false)}>Cancel</Button>
            <Button variant="primary">Send Message</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default StudentProfile;