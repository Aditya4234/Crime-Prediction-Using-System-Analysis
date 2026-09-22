"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const incidents_1 = __importDefault(require("./incidents"));
const alerts_1 = __importDefault(require("./alerts"));
const units_1 = __importDefault(require("./units"));
const stats_1 = __importDefault(require("./stats"));
const auth_1 = __importDefault(require("./auth"));
const router = (0, express_1.Router)();
router.get('/health', (_req, res) => {
    res.json({
        success: true,
        message: 'CPAS Backend is running',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
    });
});
router.use('/auth', auth_1.default);
router.use('/incidents', incidents_1.default);
router.use('/alerts', alerts_1.default);
router.use('/units', units_1.default);
router.use('/stats', stats_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map