import { PrismaService } from '../prisma/prisma.service';
export declare class VehicleService {
    private prisma;
    constructor(prisma: PrismaService);
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
    create(data: any): Promise<{
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
    update(id: string, data: any): Promise<{
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
