import styles from './terms.module.css';

export default function TermsPage() {
    const lastUpdated = 'February 3, 2026';

    return (
        <div className={styles.container}>
            <section className={styles.hero}>
                <div className="container">
                    <h1 className={styles.title}>Terms & Conditions</h1>
                    <p className={styles.lastUpdated}>Last Updated: {lastUpdated}</p>
                </div>
            </section>

            <section className={styles.content}>
                <div className="container">
                    <div className={styles.legal}>
                        <div className={styles.section}>
                            <h2>1. Agreement to Terms</h2>
                            <p>
                                By accessing and using Lesssgo's car rental services, you agree to be bound by these Terms and Conditions.
                                If you do not agree to these terms, please do not use our services.
                            </p>
                        </div>

                        <div className={styles.section}>
                            <h2>2. Rental Agreement</h2>
                            <p>
                                When you rent a car from Lesssgo, you enter into a legally binding rental agreement. You must be at least
                                21 years old and hold a valid driver's license to rent a car.
                            </p>
                            <p>
                                The rental period begins at the time specified in your booking confirmation and ends when you return the car
                                to the designated location. Late returns may incur additional charges.
                            </p>
                        </div>

                        <div className={styles.section}>
                            <h2>3. Driver Requirements</h2>
                            <p>
                                All drivers must:
                            </p>
                            <ul>
                                <li>Be at least 21 years of age (25 for premium cars)</li>
                                <li>Possess a valid driver's license for at least one year</li>
                                <li>Present a valid government-issued ID</li>
                                <li>Provide a valid credit card in their name</li>
                            </ul>
                        </div>

                        <div className={styles.section}>
                            <h2>4. Car Use and Restrictions</h2>
                            <p>
                                You agree to:
                            </p>
                            <ul>
                                <li>Use the car only for lawful purposes</li>
                                <li>Not allow unauthorized persons to drive the car</li>
                                <li>Not use the car for racing, towing, or off-road driving</li>
                                <li>Not transport illegal substances or engage in illegal activities</li>
                                <li>Return the car in the same condition as received, normal wear and tear excepted</li>
                            </ul>
                        </div>

                        <div className={styles.section}>
                            <h2>5. Payment and Fees</h2>
                            <p>
                                You agree to pay all charges associated with your rental, including:
                            </p>
                            <ul>
                                <li>Daily rental fees</li>
                                <li>Insurance coverage</li>
                                <li>Additional driver fees (if applicable)</li>
                                <li>Fuel charges if not returned with same fuel level</li>
                                <li>Late return fees</li>
                                <li>Tolls, parking tickets, and traffic violations</li>
                            </ul>
                        </div>

                        <div className={styles.section}>
                            <h2>6. Insurance and Liability</h2>
                            <p>
                                Basic insurance coverage is included in all rentals. You are responsible for any damage to the car during
                                the rental period up to the excess amount. Additional insurance options are available to reduce or eliminate the excess.
                            </p>
                            <p>
                                In case of an accident, you must immediately notify the police and Lesssgo. Failure to do so may void your insurance coverage.
                            </p>
                        </div>

                        <div className={styles.section}>
                            <h2>7. Cancellation and Modifications</h2>
                            <p>
                                You may cancel or modify your booking up to 24 hours before the scheduled pickup time without penalty.
                                Cancellations made within 24 hours are subject to a cancellation fee equivalent to one day's rental charge.
                            </p>
                        </div>

                        <div className={styles.section}>
                            <h2>8. Fuel Policy</h2>
                            <p>
                                Cars are provided with a full tank of fuel and must be returned with a full tank. If the car is returned
                                with less fuel, you will be charged for refueling at a premium rate plus a service fee.
                            </p>
                        </div>

                        <div className={styles.section}>
                            <h2>9. Breakdown and Accidents</h2>
                            <p>
                                In the event of a breakdown or accident, contact our 24/7 emergency hotline immediately. Do not arrange for repairs
                                without our authorization. We provide roadside assistance at no additional charge.
                            </p>
                        </div>

                        <div className={styles.section}>
                            <h2>10. Limitation of Liability</h2>
                            <p>
                                Lesssgo shall not be liable for any indirect, incidental, special, or consequential damages arising from your use
                                of our services. Our liability is limited to the rental charges paid.
                            </p>
                        </div>

                        <div className={styles.section}>
                            <h2>11. Governing Law</h2>
                            <p>
                                These Terms and Conditions are governed by and construed in accordance with the laws of California, United States.
                                Any disputes shall be subject to the exclusive jurisdiction of the courts of California.
                            </p>
                        </div>

                        <div className={styles.section}>
                            <h2>12. Changes to Terms</h2>
                            <p>
                                We reserve the right to modify these Terms and Conditions at any time. Changes will be effective immediately upon
                                posting to our website. Your continued use of our services constitutes acceptance of the modified terms.
                            </p>
                        </div>

                        <div className={styles.section}>
                            <h2>13. Contact Information</h2>
                            <p>
                                If you have any questions about these Terms and Conditions, please contact us at:
                            </p>
                            <p>
                                Email: legal@lesssgo.com<br />
                                Phone: +1 (555) 123-4567<br />
                                Address: 1234 Sports Car Blvd, Beverly Hills, CA 90210
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
