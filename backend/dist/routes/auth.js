"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const services_1 = require("../services");
const middleware_1 = require("../middleware");
const router = (0, express_1.Router)();
router.post('/login', (0, middleware_1.asyncHandler)(async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        const response = {
            success: false,
            error: 'Username and password are required',
        };
        res.status(400).json(response);
        return;
    }
    const result = services_1.AuthService.login({ username, password });
    if (!result) {
        const response = {
            success: false,
            error: 'Invalid username or password',
        };
        res.status(401).json(response);
        return;
    }
    res.cookie('token', result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 * 1000,
    });
    const response = {
        success: true,
        data: result,
        message: 'Login successful',
    };
    res.json(response);
}));
router.post('/register', (0, middleware_1.asyncHandler)(async (req, res) => {
    const { username, email, password, fullName, badge, role } = req.body;
    if (!username || !email || !password || !fullName || !badge) {
        const response = {
            success: false,
            error: 'All fields are required',
        };
        res.status(400).json(response);
        return;
    }
    const result = services_1.AuthService.register({ username, email, password, fullName, badge, role });
    if (!result) {
        const response = {
            success: false,
            error: 'Username or email already exists',
        };
        res.status(409).json(response);
        return;
    }
    res.cookie('token', result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 * 1000,
    });
    const response = {
        success: true,
        data: result,
        message: 'Registration successful',
    };
    res.status(201).json(response);
}));
router.get('/me', (0, middleware_1.asyncHandler)(async (req, res) => {
    const token = req.cookies?.token || req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
        const response = {
            success: false,
            error: 'Not authenticated',
        };
        res.status(401).json(response);
        return;
    }
    const user = services_1.AuthService.getUserFromToken(token);
    if (!user) {
        const response = {
            success: false,
            error: 'Invalid token',
        };
        res.status(401).json(response);
        return;
    }
    const response = {
        success: true,
        data: user,
    };
    res.json(response);
}));
router.post('/logout', (_req, res) => {
    res.clearCookie('token');
    const response = {
        success: true,
        message: 'Logged out successfully',
    };
    res.json(response);
});
exports.default = router;
//# sourceMappingURL=auth.js.map