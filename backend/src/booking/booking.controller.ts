import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Patch, Req, ForbiddenException } from '@nestjs/common';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('booking')
@UseGuards(AuthGuard)
export class BookingController {
  constructor(private readonly bookingService: BookingService) { }

  @Post()
  create(@Body() createBookingDto: CreateBookingDto) {
    return this.bookingService.create(createBookingDto);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  findAll() {
    return this.bookingService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bookingService.findOne(id);
  }

  // Added PATCH endpoint to allow users to cancel/update their own bookings
  @Patch(':id')
  async updateStatus(@Param('id') id: string, @Body() updateBookingDto: UpdateBookingDto, @Req() req: any) {
    const user = req.user;
    const booking = await this.bookingService.findOne(id);

    // Allow if Admin OR if updating own booking
    if (user.role !== Role.ADMIN && booking.userId !== user.id) {
      throw new ForbiddenException('You can only update your own bookings');
    }

    return this.bookingService.update(id, updateBookingDto);
  }

  @Put(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  update(@Param('id') id: string, @Body() updateBookingDto: UpdateBookingDto) {
    return this.bookingService.update(id, updateBookingDto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.bookingService.remove(id);
  }

  @Get('user/:userId')
  findByUser(@Param('userId') userId: string) {
    return this.bookingService.findByUser(userId);
  }
}
