"use client";

import { useState, useEffect } from "react";
import { Vehicle } from "./type";

type Props = {
  onAdd: (v: Vehicle) => void;
  onUpdate: (v: Vehicle) => void;
  editingVehicle: Vehicle | null;
};

const ALL_FEATURES = [
  "Air Conditioning",
  "Automatic",
  "Manual",
  "GPS",
  "Bluetooth",
  "Heated Seats",
];

export default function VehicleForm({ onAdd, onUpdate, editingVehicle }: Props) {
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [pricePerDay, setPricePerDay] = useState<number>(0);
  const [features, setFeatures] = useState<string[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (editingVehicle) {
      setName(editingVehicle.name);
      setBrand(editingVehicle.brand);
      setCategory(editingVehicle.category);
      setDescription(editingVehicle.description);
      setPricePerDay(editingVehicle.pricePerDay);
      setFeatures(editingVehicle.features);
      setImages(editingVehicle.images);
    }
  }, [editingVehicle]);

  const toggleFeature = (feature: string) => {
    setFeatures((prev) =>
      prev.includes(feature)
        ? prev.filter((f) => f !== feature)
        : [...prev, feature]
    );
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    const urls = files.map((file) => URL.createObjectURL(file));
    setImages((prev) => [...prev, ...urls]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !brand || !category) {
      setError("Name, Brand and Category are required");
      return;
    }

    if (pricePerDay <= 0) {
      setError("Price must be greater than 0");
      return;
    }

    if (features.length === 0) {
      setError("Select at least one feature");
      return;
    }

    if (images.length === 0) {
      setError("Upload at least one image");
      return;
    }

    setError("");

    const vehicle: Vehicle = {
      id: editingVehicle ? editingVehicle.id : Date.now(),
      name,
      brand,
      category,
      description,
      pricePerDay,
      features,
      images,
      status: editingVehicle ? editingVehicle.status : "available",
    };

    editingVehicle ? onUpdate(vehicle) : onAdd(vehicle);

    setName("");
    setBrand("");
    setCategory("");
    setDescription("");
    setPricePerDay(0);
    setFeatures([]);
    setImages([]);
  };

  return (
    <form onSubmit={handleSubmit} className="border p-4 rounded mb-6">
      <h2 className="text-xl font-bold mb-4">
        {editingVehicle ? "Edit Vehicle" : "Add Vehicle"}
      </h2>

      {error && <p className="text-red-500 mb-3">{error}</p>}

      {/* GRID INPUTS */}
      <div className="grid grid-cols-2 gap-3">
        <input
          type="text"
          placeholder="Vehicle Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 rounded"
        />

        <input
          type="text"
          placeholder="Brand"
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          className="border p-2 rounded"
        />

        <input
          type="text"
          placeholder="Category (Sedan, SUV)"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border p-2 rounded"
        />

        <input
          type="number"
          placeholder="Price / Day"
          value={pricePerDay}
          onChange={(e) => setPricePerDay(Number(e.target.value))}
          className="border p-2 rounded"
        />
      </div>

      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="border p-2 rounded w-full mt-3"
      />

      {/* FEATURES */}
      <div className="mt-3">
        <p className="font-semibold mb-1">Features</p>
        <div className="flex flex-wrap gap-4">
          {ALL_FEATURES.map((f) => (
            <label key={f} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={features.includes(f)}
                onChange={() => toggleFeature(f)}
              />
              {f}
            </label>
          ))}
        </div>
      </div>

      {/* IMAGES */}
      <div className="mt-3">
        <p className="font-semibold mb-1">Images</p>
        <input type="file" multiple accept="image/*" onChange={handleImageUpload} />
        <div className="flex gap-2 mt-2">
          {images.map((img, i) => (
            <img key={i} src={img} className="w-16 h-16 object-cover rounded" />
          ))}
        </div>
      </div>

      <button className="mt-4 bg-green-600 text-white px-4 py-2 rounded">
        {editingVehicle ? "Update Vehicle" : "Add Vehicle"}
      </button>
    </form>
  );
}
