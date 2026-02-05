"use client";

import { Upload, Image as ImageIcon, X, Plus } from "lucide-react";

interface Props {
    imagePreview: string;
    handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    galleryPreviews: string[];
    handleGalleryChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    removeGalleryImage: (index: number) => void;
}

export default function ImageUploadSection({
    imagePreview,
    handleImageChange,
    galleryPreviews,
    handleGalleryChange,
    removeGalleryImage
}: Props) {
    return (
        <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100 space-y-6">
            <div>
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Primary Identity</h3>
                <div className="flex items-center gap-6">
                    {imagePreview ? (
                        <div className="relative w-full h-48 rounded-2xl overflow-hidden border-2 border-blue-500 group shadow-lg">
                            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                            <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer">
                                <Upload className="text-white" size={24} />
                                <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                            </label>
                        </div>
                    ) : (
                        <label className="w-full h-48 rounded-2xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center gap-2 hover:border-blue-500 hover:bg-blue-50 transition cursor-pointer group">
                            <div className="p-3 bg-gray-50 rounded-full group-hover:bg-blue-100 transition">
                                <ImageIcon className="text-gray-400 group-hover:text-blue-600" size={24} />
                            </div>
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Select Key Image</span>
                            <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                        </label>
                    )}
                </div>
            </div>

            <div>
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Vehicle Gallery</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {galleryPreviews.map((prev, index) => (
                        <div key={index} className="relative aspect-square rounded-xl overflow-hidden border border-gray-200 group">
                            <img src={prev} alt={`Gallery ${index}`} className="w-full h-full object-cover" />
                            <button
                                onClick={() => removeGalleryImage(index)}
                                className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition shadow-md"
                            >
                                <X size={14} />
                            </button>
                        </div>
                    ))}
                    <label className="aspect-square rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-1 hover:border-blue-500 hover:bg-blue-50 transition cursor-pointer group">
                        <Plus size={20} className="text-gray-400 group-hover:text-blue-600" />
                        <span className="text-[10px] font-bold text-gray-400 uppercase">Add photo</span>
                        <input type="file" className="hidden" accept="image/*" multiple onChange={handleGalleryChange} />
                    </label>
                </div>
            </div>
        </div>
    );
}
