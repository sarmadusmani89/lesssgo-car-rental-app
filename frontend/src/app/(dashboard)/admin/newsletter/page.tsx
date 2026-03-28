'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import SubscribersHeader from '@/components/pages/admin/newsletter/SubscribersHeader';
import SubscribersTable, { Subscriber } from '@/components/pages/admin/newsletter/SubscribersTable';
import { Pagination } from '@/components/ui/Pagination';

export default function AdminNewsletterPage() {
    const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
    const [loading, setLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    
    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [totalSubscribers, setTotalSubscribers] = useState(0);
    const limit = 10;

    const fetchSubscribers = async (page = 1, showLoading = true) => {
        if (showLoading) setLoading(true);
        try {
            const res = await api.get(`/newsletter?page=${page}&limit=${limit}`);
            setSubscribers(res.data.subscribers);
            setTotalSubscribers(res.data.totalCount);
            setCurrentPage(res.data.currentPage);
        } catch (error) {
            console.error('Failed to fetch subscribers:', error);
            toast.error('Failed to load subscribers');
        } finally {
            if (showLoading) setLoading(false);
        }
    };

    useEffect(() => {
        fetchSubscribers(currentPage);
    }, [currentPage]);

    const handleRefresh = async () => {
        setIsRefreshing(true);
        try {
            await fetchSubscribers(currentPage, false);
            toast.success('Subscribers updated');
        } finally {
            setIsRefreshing(false);
        }
    };

    const handleExport = async () => {
        try {
            toast.loading('Preparing export of all subscribers...');
            // Fetch ALL subscribers for export
            const res = await api.get('/newsletter?page=1&limit=1000000');
            const allSubscribers = res.data.subscribers;

            if (allSubscribers.length === 0) {
                toast.dismiss();
                toast.error('No subscribers to export');
                return;
            }

            const headers = ['Email', 'Subscribed Date'];
            const csvRows = allSubscribers.map((s: Subscriber) => [
                s.email,
                new Date(s.subscribedAt).toISOString()
            ]);

            const csvContent = ([headers, ...csvRows] as string[][])
                .map((row: string[]) => row.map((cell: string) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
                .join('\n');

            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.setAttribute('href', url);
            link.setAttribute('download', `newsletter_subscribers_${new Date().toISOString().split('T')[0]}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            toast.dismiss();
            toast.success(`Exported ${allSubscribers.length} subscribers successfully`);
        } catch (error) {
            toast.dismiss();
            toast.error('Failed to export subscribers');
        }
    };

    if (loading && subscribers.length === 0) {
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
            
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <SubscribersTable subscribers={subscribers} />
                
                <div className="border-t border-slate-100 p-4">
                    <Pagination
                        currentPage={currentPage}
                        totalItems={totalSubscribers}
                        itemsPerPage={limit}
                        onPageChange={(page) => setCurrentPage(page)}
                    />
                </div>
            </div>
        </div>
    );
}
