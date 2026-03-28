"use client";

import { Plus, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

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
                <Button
                    variant="outline"
                    onClick={onOptionsClick}
                    className="gap-2"
                >
                    <Settings2 size={20} className="text-accent" />
                    Manage Options
                </Button>
                <Button
                    variant="accent"
                    onClick={onAddClick}
                    className="gap-2"
                >
                    <Plus size={20} />
                    Add New Vehicle
                </Button>
            </div>
        </div>
    );
}
