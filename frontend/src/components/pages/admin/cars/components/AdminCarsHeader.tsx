"use client";

import { Plus, Settings2 } from "lucide-react";

interface Props {
    onAddClick: () => void;
    onOptionsClick: () => void;
}

export default function AdminCarsHeader({ onAddClick, onOptionsClick }: Props) {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 font-outfit">Fleet Management</h1>
                <p className="text-gray-500 text-sm mt-1">Add, update, and manage your vehicle inventory</p>
            </div>
            <div className="flex items-center gap-3">
                <button
                    onClick={onOptionsClick}
                    className="flex items-center justify-center gap-2 bg-white text-gray-700 px-5 py-2.5 rounded-xl font-bold border border-gray-200 hover:bg-gray-50 transition shadow-sm whitespace-nowrap"
                >
                    <Settings2 size={20} className="text-blue-600" />
                    Manage Options
                </button>
                <button
                    onClick={onAddClick}
                    className="flex items-center justify-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-100 whitespace-nowrap"
                >
                    <Plus size={20} />
                    Add New Vehicle
                </button>
            </div>
        </div>
    );
}
