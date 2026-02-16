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
    const baseStyles = "w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all";

    return (
        <div className="space-y-1.5 w-full">
            {label && (
                <label className="text-sm font-semibold text-gray-700">
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
