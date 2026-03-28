import { ButtonHTMLAttributes, forwardRef } from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    isLoading?: boolean;
    variant?: 'primary' | 'secondary' | 'outline' | 'danger';
    size?: 'sm' | 'md' | 'lg';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className = '', children, isLoading, variant = 'primary', size = 'md', disabled, ...props }, ref) => {

        const baseStyles = "inline-flex items-center justify-center font-bold rounded-xl transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed active:scale-[0.98]";

        const variants = {
            primary: "bg-primary text-primary-foreground hover:opacity-90 shadow-lg shadow-primary/20",
            secondary: "bg-secondary text-secondary-foreground border border-border hover:bg-secondary/80",
            outline: "border-2 border-accent text-accent hover:bg-accent/5",
            danger: "bg-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-200"
        };

        const sizes = {
            sm: "px-4 py-2 text-sm",
            md: "px-6 py-3",
            lg: "px-8 py-4 text-lg"
        };

        return (
            <button
                ref={ref}
                className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
                disabled={isLoading || disabled}
                {...props}
            >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {children}
            </button>
        );
    }
);

Button.displayName = "Button";

export { Button };
