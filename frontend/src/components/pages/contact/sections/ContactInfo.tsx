import styles from '@/app/(public)/contact/contact.module.css';
import { Mail, MapPin, Phone } from 'lucide-react';
import ContactInfoItem from '../components/ContactInfoItem';

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

export default function ContactInfo() {
    return (
        <div className={styles.infoSection}>
            <h2>Contact Information</h2>
            <p className={styles.infoText}>
                Fill out the form and our team will get back to you within 24 hours.
            </p>

            <div className={styles.contactList}>
                {contactInfo.map((item, index) => (
                    <ContactInfoItem key={index} {...item} />
                ))}
            </div>
        </div>
    );
}
