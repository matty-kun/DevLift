import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import { Users, MessageSquare, Calendar } from 'lucide-react';
import codaxLogo from '../assets/Codax Logo.svg';

const CommunityPage: React.FC = () => {
  return (
    <div className="bg-black text-white">
      <div className="container mx-auto px-4 py-12 sm:py-16 lg:py-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 flex items-center justify-center gap-4">
            <span>Welcome to the</span> <img src={codaxLogo} alt="Codax Logo" className="h-20 sm:h-24 lg:h-32" /> <span>Community</span>
          </h1>
          <p className="text-lg sm:text-xl text-neutral-300 max-w-3xl mx-auto">
            This is the central hub for our vibrant community of developers, founders, and innovators. Connect, collaborate, and create together.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card variant="hover" className="flex flex-col text-center items-center">
            <MessageSquare className="h-12 w-12 text-custom-cyan mb-4" />
            <h2 className="text-2xl font-semibold mb-3 text-white">Discussions</h2>
            <p className="text-neutral-400 mb-6 flex-grow">
              Engage in conversations, ask questions, and share your knowledge with the community.
            </p>
            <Link to="/sign-up" className="w-full">
              <Button variant="primary" size="md" fullWidth>View Discussions</Button>
            </Link>
          </Card>

          <Card variant="hover" className="flex flex-col text-center items-center">
            <Users className="h-12 w-12 text-custom-orange mb-4" />
            <h2 className="text-2xl font-semibold mb-3 text-white">Members</h2>
            <p className="text-neutral-400 mb-6 flex-grow">
              Connect with other members. Find collaborators and mentors for your next big project.
            </p>
            <Link to="/sign-up" className="w-full">
              <Button variant="accent" size="md" fullWidth>Browse Members</Button>
            </Link>
          </Card>

          <Card variant="hover" className="flex flex-col text-center items-center">
            <Calendar className="h-12 w-12 text-custom-purple mb-4" />
            <h2 className="text-2xl font-semibold mb-3 text-white">Events</h2>
            <p className="text-neutral-400 mb-6 flex-grow">
              Check out upcoming webinars, workshops, and networking events hosted by the community.
            </p>
            <Link to="/sign-up" className="w-full">
              <Button variant="secondary" size="md" fullWidth>Upcoming Events</Button>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CommunityPage;
