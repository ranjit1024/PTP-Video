// server.ts
import { WebSocketServer, WebSocket } from 'ws';
import https from 'https';

interface SignalMessage {
  type: 'offer' | 'answer' | 'ice-candidate' | 'join' | 'leave';
  target?: string;
  source: string;
  data?: any;
}

interface ClientWebSocket extends WebSocket {
  userId: string;
}

const clients = new Map<string, ClientWebSocket>();

const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', (ws: ClientWebSocket, req) => {
  const userId = new URL(req.url!, 'ws://localhost').searchParams.get('userId');
  
  if (!userId) {
    ws.close();
    return;
  }

  ws.userId = userId;
  clients.set(userId, ws);

  ws.on('message', (data: string) => {
    const message: SignalMessage = JSON.parse(data.toString());
    
    // Route message to target peer
    if (message.target && clients.has(message.target)) {
      const targetClient = clients.get(message.target)!;
      targetClient.send(JSON.stringify(message));
    }
  });

  ws.on('close', () => {
    clients.delete(userId);
  });
});
