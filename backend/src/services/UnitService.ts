import { UnitModel, MessageModel } from '../models';

export class UnitService {
  static async getAll() {
    const units = await UnitModel.getAll();
    const messages = await MessageModel.getAll();
    return { units, messages, total: units.length };
  }

  static async getById(id: string) {
    return await UnitModel.getById(id);
  }

  static async getActive() {
    return await UnitModel.getActive();
  }

  static async getByZone(zone: string) {
    return await UnitModel.getByZone(zone);
  }

  static async updateStatus(id: string, status: 'patrol' | 'responding' | 'standby' | 'staging' | 'offline') {
    return await UnitModel.updateStatus(id, status);
  }

  static async sendMessage(from: string, msg: string, priority: 'critical' | 'high' | 'normal' = 'normal') {
    return await MessageModel.create(from, msg, priority);
  }

  static async getMessages(limit?: number) {
    return limit ? await MessageModel.getRecent(limit) : await MessageModel.getAll();
  }
}
