"use client";

import VehicleForm from "@/components/pages/admin/vehicles/vehicleform";
import { useRouter } from "next/navigation";
import { Vehicle } from "@/components/pages/admin/vehicles/type";

export default function AddVehiclePage() {
  const router = useRouter();

  const handleAdd = (vehicle: Vehicle) => {
    console.log("Vehicle added:", vehicle);
    router.push("/admin/vehicles"); // go back after add
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <VehicleForm
        onAdd={handleAdd}
        onUpdate={() => {}}
        editingVehicle={null}
      />
    </div>
  );
}
