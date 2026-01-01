import { WebSocket, WebSocketServer } from "ws";
const server  = new WebSocketServer({port:8080});

const room : Map<string, {user1:WebSocket, user2:WebSocket}> = new Map();

server.on("connection", (ws:WebSocket)=>{
    ws.on('message', (data)=>{
        const msg = JSON.parse(data.toString());
        
    })
    ws.send(JSON.stringify({
        data:"Connected"
    }))
})