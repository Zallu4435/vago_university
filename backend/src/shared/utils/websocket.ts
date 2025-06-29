import { Server as WebSocketServer, WebSocket } from 'ws';
import { Server as HttpServer } from 'http';
import { verifyToken } from '../utils/jwt';

interface WebSocketEvent {
  event: 'new_message' | 'message_read' | 'message_deleted';
  data: any;
  recipientIds?: string[];
}

interface DecodedToken {
  _id: string;
  collection: string;
  firstName: string;
  lastName: string;
  email: string;
}

declare global {
  var wss: WebSocketServer;
}

export function initializeWebSocket(server: HttpServer) {
  const wss = new WebSocketServer({ server });

  wss.on('connection', (ws: WebSocket, req: any) => {
    const token = req.url?.split('token=')[1] || req.headers.authorization?.split(' ')[1];
    if (!token) {
      ws.close(1008, 'Authentication required');
      return;
    }

    try {
      const user = verifyToken(token) as DecodedToken;
      (ws as any).userId = user._id;

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

  global.wss = wss;
  return wss;
}

export function emitWebSocketEvent(event: 'new_message' | 'message_read' | 'message_deleted', data: any, recipientIds: string[]) {
  const wss = global.wss;
  if (!wss) return;

  const eventData: WebSocketEvent = { event, recipientIds, data };

  wss.clients.forEach((client: WebSocket) => {
    if (client.readyState === WebSocket.OPEN && 
        (!recipientIds.length || recipientIds.includes((client as any).userId) || (client as any).userId === data.sender?._id)) {
      client.send(JSON.stringify(eventData));
    }
  });
}