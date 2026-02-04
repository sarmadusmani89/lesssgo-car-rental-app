import { LucideIcon, Eye, EyeOff } from 'lucide-react';
import { useState, forwardRef } from 'react';
import styles from '@/app/(public)/auth/auth.module.css';

interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    icon: LucideIcon;
    wrapperClassName?: string;
    required?: boolean;
}

const AuthInput = forwardRef<HTMLInputElement, AuthInputProps>(
    ({ label, icon: Icon, wrapperClassName, type = 'text', required, ...props }, ref) => {
        const [showPassword, setShowPassword] = useState(false);
        const isPassword = type === 'password';

        return (
            <div className={styles.inputGroup}>
                <label>
                    {label} {required ? <span className="text-red-500">*</span> : <span className="text-gray-400 font-normal italic lowercase ml-1">(optional)</span>}
                </label>
                <div className={`${styles.inputWrapper} ${wrapperClassName || ''}`}>
                    <Icon size={18} />
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
                            tabIndex={-1} // Prevent tabbing to this button for smoother form flow
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    )}
                </div>
            </div>
        );
    }
);

AuthInput.displayName = 'AuthInput';

export default AuthInput;
