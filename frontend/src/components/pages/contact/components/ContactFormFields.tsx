import { UseFormRegister, FieldErrors } from 'react-hook-form';

interface ContactFormData {
    name: string;
    email: string;
    subject: string;
    message: string;
}

interface ContactFormFieldsProps {
    register: UseFormRegister<ContactFormData>;
    errors: FieldErrors<ContactFormData>;
}

export default function ContactFormFields({ register, errors }: ContactFormFieldsProps) {
    const inputClasses = (hasError: boolean) => `
        w-full px-5 py-4 bg-slate-50 border-2 rounded-2xl text-base transition-all outline-none
        ${hasError 
            ? 'border-red-500 bg-red-50/10 focus:ring-red-500/10' 
            : 'border-slate-100 focus:bg-white focus:border-accent focus:ring-accent/10'}
    `.replace(/\s+/g, ' ').trim();

    return (
        <>
            <div className="flex flex-col gap-2">
                <label htmlFor="name" className="text-[15px] font-bold text-primary">Full Name <span className="text-accent">*</span></label>
                <input
                    id="name"
                    type="text"
                    {...register('name', { required: 'Name is required' })}
                    className={inputClasses(!!errors.name)}
                />
                {errors.name && <span className="text-red-500 text-sm font-semibold mt-1 animate-in fade-in slide-in-from-top-1 duration-200">{errors.name.message}</span>}
            </div>

            <div className="flex flex-col gap-2">
                <label htmlFor="email" className="text-[15px] font-bold text-primary">Email Address <span className="text-accent">*</span></label>
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
                    className={inputClasses(!!errors.email)}
                />
                {errors.email && <span className="text-red-500 text-sm font-semibold mt-1 animate-in fade-in slide-in-from-top-1 duration-200">{errors.email.message}</span>}
            </div>

            <div className="flex flex-col gap-2">
                <label htmlFor="subject" className="text-[15px] font-bold text-primary">Subject <span className="text-accent">*</span></label>
                <input
                    id="subject"
                    type="text"
                    {...register('subject', { required: 'Subject is required' })}
                    className={inputClasses(!!errors.subject)}
                />
                {errors.subject && <span className="text-red-500 text-sm font-semibold mt-1 animate-in fade-in slide-in-from-top-1 duration-200">{errors.subject.message}</span>}
            </div>

            <div className="flex flex-col gap-2">
                <label htmlFor="message" className="text-[15px] font-bold text-primary">Message <span className="text-accent">*</span></label>
                <textarea
                    id="message"
                    rows={6}
                    {...register('message', {
                        required: 'Message is required',
                        minLength: { value: 10, message: 'Message must be at least 10 characters' },
                    })}
                    className={inputClasses(!!errors.message)}
                />
                {errors.message && <span className="text-red-500 text-sm font-semibold mt-1 animate-in fade-in slide-in-from-top-1 duration-200">{errors.message.message}</span>}
            </div>
        </>
    );
}
