import { getCollection, updateCollection } from '../lib/database';
import { Unit } from '../types';

export class UnitModel {
  static async getAll(): Promise<Unit[]> {
    return await getCollection('units') as Unit[];
  }

  static async getById(id: string): Promise<Unit | undefined> {
    const units = await this.getAll();
    return units.find(unit => unit.id === id);
  }

  static async getActive(): Promise<Unit[]> {
    const units = await this.getAll();
    return units.filter(unit => unit.status !== 'offline');
  }

  static async getByZone(zone: string): Promise<Unit[]> {
    const units = await this.getAll();
    return units.filter(unit => unit.zone === zone);
  }

  static async updateStatus(id: string, status: Unit['status']): Promise<Unit | null> {
    const units = await this.getAll();
    const index = units.findIndex(unit => unit.id === id);
    
    if (index === -1) return null;

    units[index] = {
      ...units[index],
      status,
      lastSeen: new Date().toISOString(),
    };

    await updateCollection('units', units);
    return units[index];
  }

  static async updateBattery(id: string, battery: number): Promise<Unit | null> {
    const units = await this.getAll();
    const index = units.findIndex(unit => unit.id === id);
    
    if (index === -1) return null;

    units[index] = {
      ...units[index],
      battery,
      lastSeen: new Date().toISOString(),
    };

    await updateCollection('units', units);
    return units[index];
  }
}
