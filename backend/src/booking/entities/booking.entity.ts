import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Index, OneToMany } from 'typeorm';
import { Vehicle } from '../../vehicle/entities/vehicle.entity';
import { User } from '../../user/entities/user.entity';
import { Payment } from '../../payment/entities/payment.entity';

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';
export type PaymentStatus = 'pending' | 'paid' | 'failed';
export type PaymentMethod = 'cash' | 'card' | 'online';

@Entity('booking')
@Index('idx_userId', ['userId'])
@Index('idx_vehicleId', ['vehicleId'])
@Index('idx_vehicle_dates', ['vehicleId', 'startDate', 'endDate'])
export class Booking {
  @PrimaryGeneratedColumn()
  id!: number;

  // Relations
  @ManyToOne(() => User, (user: User) => user.bookings)
  @JoinColumn({ name: 'userId' })
  user!: User;

  @Column()
  userId!: number;

  @ManyToOne(() => Vehicle, (vehicle) => vehicle.bookings)
  @JoinColumn({ name: 'vehicleId' })
  vehicle!: Vehicle;

  @Column()
  vehicleId!: number;

  @Column({ type: 'date' })
  startDate!: string;

  @Column({ type: 'date' })
  endDate!: string;

  @Column({
    type: 'decimal', precision: 10, scale: 2, transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value),
    }
  })
  totalAmount!: number;

  @Column({ type: 'enum', enum: ['pending', 'confirmed', 'cancelled', 'completed'], default: 'pending' })
  status!: BookingStatus;

  @Column({ type: 'enum', enum: ['pending', 'paid', 'failed'], default: 'pending' })
  paymentStatus!: PaymentStatus;

  @Column({ type: 'enum', enum: ['cash', 'card', 'online'], default: 'cash' })
  paymentMethod!: PaymentMethod;

  @Column()
  customerName!: string;

  @Column()
  customerEmail!: string;

  @Column()
  customerPhone!: string;

  // Payments relation
  @OneToMany(() => Payment, (payment) => payment.booking)
  payments!: Payment[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
