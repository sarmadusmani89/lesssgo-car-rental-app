import { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import api from '@/lib/api';
import { Loader2, Save, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import Image from 'next/image';
import { formatPNGPhone, mapToPNGPrefix } from '@/lib/utils';
import { useTheme } from '@/components/common/Providers/ThemeProvider';

interface GeneralSettingsFormProps {
    onSaved: () => void;
    initialData?: any;
}

export default function GeneralSettingsForm({ onSaved, initialData }: GeneralSettingsFormProps) {
    const { refreshTheme } = useTheme();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        siteName: '',
        adminEmail: '',
        contactEmail: '',
        contactPhone: '',
        contactWhatsApp: '',
        contactAddress: '',
        theme: 'theme-corporate-blue',
    });
    const [favicon, setFavicon] = useState<File | null>(null);
    const [faviconPreview, setFaviconPreview] = useState<string>('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (initialData) {
            // Remove +675 for display if present
            const displayPhone = (phone?: string) => {
                if (!phone) return '';
                return phone.startsWith('+675') ? phone.slice(4).trim() : phone;
            };

            setFormData({
                siteName: initialData.siteName || '',
                adminEmail: initialData.adminEmail || '',
                contactEmail: initialData.contactEmail || '',
                contactPhone: formatPNGPhone(displayPhone(initialData.contactPhone)),
                contactWhatsApp: formatPNGPhone(displayPhone(initialData.contactWhatsApp)),
                contactAddress: initialData.contactAddress || '',
                theme: initialData.theme || 'theme-corporate-blue',
            });
            if (initialData.faviconUrl) {
                setFaviconPreview(initialData.faviconUrl);
            }
        }
    }, [initialData]);

    const handlePhoneChange = (field: 'contactPhone' | 'contactWhatsApp', value: string) => {
        const formatted = formatPNGPhone(value);
        if (formatted.replace(/\s/g, '').length <= 8) {
            setFormData(prev => ({ ...prev, [field]: formatted }));
        }
    };

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
            data.append('contactEmail', formData.contactEmail);

            data.append('contactPhone', mapToPNGPrefix(formData.contactPhone));
            data.append('contactWhatsApp', mapToPNGPrefix(formData.contactWhatsApp));
            data.append('contactAddress', formData.contactAddress);
            data.append('theme', formData.theme);
            if (favicon) {
                data.append('favicon', favicon);
            }

            await api.put('/settings', data);
            toast.success('Settings updated successfully');
            refreshTheme(); // Refresh theme immediately
            onSaved();
        } catch (error) {
            console.error('Failed to update settings:', error);
            toast.error('Failed to update settings');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto px-1 pt-8">
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Admin Notification Email
                    </label>
                    <input
                        type="email"
                        value={formData.adminEmail}
                        onChange={(e) => setFormData({ ...formData, adminEmail: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="admin@example.com"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Public Contact Email
                    </label>
                    <input
                        type="email"
                        value={formData.contactEmail}
                        onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="info@example.com"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Contact Phone
                    </label>
                    <div className="flex">
                        <span className="flex items-center px-4 py-2 border border-r-0 border-gray-200 rounded-l-lg bg-gray-50 text-gray-500 font-bold text-sm">
                            +675
                        </span>
                        <input
                            type="text"
                            value={formData.contactPhone}
                            onChange={(e) => handlePhoneChange('contactPhone', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-200 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="7XXX XXXX"
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        WhatsApp Number
                    </label>
                    <div className="flex">
                        <span className="flex items-center px-4 py-2 border border-r-0 border-gray-200 rounded-l-lg bg-gray-50 text-gray-500 font-bold text-sm">
                            +675
                        </span>
                        <input
                            type="text"
                            value={formData.contactWhatsApp}
                            onChange={(e) => handlePhoneChange('contactWhatsApp', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-200 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="7XXX XXXX"
                        />
                    </div>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Business Address
                </label>
                <textarea
                    value={formData.contactAddress}
                    onChange={(e) => setFormData({ ...formData, contactAddress: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[80px]"
                    placeholder="Physical location..."
                />
            </div>

            <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">
                    System Theme
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                        { id: 'theme-corporate-blue', name: 'Corporate Blue', primary: '#1e3a8a', secondary: '#0f172a' },
                        { id: 'theme-premium-green', name: 'Premium Green', primary: '#065f46', secondary: '#111827' },
                        { id: 'theme-premium-orange', name: 'Premium Orange', primary: '#c2410c', secondary: '#111827' },
                    ].map((theme) => (
                        <Button
                            key={theme.id}
                            type="button"
                            variant={formData.theme === theme.id ? 'primary' : 'outline'}
                            onClick={() => setFormData({ ...formData, theme: theme.id })}
                            className={`relative flex flex-col p-3 border-2 h-auto text-left items-start transition-all hover:bg-secondary/30 ${formData.theme === theme.id
                                ? 'border-primary bg-secondary ring-2 ring-primary/10'
                                : 'border-gray-100 bg-white'
                                }`}
                        >
                            <div className="flex gap-1.5 mb-2">
                                <div
                                    className="w-6 h-6 rounded-full border border-black/5"
                                    style={{ backgroundColor: theme.primary }}
                                />
                                <div
                                    className="w-6 h-6 rounded-full border border-black/5"
                                    style={{ backgroundColor: theme.secondary }}
                                />
                            </div>
                            <span className={`text-xs font-semibold ${formData.theme === theme.id ? 'text-blue-700' : 'text-gray-600'
                                }`}>
                                {theme.name}
                            </span>
                            {formData.theme === theme.id && (
                                <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-blue-600" />
                            )}
                        </Button>
                    ))}
                </div>
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
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={removeFavicon}
                                className="absolute top-0 right-0 bg-red-500 text-white p-0.5 rounded-none rounded-bl-lg hover:bg-red-600 h-5 w-5"
                            >
                                <X size={12} />
                            </Button>
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
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => fileInputRef.current?.click()}
                            className="text-sm bg-gray-100 text-gray-700 px-4 py-2 hover:bg-gray-200 h-auto"
                        >
                            <Upload className="w-4 h-4 mr-2" />
                            {faviconPreview ? 'Change Favicon' : 'Upload Favicon'}
                        </Button>
                    </div>
                </div>
            </div>

            <div className="pt-4 flex justify-end sticky bottom-0 bg-white">
                <Button
                    type="submit"
                    isLoading={loading}
                    className="px-6 py-2"
                >
                    {!loading && <Save className="w-4 h-4 mr-2" />}
                    Save Changes
                </Button>
            </div>
        </form>
    );
}
