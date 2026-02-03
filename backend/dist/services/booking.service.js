"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingService = void 0;
class BookingService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        return this.prisma.booking.create({
            data: {
                ...data,
                userId: String(data.userId),
                vehicleId: String(data.vehicleId),
                endDate: data.endDate,
                totalPrice: data.totalPrice,
                status: data.status,
            }
        });
    }
    async findAll() {
        return this.prisma.booking.findMany({
            include: { user: true, vehicle: true },
        });
    }
    async findByUserId(userId) {
        return this.prisma.booking.findMany({
            where: { userId: String(userId) },
            include: { user: true, vehicle: true },
        });
    }
    async update(id, data) {
        return this.prisma.booking.update({
            where: { id: String(id) },
            data,
        });
    }
    async remove(id) {
        return this.prisma.booking.delete({ where: { id: String(id) } });
    }
    async getTomorrowBookings() {
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
exports.BookingService = BookingService;
//# sourceMappingURL=booking.service.js.map