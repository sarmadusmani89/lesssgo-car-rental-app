import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Patch, Req, ForbiddenException } from '@nestjs/common';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) { }

  @Post()
  @UseGuards(AuthGuard)
  create(@Body() createBookingDto: CreateBookingDto) {
    return this.bookingService.create(createBookingDto);
  }

  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  findAll() {
    return this.bookingService.findAll();
  }

  @Get('car/:carId')
  findByCar(@Param('carId') carId: string) {
    return this.bookingService.findByCar(carId);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  findOne(@Param('id') id: string) {
    return this.bookingService.findOne(id);
  }

  // Added PATCH endpoint to allow users to cancel/update their own bookings
  @Patch(':id')
  @UseGuards(AuthGuard)
  async updateStatus(@Param('id') id: string, @Body() updateBookingDto: UpdateBookingDto, @Req() req: any) {
    const user = req.user;
    const booking = await this.bookingService.findOne(id);

    // Allow if Admin OR if updating own booking
    if (user.role !== Role.ADMIN && booking.userId !== user.id) {
      throw new ForbiddenException('You can only update your own bookings');
    }

    // Check cancellation rules if status is CANCELLED
    if (updateBookingDto.status === 'CANCELLED' && user.role !== Role.ADMIN) {
      // 1. Check if car allows free cancellation
      if (!booking.car.freeCancellation) {
        throw new ForbiddenException('This car does not allow free cancellation.');
      }

      // 2. Check 48h notice
      const pickupDate = new Date(booking.startDate);
      const now = new Date();
      const hoursDifference = (pickupDate.getTime() - now.getTime()) / (1000 * 60 * 60);

      if (hoursDifference < 48) {
        throw new ForbiddenException('Cancellations are only allowed 48 hours before pickup.');
      }
    }

    return this.bookingService.update(id, updateBookingDto);
  }

  @Put(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  update(@Param('id') id: string, @Body() updateBookingDto: UpdateBookingDto) {
    return this.bookingService.update(id, updateBookingDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.bookingService.remove(id);
  }

  @Patch(':id/confirm-payment')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  confirmPayment(@Param('id') id: string) {
    return this.bookingService.confirmPayment(id);
  }

  @Get('user/:userId')
  @UseGuards(AuthGuard)
  findByUser(@Param('userId') userId: string) {
    return this.bookingService.findByUser(userId);
  }
}
