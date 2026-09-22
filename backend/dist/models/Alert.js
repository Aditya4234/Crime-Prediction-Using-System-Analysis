"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlertModel = void 0;
const database_1 = require("../lib/database");
class AlertModel {
    static getAll() {
        return (0, database_1.getCollection)('alerts');
    }
    static getById(id) {
        const alerts = this.getAll();
        return alerts.find(alert => alert.id === id);
    }
    static getActive() {
        return this.getAll().filter(alert => alert.status !== 'resolved');
    }
    static getByPriority(priority) {
        return this.getAll().filter(alert => alert.priority === priority);
    }
    static updateStatus(id, status) {
        const alerts = this.getAll();
        const index = alerts.findIndex(alert => alert.id === id);
        if (index === -1)
            return null;
        alerts[index] = {
            ...alerts[index],
            status,
            resolvedAt: status === 'resolved' ? new Date().toISOString() : alerts[index].resolvedAt,
        };
        (0, database_1.updateCollection)('alerts', alerts);
        return alerts[index];
    }
}
exports.AlertModel = AlertModel;
//# sourceMappingURL=Alert.js.map