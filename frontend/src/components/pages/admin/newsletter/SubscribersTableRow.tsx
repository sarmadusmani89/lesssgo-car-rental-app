'use client';

import { Mail, Calendar } from 'lucide-react';

interface Subscriber {
    id: string;
    email: string;
    subscribedAt: string;
}

interface SubscribersTableRowProps {
    subscriber: Subscriber;
}

export default function SubscribersTableRow({ subscriber }: SubscribersTableRowProps) {
    return (
        <tr className="hover:bg-gray-50 transition-colors">
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                        <Mail size={14} />
                    </div>
                    <span className="text-sm font-medium text-gray-900">{subscriber.email}</span>
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center text-sm text-gray-500">
                    <Calendar size={14} className="mr-1.5" />
                    {new Date(subscriber.subscribedAt).toLocaleDateString()}
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Subscribed
                </span>
            </td>
        </tr>
    );
}
