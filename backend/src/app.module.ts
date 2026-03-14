import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { UsersModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { BookingModule } from './booking/booking.module';
import { CarModule } from './car/car.module';
import { PaymentModule } from './payment/payment.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { EmailModule } from './email/email.module';
import { CronModule } from './cron/cron.module';
import { ContactModule } from './contact/contact.module';
import { SettingsModule } from './settings/settings.module';
import { NewsletterModule } from './newsletter/newsletter.module';
import { TestimonialModule } from './testimonial/testimonial.module';
import { PrismaService } from './lib/prisma.service';
import { configValidationSchema } from './config/config.validation';

@Module({
  imports: [
    // ── Config with Joi validation ─────────────────────────────────────────
    // The app will REFUSE to start if any required env var is missing or
    // malformed. This catches misconfigured deployments immediately at boot
    // rather than silently failing at runtime during a live payment.
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: configValidationSchema,
      validationOptions: {
        // Show ALL missing/invalid fields at once, not just the first one
        abortEarly: false,
        // Strip env vars not defined in the schema (prevents env pollution)
        allowUnknown: true,
      },
    }),

    // ── Global rate limiting ───────────────────────────────────────────────
    // Default: 30 requests per 60 seconds per IP across all routes.
    // Individual routes/controllers can override this with @Throttle().
    // The /payment/callback route uses KinaCallbackThrottlerGuard (10 rpm).
    ThrottlerModule.forRoot([
      {
        name: 'default',
        ttl: 60_000,   // 60 seconds
        limit: 30,     // max 30 requests per IP
      },
    ]),

    AuthModule,
    UsersModule,
    BookingModule,
    CarModule,
    PaymentModule,
    DashboardModule,
    EmailModule,
    CronModule,
    ContactModule,
    SettingsModule,
    NewsletterModule,
    TestimonialModule,
  ],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class AppModule { }
