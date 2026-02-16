"use client";

import { useState, useEffect } from "react";
import { X, Plus, Trash2, Loader2, Save, MapPin, Tag, Layout, Settings2, Fuel, Cog } from "lucide-react";
import api from "@/lib/api";
import { toast } from "sonner";

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

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col animate-in zoom-in-95 duration-300">
                {/* Header */}
                <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 font-outfit">Manage Vehicle Options</h2>
                        <p className="text-gray-500 text-sm">Configure locations, brands, and technical specs</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition text-gray-400 hover:text-gray-900">
                        <X size={24} />
                    </button>
                </div>

                {loading ? (
                    <div className="flex-1 flex flex-col items-center justify-center min-h-[400px]">
                        <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
                        <p className="text-gray-500 font-medium font-outfit">Loading options...</p>
                    </div>
                ) : (
                    <div className="flex-1 flex overflow-hidden">
                        {/* Sidebar Tabs */}
                        <div className="w-64 border-r border-gray-100 bg-gray-50/50 p-4 space-y-1">
                            {OPTION_TYPES.map((type) => {
                                const Icon = type.icon;
                                return (
                                    <button
                                        key={type.key}
                                        onClick={() => {
                                            setActiveTab(type.key);
                                            setNewItem("");
                                        }}
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === type.key
                                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-100'
                                                : 'text-gray-500 hover:bg-white hover:text-blue-600'
                                            }`}
                                    >
                                        <Icon size={18} />
                                        {type.label}
                                    </button>
                                );
                            })}
                        </div>

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

                            {/* Add New Item */}
                            <div className="flex gap-3 mb-8">
                                <input
                                    type="text"
                                    value={newItem}
                                    onChange={(e) => setNewItem(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleAddItem()}
                                    className="flex-1 px-5 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition font-medium text-sm"
                                    placeholder={`Add new ${activeTab.slice(0, -1)}...`}
                                />
                                <button
                                    onClick={handleAddItem}
                                    disabled={!newItem.trim()}
                                    className="px-6 py-3 bg-gray-900 text-white rounded-xl font-bold text-sm hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg shadow-gray-200"
                                >
                                    <Plus size={18} />
                                    Add
                                </button>
                            </div>

                            {/* Items Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pb-8">
                                {settings[activeTab]?.map((item: string, index: number) => (
                                    <div
                                        key={`${item}-${index}`}
                                        className="group h-[52px] flex items-center justify-between px-5 py-3 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-white hover:border-blue-200 hover:shadow-md transition-all duration-300"
                                    >
                                        <span className="font-semibold text-gray-700 text-sm truncate max-w-[80%]">{item}</span>
                                        <button
                                            onClick={() => handleRemoveItem(index)}
                                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-200 opacity-0 group-hover:opacity-100"
                                            title="Delete"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))}

                                {(!settings[activeTab] || settings[activeTab].length === 0) && (
                                    <div className="col-span-full py-12 flex flex-col items-center justify-center text-gray-400 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
                                        <Plus size={32} className="mb-2 opacity-20" />
                                        <p className="text-sm font-medium">No items added yet</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Footer Actions */}
                <div className="p-6 border-t border-gray-100 bg-white flex justify-end gap-3 sticky bottom-0 z-10">
                    <button
                        onClick={onClose}
                        className="px-8 py-3 rounded-xl border border-gray-200 text-gray-400 font-bold text-sm uppercase tracking-widest hover:bg-gray-50 transition"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving || loading}
                        className="flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-xl font-bold text-sm uppercase tracking-widest hover:bg-blue-700 transition shadow-xl shadow-blue-100 disabled:opacity-70"
                    >
                        {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                        Save All Changes
                    </button>
                </div>
            </div>
        </div>
    );
}
