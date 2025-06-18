import React from "react";

interface BadgeProps {
    variant?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error' | 'neutral';
    size?: 'sm' | 'md';
    children: React.ReactNode;
    className?: string;
}

const Badge: React.FC<BadgeProps> = ({
    variant = 'primary',
    size = 'md',
    children,
    className = '',
}) => {
    const baseClasses = 'inline-flex items-center justify-center font-medium rounded-full';

    const variantClasses = {
        primary: 'bg-[#19c3f7] text-white',
        secondary: 'bg-[#7b2ff2] text-white',
        accent: 'bg-[#f74a19] text-white',
        success: 'bg-green-500 text-white',
        warning: 'bg-yellow-500 text-black',
        error: 'bg-red-600 text-white',
        neutral: 'bg-gray-700 text-white',
    };

    const sizeClasses = {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-2.5 py-0.5 text-sm',
    };

    const badgeClasses = [
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        className,
    ].join(' ');

    return (
        <span className={badgeClasses}>
            {children}
        </span>
    );
};

export default Badge;