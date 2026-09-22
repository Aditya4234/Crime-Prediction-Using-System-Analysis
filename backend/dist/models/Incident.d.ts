import { Incident, CreateIncidentInput, UpdateIncidentInput } from '../types';
export declare class IncidentModel {
    static getAll(): Incident[];
    static getById(id: string): Incident | undefined;
    static create(input: CreateIncidentInput): Incident;
    static update(id: string, input: UpdateIncidentInput): Incident | null;
    static delete(id: string): boolean;
    static getByStatus(status: Incident['status']): Incident[];
    static getBySeverity(severity: Incident['severity']): Incident[];
}
//# sourceMappingURL=Incident.d.ts.map