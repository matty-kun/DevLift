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
        primary: 'bg-primary-100 text-primary-800',
        secondary: 'bg-secondary-100 text-secondary-800',
        accent: 'bg-accent-100 text-accent-800',
        success: 'bg-success-100 text-success-800',
        warning: 'bg-warning-100 text-warning-800',
        error: 'bg-error-100 text-error-800',
        neutral: 'bg-neutral-100 text-neutral-800',
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