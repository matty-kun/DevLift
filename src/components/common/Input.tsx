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

        const baseInputClasses = 'rounded-lg border px-4 py-2 text-neutral-800 focus:outline-none focus:ring-2';

        const stateClasses = error ? 'border-error-300 focus:border-error-300 focus:ring-error-100'
        : 'border-neutral-300 focus:border-primary-300 focus:ring-primary-100';

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
                    <label htmlFor={inputId} className="block mb-1.5 text-sm font-medium text-neutral-800">
                        {label}
                    </label>
                )}

                <div className="relative">
                    {leftIcon && (
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">
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
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500">
                            {rightIcon}
                        </div>
                    )}
                </div>

                {(helperText || error) && (
                    <p className={`mt-1.5 text-sm ${error ? 'text-error-500' : 'text-neutral-500'}`}>
                        {error || helperText}
                    </p>
                )}
            </div>
        );
    }
);
Input.displayName = 'Input';

export default Input;