'use client';

import React from 'react';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
    label?: string;
    isTextArea?: boolean;
}

export default function FormInput({
    label,
    isTextArea = false,
    className = '',
    required = false,
    ...props
}: FormInputProps) {
    const baseStyles = "w-full px-4 py-2 rounded-xl bg-input border border-border focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all placeholder:text-muted-foreground/50";

    return (
        <div className="space-y-1.5 w-full">
            {label && (
                <label className="text-[13px] font-bold text-muted-foreground uppercase tracking-wider">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
            )}

            {isTextArea ? (
                <textarea
                    {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
                    className={`${baseStyles} min-h-[100px] ${className}`}
                    required={required}
                />
            ) : (
                <input
                    {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
                    className={`${baseStyles} ${className}`}
                    required={required}
                />
            )}
        </div>
    );
}
