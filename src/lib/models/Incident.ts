import { connectToDatabase } from '../mongodb';
import { Incident, CreateIncidentInput, UpdateIncidentInput } from '../types';

const COLLECTION = 'incidents';

export class IncidentModel {
  static async getAll(): Promise<Incident[]> {
    const db = await connectToDatabase();
    const incidents = await db.collection(COLLECTION).find({}).sort({ createdAt: -1 }).toArray();
    return incidents.map(({ _id, ...rest }) => rest as Incident);
  }

  static async getById(id: string): Promise<Incident | undefined> {
    const db = await connectToDatabase();
    const incident = await db.collection(COLLECTION).findOne({ id });
    if (!incident) return undefined;
    const { _id, ...rest } = incident;
    return rest as Incident;
  }

  static async create(input: CreateIncidentInput): Promise<Incident> {
    const db = await connectToDatabase();
    const allIncidents = await this.getAll();
    const now = new Date().toISOString();

    const newIncident: Incident = {
      id: `CP-${new Date().getFullYear()}-${String(allIncidents.length + 1).padStart(4, '0')}`,
      type: input.type,
      status: 'active',
      severity: input.severity,
      date: new Date().toISOString().split('T')[0],
      location: input.location,
      victim: input.victim,
      suspect: input.suspect || 'Unknown',
      officer: 'Unassigned',
      evidence: 0,
      witnesses: 0,
      description: input.description,
      createdAt: now,
      updatedAt: now,
    };

    await db.collection(COLLECTION).insertOne(newIncident);
    return newIncident;
  }

  static async update(id: string, input: UpdateIncidentInput): Promise<Incident | null> {
    const db = await connectToDatabase();
    const result = await db.collection(COLLECTION).findOneAndUpdate(
      { id },
      { $set: { ...input, updatedAt: new Date().toISOString() } },
      { returnDocument: 'after' }
    );
    if (!result) return null;
    const { _id, ...rest } = result;
    return rest as Incident;
  }

  static async delete(id: string): Promise<boolean> {
    const db = await connectToDatabase();
    const result = await db.collection(COLLECTION).deleteOne({ id });
    return result.deletedCount > 0;
  }

  static async getByStatus(status: Incident['status']): Promise<Incident[]> {
    const db = await connectToDatabase();
    const incidents = await db.collection(COLLECTION).find({ status }).toArray();
    return incidents.map(({ _id, ...rest }) => rest as Incident);
  }

  static async getBySeverity(severity: Incident['severity']): Promise<Incident[]> {
    const db = await connectToDatabase();
    const incidents = await db.collection(COLLECTION).find({ severity }).toArray();
    return incidents.map(({ _id, ...rest }) => rest as Incident);
  }
}
