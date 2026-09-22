import { connectToDatabase } from '../mongodb';
import { Message } from '../types';

const COLLECTION = 'messages';

export class MessageModel {
  static async getAll(): Promise<Message[]> {
    const db = await connectToDatabase();
    const messages = await db.collection(COLLECTION).find({}).sort({ id: -1 }).toArray();
    return messages.map(({ _id, ...rest }) => rest as Message);
  }

  static async getById(id: number): Promise<Message | undefined> {
    const db = await connectToDatabase();
    const message = await db.collection(COLLECTION).findOne({ id });
    if (!message) return undefined;
    const { _id, ...rest } = message;
    return rest as Message;
  }

  static async getRecent(limit: number = 10): Promise<Message[]> {
    const db = await connectToDatabase();
    const messages = await db.collection(COLLECTION).find({}).sort({ id: -1 }).limit(limit).toArray();
    return messages.map(({ _id, ...rest }) => rest as Message);
  }

  static async create(from: string, msg: string, priority: Message['priority'] = 'normal'): Promise<Message> {
    const db = await connectToDatabase();
    const allMessages = await this.getAll();
    const now = new Date();

    const newMessage: Message = {
      id: allMessages.length > 0 ? Math.max(...allMessages.map(m => m.id)) + 1 : 1,
      from,
      msg,
      time: `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`,
      priority,
    };

    await db.collection(COLLECTION).insertOne(newMessage);
    return newMessage;
  }

  static async delete(id: number): Promise<boolean> {
    const db = await connectToDatabase();
    const result = await db.collection(COLLECTION).deleteOne({ id });
    return result.deletedCount > 0;
  }
}
