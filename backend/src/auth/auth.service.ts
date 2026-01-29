import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { EmailService } from '../email/email.service';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService,
        private emailService: EmailService,
    ) { }

    async signup(email: string, pass: string, name: string) {
        const existingUser = await this.userService.findOne({ email });
        if (existingUser) {
            throw new ConflictException('Email already exists');
        }

        const hashedPassword = await bcrypt.hash(pass, 10);
        const verificationToken = uuidv4();

        const user = await this.userService.create({
            email,
            password: hashedPassword,
            name,
            verificationToken,
        });

        await this.emailService.sendVerificationEmail(email, verificationToken);

        return { message: 'Signup successful. Please verify your email.' };
    }

    async login(email: string, pass: string) {
        const user = await this.userService.findOne({ email });
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const isMatch = await bcrypt.compare(pass, user.password);
        if (!isMatch) {
            throw new UnauthorizedException('Invalid credentials');
        }

        if (!user.isVerified) {
            throw new UnauthorizedException('Please verify your email first');
        }

        const payload = { sub: user.id, email: user.email };
        return {
            access_token: await this.jwtService.signAsync(payload),
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
            },
        };
    }

    async verifyEmail(token: string) {
        const user = await this.userService.findOne({ verificationToken: token });
        if (!user) {
            throw new UnauthorizedException('Invalid verification token');
        }

        await this.userService.update({
            where: { id: user.id },
            data: { isVerified: true, verificationToken: null },
        });

        return { message: 'Email verified successfully' };
    }

    async forgotPassword(email: string) {
        const user = await this.userService.findOne({ email });
        if (!user) {
            // Don't leak user existence
            return { message: 'If the email exists, a reset link has been sent' };
        }

        const resetToken = uuidv4();
        const resetTokenExp = new Date();
        resetTokenExp.setHours(resetTokenExp.getHours() + 1);

        await this.userService.update({
            where: { id: user.id },
            data: { resetToken, resetTokenExp },
        });

        await this.emailService.sendPasswordResetEmail(email, resetToken);

        return { message: 'If the email exists, a reset link has been sent' };
    }

    async resetPassword(token: string, pass: string) {
        const user = await this.userService.findOne({ resetToken: token });
        if (!user || !user.resetTokenExp || user.resetTokenExp < new Date()) {
            throw new UnauthorizedException('Invalid or expired reset token');
        }

        const hashedPassword = await bcrypt.hash(pass, 10);
        await this.userService.update({
            where: { id: user.id },
            data: {
                password: hashedPassword,
                resetToken: null,
                resetTokenExp: null,
            },
        });

        return { message: 'Password reset successful' };
    }
}
