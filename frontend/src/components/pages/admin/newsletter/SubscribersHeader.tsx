import { Download, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface SubscribersHeaderProps {
    onExport: () => void;
    onRefresh: () => void;
    isRefreshing?: boolean;
}

export default function SubscribersHeader({ onExport, onRefresh, isRefreshing }: SubscribersHeaderProps) {
    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight italic font-outfit">
                    Newsletter Subscribers
                </h1>
                <p className="text-slate-500 mt-1 font-medium">
                    Manage and view your email subscriber list.
                </p>
            </div>

            <div className="flex items-center gap-3">
                <Button
                    onClick={onRefresh}
                    variant="outline"
                    size="icon"
                    isLoading={isRefreshing}
                    className="bg-white border-slate-200 text-slate-600 hover:text-accent shadow-sm group h-auto w-auto p-2.5"
                >
                    {!isRefreshing && <RefreshCw size={20} className="group-hover:rotate-180 transition-transform duration-500" />}
                </Button>
                <Button
                    onClick={onExport}
                    variant="primary"
                    className="flex items-center gap-2 px-6 py-2.5 shadow-lg h-auto"
                >
                    <Download size={20} />
                    Export
                </Button>
            </div>
        </div>
    );
}
