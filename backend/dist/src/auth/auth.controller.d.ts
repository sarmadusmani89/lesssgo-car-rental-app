import { AuthService } from './auth.service';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    signup(body: any): Promise<{
        message: string;
    }>;
    login(body: any): Promise<{
        access_token: string;
        user: {
            id: string;
            email: string;
            name: string | null;
        };
    }>;
    verify(token: string): Promise<{
        message: string;
    }>;
    forgotPassword(body: any): Promise<{
        message: string;
    }>;
    resetPassword(body: any): Promise<{
        message: string;
    }>;
}
