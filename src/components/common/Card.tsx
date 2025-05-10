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
        default: 'bg-white shadow-soft',
        glass: 'bg-white/70                                       backdrop-blur-md shadow-soft',
        border: 'bg-white border border-neutral-200',
        hover: 'bg-white shadow-soft hover:shadow-medium transition-shadow',
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