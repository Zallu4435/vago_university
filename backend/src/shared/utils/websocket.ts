import { Server as WebSocketServer } from 'ws';
import { Server as HttpServer } from 'http';
import { verifyToken } from '../utils/jwt';

interface WebSocketEvent {
  event: 'new_message' | 'message_read' | 'message_deleted';
  data: any;
  recipientIds?: string[];
}

export function initializeWebSocket(server: HttpServer) {
  const wss = new WebSocketServer({ server });

  wss.on('connection', (ws: any, req) => {
    const token = req.url?.split('token=')[1] || req.headers.authorization?.split(' ')[1];
    if (!token) {
      ws.close(1008, 'Authentication required');
      return;
    }

    try {
      const user = verifyToken(token);
      ws.userId = user._id;

      ws.on('message', (message: any) => {
        console.log(`Received message from ${user._id}: ${message}`);
      });

      ws.on('close', () => {
        console.log(`WebSocket connection closed for user ${user._id}`);
      });
    } catch (err) {
      ws.close(1008, 'Invalid token');
    }
  });

  return wss;
}

export function emitWebSocketEvent(event: string, data: any, recipientIds: string[]) {
  const wss = (global as any).wss;
  if (!wss) return;

  const eventData: WebSocketEvent = { event, recipientIds, data };

  wss.clients.forEach((client: any) => {
    if (client.readyState === WebSocket.OPEN && 
        (!recipientIds.length || recipientIds.includes(client.userId) || client.userId === data.sender?._id)) {
      client.send(JSON.stringify(eventData));
    }
  });
}