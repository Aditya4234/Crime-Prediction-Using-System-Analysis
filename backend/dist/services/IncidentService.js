"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IncidentService = void 0;
const models_1 = require("../models");
class IncidentService {
    static getAll() {
        return models_1.IncidentModel.getAll();
    }
    static getById(id) {
        return models_1.IncidentModel.getById(id);
    }
    static create(input) {
        return models_1.IncidentModel.create(input);
    }
    static update(id, input) {
        return models_1.IncidentModel.update(id, input);
    }
    static delete(id) {
        return models_1.IncidentModel.delete(id);
    }
    static getStats() {
        const incidents = models_1.IncidentModel.getAll();
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
exports.IncidentService = IncidentService;
//# sourceMappingURL=IncidentService.js.map