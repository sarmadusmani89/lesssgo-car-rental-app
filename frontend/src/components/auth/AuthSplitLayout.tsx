import Image from 'next/image';
import styles from '@/app/(public)/auth/auth.module.css';

interface AuthSplitLayoutProps {
    children: React.ReactNode;
    imageSrc: string;
    imageAlt: string;
    heading: React.ReactNode;
    subheading: string;
}

export default function AuthSplitLayout({ children, imageSrc, imageAlt, heading, subheading }: AuthSplitLayoutProps) {
    return (
        <div className={styles.authPage}>
            <div className={styles.authContainer}>
                {/* Side Section */}
                <div className={styles.sideSection}>
                    <div className={styles.sideImage}>
                        <Image src={imageSrc} alt={imageAlt} fill priority quality={100} />
                    </div>
                    <div className={styles.sideOverlay} />
                    <div className={styles.sideContent}>
                        <div className="animate-slide-up">
                            <h2>{heading}</h2>
                            <p>{subheading}</p>
                        </div>
                    </div>
                </div>

                {/* Form Section */}
                <div className={styles.formSection}>
                    <div className={`${styles.authCard} animate-fade-in`}>
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
