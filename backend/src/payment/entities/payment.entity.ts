// backend/src/payment/entities/payment.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Booking } from '../../booking/entities/booking.entity';

export type PaymentStatus = 'pending' | 'succeeded' | 'failed';
export type PaymentMethod = 'cash' | 'card' | 'online';

@Entity('payment')
export class Payment {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Booking, (booking) => booking.payments)
  @JoinColumn({ name: 'bookingId' })
  booking!: Booking;

  @Column()
  bookingId!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount!: number;

  @Column()
  currency!: string;

  @Column({ type: 'enum', enum: ['cash', 'card', 'online'], default: 'online' })
  paymentMethod!: PaymentMethod;

  @Column({ nullable: true })
  stripePaymentIntentId!: string;

  @Column({ type: 'enum', enum: ['pending', 'succeeded', 'failed'], default: 'pending' })
  status!: PaymentStatus;

  @Column({ type: 'json', nullable: true })
  metadata!: Record<string, any>;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
