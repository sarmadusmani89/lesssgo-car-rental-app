import { LucideIcon, Eye, EyeOff } from 'lucide-react';
import { useState, forwardRef } from 'react';
import styles from '@/app/(public)/auth/auth.module.css';

interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    icon: LucideIcon;
    wrapperClassName?: string;
}

const AuthInput = forwardRef<HTMLInputElement, AuthInputProps>(
    ({ label, icon: Icon, wrapperClassName, type = 'text', ...props }, ref) => {
        const [showPassword, setShowPassword] = useState(false);
        const isPassword = type === 'password';

        return (
            <div className={styles.inputGroup}>
                <label>{label}</label>
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
                            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}
                            tabIndex={-1} // Prevent tabbing to this button for smoother form flow
                        >
                            {showPassword ? <EyeOff size={18} className="text-gray-400" /> : <Eye size={18} className="text-gray-400" />}
                        </button>
                    )}
                </div>
            </div>
        );
    }
);

AuthInput.displayName = 'AuthInput';

export default AuthInput;
