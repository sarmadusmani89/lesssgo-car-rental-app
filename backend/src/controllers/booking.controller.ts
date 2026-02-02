import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { BookingService } from '../services/booking.service';

@Controller('bookings')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post()
  create(@Body() dto: any) {
    return this.bookingService.create(dto);
  }

  @Get()
  findAll() {
    return this.bookingService.findAll();
  }

  @Get('user/:userId')
  findByUserId(@Param('userId') userId: string) {
    return this.bookingService.findByUserId(Number(userId));
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: any) {
    return this.bookingService.update(Number(id), dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bookingService.remove(Number(id));
  }
}
