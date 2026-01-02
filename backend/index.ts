import { main, resolveSync } from "bun";
import { WebSocket, WebSocketServer } from "ws";
import { answer, ice, join, offer } from "./etc/types";
const server = new WebSocketServer({ port: 8080 });

const users: { user1: WebSocket | null, user2: WebSocket | null } = {
    user1: null,
    user2: null
};

server.on("connection", (ws: WebSocket) => {
    ws.on('message', (data) => {
        const msg = JSON.parse(data.toString());
        switch (msg.type) {
            case join:
                console.log('JOin')
                if (users.user1 === null) {
                    users.user1 = ws;
                    ws.send(JSON.stringify({user:"user1"}))
                }
                else {
                    users.user2 = ws;
                    ws.send(JSON.stringify({user:"user2"}))
                }
                break;
            case offer:
                console.log("offer init")
                if (users.user1 === ws) {
                    users.user2?.send(JSON.stringify({
                        type: offer,
                        sdp: msg.sdp
                    }))
                }
                else {
                    users.user1?.send(JSON.stringify({
                        type: offer,
                        sdp: msg.sdp
                    }))
                }
                break;
            case answer:
                console.log("Anser Init")
                if (users.user1 === ws) {
                    users.user2?.send(JSON.stringify({
                        type: answer,
                        sdp: msg.sdp
                    }))
                }
                else {
                    users.user1?.send(JSON.stringify({
                        type: answer,
                        sdp: msg.sdp
                    }))
                }
                break;
            case ice:
                if (users.user1 === ws) {
                    users.user2?.send(JSON.stringify({
                        type: ice,
                        candidate: msg.candidate
                    }))
                }
                else {
                    users.user1?.send(JSON.stringify({
                        type: answer,
                        candidate: msg.candidate
                    }))
                }
                break;
        }

    })
    ws.on("close",()=>{
        if(users.user1 && users.user2){
            users.user1 = null;
            users.user2 = null
        }
    })
    ws.send(JSON.stringify({
        type:"connected"
    }))
})