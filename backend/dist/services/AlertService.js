"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlertService = void 0;
const models_1 = require("../models");
class AlertService {
    static getAll() {
        return models_1.AlertModel.getAll();
    }
    static getById(id) {
        return models_1.AlertModel.getById(id);
    }
    static getActive() {
        return models_1.AlertModel.getActive();
    }
    static getByPriority(priority) {
        return models_1.AlertModel.getByPriority(priority);
    }
    static updateStatus(id, status) {
        return models_1.AlertModel.updateStatus(id, status);
    }
}
exports.AlertService = AlertService;
//# sourceMappingURL=AlertService.js.map