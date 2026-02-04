'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import api from '@/lib/api';
import { Loader2, AlertTriangle } from 'lucide-react';

interface MaintenanceSettingsFormProps {
    onSaved: () => void;
    initialData?: any;
}

export default function MaintenanceSettingsForm({ onSaved, initialData }: MaintenanceSettingsFormProps) {
    const [loading, setLoading] = useState(false);
    const [enabled, setEnabled] = useState(false);

    useEffect(() => {
        if (initialData) {
            setEnabled(initialData.maintenanceMode || false);
        }
    }, [initialData]);

    const handleToggle = async () => {
        setLoading(true);
        const newState = !enabled;

        try {
            await api.put('/settings', { maintenanceMode: newState });
            setEnabled(newState);
            toast.success(`Maintenance mode turned ${newState ? 'ON' : 'OFF'}`);
            onSaved();
        } catch (error) {
            console.error('Failed to update maintenance mode:', error);
            toast.error('Failed to update maintenance mode');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className={`p-4 rounded-xl border ${enabled ? 'bg-amber-50 border-amber-200' : 'bg-gray-50 border-gray-200'}`}>
                <div className="flex items-start gap-4">
                    <div className={`p-2 rounded-lg ${enabled ? 'bg-amber-100 text-amber-600' : 'bg-gray-200 text-gray-500'}`}>
                        <AlertTriangle size={24} />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900 mb-1">
                            {enabled ? 'Maintenance Mode is Active' : 'System is Live'}
                        </h3>
                        <p className="text-sm text-gray-600">
                            {enabled
                                ? 'Users cannot access the public site. Only admins can log in.'
                                : 'The application is fully accessible to all users.'}
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex justify-end pt-2">
                <button
                    onClick={handleToggle}
                    disabled={loading}
                    className={`
            px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2
            ${enabled
                            ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            : 'bg-amber-600 text-white hover:bg-amber-700'}
          `}
                >
                    {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                    {enabled ? 'Deactivate Maintenance Mode' : 'Activate Maintenance Mode'}
                </button>
            </div>
        </div>
    );
}
