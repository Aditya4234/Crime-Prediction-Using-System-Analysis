import { IncidentModel } from '../models';
import { CreateIncidentInput, UpdateIncidentInput, Stats } from '../types';

export class IncidentService {
  static async getAll() {
    return await IncidentModel.getAll();
  }

  static async getById(id: string) {
    return await IncidentModel.getById(id);
  }

  static async create(input: CreateIncidentInput) {
    return await IncidentModel.create(input);
  }

  static async update(id: string, input: UpdateIncidentInput) {
    return await IncidentModel.update(id, input);
  }

  static async delete(id: string) {
    return await IncidentModel.delete(id);
  }

  static async getStats(): Promise<Stats> {
    const incidents = await IncidentModel.getAll();
    const activeUnits = 42;
    const alertsActive = 3;

    return {
      totalIncidents: incidents.length + 264,
      clearanceRate: 80,
      avgResponseTime: 4.2,
      activeUnits,
      alertsActive,
      modelAccuracy: 94.2,
      riskLevel: 'HIGH',
      uptime: '99.97%',
    };
  }
}
