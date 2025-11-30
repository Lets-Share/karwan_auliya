'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    loading?: boolean;
    icon?: React.ReactNode;
    fullWidth?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({
        children,
        variant = 'primary',
        size = 'md',
        loading = false,
        icon,
        fullWidth = false,
        className = '',
        disabled,
        ...props
    }, ref) => {
        const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl';

        const variants = {
            primary: 'bg-gradient-to-r from-primary to-primary-light text-white hover:shadow-lg hover:scale-105 active:scale-95',
            secondary: 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700',
            outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-white',
            ghost: 'text-primary hover:bg-primary/10',
        };

        const sizes = {
            sm: 'px-4 py-2 text-sm',
            md: 'px-6 py-3 text-base',
            lg: 'px-8 py-4 text-lg',
        };

        const widthClass = fullWidth ? 'w-full' : '';

        return (
            <motion.button
                ref={ref}
                whileTap={{ scale: disabled || loading ? 1 : 0.95 }}
                className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthClass} ${className}`}
                disabled={disabled || loading}
                {...(props as any)}
            >
                {loading && (
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                )}
                {icon && !loading && <span className="mr-2">{icon}</span>}
                {children}
            </motion.button>
        );
    }
);

Button.displayName = 'Button';

export default Button;
