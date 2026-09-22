import { ObjectId } from 'mongodb';
import { connectToDatabase } from '../mongodb';
import { User, RegisterInput } from '../types';
import { hashSync } from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

const COLLECTION = 'users';

export class UserModel {
  static async getAll(): Promise<User[]> {
    const db = await connectToDatabase();
    const users = await db.collection(COLLECTION).find({}).toArray();
    return users.map(({ _id, ...rest }) => rest as User);
  }

  static async getById(id: string): Promise<User | undefined> {
    const db = await connectToDatabase();
    const user = await db.collection(COLLECTION).findOne({ id });
    if (!user) return undefined;
    const { _id, ...rest } = user;
    return rest as User;
  }

  static async getByUsername(username: string): Promise<User | undefined> {
    const db = await connectToDatabase();
    const user = await db.collection(COLLECTION).findOne({ username });
    if (!user) return undefined;
    const { _id, ...rest } = user;
    return rest as User;
  }

  static async getByEmail(email: string): Promise<User | undefined> {
    const db = await connectToDatabase();
    const user = await db.collection(COLLECTION).findOne({ email });
    if (!user) return undefined;
    const { _id, ...rest } = user;
    return rest as User;
  }

  static async create(input: RegisterInput): Promise<User> {
    const db = await connectToDatabase();
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

    await db.collection(COLLECTION).insertOne(newUser);
    return newUser;
  }

  static async update(id: string, data: Partial<User>): Promise<User | null> {
    const db = await connectToDatabase();
    const result = await db.collection(COLLECTION).findOneAndUpdate(
      { id },
      { $set: { ...data, updatedAt: new Date().toISOString() } },
      { returnDocument: 'after' }
    );
    if (!result) return null;
    const { _id, ...rest } = result;
    return rest as User;
  }

  static async delete(id: string): Promise<boolean> {
    const db = await connectToDatabase();
    const result = await db.collection(COLLECTION).deleteOne({ id });
    return result.deletedCount > 0;
  }
}
