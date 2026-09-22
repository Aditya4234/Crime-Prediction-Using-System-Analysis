"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = logger;
exports.validateRequest = validateRequest;
function logger(req, _res, next) {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} ${req.url}`);
    next();
}
function validateRequest(req, res, next) {
    const contentType = req.headers['content-type'];
    if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
        if (!contentType || !contentType.includes('application/json')) {
            const response = {
                success: false,
                error: 'Content-Type must be application/json',
            };
            res.status(400).json(response);
            return;
        }
    }
    next();
}
//# sourceMappingURL=validation.js.map