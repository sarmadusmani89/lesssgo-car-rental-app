'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import SubscribersHeader from '@/components/pages/admin/newsletter/SubscribersHeader';
import SubscribersTable from '@/components/pages/admin/newsletter/SubscribersTable';

export default function AdminNewsletterPage() {
    const [subscribers, setSubscribers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const fetchSubscribers = async (showLoading = true) => {
        if (showLoading) setLoading(true);
        try {
            const res = await api.get('/newsletter');
            setSubscribers(res.data);
        } catch (error) {
            console.error('Failed to fetch subscribers:', error);
            toast.error('Failed to load subscribers');
        } finally {
            if (showLoading) setLoading(false);
        }
    };

    useEffect(() => {
        fetchSubscribers();
    }, []);

    const handleRefresh = async () => {
        setIsRefreshing(true);
        try {
            await fetchSubscribers(false);
            toast.success('Subscribers updated');
        } finally {
            setIsRefreshing(false);
        }
    };

    const handleExport = () => {
        if (subscribers.length === 0) {
            toast.error('No subscribers to export');
            return;
        }

        const headers = ['Email', 'Subscribed Date'];
        const csvRows = subscribers.map(s => [
            s.email,
            new Date(s.subscribedAt).toISOString()
        ]);

        const csvContent = [headers, ...csvRows]
            .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
            .join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `newsletter_subscribers_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast.success(`Exported ${subscribers.length} subscribers successfully`);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <SubscribersHeader
                onExport={handleExport}
                onRefresh={handleRefresh}
                isRefreshing={isRefreshing}
            />
            <SubscribersTable subscribers={subscribers} />
        </div>
    );
}
