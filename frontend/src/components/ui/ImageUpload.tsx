'use client';

import { useRef } from 'react';
import { Upload, Image as ImageIcon, X } from 'lucide-react';

interface ImageUploadProps {
    label?: string;
    imagePreview: string;
    imageFile: File | null;
    onImageChange: (file: File) => void;
    onImageRemove: () => void;
    helperText?: string;
    className?: string;
}

export default function ImageUpload({
    label = 'Upload Photo',
    imagePreview,
    imageFile,
    onImageChange,
    onImageRemove,
    helperText = 'PNG, JPG or WebP (Max. 5MB)',
    className = ''
}: ImageUploadProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            onImageChange(file);
        }
    };

    return (
        <div className={`space-y-1.5 ${className}`}>
            {label && <label className="text-sm font-semibold text-gray-700">{label}</label>}
            <div
                onClick={() => fileInputRef.current?.click()}
                className="relative group cursor-pointer border-2 border-dashed border-gray-200 rounded-2xl p-4 transition-all hover:border-blue-400 hover:bg-blue-50/50"
            >
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                />

                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-100">
                        {imagePreview ? (
                            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                            <ImageIcon size={24} className="text-gray-400" />
                        )}
                    </div>

                    <div className="flex-1">
                        <p className="font-semibold text-gray-700 group-hover:text-blue-600 transition-colors">
                            {imageFile ? imageFile.name : 'Click to upload'}
                        </p>
                        <p className="text-sm text-gray-500">{helperText}</p>
                    </div>

                    <div className="p-2 rounded-lg bg-gray-50 text-gray-400 group-hover:bg-blue-100 group-hover:text-blue-600 transition-all">
                        <Upload size={20} />
                    </div>
                </div>

                {imagePreview && (
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            onImageRemove();
                            if (fileInputRef.current) fileInputRef.current.value = '';
                        }}
                        className="absolute -top-2 -right-2 p-1 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors shadow-sm"
                    >
                        <X size={14} />
                    </button>
                )}
            </div>
        </div>
    );
}
