"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Car } from "./type";
import api from "@/lib/api";
import { toast } from "sonner";
import { X, Loader2, Image as ImageIcon, Upload, ChevronDown, Check } from "lucide-react";
import CustomSelect from '@/components/ui/CustomSelect';
import { VEHICLE_BRANDS, VEHICLE_CATEGORIES, VEHICLE_TRANSMISSIONS } from "./constants";

const carSchema = z.object({
  name: z.string().min(2, "Name is too short"),
  brand: z.string().min(1, "Brand is required"),
  type: z.string().min(1, "Category is required"),
  transmission: z.string().min(1, "Transmission is required"),
  fuelCapacity: z.number().min(1, "Fuel capacity must be positive"),
  pricePerDay: z.number().min(1, "Price must be positive"),
  hp: z.number().min(50, "HP must be reasonable (min 50)"),
  description: z.string().optional(),
  status: z.enum(["AVAILABLE", "RENTED", "MAINTENANCE"]),
});

type CarFormValues = z.infer<typeof carSchema>;

type Props = {
  onSuccess: () => void;
  onCancel: () => void;
  editingCar: Car | null;
};

export default function CarForm({ onSuccess, onCancel, editingCar }: Props) {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(editingCar?.imageUrl || "");
  const [isStatusOpen, setIsStatusOpen] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
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
      hp: 150,
      description: "",
      status: "AVAILABLE",
    },
  });

  const currentStatus = watch("status");
  const currentBrand = watch("brand");
  const currentCategory = watch("type");
  const currentTransmission = watch("transmission");

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
      // Append all fields to FormData, avoiding "undefined" strings
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
              <label className="block text-sm font-bold text-gray-700 mb-1.5 uppercase tracking-tighter">Car Model Name <span className="text-red-500">*</span></label>
              <input
                {...register("name")}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition font-medium"
                placeholder="e.g. 911 GT3 RS"
              />
              {errors.name && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5 uppercase tracking-tighter">Brand <span className="text-red-500">*</span></label>
              <CustomSelect
                options={brandOptions}
                value={currentBrand}
                onChange={(val) => setValue("brand", val)}
                className="w-full bg-white"
                placeholder="Select Brand"
              />
              {errors.brand && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.brand.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5 uppercase tracking-tighter">Category <span className="text-red-500">*</span></label>
              <CustomSelect
                options={categoryOptions}
                value={currentCategory}
                onChange={(val) => setValue("type", val)}
                className="w-full bg-white"
                placeholder="Select Category"
              />
              {errors.type && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.type.message}</p>}
            </div>
          </div>

          {/* Technical Specs */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5 uppercase tracking-tighter">Transmission</label>
                <CustomSelect
                  options={transmissionOptions}
                  value={currentTransmission}
                  onChange={(val) => setValue("transmission", val)}
                  className="w-full bg-white"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5 uppercase tracking-tighter">Fuel (L) <span className="text-red-500">*</span></label>
                <input
                  type="number"
                  {...register("fuelCapacity", { valueAsNumber: true })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5 uppercase tracking-tighter">Price Per Day ($) <span className="text-red-500">*</span></label>
              <input
                type="number"
                {...register("pricePerDay", { valueAsNumber: true })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition"
              />
              {errors.pricePerDay && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.pricePerDay.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5 uppercase tracking-tighter">Horsepower (HP) <span className="text-red-500">*</span></label>
              <input
                type="number"
                {...register("hp", { valueAsNumber: true })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition"
              />
              {errors.hp && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.hp.message}</p>}
            </div>


          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5 uppercase tracking-tighter">Initial Status</label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsStatusOpen(!isStatusOpen)}
                className={`w-full px-4 py-3 rounded-xl border flex items-center justify-between text-left transition ${isStatusOpen ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-gray-200 hover:border-blue-400'
                  }`}
              >
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${currentStatus === 'AVAILABLE' ? 'bg-green-500' :
                    currentStatus === 'RENTED' ? 'bg-blue-500' : 'bg-red-500'
                    }`} />
                  <span className="font-medium text-gray-700">
                    {statusOptions.find(o => o.value === currentStatus)?.label}
                  </span>
                </div>
                <ChevronDown size={18} className={`text-gray-400 transition-transform ${isStatusOpen ? 'rotate-180' : ''}`} />
              </button>

              {isStatusOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setIsStatusOpen(false)}
                  />
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 p-1.5 z-20 animate-in fade-in zoom-in-95 duration-200">
                    {statusOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => {
                          setValue("status", option.value as any);
                          setIsStatusOpen(false);
                        }}
                        className={`w-full px-3 py-2.5 rounded-lg flex items-center justify-between transition group ${currentStatus === option.value ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50 text-gray-700'
                          }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className={`w-2 h-2 rounded-full ${option.value === 'AVAILABLE' ? 'bg-green-500' :
                            option.value === 'RENTED' ? 'bg-blue-500' : 'bg-red-500'
                            }`} />
                          <span className="font-medium">{option.label}</span>
                        </div>
                        {currentStatus === option.value && <Check size={16} />}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
            {/* Hidden Input for Form Submission */}
            <input type="hidden" {...register("status")} />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5 uppercase tracking-tighter">Car Image <span className="text-red-500">*</span></label>
            <div className="mt-2 flex items-center gap-6">
              {imagePreview ? (
                <div className="relative w-40 h-24 rounded-2xl overflow-hidden border-2 border-blue-500 group">
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer">
                    <Upload className="text-white" size={20} />
                    <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                  </label>
                </div>
              ) : (
                <label className="w-40 h-24 rounded-2xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center gap-2 hover:border-blue-500 hover:bg-blue-50 transition cursor-pointer group">
                  <div className="p-2 bg-gray-50 rounded-full group-hover:bg-blue-100 transition">
                    <ImageIcon className="text-gray-400 group-hover:text-blue-600" size={20} />
                  </div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Upload Image</span>
                  <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                </label>
              )}
              <div className="flex-1">
                <p className="text-sm text-gray-500 leading-relaxed italic">
                  Upload a high-quality image of the vehicle. <br />
                  Supported formats: JPG, PNG, WebP. Max size: 5MB.
                </p>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5 uppercase tracking-tighter">Description <span className="text-gray-400 font-normal italic lowercase ml-1">(optional)</span></label>
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
