import React from "react";

interface AvatarProps {
    src?: string;
    alt?: string;
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    status?: 'online' | 'offline' | 'away' | 'busy';
    className?: string;
}

const Avatar: React.FC<AvatarProps> = ({
    src,
    alt = 'User Avatar',
    size = 'md',
    status,
    className = '',
}) => {
    const sizeClasses = {
        xs: 'w-6 h-6',
        sm: 'w-8 h-8',
        md: 'w-10 h-10',
        lg: 'w-12 h-12',
        xl: 'w-16 h-16',
    };

    const statusColors = {
        online: 'bg-success-500',
        offline: 'bg-neutral-400',
        away: 'bg-warning-500',
        busy: 'bg-error-500',
    };

    const statusSizes = {
        xs: 'h1.5 w-1.5',
        sm: 'h-2 w-2',
        md: 'h-2.5 w-2.5',
        lg: 'h-3 w-3',
        xl: 'h-4 w-4',
    };

    const getInitials = () => {
        if (!alt || alt === 'User Avatar') return 'U';
        return alt
            .split(' ')
            .map(word => word[0])
            .join('')
            .substring(0, 2)
            .toUpperCase();
    };

    return (
        <div className={`relative inline-block ${className}`}>
            {src ? (
                <img 
                    src={src}
                    alt={alt}
                    className={`${sizeClasses[size]} rounded-full object-cover border border-neutral-200`}
                />
            ) : (
                <div
                    className={`${sizeClasses[size]} rounded-full flex items-center justify-center bg-primary-100 text-primary-800 font-medium border border-neutral-200`}
                    >
                        {getInitials()}
                    </div>
            )}
        {status && (
            <span 
            className={`absolute bottom-0 right-0 block ${statusSizes[size]} ${statusColors[status]} rounded-full ring-2 ring-white`}
            />
        )}
        </div>
    );
};

export default Avatar;