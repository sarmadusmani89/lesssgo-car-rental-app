'use client';

import React from 'react';

interface LoaderProps {
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    variant?: 'primary' | 'white' | 'accent' | 'secondary';
    className?: string;
}

const Loader: React.FC<LoaderProps> = ({
    size = 'md',
    variant = 'primary',
    className = ''
}) => {
    const sizeClasses = {
        xs: 'w-3 h-3 border-[1.5px]',
        sm: 'w-5 h-5 border-2',
        md: 'w-8 h-8 border-[3px]',
        lg: 'w-12 h-12 border-4',
        xl: 'w-16 h-16 border-[5px]',
    };

    const variantClasses = {
        primary: 'border-primary/20 border-t-primary',
        white: 'border-white/20 border-t-white',
        accent: 'border-accent/20 border-t-accent',
        secondary: 'border-secondary/20 border-t-secondary-foreground',
    };

    return (
        <div className={`relative flex items-center justify-center ${className}`}>
            <div
                className={`
                    rounded-full 
                    animate-premium-spin 
                    ${sizeClasses[size]} 
                    ${variantClasses[variant]}
                    ${variant === 'primary' || variant === 'accent' ? 'animate-glow-pulse' : ''}
                `}
            />
        </div>
    );
};

export default Loader;
