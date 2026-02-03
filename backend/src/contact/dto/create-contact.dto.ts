import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateContactDto {
    @IsNotEmpty()
    @IsString()
    name!: string;

    @IsNotEmpty()
    @IsEmail()
    email!: string;

    @IsNotEmpty()
    @IsString()
    subject!: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(10, { message: 'Message must be at least 10 characters long' })
    message!: string;
}
