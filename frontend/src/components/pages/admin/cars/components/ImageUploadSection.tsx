"use client";

import { Upload, Image as ImageIcon } from "lucide-react";

interface Props {
    imagePreview: string;
    handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function ImageUploadSection({ imagePreview, handleImageChange }: Props) {
    return (
        <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100 space-y-4">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Vehicle Identity</h3>
            <div className="flex items-center gap-6">
                {imagePreview ? (
                    <div className="relative w-full h-40 rounded-2xl overflow-hidden border-2 border-blue-500 group">
                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                        <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer">
                            <Upload className="text-white" size={24} />
                            <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                        </label>
                    </div>
                ) : (
                    <label className="w-full h-40 rounded-2xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center gap-2 hover:border-blue-500 hover:bg-blue-50 transition cursor-pointer group">
                        <div className="p-3 bg-gray-50 rounded-full group-hover:bg-blue-100 transition">
                            <ImageIcon className="text-gray-400 group-hover:text-blue-600" size={24} />
                        </div>
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Select Car Image</span>
                        <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                    </label>
                )}
            </div>
        </div>
    );
}
