'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Mail, MapPin, Phone, Send } from 'lucide-react';
import styles from './contact.module.css';

interface ContactFormData {
    name: string;
    email: string;
    subject: string;
    message: string;
}

export default function ContactPage() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { register, handleSubmit, reset, formState: { errors } } = useForm<ContactFormData>();

    const onSubmit = async (data: ContactFormData) => {
        setIsSubmitting(true);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/contact`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) throw new Error('Failed to send message');

            toast.success('Message sent successfully! We\'ll get back to you soon.');
            reset();
        } catch (error) {
            toast.error('Failed to send message. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

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
        <div className={styles.container}>
            <section className={styles.hero}>
                <div className="container">
                    <h1 className={styles.title}>Get In Touch</h1>
                    <p className={styles.subtitle}>
                        Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
                    </p>
                </div>
            </section>

            <section className={styles.content}>
                <div className="container">
                    <div className={styles.grid}>
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

                        <div className={styles.formSection}>
                            <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
                                <div className={styles.formGroup}>
                                    <label htmlFor="name">Full Name</label>
                                    <input
                                        id="name"
                                        type="text"
                                        {...register('name', { required: 'Name is required' })}
                                        className={errors.name ? styles.inputError : ''}
                                    />
                                    {errors.name && <span className={styles.error}>{errors.name.message}</span>}
                                </div>

                                <div className={styles.formGroup}>
                                    <label htmlFor="email">Email Address</label>
                                    <input
                                        id="email"
                                        type="email"
                                        {...register('email', {
                                            required: 'Email is required',
                                            pattern: {
                                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                message: 'Invalid email address',
                                            },
                                        })}
                                        className={errors.email ? styles.inputError : ''}
                                    />
                                    {errors.email && <span className={styles.error}>{errors.email.message}</span>}
                                </div>

                                <div className={styles.formGroup}>
                                    <label htmlFor="subject">Subject</label>
                                    <input
                                        id="subject"
                                        type="text"
                                        {...register('subject', { required: 'Subject is required' })}
                                        className={errors.subject ? styles.inputError : ''}
                                    />
                                    {errors.subject && <span className={styles.error}>{errors.subject.message}</span>}
                                </div>

                                <div className={styles.formGroup}>
                                    <label htmlFor="message">Message</label>
                                    <textarea
                                        id="message"
                                        rows={6}
                                        {...register('message', {
                                            required: 'Message is required',
                                            minLength: { value: 10, message: 'Message must be at least 10 characters' },
                                        })}
                                        className={errors.message ? styles.inputError : ''}
                                    />
                                    {errors.message && <span className={styles.error}>{errors.message.message}</span>}
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className={`btn btn-primary btn-lg ${styles.submitBtn}`}
                                >
                                    {isSubmitting ? 'Sending...' : (
                                        <>
                                            Send Message
                                            <Send size={20} />
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
