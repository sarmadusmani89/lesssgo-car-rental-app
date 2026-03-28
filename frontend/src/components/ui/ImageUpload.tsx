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
            {label && <label className="text-[13px] font-bold text-muted-foreground uppercase tracking-wider">{label}</label>}
            <div
                onClick={() => fileInputRef.current?.click()}
                className="relative group cursor-pointer border-2 border-dashed border-border rounded-2xl p-4 transition-all hover:border-accent hover:bg-accent/5"
            >
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                />

                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl bg-muted flex items-center justify-center overflow-hidden border border-border">
                        {imagePreview ? (
                            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                            <ImageIcon size={24} className="text-muted-foreground/50" />
                        )}
                    </div>

                    <div className="flex-1">
                        <p className="font-bold text-foreground group-hover:text-accent transition-colors">
                            {imageFile ? imageFile.name : 'Click to upload'}
                        </p>
                        <p className="text-sm text-muted-foreground">{helperText}</p>
                    </div>

                    <div className="p-2.5 rounded-xl bg-muted text-muted-foreground group-hover:bg-accent group-hover:text-accent-foreground transition-all">
                        <Upload size={18} />
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
