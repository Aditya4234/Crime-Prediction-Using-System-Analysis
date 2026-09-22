import { AlertModel } from '../models';

export class AlertService {
  static async getAll() {
    return await AlertModel.getAll();
  }

  static async getById(id: string) {
    return await AlertModel.getById(id);
  }

  static async getActive() {
    return await AlertModel.getActive();
  }

  static async getByPriority(priority: 'critical' | 'high' | 'medium' | 'low') {
    return await AlertModel.getByPriority(priority);
  }

  static async updateStatus(id: string, status: 'responding' | 'contained' | 'resolved') {
    return await AlertModel.updateStatus(id, status);
  }
}
