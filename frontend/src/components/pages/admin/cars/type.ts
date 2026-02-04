export type CarStatus = "AVAILABLE" | "RENTED" | "MAINTENANCE";

export interface Car {
  id: string;
  name: string;
  brand: string;
  type: string;
  transmission: string;
  fuelCapacity: number;
  pricePerDay: number;
  imageUrl?: string;
  description?: string;
  status: CarStatus;
  createdAt: string;
  updatedAt: string;
}
