'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import styles from '@/app/(public)/privacy/privacy.module.css';

export default function PrivacyContent() {
    const [settings, setSettings] = useState<any>(null);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await api.get('/settings');
                setSettings(res.data);
            } catch (error) {
                console.error('Failed to fetch settings:', error);
            }
        };
        fetchSettings();
    }, []);

    const siteName = settings?.siteName || 'Lesssgo';

    return (
        <section className={styles.content}>
            <div className="container">
                <div className={styles.legal}>
                    <div className={styles.intro}>
                        <p>
                            At {siteName}, we are committed to protecting your privacy and ensuring the security of your personal information.
                            This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our car rental services.
                        </p>
                    </div>

                    <div className={styles.section}>
                        <h2>1. Information We Collect</h2>
                        <h3>Personal Information</h3>
                        <p>
                            We collect personal information that you provide to us when you:
                        </p>
                        <ul>
                            <li>Create an account or make a booking</li>
                            <li>Contact our customer support</li>
                            <li>Subscribe to our newsletter</li>
                            <li>Participate in surveys or promotions</li>
                        </ul>
                        <p>This information may include:</p>
                        <ul>
                            <li>Name, email address, phone number</li>
                            <li>Driver's license information</li>
                            <li>Payment card details</li>
                            <li>Billing and mailing addresses</li>
                        </ul>

                        <h3>Automatically Collected Information</h3>
                        <p>
                            When you use our website, we automatically collect certain information, including:
                        </p>
                        <ul>
                            <li>IP address and browser type</li>
                            <li>Device information and operating system</li>
                            <li>Pages visited and time spent on our site</li>
                            <li>Cookies and similar tracking technologies</li>
                        </ul>
                    </div>

                    <div className={styles.section}>
                        <h2>2. How We Use Your Information</h2>
                        <p>
                            We use the information we collect to:
                        </p>
                        <ul>
                            <li>Process and fulfill your rental bookings</li>
                            <li>Communicate with you about your reservation</li>
                            <li>Process payments and prevent fraud</li>
                            <li>Provide customer support and respond to inquiries</li>
                            <li>Send you marketing communications (with your consent)</li>
                            <li>Improve our services and website functionality</li>
                            <li>Comply with legal obligations and enforce our terms</li>
                        </ul>
                    </div>

                    <div className={styles.section}>
                        <h2>3. Information Sharing and Disclosure</h2>
                        <p>
                            We do not sell your personal information. We may share your information with:
                        </p>
                        <ul>
                            <li><strong>Service Providers:</strong> Third-party companies that help us operate our business (payment processors, email services, analytics providers)</li>
                            <li><strong>Legal Requirements:</strong> When required by law, court order, or governmental authority</li>
                            <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
                            <li><strong>With Your Consent:</strong> When you explicitly authorize us to share your information</li>
                        </ul>
                    </div>

                    <div className={styles.section}>
                        <h2>4. Cookies and Tracking Technologies</h2>
                        <p>
                            We use cookies and similar technologies to enhance your experience, analyze site usage, and assist in our marketing efforts.
                            You can control cookies through your browser settings, but disabling cookies may affect website functionality.
                        </p>
                        <p>
                            We use the following types of cookies:
                        </p>
                        <ul>
                            <li><strong>Essential Cookies:</strong> Required for website operation</li>
                            <li><strong>Analytics Cookies:</strong> Help us understand how visitors use our site</li>
                            <li><strong>Marketing Cookies:</strong> Used to deliver relevant advertisements</li>
                        </ul>
                    </div>

                    <div className={styles.section}>
                        <h2>5. Data Security</h2>
                        <p>
                            We implement industry-standard security measures to protect your personal information from unauthorized access,
                            alteration, disclosure, or destruction. These measures include:
                        </p>
                        <ul>
                            <li>Encryption of sensitive data during transmission (SSL/TLS)</li>
                            <li>Secure storage of payment information</li>
                            <li>Regular security assessments and updates</li>
                            <li>Restricted access to personal information</li>
                        </ul>
                        <p>
                            However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
                        </p>
                    </div>

                    <div className={styles.section}>
                        <h2>6. Your Privacy Rights</h2>
                        <p>
                            You have the right to:
                        </p>
                        <ul>
                            <li><strong>Access:</strong> Request access to the personal information we hold about you</li>
                            <li><strong>Correction:</strong> Request correction of inaccurate or incomplete information</li>
                            <li><strong>Deletion:</strong> Request deletion of your personal information (subject to legal requirements)</li>
                            <li><strong>Opt-Out:</strong> Unsubscribe from marketing communications</li>
                            <li><strong>Data Portability:</strong> Request a copy of your data in a structured format</li>
                        </ul>
                        <p>
                            To exercise these rights, please contact us at {settings?.contactEmail || 'ride@lessssgopng.com'}.
                        </p>
                    </div>

                    <div className={styles.section}>
                        <h2>7. Data Retention</h2>
                        <p>
                            We retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy,
                            unless a longer retention period is required by law. When we no longer need your information, we will securely delete or anonymize it.
                        </p>
                    </div>

                    <div className={styles.section}>
                        <h2>8. Third-Party Links</h2>
                        <p>
                            Our website may contain links to third-party websites. We are not responsible for the privacy practices of these external sites.
                            We encourage you to review their privacy policies before providing any personal information.
                        </p>
                    </div>

                    <div className={styles.section}>
                        <h2>9. Children's Privacy</h2>
                        <p>
                            Our services are not intended for individuals under the age of 18. We do not knowingly collect personal information from children.
                            If we discover that we have collected information from a child, we will promptly delete it.
                        </p>
                    </div>

                    <div className={styles.section}>
                        <h2>10. International Data Transfers</h2>
                        <p>
                            Your information may be transferred to and maintained on servers located outside your country of residence.
                            We ensure appropriate safeguards are in place to protect your information in accordance with this Privacy Policy.
                        </p>
                    </div>

                    <div className={styles.section}>
                        <h2>11. Changes to This Privacy Policy</h2>
                        <p>
                            We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on our website
                            and updating the "Last Updated" date. Your continued use of our services after changes constitutes acceptance of the updated policy.
                        </p>
                    </div>

                    <div className={styles.section}>
                        <h2>12. Contact Us</h2>
                        <p>
                            If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us at:
                        </p>
                        <p>
                            Email: {settings?.contactEmail || 'ride@lessssgopng.com'}<br />
                            Phone: {settings?.contactPhone || '+675 83054576'}<br />
                            Address: {settings?.contactAddress || '1234 Sports Car Blvd, Beverly Hills, CA 90210'}
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
