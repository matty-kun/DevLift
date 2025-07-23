  import React from 'react';
  import { Link } from 'react-router-dom';
  import Button from '../components/common/Button';
  import Card from '../components/common/Card';
  import { Users, MessageSquare, Calendar } from 'lucide-react';
  import codaxLogo from '../assets/Codax Logo.svg';
  import SocialLinkCard from '../components/common/SocialLinkCard';

  const CommunityPage: React.FC = () => {
    return (
      <div className="bg-black text-white">
        <div className="container mx-auto px-4 py-12 sm:py-16 lg:py-20">
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 flex items-center justify-center gap-4">
              <span>Join the</span> <img src={codaxLogo} alt="Codax Logo" className="h-20 sm:h-24 lg:h-32" /> <span>Community</span>
            </h1>
            <p className="text-lg sm:text-xl text-neutral-300 max-w-3xl mx-auto">
              This is the central hub for our vibrant community of developers, founders, and innovators. Connect, collaborate, and create together.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <SocialLinkCard
              platform="Facebook Page"
              url="https://www.facebook.com/profile.php?id=61571566707262"
              title="Facebook Page"
              description="Follow for updates and news."
            />
            <SocialLinkCard
              platform="Discord"
              url="https://discord.gg/hN8Mekq8Rs"
              title="Discord Server"
              description="Join for real-time chat."
            />
            <SocialLinkCard
              platform="Facebook Group"
              url="https://www.facebook.com/groups/codax"
              title="Facebook Group"
              description="Join for deeper discussions."
            />
          </div>
        </div>
      </div>
    );
  };

  export default CommunityPage;
