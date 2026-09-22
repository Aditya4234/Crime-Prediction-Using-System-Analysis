import { getCollection, updateCollection } from '../lib/database';
import { Alert } from '../types';

export class AlertModel {
  static async getAll(): Promise<Alert[]> {
    return await getCollection('alerts') as Alert[];
  }

  static async getById(id: string): Promise<Alert | undefined> {
    const alerts = await this.getAll();
    return alerts.find(alert => alert.id === id);
  }

  static async getActive(): Promise<Alert[]> {
    const alerts = await this.getAll();
    return alerts.filter(alert => alert.status !== 'resolved');
  }

  static async getByPriority(priority: Alert['priority']): Promise<Alert[]> {
    const alerts = await this.getAll();
    return alerts.filter(alert => alert.priority === priority);
  }

  static async updateStatus(id: string, status: Alert['status']): Promise<Alert | null> {
    const alerts = await this.getAll();
    const index = alerts.findIndex(alert => alert.id === id);
    
    if (index === -1) return null;

    alerts[index] = {
      ...alerts[index],
      status,
      resolvedAt: status === 'resolved' ? new Date().toISOString() : alerts[index].resolvedAt,
    };

    await updateCollection('alerts', alerts);
    return alerts[index];
  }
}
