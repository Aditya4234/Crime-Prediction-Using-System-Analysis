"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IncidentModel = void 0;
const database_1 = require("../lib/database");
class IncidentModel {
    static getAll() {
        return (0, database_1.getCollection)('incidents');
    }
    static getById(id) {
        const incidents = this.getAll();
        return incidents.find(inc => inc.id === id);
    }
    static create(input) {
        const incidents = this.getAll();
        const now = new Date().toISOString();
        const newIncident = {
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
        (0, database_1.updateCollection)('incidents', incidents);
        return newIncident;
    }
    static update(id, input) {
        const incidents = this.getAll();
        const index = incidents.findIndex(inc => inc.id === id);
        if (index === -1)
            return null;
        const updated = {
            ...incidents[index],
            ...input,
            updatedAt: new Date().toISOString(),
        };
        incidents[index] = updated;
        (0, database_1.updateCollection)('incidents', incidents);
        return updated;
    }
    static delete(id) {
        const incidents = this.getAll();
        const filtered = incidents.filter(inc => inc.id !== id);
        if (filtered.length === incidents.length)
            return false;
        (0, database_1.updateCollection)('incidents', filtered);
        return true;
    }
    static getByStatus(status) {
        return this.getAll().filter(inc => inc.status === status);
    }
    static getBySeverity(severity) {
        return this.getAll().filter(inc => inc.severity === severity);
    }
}
exports.IncidentModel = IncidentModel;
//# sourceMappingURL=Incident.js.map