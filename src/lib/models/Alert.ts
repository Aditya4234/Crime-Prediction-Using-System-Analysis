import { connectToDatabase } from '../mongodb';
import { Alert } from '../types';

const COLLECTION = 'alerts';

export class AlertModel {
  static async getAll(): Promise<Alert[]> {
    const db = await connectToDatabase();
    const alerts = await db.collection(COLLECTION).find({}).sort({ dispatchedAt: -1 }).toArray();
    return alerts.map(({ _id, ...rest }) => rest as Alert);
  }

  static async getById(id: string): Promise<Alert | undefined> {
    const db = await connectToDatabase();
    const alert = await db.collection(COLLECTION).findOne({ id });
    if (!alert) return undefined;
    const { _id, ...rest } = alert;
    return rest as Alert;
  }

  static async getActive(): Promise<Alert[]> {
    const db = await connectToDatabase();
    const alerts = await db.collection(COLLECTION).find({ status: { $ne: 'resolved' } }).toArray();
    return alerts.map(({ _id, ...rest }) => rest as Alert);
  }

  static async getByPriority(priority: Alert['priority']): Promise<Alert[]> {
    const db = await connectToDatabase();
    const alerts = await db.collection(COLLECTION).find({ priority }).toArray();
    return alerts.map(({ _id, ...rest }) => rest as Alert);
  }

  static async create(alertData: Omit<Alert, 'id'>): Promise<Alert> {
    const db = await connectToDatabase();
    const allAlerts = await this.getAll();

    const newAlert: Alert = {
      id: `ALT-${String(allAlerts.length + 1).padStart(3, '0')}`,
      ...alertData,
    };

    await db.collection(COLLECTION).insertOne(newAlert);
    return newAlert;
  }

  static async updateStatus(id: string, status: Alert['status']): Promise<Alert | null> {
    const db = await connectToDatabase();
    const updateData: Partial<Alert> = { status };
    if (status === 'resolved') {
      updateData.resolvedAt = new Date().toISOString();
    }

    const result = await db.collection(COLLECTION).findOneAndUpdate(
      { id },
      { $set: updateData },
      { returnDocument: 'after' }
    );
    if (!result) return null;
    const { _id, ...rest } = result;
    return rest as Alert;
  }
}
