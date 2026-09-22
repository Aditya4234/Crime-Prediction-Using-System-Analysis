import { v4 as uuidv4 } from 'uuid';
import { getCollection, updateCollection } from '../lib/database';
import { Incident, CreateIncidentInput, UpdateIncidentInput } from '../types';

export class IncidentModel {
  static async getAll(): Promise<Incident[]> {
    return await getCollection('incidents') as Incident[];
  }

  static async getById(id: string): Promise<Incident | undefined> {
    const incidents = await this.getAll();
    return incidents.find(inc => inc.id === id);
  }

  static async create(input: CreateIncidentInput): Promise<Incident> {
    const incidents = await this.getAll();
    const now = new Date().toISOString();
    
    const newIncident: Incident = {
      id: `CP-${new Date().getFullYear()}-${String(incidents.length + 1).padStart(4, '0')}`,
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

    incidents.push(newIncident);
    await updateCollection('incidents', incidents);
    return newIncident;
  }

  static async update(id: string, input: UpdateIncidentInput): Promise<Incident | null> {
    const incidents = await this.getAll();
    const index = incidents.findIndex(inc => inc.id === id);
    
    if (index === -1) return null;

    const updated: Incident = {
      ...incidents[index],
      ...input,
      updatedAt: new Date().toISOString(),
    };

    incidents[index] = updated;
    await updateCollection('incidents', incidents);
    return updated;
  }

  static async delete(id: string): Promise<boolean> {
    const incidents = await this.getAll();
    const filtered = incidents.filter(inc => inc.id !== id);
    
    if (filtered.length === incidents.length) return false;
    
    await updateCollection('incidents', filtered);
    return true;
  }

  static async getByStatus(status: Incident['status']): Promise<Incident[]> {
    const incidents = await this.getAll();
    return incidents.filter(inc => inc.status === status);
  }

  static async getBySeverity(severity: Incident['severity']): Promise<Incident[]> {
    const incidents = await this.getAll();
    return incidents.filter(inc => inc.severity === severity);
  }
}
