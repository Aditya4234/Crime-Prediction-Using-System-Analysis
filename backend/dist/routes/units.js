"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const services_1 = require("../services");
const middleware_1 = require("../middleware");
const router = (0, express_1.Router)();
router.get('/', (0, middleware_1.asyncHandler)(async (_req, res) => {
    const data = services_1.UnitService.getAll();
    const response = {
        success: true,
        data,
        message: `Found ${data.total} units`,
    };
    res.json(response);
}));
router.get('/active', (0, middleware_1.asyncHandler)(async (_req, res) => {
    const units = services_1.UnitService.getActive();
    const response = {
        success: true,
        data: units,
    };
    res.json(response);
}));
router.get('/zone/:zone', (0, middleware_1.asyncHandler)(async (req, res) => {
    const units = services_1.UnitService.getByZone(req.params.zone);
    const response = {
        success: true,
        data: units,
    };
    res.json(response);
}));
router.get('/messages', (0, middleware_1.asyncHandler)(async (req, res) => {
    const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
    const messages = services_1.UnitService.getMessages(limit);
    const response = {
        success: true,
        data: messages,
    };
    res.json(response);
}));
router.get('/:id', (0, middleware_1.asyncHandler)(async (req, res) => {
    const unit = services_1.UnitService.getById(req.params.id);
    if (!unit) {
        const response = {
            success: false,
            error: 'Unit not found',
        };
        res.status(404).json(response);
        return;
    }
    const response = {
        success: true,
        data: unit,
    };
    res.json(response);
}));
router.patch('/:id/status', (0, middleware_1.asyncHandler)(async (req, res) => {
    const { status } = req.body;
    if (!status || !['patrol', 'responding', 'standby', 'staging', 'offline'].includes(status)) {
        const response = {
            success: false,
            error: 'Invalid status',
        };
        res.status(400).json(response);
        return;
    }
    const unit = services_1.UnitService.updateStatus(req.params.id, status);
    if (!unit) {
        const response = {
            success: false,
            error: 'Unit not found',
        };
        res.status(404).json(response);
        return;
    }
    const response = {
        success: true,
        data: unit,
        message: 'Unit status updated successfully',
    };
    res.json(response);
}));
router.post('/messages', (0, middleware_1.asyncHandler)(async (req, res) => {
    const { from, msg, priority } = req.body;
    if (!from || !msg) {
        const response = {
            success: false,
            error: 'Missing required fields: from, msg',
        };
        res.status(400).json(response);
        return;
    }
    const message = services_1.UnitService.sendMessage(from, msg, priority);
    const response = {
        success: true,
        data: message,
        message: 'Message sent successfully',
    };
    res.status(201).json(response);
}));
exports.default = router;
//# sourceMappingURL=units.js.map