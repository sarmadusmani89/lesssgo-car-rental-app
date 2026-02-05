'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import styles from '@/app/(public)/contact/contact.module.css';
import ContactFormFields from '../components/ContactFormFields';

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
                <ContactFormFields register={register} errors={errors} />

                <Button
                    type="submit"
                    isLoading={isSubmitting}
                    disabled={isSubmitting}
                    size="lg"
                    className={styles.submitBtn}
                >
                    Send Message
                    <Send size={20} className="ml-2" />
                </Button>
            </form>
        </div>
    );
}
