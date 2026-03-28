'use client';

import { forwardRef, ButtonHTMLAttributes } from 'react';
import Loader from './Loader';
import Link from 'next/link';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    isLoading?: boolean;
    variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'accent' | 'ghost' | 'link';
    size?: 'sm' | 'md' | 'lg' | 'icon';
    href?: string;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className = '', children, isLoading, variant = 'primary', size = 'md', disabled, href, ...props }, ref) => {

        const baseStyles = "inline-flex items-center justify-center font-extrabold rounded-xl transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed active:scale-[0.98] whitespace-nowrap gap-2";

        const variants = {
            primary: "bg-primary text-primary-foreground hover:opacity-90 shadow-lg shadow-primary/20 hover:-translate-y-0.5",
            accent: "bg-accent text-accent-foreground hover:opacity-90 shadow-lg shadow-accent/20 hover:-translate-y-0.5",
            secondary: "bg-secondary text-secondary-foreground border border-border/50 hover:bg-secondary/80 hover:shadow-md",
            outline: "border-2 border-border bg-transparent text-foreground hover:bg-muted hover:border-muted-foreground/30 hover:text-foreground",
            ghost: "bg-transparent text-foreground hover:bg-muted/80 hover:text-foreground",
            danger: "bg-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-200",
            link: "bg-transparent text-primary underline-offset-4 hover:underline !p-0 !h-auto"
        };

        const sizes = {
            sm: "px-4 py-2 text-xs",
            md: "px-6 py-3 text-sm",
            lg: "px-8 py-4 text-base",
            icon: "h-10 w-10 p-0"
        };

        const combinedClassName = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;

        if (href) {
            return (
                <Link
                    href={href}
                    className={combinedClassName}
                    onClick={(e) => {
                        if (disabled || isLoading) {
                            e.preventDefault();
                        }
                    }}
                >
                    {isLoading && <Loader size="xs" variant={variant === 'outline' || variant === 'ghost' ? 'primary' : 'white'} />}
                    {children}
                </Link>
            );
        }

        return (
            <button
                ref={ref}
                className={combinedClassName}
                disabled={isLoading || disabled}
                {...props}
            >
                {isLoading && <Loader size="xs" variant={variant === 'outline' || variant === 'ghost' ? 'primary' : 'white'} />}
                {children}
            </button>
        );
    }
);

Button.displayName = "Button";

export { Button };
