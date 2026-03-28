'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';

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
        <section className="py-16">
            <div className="container mx-auto px-4">
                <div className="max-w-3xl mx-auto">
                    <div className="mb-12 p-8 bg-slate-50 rounded-2xl border-l-4 border-accent shadow-sm">
                        <p className="text-lg text-foreground leading-relaxed italic">
                            At {siteName}, we are committed to protecting your privacy and ensuring the security of your personal information.
                            This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our car rental services.
                        </p>
                    </div>

                    <div className="mb-12">
                        <h2 className="text-2xl font-bold text-primary mb-4">1. Information We Collect</h2>
                        <h3 className="text-lg font-bold text-primary mt-6 mb-3">Personal Information</h3>
                        <p className="text-base text-foreground leading-relaxed mb-4">
                            We collect personal information that you provide to us when you:
                        </p>
                        <ul className="list-disc ml-8 mb-4 space-y-2">
                            <li className="text-base text-foreground leading-relaxed">Create an account or make a booking</li>
                            <li className="text-base text-foreground leading-relaxed">Contact our customer support</li>
                            <li className="text-base text-foreground leading-relaxed">Subscribe to our newsletter</li>
                            <li className="text-base text-foreground leading-relaxed">Participate in surveys or promotions</li>
                        </ul>
                        <p className="text-base text-foreground leading-relaxed mb-4">This information may include:</p>
                        <ul className="list-disc ml-8 mb-4 space-y-2">
                            <li className="text-base text-foreground leading-relaxed">Name, email address, phone number</li>
                            <li className="text-base text-foreground leading-relaxed">Driver's license information</li>
                            <li className="text-base text-foreground leading-relaxed">Payment card details</li>
                            <li className="text-base text-foreground leading-relaxed">Billing and mailing addresses</li>
                        </ul>

                        <h3 className="text-lg font-bold text-primary mt-6 mb-3">Automatically Collected Information</h3>
                        <p className="text-base text-foreground leading-relaxed mb-4">
                            When you use our website, we automatically collect certain information, including:
                        </p>
                        <ul className="list-disc ml-8 mb-4 space-y-2">
                            <li className="text-base text-foreground leading-relaxed">IP address and browser type</li>
                            <li className="text-base text-foreground leading-relaxed">Device information and operating system</li>
                            <li className="text-base text-foreground leading-relaxed">Pages visited and time spent on our site</li>
                            <li className="text-base text-foreground leading-relaxed">Cookies and similar tracking technologies</li>
                        </ul>
                    </div>

                    <div className="mb-12">
                        <h2 className="text-2xl font-bold text-primary mb-4">2. How We Use Your Information</h2>
                        <p className="text-base text-foreground leading-relaxed mb-4">
                            We use the information we collect to:
                        </p>
                        <ul className="list-disc ml-8 mb-4 space-y-2">
                            <li className="text-base text-foreground leading-relaxed">Process and fulfill your rental bookings</li>
                            <li className="text-base text-foreground leading-relaxed">Communicate with you about your reservation</li>
                            <li className="text-base text-foreground leading-relaxed">Process payments and prevent fraud</li>
                            <li className="text-base text-foreground leading-relaxed">Provide customer support and respond to inquiries</li>
                            <li className="text-base text-foreground leading-relaxed">Send you marketing communications (with your consent)</li>
                            <li className="text-base text-foreground leading-relaxed">Improve our services and website functionality</li>
                            <li className="text-base text-foreground leading-relaxed">Comply with legal obligations and enforce our terms</li>
                        </ul>
                    </div>

                    <div className="mb-12">
                        <h2 className="text-2xl font-bold text-primary mb-4">3. Information Sharing and Disclosure</h2>
                        <p className="text-base text-foreground leading-relaxed mb-4">
                            We do not sell your personal information. We may share your information with:
                        </p>
                        <ul className="list-disc ml-8 mb-4 space-y-2">
                            <li className="text-base text-foreground leading-relaxed"><strong className="text-primary font-bold">Service Providers:</strong> Third-party companies that help us operate our business (payment processors, email services, analytics providers)</li>
                            <li className="text-base text-foreground leading-relaxed"><strong className="text-primary font-bold">Legal Requirements:</strong> When required by law, court order, or governmental authority</li>
                            <li className="text-base text-foreground leading-relaxed"><strong className="text-primary font-bold">Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
                            <li className="text-base text-foreground leading-relaxed"><strong className="text-primary font-bold">With Your Consent:</strong> When you explicitly authorize us to share your information</li>
                        </ul>
                    </div>

                    <div className="mb-12">
                        <h2 className="text-2xl font-bold text-primary mb-4">4. Cookies and Tracking Technologies</h2>
                        <p className="text-base text-foreground leading-relaxed mb-4">
                            We use cookies and similar technologies to enhance your experience, analyze site usage, and assist in our marketing efforts.
                            You can control cookies through your browser settings, but disabling cookies may affect website functionality.
                        </p>
                        <p className="text-base text-foreground leading-relaxed mb-4">
                            We use the following types of cookies:
                        </p>
                        <ul className="list-disc ml-8 mb-4 space-y-2">
                            <li className="text-base text-foreground leading-relaxed"><strong className="text-primary font-bold">Essential Cookies:</strong> Required for website operation</li>
                            <li className="text-base text-foreground leading-relaxed"><strong className="text-primary font-bold">Analytics Cookies:</strong> Help us understand how visitors use our site</li>
                            <li className="text-base text-foreground leading-relaxed"><strong className="text-primary font-bold">Marketing Cookies:</strong> Used to deliver relevant advertisements</li>
                        </ul>
                    </div>

                    <div className="mb-12">
                        <h2 className="text-2xl font-bold text-primary mb-4">5. Data Security</h2>
                        <p className="text-base text-foreground leading-relaxed mb-4">
                            We implement industry-standard security measures to protect your personal information from unauthorized access,
                            alteration, disclosure, or destruction. These measures include:
                        </p>
                        <ul className="list-disc ml-8 mb-4 space-y-2">
                            <li className="text-base text-foreground leading-relaxed">Encryption of sensitive data during transmission (SSL/TLS)</li>
                            <li className="text-base text-foreground leading-relaxed">Secure storage of payment information</li>
                            <li className="text-base text-foreground leading-relaxed">Regular security assessments and updates</li>
                            <li className="text-base text-foreground leading-relaxed">Restricted access to personal information</li>
                        </ul>
                        <p className="text-base text-foreground leading-relaxed mb-4">
                            However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
                        </p>
                    </div>

                    <div className="mb-12">
                        <h2 className="text-2xl font-bold text-primary mb-4">6. Your Privacy Rights</h2>
                        <p className="text-base text-foreground leading-relaxed mb-4">
                            You have the right to:
                        </p>
                        <ul className="list-disc ml-8 mb-4 space-y-2">
                            <li className="text-base text-foreground leading-relaxed"><strong className="text-primary font-bold">Access:</strong> Request access to the personal information we hold about you</li>
                            <li className="text-base text-foreground leading-relaxed"><strong className="text-primary font-bold">Correction:</strong> Request correction of inaccurate or incomplete information</li>
                            <li className="text-base text-foreground leading-relaxed"><strong className="text-primary font-bold">Deletion:</strong> Request deletion of your personal information (subject to legal requirements)</li>
                            <li className="text-base text-foreground leading-relaxed"><strong className="text-primary font-bold">Opt-Out:</strong> Unsubscribe from marketing communications</li>
                            <li className="text-base text-foreground leading-relaxed"><strong className="text-primary font-bold">Data Portability:</strong> Request a copy of your data in a structured format</li>
                        </ul>
                        <p className="text-base text-foreground leading-relaxed mb-4">
                            To exercise these rights, please contact us at {settings?.contactEmail || 'ride@lessssgopng.com'}.
                        </p>
                    </div>

                    <div className="mb-12">
                        <h2 className="text-2xl font-bold text-primary mb-4">7. Data Retention</h2>
                        <p className="text-base text-foreground leading-relaxed mb-4">
                            We retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy,
                            unless a longer retention period is required by law. When we no longer need your information, we will securely delete or anonymize it.
                        </p>
                    </div>

                    <div className="mb-12">
                        <h2 className="text-2xl font-bold text-primary mb-4">8. Third-Party Links</h2>
                        <p className="text-base text-foreground leading-relaxed mb-4">
                            Our website may contain links to third-party websites. We are not responsible for the privacy practices of these external sites.
                            We encourage you to review their privacy policies before providing any personal information.
                        </p>
                    </div>

                    <div className="mb-12">
                        <h2 className="text-2xl font-bold text-primary mb-4">9. Children's Privacy</h2>
                        <p className="text-base text-foreground leading-relaxed mb-4">
                            Our services are not intended for individuals under the age of 18. We do not knowingly collect personal information from children.
                            If we discover that we have collected information from a child, we will promptly delete it.
                        </p>
                    </div>

                    <div className="mb-12">
                        <h2 className="text-2xl font-bold text-primary mb-4">10. International Data Transfers</h2>
                        <p className="text-base text-foreground leading-relaxed mb-4">
                            Your information may be transferred to and maintained on servers located outside your country of residence.
                            We ensure appropriate safeguards are in place to protect your information in accordance with this Privacy Policy.
                        </p>
                    </div>

                    <div className="mb-12">
                        <h2 className="text-2xl font-bold text-primary mb-4">11. Changes to This Privacy Policy</h2>
                        <p className="text-base text-foreground leading-relaxed mb-4">
                            We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on our website
                            and updating the "Last Updated" date. Your continued use of our services after changes constitutes acceptance of the updated policy.
                        </p>
                    </div>

                    <div className="mb-12">
                        <h2 className="text-2xl font-bold text-primary mb-4">12. Contact Us</h2>
                        <p className="text-base text-foreground leading-relaxed mb-4">
                            If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us at:
                        </p>
                        <p className="text-base text-foreground leading-relaxed mb-4">
                            Email: {settings?.contactEmail || 'ride@lessssgopng.com'}<br />
                            Phone: {settings?.contactPhone || '+675 83054576'}<br />
                            Address: {settings?.contactAddress || 'Port Moresby, Papua New Guinea'}
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
