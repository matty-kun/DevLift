import React from 'react';
import Button from '../common/Button';

interface ProfileHeaderProps {
  avatar_url: string;
  name: string;
  bio: string;
  onContact: () => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ avatar_url, name, bio, onContact }) => {
  return (
    <div className="flex items-center gap-6 mb-6">
      <img
        src={avatar_url}
        alt={name}
        className="h-24 w-24 rounded-full object-cover border-4 border-custom-cyan"
      />
      <div>
        <h1 className="text-4xl font-bold">{name}</h1>
        <p className="text-neutral-400 mt-1">{bio}</p>
        <div className="mt-4">
          <Button variant="primary" onClick={onContact}>Contact Me</Button>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;