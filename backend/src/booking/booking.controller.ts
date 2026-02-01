import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BookingService } from './booking.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Bookings')
@Controller('bookings')
export class BookingController {
    constructor(private readonly bookingService: BookingService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new booking' })
    create(@Body() createBookingDto: any) {
        return this.bookingService.create(createBookingDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all bookings (Admin)' })
    findAll() {
        return this.bookingService.findAll();
    }

    @Get('user/:userId')
    @ApiOperation({ summary: 'Get bookings for a specific user' })
    findByUserId(@Param('userId') userId: string) {
        return this.bookingService.findByUserId(userId);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update booking status' })
    update(@Param('id') id: string, @Body() updateBookingDto: any) {
        return this.bookingService.update(id, updateBookingDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Cancel/Delete booking' })
    remove(@Param('id') id: string) {
        return this.bookingService.remove(id);
    }
}
