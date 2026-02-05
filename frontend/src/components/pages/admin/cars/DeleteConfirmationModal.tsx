import { createPortal } from "react-dom";
import { AlertTriangle, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";

type Props = {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    carBrand?: string;
    carName: string;
    isDeleting: boolean;
};

export default function DeleteConfirmationModal({ isOpen, onClose, onConfirm, carBrand, carName, isDeleting }: Props) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    if (!isOpen || !mounted) return null;

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in cursor-pointer"
                onClick={isDeleting ? undefined : onClose}
            />

            {/* Modal Content */}
            <div className="relative bg-white rounded-3xl w-full max-w-sm p-6 shadow-2xl animate-in zoom-in-95 duration-200">
                <div className="flex justify-center mb-6">
                    <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center shadow-inner">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center animate-pulse">
                            <AlertTriangle className="text-red-600" size={32} />
                        </div>
                    </div>
                </div>

                <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-gray-900 font-outfit mb-2">Delete This Vehicle?</h3>
                    <p className="text-gray-500 text-sm leading-relaxed px-4">
                        Are you sure you want to delete <strong className="text-gray-900 block mt-1">
                            {carBrand && <span className="block text-xs font-bold text-gray-400 uppercase tracking-widest">{carBrand}</span>}
                            {carName}
                        </strong>
                        This action cannot be undone.
                    </p>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        disabled={isDeleting}
                        className="flex-1 py-3 px-4 rounded-xl border border-gray-200 font-bold text-gray-700 hover:bg-gray-50 transition active:scale-95 disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isDeleting}
                        className="flex-1 py-3 px-4 rounded-xl bg-red-600 font-bold text-white hover:bg-red-700 transition shadow-lg shadow-red-200 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isDeleting ? (
                            "Deleting..."
                        ) : (
                            <>
                                <Trash2 size={18} />
                                Yes, Delete
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}
