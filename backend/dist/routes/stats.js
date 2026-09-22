"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const services_1 = require("../services");
const router = (0, express_1.Router)();
router.get('/', (_req, res) => {
    const stats = services_1.IncidentService.getStats();
    const response = {
        success: true,
        data: stats,
    };
    res.json(response);
});
exports.default = router;
//# sourceMappingURL=stats.js.map