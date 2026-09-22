import { User, RegisterInput } from '../types';
export declare class UserModel {
    static getAll(): User[];
    static getById(id: string): User | undefined;
    static getByUsername(username: string): User | undefined;
    static getByEmail(email: string): User | undefined;
    static create(input: RegisterInput): User;
    static update(id: string, data: Partial<User>): User | null;
    static delete(id: string): boolean;
}
//# sourceMappingURL=User.d.ts.map