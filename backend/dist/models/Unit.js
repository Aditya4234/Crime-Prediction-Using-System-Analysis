"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnitModel = void 0;
const database_1 = require("../lib/database");
class UnitModel {
    static getAll() {
        return (0, database_1.getCollection)('units');
    }
    static getById(id) {
        const units = this.getAll();
        return units.find(unit => unit.id === id);
    }
    static getActive() {
        return this.getAll().filter(unit => unit.status !== 'offline');
    }
    static getByZone(zone) {
        return this.getAll().filter(unit => unit.zone === zone);
    }
    static updateStatus(id, status) {
        const units = this.getAll();
        const index = units.findIndex(unit => unit.id === id);
        if (index === -1)
            return null;
        units[index] = {
            ...units[index],
            status,
            lastSeen: new Date().toISOString(),
        };
        (0, database_1.updateCollection)('units', units);
        return units[index];
    }
    static updateBattery(id, battery) {
        const units = this.getAll();
        const index = units.findIndex(unit => unit.id === id);
        if (index === -1)
            return null;
        units[index] = {
            ...units[index],
            battery,
            lastSeen: new Date().toISOString(),
        };
        (0, database_1.updateCollection)('units', units);
        return units[index];
    }
}
exports.UnitModel = UnitModel;
//# sourceMappingURL=Unit.js.map