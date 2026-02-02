import { PrismaService } from "../prisma/prisma.service";
import { BookingService } from "../services/booking.service";
import { sendEmail } from "../lib/sendEmail";
import { bookingReminderTemplate } from "../lib/emailTemplates/bookingReminder";

const prisma = new PrismaService();
const bookingService = new BookingService(prisma);

export async function sendBookingReminders() {
  const bookings = await bookingService.getTomorrowBookings();

  for (const booking of bookings) {
    if (!booking.user || !booking.vehicle) continue;

    await sendEmail(
      booking.user.email,
      "Booking Reminder",
      bookingReminderTemplate(
        booking.user.name ?? "User",
        booking.vehicle.name ?? "Vehicle",
        booking.startDate.toDateString()
      )
    );
  }
}

// Call manually if needed
// sendBookingReminders();
