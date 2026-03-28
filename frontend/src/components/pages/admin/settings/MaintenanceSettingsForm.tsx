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
            <div className={`p-5 rounded-2xl border transition-all duration-300 ${enabled ? 'bg-amber-50/50 border-amber-200 shadow-sm' : 'bg-slate-50 border-slate-100'}`}>
                <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-xl transition-colors ${enabled ? 'bg-amber-100 text-amber-600' : 'bg-slate-200 text-slate-500'}`}>
                        <AlertTriangle size={24} />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-900 mb-1 text-lg">
                            {enabled ? 'Maintenance Mode Active' : 'System Status: Live'}
                        </h3>
                        <p className="text-sm text-slate-600 font-medium   leading-relaxed">
                            {enabled
                                ? 'The public application is currently restricted. Only administrative staff can access the system.'
                                : 'The application is fully operational and accessible to all customers and guests.'}
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex justify-end pt-2">
                <button
                    onClick={handleToggle}
                    disabled={loading}
                    className={`
                        px-8 py-3 rounded-xl font-bold transition-all flex items-center gap-2 shadow-lg
                        ${enabled
                            ? 'bg-slate-100 text-slate-700 hover:bg-slate-200 shadow-slate-200/20'
                            : 'bg-amber-600 text-white hover:bg-amber-700 shadow-amber-600/20'}
                        disabled:opacity-50 disabled:cursor-not-allowed
                    `}
                >
                    {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                    {enabled ? 'Deactivate Maintenance Mode' : 'Activate Maintenance Mode'}
                </button>
            </div>
        </div>
    );
}
