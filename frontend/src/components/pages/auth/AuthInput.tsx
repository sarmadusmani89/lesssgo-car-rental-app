import { LucideIcon } from 'lucide-react';
import styles from '@/app/(public)/auth/auth.module.css';

interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    icon: LucideIcon;
    wrapperClassName?: string;
}

import { forwardRef } from 'react';

const AuthInput = forwardRef<HTMLInputElement, AuthInputProps>(
    ({ label, icon: Icon, wrapperClassName, ...props }, ref) => {
        return (
            <div className={styles.inputGroup}>
                <label>{label}</label>
                <div className={`${styles.inputWrapper} ${wrapperClassName || ''}`}>
                    <Icon size={18} />
                    <input ref={ref} {...props} />
                </div>
            </div>
        );
    }
);

AuthInput.displayName = 'AuthInput';

export default AuthInput;
