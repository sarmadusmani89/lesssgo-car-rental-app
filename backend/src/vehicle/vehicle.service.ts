import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class VehicleService {
    constructor(private prisma: PrismaService) { }

    async findAll() {
        return this.prisma.vehicle.findMany();
    }

    async findOne(id: string) {
        return this.prisma.vehicle.findUnique({ where: { id } });
    }

    async create(data: any) {
        return this.prisma.vehicle.create({ data });
    }

    async update(id: string, data: any) {
        return this.prisma.vehicle.update({ where: { id }, data });
    }

    async remove(id: string) {
        return this.prisma.vehicle.delete({ where: { id } });
    }
}
