export type CarStatus = "AVAILABLE" | "RENTED" | "MAINTENANCE";

export interface Car {
  id: string;
  name: string;
  brand: string;
  type: string;
  transmission: string;
  fuelCapacity: number;
  pricePerDay: number;
  hp: number;
  vehicleClass: string;
  imageUrl?: string;
  description?: string;
  status: CarStatus;
  pickupLocation?: string[];
  returnLocation?: string[];
  passengers?: number;
  freeCancellation?: boolean;
  fuelType?: string;
  airConditioner?: boolean;
  gps?: boolean;
  gallery?: string[];
  createdAt: string;
  updatedAt: string;
}
