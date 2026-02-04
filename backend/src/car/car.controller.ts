import { Controller, Get, Post, Body, Param, Put, Delete, ParseIntPipe, UseGuards, Query, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Role } from '@prisma/client';
import { CarService } from './car.service';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('car')
export class CarController {
  constructor(private readonly carService: CarService) { }

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @UseInterceptors(FileInterceptor('image'))
  create(
    @Body() createCarDto: CreateCarDto,
    @UploadedFile() file: Express.Multer.File
  ) {
    return this.carService.create(createCarDto, file);

  }

  @Get()
  findAll(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string
  ) {
    return this.carService.findAll(startDate, endDate);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.carService.findOne(id);
  }

  @Get(':id/availability')
  checkAvailability(
    @Param('id') id: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string
  ) {
    return this.carService.checkAvailability(id, startDate, endDate);
  }

  @Get(':id/bookings')
  getBookings(@Param('id') id: string) {
    return this.carService.getBookings(id);
  }

  @Put(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @UseInterceptors(FileInterceptor('image'))
  update(
    @Param('id') id: string,
    @Body() updateCarDto: UpdateCarDto,
    @UploadedFile() file?: Express.Multer.File
  ) {
    return this.carService.update(id, updateCarDto, file);

  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.carService.remove(id);
  }
}
