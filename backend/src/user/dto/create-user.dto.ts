import { IsEmail, IsString, IsOptional, MinLength } from 'class-validator';

export class CreateUserDto {
    @IsEmail()
    email!: string;

    @IsString()
    @MinLength(6)
    password!: string;

    @IsString()
    firstName!: string;

    @IsString()
    lastName!: string;

    @IsOptional()
    isVerified?: boolean;

    @IsOptional()
    verificationToken?: string | null;

    @IsOptional()
    resetToken?: string | null;

    @IsOptional()
    resetTokenExp?: Date | null;
}
