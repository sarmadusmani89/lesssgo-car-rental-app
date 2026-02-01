import { PrismaService } from '../prisma/prisma.service';
import { User, Prisma } from '@prisma/client';
export declare class UserService {
    private prisma;
    constructor(prisma: PrismaService);
    findOne(where: Prisma.UserWhereInput): Promise<User | null>;
    create(data: Prisma.UserCreateInput): Promise<User>;
    update(params: {
        where: Prisma.UserWhereUniqueInput;
        data: Prisma.UserUpdateInput;
    }): Promise<User>;
}
