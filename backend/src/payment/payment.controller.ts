import { Controller, Get, Post, Body, Param, Put, Delete, Headers, Req, RawBodyRequest, UseGuards, Res } from '@nestjs/common';
import { Response } from 'express';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { Request } from 'express';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { Throttle } from '@nestjs/throttler';
import { KinaCallbackThrottlerGuard } from './kina-callback-throttler.guard';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) { }

  @Post('initialize')
  @UseGuards(AuthGuard)
  initialize(@Body('bookingId') bookingId: string) {
    return this.paymentService.initializeKinaPayment(bookingId);
  }

  // ──────────────────────────────────────────────────────────────────────────
  // Kina Bank IPG callback endpoint.
  //
  // SECURITY NOTE: This endpoint MUST be restricted to Kina Bank's known IP
  // ranges at the reverse-proxy (nginx) or firewall level in production.
  // The HMAC P_SIGN check inside the service is our second layer of defence.
  //
  // PROTOCOL NOTE: Kina's IPG POSTs the result to BACKREF. We respond 200 OK
  // and include the redirect URL in the body. The user's browser redirect is
  // handled independently by Kina's hosted payment page (not this server POST).
  // ──────────────────────────────────────────────────────────────────────────
  @Post('callback')
  @UseGuards(KinaCallbackThrottlerGuard)
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  async callback(@Body() body: any, @Res() res: Response) {
    const redirectUrl = await this.paymentService.handleKinaCallback(body);
    // Respond 200 OK to Kina's server-to-server POST.
    // Do NOT use res.redirect() — Kina's server does not follow browser redirects.
    return res.status(200).json({ redirectUrl });
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
