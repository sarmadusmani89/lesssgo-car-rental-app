// Booking types
export enum BookingStatus {
    PENDING = 'PENDING',
    CONFIRMED = 'CONFIRMED',
    CANCELLED = 'CANCELLED',
    COMPLETED = 'COMPLETED',
}

export enum PaymentStatus {
    PENDING = 'PENDING',
    PAID = 'PAID',
    FAILED = 'FAILED',
}

export enum PaymentMethod {
    CASH = 'CASH',
    CARD = 'CARD',
    ONLINE = 'ONLINE',
}

export interface Car {
    id: string;
    name: string;
    brand: string;
    type: string;
    imageUrl: string | null;
    pricePerDay: number;
    vehicleClass: string;
}

export interface BookingUser {
    id: string;
    name: string | null;
    email: string;
}

export interface Payment {
    id: string;
    amount: number;
    status: PaymentStatus;
    paymentMethod: PaymentMethod;
    createdAt: string;
}

export interface Booking {
    id: string;
    userId: string;
    carId: string;
    startDate: string;
    endDate: string;
    totalAmount: number;
    status: BookingStatus;
    paymentStatus: PaymentStatus;
    paymentMethod: PaymentMethod;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    createdAt: string;
    updatedAt: string;
    user?: BookingUser;
    car?: Car;
    payments?: Payment[];
}

export interface BookingFilters {
    status?: BookingStatus;
    paymentStatus?: PaymentStatus;
    search?: string;
    startDate?: string;
    endDate?: string;
}

export interface BookingsResponse {
    bookings: Booking[];
    total: number;
    page: number;
    limit: number;
}

export interface UpdateBookingDto {
    status?: BookingStatus;
    paymentStatus?: PaymentStatus;
}
