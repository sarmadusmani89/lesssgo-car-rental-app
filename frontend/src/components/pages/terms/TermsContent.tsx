'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';

export default function TermsContent() {
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
                    <div className="mb-12">
                        <h2 className="text-2xl font-bold text-primary mb-4">1. Agreement to Terms</h2>
                        <p className="text-base text-foreground leading-relaxed mb-4">
                            By accessing and using {siteName}'s car rental services, you agree to be bound by these Terms and Conditions.
                            If you do not agree to these terms, please do not use our services.
                        </p>
                    </div>

                    <div className="mb-12">
                        <h2 className="text-2xl font-bold text-primary mb-4">2. Rental Agreement</h2>
                        <p className="text-base text-foreground leading-relaxed mb-4">
                            When you rent a car from {siteName}, you enter into a legally binding rental agreement. You must be at least
                            21 years old and hold a valid driver's license to rent a car.
                        </p>
                        <p className="text-base text-foreground leading-relaxed mb-4">
                            The rental period begins at the time specified in your booking confirmation and ends when you return the car
                            to the designated location. Late returns may incur additional charges.
                        </p>
                    </div>

                    <div className="mb-12">
                        <h2 className="text-2xl font-bold text-primary mb-4">3. Driver Requirements</h2>
                        <p className="text-base text-foreground leading-relaxed mb-4">
                            All drivers must:
                        </p>
                        <ul className="list-disc ml-8 mb-4 space-y-2">
                            <li className="text-base text-foreground leading-relaxed">Be at least 21 years of age (25 for premium cars)</li>
                            <li className="text-base text-foreground leading-relaxed">Possess a valid driver's license for at least one year</li>
                            <li className="text-base text-foreground leading-relaxed">Present a valid government-issued ID</li>
                            <li className="text-base text-foreground leading-relaxed">Provide a valid credit card in their name</li>
                        </ul>
                    </div>

                    <div className="mb-12">
                        <h2 className="text-2xl font-bold text-primary mb-4">4. Car Use and Restrictions</h2>
                        <p className="text-base text-foreground leading-relaxed mb-4">
                            You agree to:
                        </p>
                        <ul className="list-disc ml-8 mb-4 space-y-2">
                            <li className="text-base text-foreground leading-relaxed">Use the car only for lawful purposes</li>
                            <li className="text-base text-foreground leading-relaxed">Not allow unauthorized persons to drive the car</li>
                            <li className="text-base text-foreground leading-relaxed">Not use the car for racing, towing, or off-road driving</li>
                            <li className="text-base text-foreground leading-relaxed">Not transport illegal substances or engage in illegal activities</li>
                            <li className="text-base text-foreground leading-relaxed">Return the car in the same condition as received, normal wear and tear excepted</li>
                        </ul>
                    </div>

                    <div className="mb-12">
                        <h2 className="text-2xl font-bold text-primary mb-4">5. Payment and Fees</h2>
                        <p className="text-base text-foreground leading-relaxed mb-4">
                            You agree to pay all charges associated with your rental, including:
                        </p>
                        <ul className="list-disc ml-8 mb-4 space-y-2">
                            <li className="text-base text-foreground leading-relaxed">Daily rental fees</li>
                            <li className="text-base text-foreground leading-relaxed">Insurance coverage</li>
                            <li className="text-base text-foreground leading-relaxed">Additional driver fees (if applicable)</li>
                            <li className="text-base text-foreground leading-relaxed">Fuel charges if not returned with same fuel level</li>
                            <li className="text-base text-foreground leading-relaxed">Late return fees</li>
                            <li className="text-base text-foreground leading-relaxed">Tolls, parking tickets, and traffic violations</li>
                        </ul>
                    </div>

                    <div className="mb-12">
                        <h2 className="text-2xl font-bold text-primary mb-4">6. Insurance and Liability</h2>
                        <p className="text-base text-foreground leading-relaxed mb-4">
                            Basic insurance coverage is included in all rentals. You are responsible for any damage to the car during
                            the rental period up to the excess amount. Additional insurance options are available to reduce or eliminate the excess.
                        </p>
                        <p className="text-base text-foreground leading-relaxed mb-4">
                            In case of an accident, you must immediately notify the police and Lesssgo. Failure to do so may void your insurance coverage.
                        </p>
                    </div>

                    <div className="mb-12">
                        <h2 className="text-2xl font-bold text-primary mb-4">7. Cancellation and Modifications</h2>
                        <p className="text-base text-foreground leading-relaxed mb-4">
                            You may cancel or modify your booking up to 24 hours before the scheduled pickup time without penalty.
                            Cancellations made within 24 hours are subject to a cancellation fee equivalent to one day's rental charge.
                        </p>
                    </div>

                    <div className="mb-12">
                        <h2 className="text-2xl font-bold text-primary mb-4">8. Fuel Policy</h2>
                        <p className="text-base text-foreground leading-relaxed mb-4">
                            Cars are provided with a full tank of fuel and must be returned with a full tank. If the car is returned
                            with less fuel, you will be charged for refueling at a premium rate plus a service fee.
                        </p>
                    </div>

                    <div className="mb-12">
                        <h2 className="text-2xl font-bold text-primary mb-4">9. Breakdown and Accidents</h2>
                        <p className="text-base text-foreground leading-relaxed mb-4">
                            In the event of a breakdown or accident, contact our 24/7 emergency hotline immediately. Do not arrange for repairs
                            without our authorization. We provide roadside assistance at no additional charge.
                        </p>
                    </div>

                    <div className="mb-12">
                        <h2 className="text-2xl font-bold text-primary mb-4">10. Limitation of Liability</h2>
                        <p className="text-base text-foreground leading-relaxed mb-4">
                            {siteName} shall not be liable for any indirect, incidental, special, or consequential damages arising from your use
                            of our services. Our liability is limited to the rental charges paid.
                        </p>
                    </div>

                    <div className="mb-12">
                        <h2 className="text-2xl font-bold text-primary mb-4">11. Governing Law</h2>
                        <p className="text-base text-foreground leading-relaxed mb-4">
                            These Terms and Conditions are governed by and construed in accordance with the laws of Papua New Guinea.
                            Any disputes shall be subject to the exclusive jurisdiction of the courts of Papua New Guinea.
                        </p>
                    </div>

                    <div className="mb-12">
                        <h2 className="text-2xl font-bold text-primary mb-4">12. Changes to Terms</h2>
                        <p className="text-base text-foreground leading-relaxed mb-4">
                            We reserve the right to modify these Terms and Conditions at any time. Changes will be effective immediately upon
                            posting to our website. Your continued use of our services constitutes acceptance of the modified terms.
                        </p>
                    </div>

                    <div className="mb-12">
                        <h2 className="text-2xl font-bold text-primary mb-4">13. Contact Information</h2>
                        <p className="text-base text-foreground leading-relaxed mb-4">
                            If you have any questions about these Terms and Conditions, please contact us at:
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
