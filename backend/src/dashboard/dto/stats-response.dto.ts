export class AdminStatsDto {
    users!: number;
    bookings!: number;
    revenue!: number;
}

export class UserStatsDto {
    userId!: string;
    bookings!: number;
    totalSpent!: number;
}
