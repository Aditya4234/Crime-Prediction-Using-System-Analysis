import { connectToDatabase } from '../mongodb';
import { Unit } from '../types';

const COLLECTION = 'units';

export class UnitModel {
  static async getAll(): Promise<Unit[]> {
    const db = await connectToDatabase();
    const units = await db.collection(COLLECTION).find({}).toArray();
    return units.map(({ _id, ...rest }) => rest as Unit);
  }

  static async getById(id: string): Promise<Unit | undefined> {
    const db = await connectToDatabase();
    const unit = await db.collection(COLLECTION).findOne({ id });
    if (!unit) return undefined;
    const { _id, ...rest } = unit;
    return rest as Unit;
  }

  static async getActive(): Promise<Unit[]> {
    const db = await connectToDatabase();
    const units = await db.collection(COLLECTION).find({ status: { $ne: 'offline' } }).toArray();
    return units.map(({ _id, ...rest }) => rest as Unit);
  }

  static async getByZone(zone: string): Promise<Unit[]> {
    const db = await connectToDatabase();
    const units = await db.collection(COLLECTION).find({ zone }).toArray();
    return units.map(({ _id, ...rest }) => rest as Unit);
  }

  static async updateStatus(id: string, status: Unit['status']): Promise<Unit | null> {
    const db = await connectToDatabase();
    const result = await db.collection(COLLECTION).findOneAndUpdate(
      { id },
      { $set: { status, lastSeen: new Date().toISOString() } },
      { returnDocument: 'after' }
    );
    if (!result) return null;
    const { _id, ...rest } = result;
    return rest as Unit;
  }

  static async updateBattery(id: string, battery: number): Promise<Unit | null> {
    const db = await connectToDatabase();
    const result = await db.collection(COLLECTION).findOneAndUpdate(
      { id },
      { $set: { battery, lastSeen: new Date().toISOString() } },
      { returnDocument: 'after' }
    );
    if (!result) return null;
    const { _id, ...rest } = result;
    return rest as Unit;
  }
}
