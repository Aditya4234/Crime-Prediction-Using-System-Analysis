"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const services_1 = require("../services");
const middleware_1 = require("../middleware");
const database_1 = require("../lib/database");
const router = (0, express_1.Router)();
router.get('/', (0, middleware_1.asyncHandler)(async (_req, res) => {
    const alerts = services_1.AlertService.getAll();
    const response = {
        success: true,
        data: alerts,
        message: `Found ${alerts.length} alerts`,
    };
    res.json(response);
}));
router.post('/', (0, middleware_1.asyncHandler)(async (req, res) => {
    const { code, type, location, priority } = req.body;
    if (!type || !location) {
        const response = {
            success: false,
            error: 'Type and location are required',
        };
        res.status(400).json(response);
        return;
    }
    const alerts = (0, database_1.getCollection)('alerts');
    const newAlert = {
        id: `ALT-${String(alerts.length + 1).padStart(3, '0')}`,
        code: code || 'CODE-1',
        type,
        location,
        priority: priority || 'medium',
        status: 'responding',
        units: [],
        time: 'Just now',
        dispatchedAt: new Date().toISOString(),
    };
    alerts.push(newAlert);
    (0, database_1.updateCollection)('alerts', alerts);
    const response = {
        success: true,
        data: newAlert,
        message: 'Alert created successfully',
    };
    res.status(201).json(response);
}));
router.get('/active', (0, middleware_1.asyncHandler)(async (_req, res) => {
    const alerts = services_1.AlertService.getActive();
    const response = {
        success: true,
        data: alerts,
        message: `Found ${alerts.length} active alerts`,
    };
    res.json(response);
}));
router.get('/priority/:priority', (0, middleware_1.asyncHandler)(async (req, res) => {
    const { priority } = req.params;
    if (!['critical', 'high', 'medium', 'low'].includes(priority)) {
        const response = {
            success: false,
            error: 'Invalid priority level',
        };
        res.status(400).json(response);
        return;
    }
    const alerts = services_1.AlertService.getByPriority(priority);
    const response = {
        success: true,
        data: alerts,
    };
    res.json(response);
}));
router.get('/:id', (0, middleware_1.asyncHandler)(async (req, res) => {
    const alert = services_1.AlertService.getById(req.params.id);
    if (!alert) {
        const response = {
            success: false,
            error: 'Alert not found',
        };
        res.status(404).json(response);
        return;
    }
    const response = {
        success: true,
        data: alert,
    };
    res.json(response);
}));
router.patch('/:id/status', (0, middleware_1.asyncHandler)(async (req, res) => {
    const { status } = req.body;
    if (!status || !['responding', 'contained', 'resolved'].includes(status)) {
        const response = {
            success: false,
            error: 'Invalid status. Must be: responding, contained, or resolved',
        };
        res.status(400).json(response);
        return;
    }
    const alert = services_1.AlertService.updateStatus(req.params.id, status);
    if (!alert) {
        const response = {
            success: false,
            error: 'Alert not found',
        };
        res.status(404).json(response);
        return;
    }
    const response = {
        success: true,
        data: alert,
        message: 'Alert status updated successfully',
    };
    res.json(response);
}));
exports.default = router;
//# sourceMappingURL=alerts.js.map