import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    variant?: 'default' | 'glass' | 'border' | 'hover';
    padding?: 'none' | 'sm' | 'md' | 'lg';
}

const Card: React.FC<CardProps> = ({
    children,
    className = '',
    variant = 'default',
    padding = 'md',
}) => {
    const baseClasses = 'rounded-xl';

    const variantClasses = {
        default: 'bg-gray-900 shadow-lg',
        glass: 'bg-gray-900/70 backdrop-blur-md shadow-lg',
        border: 'bg-gray-900 border border-gray-800',
        hover: 'bg-gray-900 shadow-lg hover:shadow-xl hover:border-gray-700 transition-all',
    };

    const paddingClasses = {
        none: 'p-0',
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8',
    };

    const cardClasses = [
        baseClasses,
        variantClasses[variant],
        paddingClasses[padding],
        className,
    ].join(' ');

    return (
        <div className={cardClasses}>
            {children}
        </div>
    );
}

export default Card;