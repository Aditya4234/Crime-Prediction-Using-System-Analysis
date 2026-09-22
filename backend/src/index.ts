import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import cookieParser from 'cookie-parser';

import { errorHandler, notFoundHandler, logger } from './middleware';
import routes from './routes';
import { initializeDatabase } from './lib/database';

dotenv.config();

const app = express();
const server = createServer(app);
const PORT = process.env.PORT || 5000;

// WebSocket Server
const wss = new WebSocketServer({ server, path: '/ws' });

const clients = new Map<string, WebSocket>();

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
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(message));
        }
      });
    } catch (error) {
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
export function broadcast(message: any) {
  clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  });
}

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(logger);

// Routes
app.use('/api', routes);

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
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
async function startServer() {
  try {
    await initializeDatabase();
    console.log('Database initialized successfully');
    
    server.listen(PORT, () => {
      console.log(`
  ========================================
   CPAS Backend Server Running
  ========================================
   Port: ${PORT}
   Environment: ${process.env.NODE_ENV || 'development'}
   API Base: http://localhost:${PORT}/api
   WebSocket: ws://localhost:${PORT}/ws
   Database: MongoDB Atlas Connected
  ========================================
      `);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

export default app;
export { wss };
