'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import api from '@/lib/api';
import { Loader2, Save } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface SecuritySettingsFormProps {
    onSaved: () => void;
    initialData?: any;
}

export default function SecuritySettingsForm({ onSaved, initialData }: SecuritySettingsFormProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        passwordMinLength: 8,
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                passwordMinLength: initialData.passwordMinLength || 8,
            });
        }
    }, [initialData]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await api.put('/settings', formData);
            toast.success('Security settings updated successfully');
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
                    Minimum Password Length
                </label>
                <input
                    type="number"
                    min="6"
                    max="32"
                    value={formData.passwordMinLength}
                    onChange={(e) => setFormData({ ...formData, passwordMinLength: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all"
                    required
                />
                <p className="text-xs text-slate-500 mt-1 font-medium">
                    Enforces a minimum character count for new user passwords.
                </p>
            </div>

            <div className="pt-6 flex justify-end">
                <Button
                    type="submit"
                    isLoading={loading}
                    className="px-8 py-3 rounded-xl shadow-lg shadow-primary/20 font-bold"
                >
                    {!loading && <Save className="w-5 h-5 mr-2" />}
                    Save Security Settings
                </Button>
            </div>
        </form>
    );
}
