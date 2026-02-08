import { IsEmail, IsString, IsOptional, MinLength, IsEnum } from 'class-validator';
import { Role } from '@prisma/client';

export class CreateUserDto {
    @IsEmail()
    email!: string;

    @IsString()
    @MinLength(6)
    password!: string;

    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsString()
    phoneNumber?: string;

    @IsOptional()
    isVerified?: boolean;

    @IsOptional()
    verificationToken?: string | null;

    @IsOptional()
    resetToken?: string | null;

    @IsOptional()
    resetTokenExp?: Date | null;

    @IsOptional()
    @IsEnum(Role)
    role?: Role;
}
