import { PrismaService } from "../prisma/prisma.service";
import { Booking, User, Vehicle, BookingStatus } from "@prisma/client";

export class BookingService {
  constructor(private prisma: PrismaService) {}

  async create(data: {
    userId: number;
    vehicleId: number;
    startDate: Date;
    endDate: Date;
    totalPrice: number;
    status: string;
  }): Promise<Booking> {
    return this.prisma.booking.create({ 
      data: {
        ...data,
        userId: String(data.userId),
        vehicleId: String(data.vehicleId),
        endDate: data.endDate,
        totalPrice: data.totalPrice,
        status: data.status as BookingStatus,
      }
    });
  }

  async findAll(): Promise<(Booking & { user: User; vehicle: Vehicle })[]> {
    return this.prisma.booking.findMany({
      include: { user: true, vehicle: true },
    });
  }

  async findByUserId(userId: number): Promise<(Booking & { user: User; vehicle: Vehicle })[]> {
    return this.prisma.booking.findMany({
      where: { userId: String(userId) },
      include: { user: true, vehicle: true },
    });
  }

  async update(id: number, data: Partial<Omit<Booking, "id">>): Promise<Booking> {
    return this.prisma.booking.update({
      where: { id: String(id) },
      data,
    });
  }

  async remove(id: number): Promise<Booking> {
    return this.prisma.booking.delete({ where: { id: String(id) } });
  }

  async getTomorrowBookings(): Promise<(Booking & { user: User; vehicle: Vehicle })[]> {
    const start = new Date();
    start.setDate(start.getDate() + 1);
    start.setHours(0, 0, 0, 0);

    const end = new Date(start);
    end.setHours(23, 59, 59, 999);

    return this.prisma.booking.findMany({
      where: { startDate: { gte: start, lte: end }, status: "CONFIRMED" },
      include: { user: true, vehicle: true },
    });
  }
}
