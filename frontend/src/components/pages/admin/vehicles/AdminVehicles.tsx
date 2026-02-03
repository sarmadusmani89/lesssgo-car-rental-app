"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Vehicle } from "./type";
import VehicleTable from "./vehicletable";

const initialVehicles: Vehicle[] = [
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

export default function AdminVehicles() {
  const router = useRouter();
  const [vehicles, setVehicles] = useState<Vehicle[]>(initialVehicles);
  const [search, setSearch] = useState("");

  const filteredVehicles = vehicles.filter(
    (v) =>
      v.name.toLowerCase().includes(search.toLowerCase()) ||
      v.brand.toLowerCase().includes(search.toLowerCase()) ||
      v.category.toLowerCase().includes(search.toLowerCase())
  );

  const deleteVehicle = (id: number) => {
    setVehicles(vehicles.filter((v) => v.id !== id));
  };

  const toggleStatus = (id: number) => {
    setVehicles(
      vehicles.map((v) =>
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
        <h1 className="text-3xl font-bold">Vehicle Management</h1>

        <button
          onClick={() => router.push("/admin/vehicles/add")}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          + Add Vehicle
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
      <VehicleTable
        vehicles={filteredVehicles}
        onDelete={deleteVehicle}
        onToggleStatus={toggleStatus}
        onEdit={() => {}}
      />
    </div>
  );
}
