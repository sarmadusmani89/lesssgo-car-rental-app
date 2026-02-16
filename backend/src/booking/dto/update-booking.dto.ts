import { PartialType } from '@nestjs/mapped-types';
import { CreateBookingDto } from './create-booking.dto';

export class UpdateBookingDto extends PartialType(CreateBookingDto) {
    timezoneOffset?: number; // in minutes, e.g. -600 for PNG (+10h)
}
