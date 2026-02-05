"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Car } from "./type";
import api from "@/lib/api";
import { toast } from "sonner";
import { X, Loader2, Image as ImageIcon, Upload, ChevronDown, Check, Users, Snowflake, MapPin, Fuel } from "lucide-react";
import CustomSelect from '@/components/ui/CustomSelect';
import { VEHICLE_BRANDS, VEHICLE_CATEGORIES, VEHICLE_TRANSMISSIONS } from "./constants";

import BasicInfoSection from "./components/BasicInfoSection";
import LocationSection from "./components/LocationSection";
import TechnicalSpecsSection from "./components/TechnicalSpecsSection";
import FeaturesStatusSection from "./components/FeaturesStatusSection";
import ImageUploadSection from "./components/ImageUploadSection";

const carSchema = z.object({
  name: z.string().min(2, "Name is too short"),
  brand: z.string().min(1, "Brand is required"),
  type: z.string().min(1, "Category is required"),
  transmission: z.string().min(1, "Transmission is required"),
  fuelCapacity: z.number().min(1, "Fuel capacity must be positive"),
  pricePerDay: z.number().min(1, "Price must be positive"),
  hp: z.number().min(50, "HP must be reasonable (min 50)"),
  description: z.string().default(""),
  status: z.enum(["AVAILABLE", "RENTED", "MAINTENANCE"]),
  pickupLocation: z.string().min(1, "Pickup location is required"),
  dropoffLocation: z.string().min(1, "Dropoff location is required"),
  passengers: z.number().min(1, "At least 1 passenger"),
  freeCancellation: z.boolean().default(true),
  fuelType: z.string().default("Petrol"),
  airConditioner: z.boolean().default(true),
  gps: z.boolean().default(true),
});

type CarFormValues = {
  name: string;
  brand: string;
  type: string;
  transmission: string;
  fuelCapacity: number;
  pricePerDay: number;
  hp: number;
  description: string;
  status: "AVAILABLE" | "RENTED" | "MAINTENANCE";
  pickupLocation: string;
  dropoffLocation: string;
  passengers: number;
  freeCancellation: boolean;
  fuelType: string;
  airConditioner: boolean;
  gps: boolean;
};

type Props = {
  onSuccess: () => void;
  onCancel: () => void;
  editingCar: Car | null;
};

export default function CarForm({ onSuccess, onCancel, editingCar }: Props) {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(editingCar?.imageUrl || "");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CarFormValues>({
    resolver: zodResolver(carSchema) as any,
    defaultValues: editingCar ? {
      name: editingCar.name,
      brand: editingCar.brand,
      type: editingCar.type,
      transmission: editingCar.transmission,
      fuelCapacity: editingCar.fuelCapacity,
      pricePerDay: editingCar.pricePerDay,
      hp: editingCar.hp,
      description: editingCar.description || "",
      status: editingCar.status,
      pickupLocation: editingCar.pickupLocation || "Port Moresby Airport",
      dropoffLocation: editingCar.dropoffLocation || "Port Moresby Airport",
      passengers: editingCar.passengers || 4,
      freeCancellation: editingCar.freeCancellation ?? true,
      fuelType: editingCar.fuelType || "Petrol",
      airConditioner: editingCar.airConditioner ?? true,
      gps: editingCar.gps ?? true,
    } : {
      name: "",
      brand: "",
      type: "",
      transmission: "Automatic",
      fuelCapacity: 50,
      pricePerDay: 50,
      hp: 150,
      description: "",
      status: "AVAILABLE",
      pickupLocation: "Port Moresby Airport",
      dropoffLocation: "Port Moresby Airport",
      passengers: 4,
      freeCancellation: true,
      fuelType: "Petrol",
      airConditioner: true,
      gps: true,
    },
  });

  const currentStatus = watch("status");
  const currentBrand = watch("brand");
  const currentCategory = watch("type");
  const currentTransmission = watch("transmission");
  const freeCancellation = watch("freeCancellation");
  const airConditioner = watch("airConditioner");
  const gps = watch("gps");

  const statusOptions = [
    { value: "AVAILABLE", label: "Available" },
    { value: "MAINTENANCE", label: "Maintenance" },
    { value: "RENTED", label: "Rented" }
  ];

  const brandOptions = VEHICLE_BRANDS.map(brand => ({ label: brand, value: brand }));
  const categoryOptions = VEHICLE_CATEGORIES.map(cat => ({ label: cat, value: cat }));
  const transmissionOptions = VEHICLE_TRANSMISSIONS.map(trans => ({ label: trans, value: trans }));

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: CarFormValues) => {
    if (!editingCar && !imageFile) {
      toast.error("Please upload an image");
      return;
    }

    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value.toString());
        }
      });

      if (imageFile) {
        formData.append("image", imageFile);
      }

      if (editingCar) {
        await api.put(`/car/${editingCar.id}`, formData);
        toast.success("Car updated successfully");
      } else {
        await api.post("/car", formData);
        toast.success("Car added successfully");
      }
      onSuccess();
    } catch (error: any) {
      console.error("Form submission error:", error);
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="bg-white rounded-2xl">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* LEFT COLUMN */}
          <div className="space-y-6">
            <BasicInfoSection
              register={register}
              errors={errors}
              setValue={setValue}
              currentBrand={currentBrand}
              currentCategory={currentCategory}
              brandOptions={brandOptions}
              categoryOptions={categoryOptions}
            />
            <LocationSection register={register} />
          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-6">
            <TechnicalSpecsSection
              register={register}
              errors={errors}
              setValue={setValue}
              currentTransmission={currentTransmission}
              transmissionOptions={transmissionOptions}
            />
            <FeaturesStatusSection
              setValue={setValue}
              freeCancellation={freeCancellation}
              airConditioner={airConditioner}
              gps={gps}
              currentStatus={currentStatus}
              statusOptions={statusOptions}
            />
            <ImageUploadSection
              imagePreview={imagePreview}
              handleImageChange={handleImageChange}
            />
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row gap-4 border-t border-gray-100">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-8 py-4 rounded-xl border border-gray-200 text-gray-400 font-bold uppercase tracking-widest hover:bg-gray-50 transition"
          >
            Go Back
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-[2] bg-blue-600 text-white px-8 py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-blue-700 transition shadow-xl shadow-blue-100 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin" size={24} />
                Saving Changes...
              </>
            ) : (
              editingCar ? "Update Vehicle Record" : "Add to Fleet"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
