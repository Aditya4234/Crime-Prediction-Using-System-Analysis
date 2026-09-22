import { compareSync } from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserModel } from './models';
import { LoginInput, RegisterInput, AuthResponse, User, JWTPayload } from './types';

const JWT_SECRET = process.env.JWT_SECRET || 'cpas-secret-key-change-in-production';
const JWT_EXPIRES_IN = '24h';

export class AuthService {
  static async login(input: LoginInput): Promise<AuthResponse | null> {
    const user = await UserModel.getByUsername(input.username);
    if (!user) return null;

    const isPasswordValid = compareSync(input.password, user.password);
    if (!isPasswordValid) return null;

    const token = jwt.sign(
      { userId: user.id, username: user.username, role: user.role } as JWTPayload,
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    const { password, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, token };
  }

  static async register(input: RegisterInput): Promise<AuthResponse | null> {
    const existingUser = await UserModel.getByUsername(input.username);
    if (existingUser) return null;

    const existingEmail = await UserModel.getByEmail(input.email);
    if (existingEmail) return null;

    const user = await UserModel.create(input);
    const token = jwt.sign(
      { userId: user.id, username: user.username, role: user.role } as JWTPayload,
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    const { password, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, token };
  }

  static verifyToken(token: string): JWTPayload | null {
    try {
      return jwt.verify(token, JWT_SECRET) as JWTPayload;
    } catch {
      return null;
    }
  }

  static async getUserFromToken(token: string): Promise<Omit<User, 'password'> | null> {
    const payload = this.verifyToken(token);
    if (!payload) return null;

    const user = await UserModel.getById(payload.userId);
    if (!user) return null;

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}
