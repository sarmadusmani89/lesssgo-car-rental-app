import { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import api from '@/lib/api';
import { Loader2, Save, Upload, X } from 'lucide-react';
import Image from 'next/image';

interface GeneralSettingsFormProps {
    onSaved: () => void;
    initialData?: any;
}

export default function GeneralSettingsForm({ onSaved, initialData }: GeneralSettingsFormProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        siteName: '',
        adminEmail: '',
    });
    const [favicon, setFavicon] = useState<File | null>(null);
    const [faviconPreview, setFaviconPreview] = useState<string>('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (initialData) {
            setFormData({
                siteName: initialData.siteName || '',
                adminEmail: initialData.adminEmail || '',
            });
            if (initialData.faviconUrl) {
                setFaviconPreview(initialData.faviconUrl);
            }
        }
    }, [initialData]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFavicon(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setFaviconPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeFavicon = () => {
        setFavicon(null);
        setFaviconPreview(initialData?.faviconUrl || '');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const data = new FormData();
            data.append('siteName', formData.siteName);
            data.append('adminEmail', formData.adminEmail);
            if (favicon) {
                data.append('favicon', favicon);
            }

            await api.put('/settings', data);
            toast.success('Settings updated successfully');
            onSaved();
        } catch (error) {
            console.error('Failed to update settings:', error);
            toast.error('Failed to update settings');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Site Name
                </label>
                <input
                    type="text"
                    value={formData.siteName}
                    onChange={(e) => setFormData({ ...formData, siteName: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g. Lesssgo Car Rental"
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Admin Notification Email
                </label>
                <input
                    type="email"
                    value={formData.adminEmail}
                    onChange={(e) => setFormData({ ...formData, adminEmail: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g. admin@example.com"
                    required
                />
                <p className="text-xs text-gray-500 mt-1">
                    Systems notifications and contact form messages will be sent to this address.
                </p>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Site Favicon
                </label>
                <div className="flex items-center gap-4">
                    <div className="relative w-16 h-16 border border-gray-200 rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center">
                        {faviconPreview ? (
                            <Image
                                src={faviconPreview}
                                alt="Favicon Preview"
                                fill
                                className="object-contain p-1"
                            />
                        ) : (
                            <Upload className="w-6 h-6 text-gray-400" />
                        )}
                        {favicon && (
                            <button
                                type="button"
                                onClick={removeFavicon}
                                className="absolute top-0 right-0 bg-red-500 text-white p-0.5 rounded-bl-lg hover:bg-red-600 transition-colors"
                            >
                                <X size={12} />
                            </button>
                        )}
                    </div>
                    <div>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept="image/*"
                            className="hidden"
                        />
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="text-sm bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
                        >
                            <Upload className="w-4 h-4" />
                            {faviconPreview ? 'Change Favicon' : 'Upload Favicon'}
                        </button>
                        <p className="text-[10px] text-gray-500 mt-1">
                            Recommended size: 32x32 or 48x48. PNG, ICO, or SVG.
                        </p>
                    </div>
                </div>
            </div>

            <div className="pt-4 flex justify-end">
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Save Changes
                </button>
            </div>
        </form>
    );
}
