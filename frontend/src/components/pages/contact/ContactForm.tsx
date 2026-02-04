'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Send } from 'lucide-react';
import styles from '@/app/(public)/contact/contact.module.css';

interface ContactFormData {
    name: string;
    email: string;
    subject: string;
    message: string;
}

export default function ContactForm() {
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

    return (
        <div className={styles.formSection}>
            <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
                <div className={styles.formGroup}>
                    <label htmlFor="name">Full Name <span className="text-red-500">*</span></label>
                    <input
                        id="name"
                        type="text"
                        {...register('name', { required: 'Name is required' })}
                        className={errors.name ? styles.inputError : ''}
                    />
                    {errors.name && <span className={styles.error}>{errors.name.message}</span>}
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="email">Email Address <span className="text-red-500">*</span></label>
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
                    <label htmlFor="subject">Subject <span className="text-red-500">*</span></label>
                    <input
                        id="subject"
                        type="text"
                        {...register('subject', { required: 'Subject is required' })}
                        className={errors.subject ? styles.inputError : ''}
                    />
                    {errors.subject && <span className={styles.error}>{errors.subject.message}</span>}
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="message">Message <span className="text-red-500">*</span></label>
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
    );
}
