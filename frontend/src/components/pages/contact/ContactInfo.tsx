import styles from '@/app/(public)/contact/contact.module.css';
import { Mail, MapPin, Phone } from 'lucide-react';

export default function ContactInfo() {
    const contactInfo = [
        {
            icon: MapPin,
            title: 'Visit Us',
            content: '1234 Sports Car Blvd, Beverly Hills, CA 90210',
        },
        {
            icon: Phone,
            title: 'Call Us',
            content: '+1 (555) 123-4567',
        },
        {
            icon: Mail,
            title: 'Email Us',
            content: 'hello@lesssgo.com',
        },
    ];

    return (
        <div className={styles.infoSection}>
            <h2>Contact Information</h2>
            <p className={styles.infoText}>
                Fill out the form and our team will get back to you within 24 hours.
            </p>

            <div className={styles.contactList}>
                {contactInfo.map((item, index) => {
                    const Icon = item.icon;
                    return (
                        <div key={index} className={styles.contactItem}>
                            <div className={styles.contactIcon}>
                                <Icon size={24} />
                            </div>
                            <div>
                                <div className={styles.contactTitle}>{item.title}</div>
                                <div className={styles.contactContent}>{item.content}</div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
