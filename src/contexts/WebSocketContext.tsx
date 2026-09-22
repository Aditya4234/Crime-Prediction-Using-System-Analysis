'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useAuth } from './AuthContext';

interface WebSocketContextType {
  connected: boolean;
  lastMessage: any;
  send: (message: any) => void;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

export function WebSocketProvider({ children }: { children: ReactNode }) {
  const [connected, setConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState(null);
  const [ws, setWs] = useState<WebSocket | null>(null);
  const { token } = useAuth();

  useEffect(() => {
    if (!token) return;

    const wsUrl = process.env.NEXT_PUBLIC_WS_URL;
    if (!wsUrl) {
      console.log('[WS] No WebSocket URL configured, running without real-time updates');
      return;
    }

    const connect = () => {
      try {
        const socket = new WebSocket(wsUrl);

        socket.onopen = () => {
          console.log('[WS] Connected');
          setConnected(true);
        };

        socket.onmessage = (event) => {
          try {
            const message = JSON.parse(event.data);
            setLastMessage(message);
          } catch (error) {
            console.error('[WS] Parse error:', error);
          }
        };

        socket.onclose = () => {
          console.log('[WS] Disconnected');
          setConnected(false);
          setTimeout(connect, 5000);
        };

        socket.onerror = (error) => {
          console.error('[WS] Error:', error);
          socket.close();
        };

        setWs(socket);
      } catch (error) {
        console.error('[WS] Connection failed:', error);
      }
    };

    connect();

    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, [token]);

  const send = useCallback((message: any) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(message));
    }
  }, [ws]);

  return (
    <WebSocketContext.Provider value={{ connected, lastMessage, send }}>
      {children}
    </WebSocketContext.Provider>
  );
}

export function useWebSocket() {
  const context = useContext(WebSocketContext);
  if (context === undefined) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
}
