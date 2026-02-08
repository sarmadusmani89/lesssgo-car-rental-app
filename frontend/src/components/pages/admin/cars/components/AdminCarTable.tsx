"use client";

import Image from 'next/image';
import { Car } from '../type';
import { formatPrice } from '@/lib/utils';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';

interface Props {
    cars: Car[];
    onToggleStatus: (id: string, currentStatus: string) => void;
    onCheckAvailability: (car: Car) => void;
    onEdit: (id: string) => void;
    onDelete: (car: { id: string; name: string; brand: string }) => void;
}

export default function AdminCarTable({
    cars,
    onToggleStatus,
    onCheckAvailability,
    onEdit,
    onDelete
}: Props) {
    const { currency, rates } = useSelector((state: RootState) => state.ui);
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-gray-50/50">
                        <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Vehicle</th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Specifications</th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Daily Rate</th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {cars.length > 0 ? cars.map((car) => (
                        <tr key={car.id} className="hover:bg-gray-50/50 transition">
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-4">
                                    <div className="relative w-16 h-10 rounded-lg overflow-hidden border border-gray-100 flex-shrink-0">
                                        <Image
                                            src={car.imageUrl || '/images/cars/placeholder.jpg'}
                                            alt={car.name}
                                            fill
                                            style={{ objectFit: 'cover' }}
                                        />
                                    </div>
                                    <div>
                                        <div className="font-bold text-gray-900">{car.name}</div>
                                        <div className="text-xs text-gray-500 font-medium">{car.brand}</div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex flex-wrap gap-2">
                                    <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-[10px] font-bold uppercase">{car.type}</span>
                                    <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-[10px] font-bold uppercase">{car.transmission}</span>
                                </div>
                            </td>
                            <td className="px-6 py-4 font-bold text-gray-900">
                                {formatPrice(car.pricePerDay, currency, rates)}
                            </td>
                            <td className="px-6 py-4">
                                <button
                                    onClick={() => onToggleStatus(car.id, car.status)}
                                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border shadow-sm transition ${car.status === 'AVAILABLE' ? 'bg-green-50 border-green-100 text-green-600' :
                                        car.status === 'RENTED' ? 'bg-blue-50 border-blue-100 text-blue-600' :
                                            'bg-red-50 border-red-100 text-red-600'
                                        }`}
                                >
                                    <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${car.status === 'AVAILABLE' ? 'bg-green-500' :
                                        car.status === 'RENTED' ? 'bg-blue-500' : 'bg-red-500'
                                        }`} />
                                    {car.status}
                                </button>
                            </td>
                            <td className="px-6 py-4 text-right">
                                <div className="flex items-center justify-end gap-2">
                                    <button
                                        onClick={() => onCheckAvailability(car)}
                                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                        title="Check Availability"
                                    >
                                        <Calendar size={18} />
                                    </button>
                                    <button
                                        onClick={() => onEdit(car.id)}
                                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                        title="Edit Vehicle"
                                    >
                                        <Edit2 size={18} />
                                    </button>
                                    <button
                                        onClick={() => onDelete({ id: car.id, name: car.name, brand: car.brand })}
                                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                                        title="Delete Vehicle"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    )) : (
                        <tr>
                            <td colSpan={5} className="px-6 py-12 text-center">
                                <div className="flex flex-col items-center justify-center text-gray-400">
                                    <AlertCircle size={40} className="mb-2 opacity-20" />
                                    <p className="font-medium">No vehicles found matching your search</p>
                                </div>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
