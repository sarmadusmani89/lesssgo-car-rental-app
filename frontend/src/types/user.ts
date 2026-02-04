// User types
export enum UserRole {
    USER = 'USER',
    ADMIN = 'ADMIN',
}

export interface User {
    id: string;
    email: string;
    name: string | null;
    role: UserRole;
    isVerified: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface CreateUserDto {
    email: string;
    password: string;
    name?: string;
    role?: UserRole;
}

export interface UpdateUserDto {
    email?: string;
    name?: string;
    role?: UserRole;
    isVerified?: boolean;
}

// API Response types
export interface UsersResponse {
    users: User[];
    total: number;
    page: number;
    limit: number;
}

export interface UserFilters {
    role?: UserRole;
    search?: string;
    isVerified?: boolean;
}
