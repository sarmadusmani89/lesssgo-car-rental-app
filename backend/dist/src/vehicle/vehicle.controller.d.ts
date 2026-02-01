import { VehicleService } from './vehicle.service';
export declare class VehicleController {
    private readonly vehicleService;
    constructor(vehicleService: VehicleService);
    create(createVehicleDto: any): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        brand: string;
        type: string;
        transmission: string;
        fuelCapacity: number;
        pricePerDay: number;
        imageUrl: string | null;
        description: string | null;
        status: import("@prisma/client").$Enums.VehicleStatus;
    }>;
    findAll(): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        brand: string;
        type: string;
        transmission: string;
        fuelCapacity: number;
        pricePerDay: number;
        imageUrl: string | null;
        description: string | null;
        status: import("@prisma/client").$Enums.VehicleStatus;
    }[]>;
    findOne(id: string): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        brand: string;
        type: string;
        transmission: string;
        fuelCapacity: number;
        pricePerDay: number;
        imageUrl: string | null;
        description: string | null;
        status: import("@prisma/client").$Enums.VehicleStatus;
    } | null>;
    update(id: string, updateVehicleDto: any): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        brand: string;
        type: string;
        transmission: string;
        fuelCapacity: number;
        pricePerDay: number;
        imageUrl: string | null;
        description: string | null;
        status: import("@prisma/client").$Enums.VehicleStatus;
    }>;
    remove(id: string): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        brand: string;
        type: string;
        transmission: string;
        fuelCapacity: number;
        pricePerDay: number;
        imageUrl: string | null;
        description: string | null;
        status: import("@prisma/client").$Enums.VehicleStatus;
    }>;
}
