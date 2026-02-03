"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Car } from "./type";
import CarTable from "./cartable";

const initialCars: Car[] = [
    {
        id: 1,
        name: "Civic",
        brand: "Honda",
        category: "Sedan",
        description: "Comfortable sedan",
        pricePerDay: 60,
        features: ["Automatic"],
        images: [],
        status: "available",
    },
    {
        id: 2,
        name: "Corolla",
        brand: "Toyota",
        category: "Sedan",
        description: "Reliable daily car",
        pricePerDay: 50,
        features: ["Automatic"],
        images: [],
        status: "unavailable",
    },
];

export default function AdminCars() {
    const router = useRouter();
    const [cars, setCars] = useState<Car[]>(initialCars);
    const [search, setSearch] = useState("");

    const filteredCars = cars.filter(
        (v) =>
            v.name.toLowerCase().includes(search.toLowerCase()) ||
            v.brand.toLowerCase().includes(search.toLowerCase()) ||
            v.category.toLowerCase().includes(search.toLowerCase())
    );

    const deleteCar = (id: number) => {
        setCars(cars.filter((v) => v.id !== id));
    };

    const toggleStatus = (id: number) => {
        setCars(
            cars.map((v) =>
                v.id === id
                    ? {
                        ...v,
                        status:
                            v.status === "available" ? "unavailable" : "available",
                    }
                    : v
            )
        );
    };

    return (
        <div>
            {/* HEADER */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Car Management</h1>

                <button
                    onClick={() => router.push("/admin/cars/add")}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                    + Add Car
                </button>
            </div>

            {/* SEARCH */}
            <input
                type="text"
                placeholder="Search by name, brand or category..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border px-3 py-2 rounded mb-4 w-full max-w-md"
            />

            {/* MODERN TABLE */}
            <CarTable
                cars={filteredCars}
                onDelete={deleteCar}
                onToggleStatus={toggleStatus}
                onEdit={() => { }}
            />
        </div>
    );
}
