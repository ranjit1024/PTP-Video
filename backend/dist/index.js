"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
// creating wesocket server
const wss = new ws_1.WebSocketServer({ port: 8080 });
let sender = null;
let receiver = null;
wss.on('connection', (ws) => {
    ws.on('open', (data) => {
        console.log(data);
    });
    ws.on('message', (data) => {
        const message = JSON.parse(data);
        console.log(message);
        // adding for sender
        switch (message.type) {
            case "sender":
                console.log("sender");
                sender = ws;
                break;
            case "receiver":
                console.log("receiver");
                receiver = ws;
                break;
            case "createOffer":
                if (ws === receiver) {
                    return;
                }
                console.log(message);
                receiver === null || receiver === void 0 ? void 0 : receiver.send(JSON.stringify({ type: "createOffer", sdp: message.sdp }));
            case "createAnswer":
                if (ws === sender) {
                    return;
                }
                sender === null || sender === void 0 ? void 0 : sender.send(JSON.stringify({ type: "createAnswer", sdp: message.sdp }));
        }
    });
    ws.send(JSON.stringify({
        status: 'Connected'
    }));
});
