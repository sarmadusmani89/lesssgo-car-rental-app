import { BookingService } from './booking.service';
export declare class BookingController {
    private readonly bookingService;
    constructor(bookingService: BookingService);
    create(createBookingDto: any): Promise<{
        user: {
            name: string | null;
            id: string;
            email: string;
            verificationToken: string | null;
            resetToken: string | null;
            password: string;
            role: import("@prisma/client").$Enums.Role;
            isVerified: boolean;
            resetTokenExp: Date | null;
            createdAt: Date;
            updatedAt: Date;
        };
        vehicle: {
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
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.BookingStatus;
        startDate: Date;
        endDate: Date;
        totalPrice: number;
        userId: string;
        vehicleId: string;
    }>;
    findAll(): Promise<({
        user: {
            name: string | null;
            id: string;
            email: string;
            verificationToken: string | null;
            resetToken: string | null;
            password: string;
            role: import("@prisma/client").$Enums.Role;
            isVerified: boolean;
            resetTokenExp: Date | null;
            createdAt: Date;
            updatedAt: Date;
        };
        vehicle: {
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
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.BookingStatus;
        startDate: Date;
        endDate: Date;
        totalPrice: number;
        userId: string;
        vehicleId: string;
    })[]>;
    findByUserId(userId: string): Promise<({
        vehicle: {
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
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.BookingStatus;
        startDate: Date;
        endDate: Date;
        totalPrice: number;
        userId: string;
        vehicleId: string;
    })[]>;
    update(id: string, updateBookingDto: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.BookingStatus;
        startDate: Date;
        endDate: Date;
        totalPrice: number;
        userId: string;
        vehicleId: string;
    }>;
    remove(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.BookingStatus;
        startDate: Date;
        endDate: Date;
        totalPrice: number;
        userId: string;
        vehicleId: string;
    }>;
}
