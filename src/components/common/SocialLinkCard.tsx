import React from 'react';
import { Facebook, ChevronRight, Disc } from 'lucide-react';
import Card from './Card';
import { FaDiscord } from 'react-icons/fa';

interface SocialLinkCardProps {
    platform: 'Facebook Page' | 'Discord' | 'Facebook Group';
    url: string;
    title: string;
    description: string;
}

const SocialLinkCard: React.FC<SocialLinkCardProps> = ({ platform, url, title, description }) => {
    const getIcon = () => {
        switch (platform) {
            case 'Facebook Page':
                return <Facebook className="w-8 h-8 text-blue-500" />;
            case 'Facebook Group':
                return <Facebook className="w-8 h-8 text-blue-700" />;
            case 'Discord':
                return <FaDiscord className="w-8 h-8 text-indigo-500" />;
            default:
                return null;
        }
    };

    return (
        <Card 
            variant="border"
            padding="md"
            className="w-full group relative flex flex-col overflow-hidden rounded-xl border-neutral-800 bg-neutral-900 shadow-lg transition-all duration-300 hover:border-custom-cyan hover:shadow-custom-cyan/20 hover:-translate-y-1"
        >
            <a href={url} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-4">
                <div className="flex-shrink-0 p-2 bg-neutral-800 rounded-lg">
                    {getIcon()}
                </div>
                <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white group-hover:text-custom-cyan transition-colors duration-300">{title}</h3>
                    <p className="text-neutral-400 text-sm">{description}</p>
                </div>
                <div className="transform transition-transform duration-300 group-hover:translate-x-1">
                    <ChevronRight className="w-6 h-6 text-neutral-600 group-hover:text-custom-cyan transition-colors duration-300" />
                </div>
            </a>
        </Card>
    );
};

export default SocialLinkCard;
