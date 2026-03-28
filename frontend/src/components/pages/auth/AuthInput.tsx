import { LucideIcon, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useState, forwardRef } from 'react';

interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    icon: LucideIcon;
    wrapperClassName?: string;
    required?: boolean;
    error?: string;
    prefix?: string;
}

const AuthInput = forwardRef<HTMLInputElement, AuthInputProps>(
    ({ label, icon: Icon, wrapperClassName, type = 'text', required, error, prefix, ...props }, ref) => {
        const [showPassword, setShowPassword] = useState(false);
        const isPassword = type === 'password';

        return (
            <div className={`transition-all duration-300 ${error ? 'mb-10' : 'mb-6'}`}>
                <label className="block text-[13px] font-extrabold uppercase tracking-widest text-muted-foreground mb-2 flex items-center justify-between">
                    <span>
                        {label}
                        {required && <span className="text-accent ml-1">*</span>}
                    </span>
                    {props.readOnly ? (
                        <span className="text-slate-400 font-normal italic lowercase">(read-only)</span>
                    ) : !required && (
                        <span className="text-slate-400 font-normal italic lowercase">(optional)</span>
                    )}
                </label>
                <div className={`relative group ${wrapperClassName || ''}`}>
                    <Icon 
                        size={18} 
                        className={`absolute left-5 top-1/2 -translate-y-1/2 transition-colors pointer-events-none z-10 
                            ${error ? 'text-red-500' : 'text-muted-foreground group-focus-within:text-accent'}`} 
                    />
                    {prefix && (
                        <span className="absolute left-14 top-1/2 -translate-y-1/2 font-bold text-[15px] text-slate-600 z-10 pointer-events-none">
                            {prefix}
                        </span>
                    )}
                    <input
                        ref={ref}
                        type={isPassword ? (showPassword ? 'text' : 'password') : type}
                        className={`w-full py-4 pr-12 bg-slate-50 border-2 rounded-[1.25rem] text-base font-medium transition-all outline-none 
                            ${prefix ? 'pl-[6.5rem]' : 'pl-14'} 
                            ${error 
                                ? 'border-red-500 bg-red-50/30 focus:ring-red-500/10' 
                                : 'border-slate-100 focus:bg-white focus:border-accent focus:ring-accent/10'}`}
                        {...props}
                    />
                    {isPassword && (
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-accent transition-colors z-20"
                            tabIndex={-1}
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    )}
                </div>
                {error && (
                    <div className="text-red-500 text-[13px] font-semibold mt-2 flex items-center gap-1.5 animate-in slide-in-from-top-1 duration-200">
                        <AlertCircle size={14} />
                        <span>{error}</span>
                    </div>
                )}
            </div>
        );
    }
);

AuthInput.displayName = 'AuthInput';

export default AuthInput;
