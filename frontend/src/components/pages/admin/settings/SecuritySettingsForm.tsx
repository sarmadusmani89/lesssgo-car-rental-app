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
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />
                <p className="text-xs text-gray-500 mt-1">
                    Enforces a minimum character count for new user passwords.
                </p>
            </div>

            <div className="pt-4 flex justify-end">
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
