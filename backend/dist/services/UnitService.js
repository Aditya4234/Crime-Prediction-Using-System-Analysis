"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnitService = void 0;
const models_1 = require("../models");
class UnitService {
    static getAll() {
        const units = models_1.UnitModel.getAll();
        const messages = models_1.MessageModel.getAll();
        return { units, messages, total: units.length };
    }
    static getById(id) {
        return models_1.UnitModel.getById(id);
    }
    static getActive() {
        return models_1.UnitModel.getActive();
    }
    static getByZone(zone) {
        return models_1.UnitModel.getByZone(zone);
    }
    static updateStatus(id, status) {
        return models_1.UnitModel.updateStatus(id, status);
    }
    static sendMessage(from, msg, priority = 'normal') {
        return models_1.MessageModel.create(from, msg, priority);
    }
    static getMessages(limit) {
        return limit ? models_1.MessageModel.getRecent(limit) : models_1.MessageModel.getAll();
    }
}
exports.UnitService = UnitService;
//# sourceMappingURL=UnitService.js.map