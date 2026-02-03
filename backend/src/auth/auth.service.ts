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

  async signup(email: string, password: string, name: string) {
    const users = await this.usersService.findAll();
    if (users.find(u => u.email === email)) {
      throw new ConflictException('Email already exists');
    }

    const [firstName, ...rest] = name.split(' ');
    const lastName = rest.join(' ') || '';

    const verificationToken = uuidv4();

    await this.usersService.create({
      email,
      password: password, // usersService.create will handle hashing
      firstName,
      lastName,
      role: 'user', // Ensure default role is 'user'
      isVerified: false,
      verificationToken,
    });

    await this.emailService.sendVerificationEmail(email, verificationToken);
    return { message: 'Signup successful. Please verify your email.' };
  }

  async login(email: string, password: string) {
    const user = (await this.usersService.findAll()).find(u => u.email === email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) throw new UnauthorizedException('Invalid credentials');

    if (!user.isVerified) {
      throw new UnauthorizedException('Please verify your email first');
    }

    const payload = { sub: user.id, email: user.email, role: user.role };
    return {
      access_token: await this.jwtService.signAsync(payload),
      user,
    };
  }

  async verifyEmail(token: string) {
    const user = (await this.usersService.findAll()).find(u => u.verificationToken === token);
    if (!user) throw new UnauthorizedException('Invalid verification token');

    await this.usersService.update(user.id, {
      isVerified: true,
      verificationToken: null,
    });

    return { message: 'Email verified successfully' };
  }

  async forgotPassword(email: string) {
    const user = (await this.usersService.findAll()).find(u => u.email === email);
    if (!user) return { message: 'If the email exists, a reset link has been sent' };

    const resetToken = uuidv4();
    const resetTokenExp = new Date();
    resetTokenExp.setHours(resetTokenExp.getHours() + 1);

    await this.usersService.update(user.id, {
      resetToken,
      resetTokenExp,
    });

    await this.emailService.sendPasswordResetEmail(email, resetToken);
    return { message: 'If the email exists, a reset link has been sent' };
  }

  async resetPassword(token: string, password: string) {
    const user = (await this.usersService.findAll()).find(u => u.resetToken === token);
    if (!user || !user.resetTokenExp || user.resetTokenExp < new Date()) {
      throw new UnauthorizedException('Invalid or expired reset token');
    }

    const hashed = await bcrypt.hash(password, 10);
    await this.usersService.update(user.id, {
      password: hashed,
      resetToken: null,
      resetTokenExp: null,
    });

    return { message: 'Password reset successful' };
  }
}
