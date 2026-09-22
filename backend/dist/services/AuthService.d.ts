import { LoginInput, RegisterInput, AuthResponse, User } from '../types';
export declare class AuthService {
    static login(input: LoginInput): AuthResponse | null;
    static register(input: RegisterInput): AuthResponse | null;
    static verifyToken(token: string): any;
    static getUserFromToken(token: string): Omit<User, 'password'> | null;
}
//# sourceMappingURL=AuthService.d.ts.map