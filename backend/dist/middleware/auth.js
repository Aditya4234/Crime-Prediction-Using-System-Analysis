"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = authenticate;
exports.authorize = authorize;
const services_1 = require("../services");
function authenticate(req, res, next) {
    const token = req.cookies?.token || req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
        const response = {
            success: false,
            error: 'Authentication required',
        };
        res.status(401).json(response);
        return;
    }
    const payload = services_1.AuthService.verifyToken(token);
    if (!payload) {
        const response = {
            success: false,
            error: 'Invalid or expired token',
        };
        res.status(401).json(response);
        return;
    }
    req.user = payload;
    next();
}
function authorize(...roles) {
    return (req, res, next) => {
        if (!req.user) {
            const response = {
                success: false,
                error: 'Authentication required',
            };
            res.status(401).json(response);
            return;
        }
        if (!roles.includes(req.user.role)) {
            const response = {
                success: false,
                error: 'Insufficient permissions',
            };
            res.status(403).json(response);
            return;
        }
        next();
    };
}
//# sourceMappingURL=auth.js.map