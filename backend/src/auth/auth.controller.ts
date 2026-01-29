import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('signup')
    @ApiOperation({ summary: 'User signup' })
    @ApiResponse({ status: 201, description: 'User successfully created.' })
    @ApiResponse({ status: 409, description: 'Email already exists.' })
    async signup(@Body() body: any) {
        return this.authService.signup(body.email, body.password, body.name);
    }

    @Post('login')
    @ApiOperation({ summary: 'User login' })
    @ApiResponse({ status: 200, description: 'User successfully logged in.' })
    @ApiResponse({ status: 401, description: 'Invalid credentials.' })
    async login(@Body() body: any) {
        return this.authService.login(body.email, body.password);
    }

    @Get('verify')
    @ApiOperation({ summary: 'Email verification' })
    @ApiResponse({ status: 200, description: 'Email verified successfully.' })
    @ApiResponse({ status: 401, description: 'Invalid verification token.' })
    async verify(@Query('token') token: string) {
        return this.authService.verifyEmail(token);
    }

    @Post('forgot-password')
    @ApiOperation({ summary: 'Request password reset' })
    @ApiResponse({ status: 200, description: 'Reset link sent if email exists.' })
    async forgotPassword(@Body() body: any) {
        return this.authService.forgotPassword(body.email);
    }

    @Post('reset-password')
    @ApiOperation({ summary: 'Reset password' })
    @ApiResponse({ status: 200, description: 'Password reset successful.' })
    @ApiResponse({ status: 401, description: 'Invalid or expired reset token.' })
    async resetPassword(@Body() body: any) {
        return this.authService.resetPassword(body.token, body.password);
    }
}
