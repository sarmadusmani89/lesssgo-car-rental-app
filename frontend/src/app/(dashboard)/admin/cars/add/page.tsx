'use client';

import { useRouter } from 'next/navigation';
import CarForm from '@/components/pages/admin/cars/carform';

export default function AddCarPage() {
    const router = useRouter();

    const handleAdd = (car: any) => {
        console.log('Adding car:', car);
        router.push('/admin/cars');
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Add New Car</h1>
            <CarForm onAdd={handleAdd} onUpdate={() => { }} editingCar={null} />
        </div>
    );
}
