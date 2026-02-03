export type VehicleStatus = "available" | "unavailable";

export interface Vehicle {
  id: number;
  name: string;
  brand: string;
  category: string;
  description: string;
  pricePerDay: number;
  features: string[];
  images: string[]; // preview URLs (frontend only)
  status: VehicleStatus;
}
