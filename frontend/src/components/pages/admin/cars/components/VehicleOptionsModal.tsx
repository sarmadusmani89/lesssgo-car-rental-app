"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Loader2 } from "lucide-react";
import api from "@/lib/api";
import { toast } from "sonner";
import { MapPin, Tag, Layout, Settings2, Fuel, Cog } from "lucide-react";
import { Button } from "@/components/ui/Button";
import OptionSidebar from "./vehicle-options/OptionSidebar";
import OptionInput from "./vehicle-options/OptionInput";
import OptionList from "./vehicle-options/OptionList";

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

const OPTION_TYPES = [
    { key: 'locations', label: 'Locations', icon: MapPin },
    { key: 'brands', label: 'Brands', icon: Tag },
    { key: 'categories', label: 'Categories', icon: Layout },
    { key: 'transmissions', label: 'Transmissions', icon: Cog },
    { key: 'fuelTypes', label: 'Fuel Types', icon: Fuel },
    { key: 'vehicleClasses', label: 'Vehicle Classes', icon: Settings2 },
];

export default function VehicleOptionsModal({ isOpen, onClose }: Props) {
    const [settings, setSettings] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState(OPTION_TYPES[0].key);
    const [newItem, setNewItem] = useState("");

    const fetchSettings = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/settings');
            setSettings(data);
        } catch (error) {
            console.error("Failed to fetch settings:", error);
            toast.error("Failed to load vehicle options");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            fetchSettings();
        }
    }, [isOpen]);

    const handleAddItem = () => {
        if (!newItem.trim()) return;
        if (settings[activeTab].includes(newItem.trim())) {
            toast.error("Item already exists");
            return;
        }
        setSettings({
            ...settings,
            [activeTab]: [...settings[activeTab], newItem.trim()]
        });
        setNewItem("");
    };

    const handleRemoveItem = (index: number) => {
        const newList = [...settings[activeTab]];
        newList.splice(index, 1);
        setSettings({
            ...settings,
            [activeTab]: newList
        });
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await api.put('/settings', settings);
            toast.success("Vehicle options updated successfully");
            onClose();
        } catch (error) {
            console.error("Failed to save settings:", error);
            toast.error("Failed to save changes");
        } finally {
            setSaving(false);
        }
    };

    if (!isOpen || typeof document === 'undefined') return null;

    return createPortal(
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col animate-in zoom-in-95 duration-300">
                {/* Header */}
                <div className="px-8 py-4 flex items-center justify-between border-b border-gray-100 bg-gray-50/50 sticky top-0 z-10">
                    <div>
                        <h3 className="text-xl font-bold text-gray-900">
                            Manage Vehicle Options
                        </h3>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mt-1">Configure locations, brands, and technical specs</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-rose-600 hover:border-rose-100 transition-all"
                    >
                        <X size={20} />
                    </button>
                </div>

                {loading ? (
                    <div className="flex-1 flex flex-col items-center justify-center min-h-[400px]">
                        <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
                        <p className="text-gray-500 font-medium font-outfit">Loading options...</p>
                    </div>
                ) : (
                    <div className="flex-1 flex overflow-hidden">
                        <OptionSidebar
                            options={OPTION_TYPES}
                            activeTab={activeTab}
                            onTabChange={(key) => {
                                setActiveTab(key);
                                setNewItem("");
                            }}
                        />

                        {/* Content Area */}
                        <div className="flex-1 flex flex-col p-8 overflow-y-auto bg-white">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-lg font-bold text-gray-900 capitalize">
                                    {OPTION_TYPES.find(t => t.key === activeTab)?.label} List
                                </h3>
                                <div className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full uppercase tracking-widest">
                                    {settings[activeTab]?.length || 0} Items
                                </div>
                            </div>

                            <OptionInput
                                value={newItem}
                                onChange={setNewItem}
                                onAdd={handleAddItem}
                                placeholder={`Add new ${activeTab.slice(0, -1)}...`}
                            />

                            <OptionList
                                items={settings[activeTab]}
                                onDeleteItem={handleRemoveItem}
                            />
                        </div>
                    </div>
                )}

                {/* Footer Actions */}
                <div className="p-6 border-t border-gray-100 bg-white flex justify-end gap-3 sticky bottom-0 z-10">
                    <Button
                        variant="secondary"
                        onClick={onClose}
                        className="px-8 font-bold text-sm uppercase tracking-widest"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSave}
                        isLoading={saving}
                        disabled={loading}
                        className="px-8 font-bold text-sm uppercase tracking-widest"
                    >
                        Save All Changes
                    </Button>
                </div>
            </div>
        </div>,
        document.body
    );
}
