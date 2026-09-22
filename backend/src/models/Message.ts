import { getCollection, updateCollection } from '../lib/database';
import { Message } from '../types';

export class MessageModel {
  static async getAll(): Promise<Message[]> {
    return await getCollection('messages') as Message[];
  }

  static async getById(id: number): Promise<Message | undefined> {
    const messages = await this.getAll();
    return messages.find(msg => msg.id === id);
  }

  static async getRecent(limit: number = 10): Promise<Message[]> {
    const messages = await this.getAll();
    return messages.slice(-limit);
  }

  static async create(from: string, msg: string, priority: Message['priority'] = 'normal'): Promise<Message> {
    const messages = await this.getAll();
    const now = new Date();
    
    const newMessage: Message = {
      id: messages.length > 0 ? Math.max(...messages.map(m => m.id)) + 1 : 1,
      from,
      msg,
      time: `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`,
      priority,
    };

    messages.push(newMessage);
    await updateCollection('messages', messages);
    return newMessage;
  }

  static async delete(id: number): Promise<boolean> {
    const messages = await this.getAll();
    const filtered = messages.filter(msg => msg.id !== id);
    
    if (filtered.length === messages.length) return false;
    
    await updateCollection('messages', filtered);
    return true;
  }
}
