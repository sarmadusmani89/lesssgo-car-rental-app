import { Controller, Get, Post, Body, Param, Put, Delete, Headers, Req, RawBodyRequest, UseGuards } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { Request } from 'express';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) { }

  @Post('create-session')
  @UseGuards(AuthGuard)
  createSession(@Body('bookingId') bookingId: string) {
    return this.paymentService.createCheckoutSession(bookingId);
  }

  @Post('create-intent')
  @UseGuards(AuthGuard)
  createIntent(@Body('bookingId') bookingId: string) {
    return this.paymentService.createPaymentIntent(bookingId);
  }

  @Post('webhook')
  async webhook(
    @Headers('stripe-signature') signature: string,
    @Req() req: RawBodyRequest<Request>,
  ) {
    if (!req.rawBody) {
      throw new Error('Raw body not found');
    }
    return this.paymentService.handleWebhook(signature, req.rawBody);
  }

  @Post()
  @UseGuards(AuthGuard)
  create(@Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentService.create(createPaymentDto);
  }

  @Get('user/:userId')
  @UseGuards(AuthGuard)
  findByUser(@Param('userId') userId: string) {
    return this.paymentService.findByUser(userId);
  }

  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  findAll() {
    return this.paymentService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  findOne(@Param('id') id: string) {
    return this.paymentService.findOne(id);
  }

  @Put(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  update(@Param('id') id: string, @Body() updatePaymentDto: UpdatePaymentDto) {
    return this.paymentService.update(id, updatePaymentDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.paymentService.remove(id);
  }

  @Post('release-bond/:bookingId')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  releaseBond(@Param('bookingId') bookingId: string) {
    return this.paymentService.releaseBond(bookingId);
  }
}
