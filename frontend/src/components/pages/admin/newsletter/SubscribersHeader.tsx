import { Download, RefreshCw } from 'lucide-react';

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
                <button
                    onClick={onRefresh}
                    disabled={isRefreshing}
                    className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-all shadow-sm disabled:opacity-50 group"
                >
                    <RefreshCw size={20} className={isRefreshing ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'} />
                </button>
                <button
                    onClick={onExport}
                    className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 hover:scale-[1.02] active:scale-95 transition-all shadow-lg"
                >
                    <Download size={20} />
                    Export
                </button>
            </div>
        </div>
    );
}
