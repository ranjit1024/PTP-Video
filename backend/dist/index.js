"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Node.js WebSocket Server with Room Logic
const ws_1 = require("ws");
const wss = new ws_1.WebSocketServer({ port: 8080 });
const rooms = new Map();
wss.on('connection', (ws) => {
    let currentClient;
    ws.on('message', (message) => {
        const data = JSON.parse(message);
        switch (data.type) {
            case 'join-room':
                currentClient = { ws, roomId: data.roomId, userId: data.userId };
                if (!rooms.has(data.roomId)) {
                    rooms.set(data.roomId, new Set());
                }
                const room = rooms.get(data.roomId);
                // Notify existing room members about new peer
                room.forEach(client => {
                    if (client.userId !== data.userId) {
                        client.ws.send(JSON.stringify({
                            type: 'peer-joined',
                            userId: data.userId
                        }));
                    }
                });
                room.add(currentClient);
                break;
            case 'offer':
            case 'answer':
            case 'ice-candidate':
                // Forward signaling messages to specific peer in the room
                const targetRoom = rooms.get(currentClient.roomId);
                if (targetRoom) {
                    targetRoom.forEach(client => {
                        if (client.userId === data.targetUserId) {
                            client.ws.send(JSON.stringify(Object.assign(Object.assign({}, data), { fromUserId: currentClient.userId })));
                        }
                    });
                }
                break;
        }
    });
    ws.on('close', () => {
        if (currentClient) {
            const room = rooms.get(currentClient.roomId);
            if (room) {
                room.delete(currentClient);
                // Notify others about peer leaving
                room.forEach(client => {
                    client.ws.send(JSON.stringify({
                        type: 'peer-left',
                        userId: currentClient.userId
                    }));
                });
            }
        }
    });
});
