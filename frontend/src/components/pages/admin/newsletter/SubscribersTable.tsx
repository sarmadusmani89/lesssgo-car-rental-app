'use client';

import { Mail } from 'lucide-react';
import SubscribersTableRow from './SubscribersTableRow';

interface Subscriber {
    id: string;
    email: string;
    subscribedAt: string;
}

interface SubscribersTableProps {
    subscribers: Subscriber[];
}

export default function SubscribersTable({ subscribers }: SubscribersTableProps) {
    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Email Address</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Subscribed Date</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {subscribers.length === 0 ? (
                            <tr>
                                <td colSpan={3} className="px-6 py-12 text-center text-gray-500">
                                    <Mail className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                    <p>No subscribers yet.</p>
                                </td>
                            </tr>
                        ) : (
                            subscribers.map((sub) => (
                                <SubscribersTableRow key={sub.id} subscriber={sub} />
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
