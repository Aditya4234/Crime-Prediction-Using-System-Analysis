"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcryptjs_1 = require("bcryptjs");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const models_1 = require("../models");
const JWT_SECRET = process.env.JWT_SECRET || 'cpas-secret-key-change-in-production';
const JWT_EXPIRES_IN = '24h';
class AuthService {
    static login(input) {
        const user = models_1.UserModel.getByUsername(input.username);
        if (!user)
            return null;
        const isPasswordValid = (0, bcryptjs_1.compareSync)(input.password, user.password);
        if (!isPasswordValid)
            return null;
        const token = jsonwebtoken_1.default.sign({ userId: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
        const { password, ...userWithoutPassword } = user;
        return { user: userWithoutPassword, token };
    }
    static register(input) {
        const existingUser = models_1.UserModel.getByUsername(input.username);
        if (existingUser)
            return null;
        const existingEmail = models_1.UserModel.getByEmail(input.email);
        if (existingEmail)
            return null;
        const user = models_1.UserModel.create(input);
        const token = jsonwebtoken_1.default.sign({ userId: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
        const { password, ...userWithoutPassword } = user;
        return { user: userWithoutPassword, token };
    }
    static verifyToken(token) {
        try {
            return jsonwebtoken_1.default.verify(token, JWT_SECRET);
        }
        catch {
            return null;
        }
    }
    static getUserFromToken(token) {
        const payload = this.verifyToken(token);
        if (!payload)
            return null;
        const user = models_1.UserModel.getById(payload.userId);
        if (!user)
            return null;
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }
}
exports.AuthService = AuthService;
//# sourceMappingURL=AuthService.js.map