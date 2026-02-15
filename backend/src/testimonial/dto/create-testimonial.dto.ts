import { IsString, IsOptional, IsInt, Min, Max, IsUrl } from 'class-validator';

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
    @IsOptional()
    rating?: number;
}
