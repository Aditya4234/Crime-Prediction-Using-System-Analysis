"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.wss = void 0;
exports.broadcast = broadcast;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
const http_1 = require("http");
const ws_1 = require("ws");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const middleware_1 = require("./middleware");
const routes_1 = __importDefault(require("./routes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const server = (0, http_1.createServer)(app);
const PORT = process.env.PORT || 5000;
// WebSocket Server
const wss = new ws_1.WebSocketServer({ server, path: '/ws' });
exports.wss = wss;
const clients = new Map();
wss.on('connection', (ws) => {
    const clientId = Math.random().toString(36).substring(7);
    clients.set(clientId, ws);
    console.log(`[WS] Client connected: ${clientId}`);
    ws.on('message', (data) => {
        try {
            const message = JSON.parse(data.toString());
            console.log(`[WS] Received:`, message);
            // Broadcast to all clients
            clients.forEach((client) => {
                if (client.readyState === ws_1.WebSocket.OPEN) {
                    client.send(JSON.stringify(message));
                }
            });
        }
        catch (error) {
            console.error('[WS] Parse error:', error);
        }
    });
    ws.on('close', () => {
        clients.delete(clientId);
        console.log(`[WS] Client disconnected: ${clientId}`);
    });
    ws.on('error', (error) => {
        console.error(`[WS] Error for ${clientId}:`, error);
        clients.delete(clientId);
    });
    // Send welcome message
    ws.send(JSON.stringify({
        type: 'connected',
        clientId,
        timestamp: new Date().toISOString(),
    }));
});
// Broadcast function for use in routes
function broadcast(message) {
    clients.forEach((client) => {
        if (client.readyState === ws_1.WebSocket.OPEN) {
            client.send(JSON.stringify(message));
        }
    });
}
// Middleware
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
}));
app.use((0, morgan_1.default)('dev'));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
app.use(middleware_1.logger);
// Routes
app.use('/api', routes_1.default);
// Root route
app.get('/', (_req, res) => {
    res.json({
        success: true,
        message: 'CPAS Command Center API',
        version: '1.0.0',
        endpoints: {
            health: '/api/health',
            auth: '/api/auth',
            incidents: '/api/incidents',
            alerts: '/api/alerts',
            units: '/api/units',
            stats: '/api/stats',
            websocket: 'ws://localhost:' + PORT + '/ws',
        },
    });
});
// Error handling
app.use(middleware_1.notFoundHandler);
app.use(middleware_1.errorHandler);
// Start server
server.listen(PORT, () => {
    console.log(`
  ========================================
   CPAS Backend Server Running
  ========================================
   Port: ${PORT}
   Environment: ${process.env.NODE_ENV || 'development'}
   API Base: http://localhost:${PORT}/api
   WebSocket: ws://localhost:${PORT}/ws
  ========================================
  `);
});
exports.default = app;
//# sourceMappingURL=index.js.map