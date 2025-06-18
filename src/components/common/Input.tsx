import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    helperText?: string;
    error?: string;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    fullWidth?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({
        label,
        helperText,
        error,
        leftIcon,
        rightIcon,
        fullWidth = true,
        className = '',
        id,
        ...props 
    }, ref) => {
        const inputId = id || `input-${Math.random().toString(36).substring(2, 9)}`;

        const baseInputClasses = 'rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 bg-gray-900 text-white';

        const stateClasses = error 
            ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
            : 'border-gray-700 focus:border-custom-cyan focus:ring-custom-cyan/20';

        const widthClass = fullWidth ? 'w-full' : '';
        const paddingLeft = leftIcon ? 'pl-10' : '';
        const paddingRight = rightIcon ? 'pr-10' : '';

        const inputClasses = [
            baseInputClasses,
            stateClasses, 
            widthClass,
            paddingLeft,
            paddingRight,
            className,
        ].join(' ');

        return (
            <div className={fullWidth ? 'w-full' : ''}>
                {label && (
                    <label htmlFor={inputId} className="block mb-1.5 text-sm font-medium text-white">
                        {label}
                    </label>
                )}

                <div className="relative">
                    {leftIcon && (
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                            {leftIcon}
                        </div>
                    )}

                    <input
                        ref={ref} 
                        id={inputId}
                        className={inputClasses}
                        {...props}
                    />

                    {rightIcon && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                            {rightIcon}
                        </div>
                    )}
                </div>

                {(helperText || error) && (
                    <p className={`mt-1.5 text-sm ${error ? 'text-red-500' : 'text-gray-400'}`}>
                        {error || helperText}
                    </p>
                )}
            </div>
        );
    }
);
Input.displayName = 'Input';

export default Input;