import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { EmailService } from '../email/email.service';
export declare class AuthService {
    private userService;
    private jwtService;
    private emailService;
    constructor(userService: UserService, jwtService: JwtService, emailService: EmailService);
    signup(email: string, pass: string, name: string): Promise<{
        message: string;
    }>;
    login(email: string, pass: string): Promise<{
        access_token: string;
        user: {
            id: string;
            email: string;
            name: string | null;
        };
    }>;
    verifyEmail(token: string): Promise<{
        message: string;
    }>;
    forgotPassword(email: string): Promise<{
        message: string;
    }>;
    resetPassword(token: string, pass: string): Promise<{
        message: string;
    }>;
}
