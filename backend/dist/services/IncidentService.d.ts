import { CreateIncidentInput, UpdateIncidentInput, Stats } from '../types';
export declare class IncidentService {
    static getAll(): import("../types").Incident[];
    static getById(id: string): import("../types").Incident | undefined;
    static create(input: CreateIncidentInput): import("../types").Incident;
    static update(id: string, input: UpdateIncidentInput): import("../types").Incident | null;
    static delete(id: string): boolean;
    static getStats(): Stats;
}
//# sourceMappingURL=IncidentService.d.ts.map