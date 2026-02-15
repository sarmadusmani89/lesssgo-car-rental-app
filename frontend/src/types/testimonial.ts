export interface Testimonial {
    id: string;
    name: string;
    role?: string;
    content: string;
    avatar?: string;
    rating: number;
    createdAt: string;
    updatedAt: string;
}

export interface CreateTestimonialDto {
    name: string;
    role?: string;
    content: string;
    avatar?: string;
    rating?: number;
}

export interface UpdateTestimonialDto extends Partial<CreateTestimonialDto> { }
