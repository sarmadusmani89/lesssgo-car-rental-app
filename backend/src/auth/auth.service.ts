import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../user/user.service';
import { EmailService } from '../email/email.service';
import * as bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private emailService: EmailService,
  ) { }

  async signup(email: string, password: string, name: string, phoneNumber: string) {
    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const verificationToken = uuidv4();

    await this.usersService.create({
      email,
      password: password, // usersService.create will handle hashing
      name,
      phoneNumber,
      role: 'USER' as any, // Ensure default role is 'user'
      isVerified: false,
      verificationToken,
    });

    await this.emailService.sendVerificationEmail(email, verificationToken);
    return { message: 'Signup successful. Please verify your email.' };
  }

  async login(email: string, password: string, rememberMe: boolean = false) {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) throw new UnauthorizedException('Invalid credentials');

    if (!user.isVerified) {
      throw new UnauthorizedException('Please verify your email first');
    }

    const payload = { sub: user.id, email: user.email, role: user.role };
    return {
      access_token: await this.jwtService.signAsync(payload, {
        expiresIn: rememberMe ? '2d' : '1d',
      }),
      user,
    };
  }

  async verifyEmail(token: string) {
    const users = await this.usersService.findAll();
    const user = users.find(u => u.verificationToken === token);
    if (!user) throw new UnauthorizedException('Invalid verification token');

    await this.usersService.update(user.id, {
      isVerified: true,
      verificationToken: null,
    });

    return { message: 'Email verified successfully' };
  }

  async forgotPassword(email: string) {
    console.log(`[ForgotPassword] Request for email: ${email}`);
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      console.log(`[ForgotPassword] User not found for email: ${email}`);
      return { message: 'If the email exists, a reset link has been sent' };
    }

    console.log(`[ForgotPassword] User found: ${user.id}`);

    const resetToken = uuidv4();
    const resetTokenExp = new Date();
    resetTokenExp.setHours(resetTokenExp.getHours() + 1);

    await this.usersService.update(user.id, {
      resetToken,
      resetTokenExp,
    });

    try {
      console.log(`[ForgotPassword] Sending email to: ${email} with token: ${resetToken}`);
      await this.emailService.sendPasswordResetEmail(email, resetToken);
      console.log(`[ForgotPassword] Email sent successfully.`);
    } catch (error) {
      console.error(`[ForgotPassword] Failed to send email:`, error);
      // We still return success to not leak info, but logging error is crucial for us
    }

    return { message: 'If the email exists, a reset link has been sent' };
  }

  async resetPassword(token: string, password: string) {
    const users = await this.usersService.findAll();
    const user = users.find(u => u.resetToken === token);
    if (!user || !user.resetTokenExp || user.resetTokenExp < new Date()) {
      throw new UnauthorizedException('Invalid or expired reset token');
    }

    await this.usersService.update(user.id, {
      password,
      resetToken: null,
      resetTokenExp: null,
    });

    return { message: 'Password reset successful' };
  }

  async verifyResetToken(token: string) {
    const users = await this.usersService.findAll();
    const user = users.find(u => u.resetToken === token);
    if (!user || !user.resetTokenExp || user.resetTokenExp < new Date()) {
      throw new UnauthorizedException('Invalid or expired reset token');
    }
    return { valid: true };
  }
}
