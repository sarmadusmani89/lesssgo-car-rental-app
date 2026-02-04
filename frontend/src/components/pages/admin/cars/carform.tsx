"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Car } from "./type";
import api from "@/lib/api";
import { toast } from "sonner";
import { X, Loader2, Image as ImageIcon } from "lucide-react";

const carSchema = z.object({
  name: z.string().min(2, "Name is too short"),
  brand: z.string().min(2, "Brand is too short"),
  type: z.string().min(2, "Type is required (e.g. Sedan, SUV)"),
  transmission: z.string().min(2, "Transmission is required"),
  fuelCapacity: z.number().min(1, "Fuel capacity must be positive"),
  pricePerDay: z.number().min(1, "Price must be positive"),
  description: z.string().optional(),
  imageUrl: z.string().url("Must be a valid URL").or(z.string().length(0)).optional(),
  status: z.enum(["AVAILABLE", "RENTED", "MAINTENANCE"]),
});

type CarFormValues = z.infer<typeof carSchema>;

type Props = {
  onSuccess: () => void;
  onCancel: () => void;
  editingCar: Car | null;
};

export default function CarForm({ onSuccess, onCancel, editingCar }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CarFormValues>({
    resolver: zodResolver(carSchema),
    defaultValues: editingCar || {
      name: "",
      brand: "",
      type: "",
      transmission: "Automatic",
      fuelCapacity: 50,
      pricePerDay: 50,
      description: "",
      imageUrl: "",
      status: "AVAILABLE",
    },
  });

  const onSubmit = async (data: CarFormValues) => {
    try {
      if (editingCar) {
        await api.put(`/car/${editingCar.id}`, data);
        toast.success("Car updated successfully");
      } else {
        await api.post("/car", data);
        toast.success("Car added successfully");
      }
      onSuccess();
    } catch (error: any) {
      console.error("Form submission error:", error);
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-100">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 font-outfit">
            {editingCar ? "Edit Vehicle" : "Add New Vehicle"}
          </h2>
          <p className="text-sm text-gray-500 mt-1">Fill in the details for your fleet member</p>
        </div>
        <button
          onClick={onCancel}
          className="p-2 hover:bg-gray-100 rounded-full transition text-gray-400"
        >
          <X size={24} />
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5 uppercase tracking-tighter">Car Name</label>
              <input
                {...register("name")}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition"
                placeholder="e.g. Civic Turbo"
              />
              {errors.name && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5 uppercase tracking-tighter">Brand</label>
              <input
                {...register("brand")}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition"
                placeholder="e.g. Honda"
              />
              {errors.brand && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.brand.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5 uppercase tracking-tighter">Category / Type</label>
              <input
                {...register("type")}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition"
                placeholder="e.g. Sedan, SUV, Sport"
              />
              {errors.type && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.type.message}</p>}
            </div>
          </div>

          {/* Technical Specs */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5 uppercase tracking-tighter">Transmission</label>
                <select
                  {...register("transmission")}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition bg-white"
                >
                  <option value="Automatic">Automatic</option>
                  <option value="Manual">Manual</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5 uppercase tracking-tighter">Fuel (L)</label>
                <input
                  type="number"
                  {...register("fuelCapacity", { valueAsNumber: true })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5 uppercase tracking-tighter">Price Per Day ($)</label>
              <input
                type="number"
                {...register("pricePerDay", { valueAsNumber: true })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition"
              />
              {errors.pricePerDay && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.pricePerDay.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5 uppercase tracking-tighter">Initial Status</label>
              <select
                {...register("status")}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition bg-white"
              >
                <option value="AVAILABLE">Available</option>
                <option value="MAINTENANCE">Maintenance</option>
                <option value="RENTED">Rented</option>
              </select>
            </div>
          </div>
        </div>

        {/* Full Width Fields */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5 uppercase tracking-tighter">Image URL</label>
            <div className="relative">
              <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                {...register("imageUrl")}
                className="w-full pl-12 pr-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition"
                placeholder="https://images.unsplash.com/..."
              />
            </div>
            {errors.imageUrl && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.imageUrl.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5 uppercase tracking-tighter">Description</label>
            <textarea
              {...register("description")}
              rows={3}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition"
              placeholder="Tell more about this car..."
            />
          </div>
        </div>

        <div className="pt-6 flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-6 py-3 rounded-xl border border-gray-200 text-gray-700 font-bold hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-[2] bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-100 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Processing...
              </>
            ) : (
              editingCar ? "Update Vehicle" : "Add Vehicle"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
