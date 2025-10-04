import React from 'react';
import { Link, LinkProps } from 'react-router-dom';

interface BaseButtonProps {
    variant?: 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost' | 'dark-blue' | 'outline-cyan' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    fullWidth?: boolean;
    children: React.ReactNode;
    className?: string;
}

type ButtonAsButton = BaseButtonProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type'> & {
    as?: 'button';
    to?: undefined;
    type?: 'submit' | 'button' | 'reset';
  };

type ButtonAsLink = BaseButtonProps & LinkProps & { as: 'link' };

type ButtonProps = ButtonAsButton | ButtonAsLink;

const Button: React.FC<ButtonProps> = ({
    variant = 'primary',
    size = 'md',
    isLoading = false,
    leftIcon,
    rightIcon,
    className = '',
    fullWidth = false,
    children,
    ...props
}) => {
    const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black';

    const variantClasses = {
        primary: 'bg-custom-cyan text-black hover:bg-opacity-90 focus:ring-custom-cyan',
        secondary: 'bg-custom-purple text-white hover:bg-opacity-90 focus:ring-custom-purple',
        accent: 'bg-custom-orange text-white hover:bg-opacity-90 focus:ring-custom-orange',
        outline: 'border border-gray-600 bg-transparent text-white hover:border-gray-400 focus:ring-gray-500',
        ghost: 'text-white hover:bg-white/10 focus:ring-white/30',
        'dark-blue': 'bg-primary-600 text-white hover:bg-primary-500 focus:ring-primary-500',
        danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
        'outline-cyan': 'bg-transparent text-white border border-transparent hover:text-custom-cyan hover:border-custom-cyan focus:ring-custom-cyan',
    };

    const sizeClasses = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-base',
        lg: 'px-6 py-3 text-lg',
    };

    const disabledClasses = ('disabled' in props && props.disabled && !isLoading) ? 'opacity-60 cursor-not-allowed' : '';
    const loadingClasses = 'cursor-wait';

    const fullWidthClass = fullWidth ? 'w-full' : '';

    const buttonClasses = [
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        disabledClasses,
        isLoading ? loadingClasses : '',
        fullWidthClass,
        className,
    ].join(' ');

    const buttonContent = (
        <>
            {isLoading && (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
                xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                    strokeWidth="4"></circle>
                    <path className="opacity-75" fill='currentColor' d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            )}
            {!isLoading && leftIcon && <span className="mr-2">{leftIcon}</span>}
            {children}
            {!isLoading && rightIcon && <span className="ml-2">{rightIcon}</span>}
        </>
    );

    if (props.as === 'link') {
        const { as, ...rest } = props;
        return (
            <Link className={buttonClasses} {...rest}>
                {buttonContent}
            </Link>
        );
    }

    const { as, disabled, ...rest } = props as ButtonAsButton;
    return (
        <button
            className={buttonClasses}
            disabled={isLoading || disabled}
            {...rest}
        >
            {buttonContent}
        </button>
    );
};

export default Button;