import { IsString, IsOptional, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateTestimonialDto {
    @IsString()
    name!: string;

    @IsString()
    @IsOptional()
    role?: string;

    @IsString()
    content!: string;

    @IsString()
    @IsOptional()
    avatar?: string;

    @IsInt()
    @Min(1)
    @Max(5)
    @Type(() => Number)
    @IsOptional()
    rating?: number;
}
