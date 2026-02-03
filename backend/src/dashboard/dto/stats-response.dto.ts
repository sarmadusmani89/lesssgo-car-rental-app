export class AdminStatsDto {
    users!: number;
    bookings!: number;
    revenue!: number;
}

export class UserStatsDto {
    userId!: number;
    bookings!: number;
    totalSpent!: number;
}
