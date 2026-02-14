import { LucideIcon, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useState, forwardRef } from 'react';
import styles from '@/app/(public)/auth/auth.module.css';

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
            <div className={`${styles.inputGroup} ${error ? styles.inputGroupWithError : ''}`}>
                <label>
                    {label} {required ? <span className="text-red-500">*</span> : <span className="text-gray-400 font-normal italic lowercase ml-1">(optional)</span>}
                </label>
                <div className={`${styles.inputWrapper} ${error ? styles.inputError : ''} ${wrapperClassName || ''}`}>
                    <Icon size={18} />
                    {prefix && (
                        <span className="flex items-center pl-1 pr-2 mr-2 border-r border-gray-100 text-gray-500 font-bold text-sm whitespace-nowrap">
                            {prefix}
                        </span>
                    )}
                    <input
                        ref={ref}
                        type={isPassword ? (showPassword ? 'text' : 'password') : type}
                        {...props}
                    />
                    {isPassword && (
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className={styles.toggleBtn}
                            tabIndex={-1}
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    )}
                </div>
                {error && (
                    <div className={styles.errorMessage}>
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
