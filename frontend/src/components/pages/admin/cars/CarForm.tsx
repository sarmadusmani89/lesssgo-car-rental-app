"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Car } from "./type";
import api from "@/lib/api";
import { toast } from "sonner";
import { X, Loader2, Image as ImageIcon, Upload, ChevronDown, Check, Users, Snowflake, MapPin, Fuel } from "lucide-react";
import { VEHICLE_BRANDS, VEHICLE_CATEGORIES, VEHICLE_TRANSMISSIONS, VEHICLE_FUEL_TYPES, VEHICLE_CLASSES } from "./constants";

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
  fuelCapacity: z.preprocess((val) => Number(val) || undefined, z.number().min(1, "Fuel capacity must be positive")),
  pricePerDay: z.preprocess((val) => Number(val) || undefined, z.number().min(1, "Price must be positive")),
  hp: z.preprocess((val) => Number(val) || undefined, z.number().min(50, "HP must be reasonable (min 50)")),
  description: z.string().default(""),
  status: z.enum(["AVAILABLE", "RENTED", "MAINTENANCE"]),
  pickupLocation: z.array(z.string()).min(1, "At least one pickup location is required"),
  returnLocation: z.array(z.string()).min(1, "At least one return location is required"),
  passengers: z.preprocess((val) => Number(val) || undefined, z.number().min(1, "At least 1 passenger")),
  freeCancellation: z.boolean().default(true),
  fuelType: z.string().default("Petrol"),
  airConditioner: z.boolean().default(true),
  gps: z.boolean().default(true),
  vehicleClass: z.string().min(1, "Vehicle class is required"),
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
  pickupLocation: string[];
  returnLocation: string[];
  passengers: number;
  freeCancellation: boolean;
  fuelType: string;
  airConditioner: boolean;
  gps: boolean;
  vehicleClass: string;
};

type Props = {
  onSuccess: () => void;
  onCancel: () => void;
  editingCar: Car | null;
};

export default function CarForm({ onSuccess, onCancel, editingCar }: Props) {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(editingCar?.imageUrl || "");
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>(editingCar?.gallery || []);
  const [settings, setSettings] = useState<any>(null);

  useState(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await api.get('/settings');
        setSettings(data);
      } catch (error) {
        console.error("Failed to fetch settings:", error);
      }
    };
    fetchSettings();
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
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
      gps: editingCar.gps ?? true,
      vehicleClass: editingCar.vehicleClass || "Standard",
      pickupLocation: editingCar.pickupLocation || [],
      returnLocation: editingCar.returnLocation || [],
      passengers: editingCar.passengers || 4,
      fuelType: editingCar.fuelType || "Petrol",
      freeCancellation: editingCar.freeCancellation ?? true,
      airConditioner: editingCar.airConditioner ?? true,
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
      gps: true,
      vehicleClass: "Standard",
      pickupLocation: [],
      returnLocation: [],
      passengers: 4,
      fuelType: "Petrol",
      freeCancellation: true,
      airConditioner: true,
    },
  });

  const currentStatus = watch("status");
  const currentBrand = watch("brand");
  const currentCategory = watch("type");
  const currentTransmission = watch("transmission");
  const currentFuelType = watch("fuelType");
  const freeCancellation = watch("freeCancellation");
  const airConditioner = watch("airConditioner");
  const gps = watch("gps");
  const currentClass = watch("vehicleClass");

  const statusOptions = [
    { value: "AVAILABLE", label: "Available" },
    { value: "MAINTENANCE", label: "Maintenance" },
    { value: "RENTED", label: "Rented" }
  ];

  const brandOptions = (settings?.brands || VEHICLE_BRANDS).map((brand: any) => ({ label: brand, value: brand }));
  const categoryOptions = (settings?.categories || VEHICLE_CATEGORIES).map((cat: any) => ({ label: cat, value: cat }));
  const transmissionOptions = (settings?.transmissions || VEHICLE_TRANSMISSIONS).map((trans: any) => ({ label: trans, value: trans }));
  const fuelOptions = (settings?.fuelTypes || VEHICLE_FUEL_TYPES).map((fuel: any) => ({ label: fuel, value: fuel }));

  const classOptions = (settings?.vehicleClasses || VEHICLE_CLASSES).map((cls: any) => ({ label: cls, value: cls }));

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

  const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setGalleryFiles(prev => [...prev, ...files]);
      files.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setGalleryPreviews(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeGalleryImage = (index: number) => {
    const existingCount = editingCar?.gallery?.length || 0;
    if (index < existingCount) {
      // Deleting an existing image URL
      setGalleryPreviews(prev => prev.filter((_, i) => i !== index));
    } else {
      // Deleting a newly added file
      setGalleryPreviews(prev => prev.filter((_, i) => i !== index));
      setGalleryFiles(prev => prev.filter((_, i) => i !== (index - existingCount)));
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
          if (Array.isArray(value)) {
            // Send as comma-separated string for backend Transform
            formData.append(key, value.join(','));
          } else {
            formData.append(key, value.toString());
          }
        }
      });

      if (imageFile) {
        formData.append("image", imageFile);
      }

      if (galleryFiles.length > 0) {
        galleryFiles.forEach(file => {
          formData.append("gallery", file);
        });
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
      if (error.response?.status === 413) {
        toast.error("File size is too large. Please upload smaller images (max 50MB).");
      } else {
        toast.error(error.response?.data?.message || "Something went wrong sending the request");
      }
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
              currentClass={currentClass}
              brandOptions={brandOptions}
              categoryOptions={categoryOptions}
              classOptions={classOptions}
            />
            <LocationSection control={control} errors={errors} locations={settings?.locations} />
          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-6">
            <TechnicalSpecsSection
              register={register}
              errors={errors}
              setValue={setValue}
              currentTransmission={currentTransmission}
              transmissionOptions={transmissionOptions}
              currentFuelType={currentFuelType}
              fuelOptions={fuelOptions}
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
              galleryPreviews={galleryPreviews}
              handleGalleryChange={handleGalleryChange}
              removeGalleryImage={removeGalleryImage}
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
