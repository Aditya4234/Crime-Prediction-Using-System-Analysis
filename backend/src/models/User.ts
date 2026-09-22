import { hashSync } from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { getCollection, updateCollection } from '../lib/database';
import { User, RegisterInput } from '../types';

export class UserModel {
  static async getAll(): Promise<User[]> {
    return await getCollection('users') as User[];
  }

  static async getById(id: string): Promise<User | undefined> {
    const users = await this.getAll();
    return users.find(u => u.id === id);
  }

  static async getByUsername(username: string): Promise<User | undefined> {
    const users = await this.getAll();
    return users.find(u => u.username === username);
  }

  static async getByEmail(email: string): Promise<User | undefined> {
    const users = await this.getAll();
    return users.find(u => u.email === email);
  }

  static async create(input: RegisterInput): Promise<User> {
    const users = await this.getAll();
    const now = new Date().toISOString();

    const newUser: User = {
      id: uuidv4(),
      username: input.username,
      email: input.email,
      password: hashSync(input.password, 10),
      fullName: input.fullName,
      badge: input.badge,
      role: input.role || 'officer',
      createdAt: now,
      updatedAt: now,
    };

    users.push(newUser);
    await updateCollection('users', users);
    return newUser;
  }

  static async update(id: string, data: Partial<User>): Promise<User | null> {
    const users = await this.getAll();
    const index = users.findIndex(u => u.id === id);
    
    if (index === -1) return null;

    users[index] = {
      ...users[index],
      ...data,
      id: users[index].id,
      password: users[index].password,
      updatedAt: new Date().toISOString(),
    };

    await updateCollection('users', users);
    return users[index];
  }

  static async delete(id: string): Promise<boolean> {
    const users = await this.getAll();
    const filtered = users.filter(u => u.id !== id);
    
    if (filtered.length === users.length) return false;
    
    await updateCollection('users', filtered);
    return true;
  }
}
