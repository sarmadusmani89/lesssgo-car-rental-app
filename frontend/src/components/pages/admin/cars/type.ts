export type CarStatus = "available" | "unavailable";

export interface Car {
  id: number;
  name: string;
  brand: string;
  category: string;
  description: string;
  pricePerDay: number;
  features: string[];
  images: string[]; // preview URLs (frontend only)
  status: CarStatus;
}
