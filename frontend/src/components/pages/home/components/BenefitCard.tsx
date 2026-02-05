import styles from '@/app/(public)/(home)/page.module.css';
import { LucideIcon } from 'lucide-react';

interface BenefitCardProps {
    icon: LucideIcon;
    title: string;
    description: string;
}

export default function BenefitCard({ icon: Icon, title, description }: BenefitCardProps) {
    return (
        <div className={styles.benefitCard}>
            <div className={styles.benefitIcon}>
                <Icon size={24} />
            </div>
            <h3>{title}</h3>
            <p>{description}</p>
        </div>
    );
}
