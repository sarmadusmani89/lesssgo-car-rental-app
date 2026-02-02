// backend/src/vehicle/entities/vehicle.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Booking } from '../../booking/entities/booking.entity';

export type VehicleStatus = 'available' | 'unavailable';

@Entity('vehicle')
export class Vehicle {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ type: 'text' })
  description!: string;

  @Column()
  category!: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  dailyPrice!: number;

  @Column({ type: 'json', nullable: true })
  features!: Record<string, any>[];

  @Column({ type: 'json', nullable: true })
  images!: string[];

  @Column({ type: 'enum', enum: ['available', 'unavailable'], default: 'available' })
  status!: VehicleStatus;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  // ✅ Relation to Booking
  @OneToMany(() => Booking, (booking) => booking.vehicle)
  bookings!: Booking[];
}
