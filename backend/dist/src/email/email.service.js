"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const common_1 = require("@nestjs/common");
const nodemailer = __importStar(require("nodemailer"));
let EmailService = class EmailService {
    transporter;
    onModuleInit() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp.mailtrap.io',
            port: parseInt(process.env.SMTP_PORT || '2525'),
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });
    }
    async sendPasswordResetEmail(email, token) {
        const url = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${token}`;
        await this.sendMail({
            to: email,
            subject: 'Reset your password - Lesssgo',
            html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #2563eb;">Password Reset Request</h2>
          <p>Click the button below to reset your password. This link expires in 1 hour.</p>
          <a href="${url}" style="display: inline-block; padding: 12px 24px; background: #2563eb; color: #fff; text-decoration: none; border-radius: 8px;">Reset Password</a>
        </div>
      `,
        });
    }
    async sendVerificationEmail(email, token) {
        const url = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify?token=${token}`;
        await this.sendMail({
            to: email,
            subject: 'Verify your email - Lesssgo',
            html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #2563eb;">Welcome to Lesssgo!</h2>
          <p>Click the button below to verify your account:</p>
          <a href="${url}" style="display: inline-block; padding: 12px 24px; background: #2563eb; color: #fff; text-decoration: none; rounded: 8px;">Verify Account</a>
        </div>
      `,
        });
    }
    async sendBookingConfirmation(email, bookingDetails) {
        await this.sendMail({
            to: email,
            subject: 'Booking Confirmation - Lesssgo',
            html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #2563eb;">Booking Confirmed!</h2>
          <p>Your booking for <strong>${bookingDetails.vehicleName}</strong> has been confirmed.</p>
          <p>Duration: ${bookingDetails.startDate} to ${bookingDetails.endDate}</p>
          <p>Total Price: $${bookingDetails.totalPrice}</p>
        </div>
      `,
        });
    }
    async sendNotification(email, title, message) {
        await this.sendMail({
            to: email,
            subject: title,
            html: `<p>${message}</p>`,
        });
    }
    async sendMail(options) {
        try {
            await this.transporter.sendMail({
                from: '"Lesssgo Auto" <noreply@lesssgo.com>',
                ...options,
            });
            console.log(`[EmailService] Email sent to ${options.to}`);
        }
        catch (error) {
            console.error('[EmailService] Failed to send email:', error);
        }
    }
};
exports.EmailService = EmailService;
exports.EmailService = EmailService = __decorate([
    (0, common_1.Injectable)()
], EmailService);
//# sourceMappingURL=email.service.js.map