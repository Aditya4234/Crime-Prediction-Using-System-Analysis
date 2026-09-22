"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const services_1 = require("../services");
const middleware_1 = require("../middleware");
const router = (0, express_1.Router)();
router.get('/', (0, middleware_1.asyncHandler)(async (_req, res) => {
    const incidents = services_1.IncidentService.getAll();
    const response = {
        success: true,
        data: incidents,
        message: `Found ${incidents.length} incidents`,
    };
    res.json(response);
}));
router.get('/stats', (0, middleware_1.asyncHandler)(async (_req, res) => {
    const stats = services_1.IncidentService.getStats();
    const response = {
        success: true,
        data: stats,
    };
    res.json(response);
}));
router.get('/:id', (0, middleware_1.asyncHandler)(async (req, res) => {
    const incident = services_1.IncidentService.getById(req.params.id);
    if (!incident) {
        const response = {
            success: false,
            error: 'Incident not found',
        };
        res.status(404).json(response);
        return;
    }
    const response = {
        success: true,
        data: incident,
    };
    res.json(response);
}));
router.post('/', (0, middleware_1.asyncHandler)(async (req, res) => {
    const { type, severity, location, victim, suspect, description } = req.body;
    if (!type || !severity || !location || !victim) {
        const response = {
            success: false,
            error: 'Missing required fields: type, severity, location, victim',
        };
        res.status(400).json(response);
        return;
    }
    const input = {
        type,
        severity,
        location,
        victim,
        suspect,
        description,
    };
    const incident = services_1.IncidentService.create(input);
    const response = {
        success: true,
        data: incident,
        message: 'Incident created successfully',
    };
    res.status(201).json(response);
}));
router.put('/:id', (0, middleware_1.asyncHandler)(async (req, res) => {
    const incident = services_1.IncidentService.update(req.params.id, req.body);
    if (!incident) {
        const response = {
            success: false,
            error: 'Incident not found',
        };
        res.status(404).json(response);
        return;
    }
    const response = {
        success: true,
        data: incident,
        message: 'Incident updated successfully',
    };
    res.json(response);
}));
router.delete('/:id', (0, middleware_1.asyncHandler)(async (req, res) => {
    const deleted = services_1.IncidentService.delete(req.params.id);
    if (!deleted) {
        const response = {
            success: false,
            error: 'Incident not found',
        };
        res.status(404).json(response);
        return;
    }
    const response = {
        success: true,
        message: 'Incident deleted successfully',
    };
    res.json(response);
}));
exports.default = router;
//# sourceMappingURL=incidents.js.map