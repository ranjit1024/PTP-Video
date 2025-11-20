import {WebSocketServer,WebSocket} from "ws";
// creating wesocket server
const wss = new WebSocketServer({port:8080});
let  sender : WebSocket | null = null;
let  receiver : WebSocket | null = null;
wss.on('connection', (ws:WebSocket)=>{
    ws.on('open', (data:any)=>{
        console.log(data)
    })
    ws.on('message', (data:any)=>{
        const message = JSON.parse(data);
        console.log(message)

        // adding for sender
        switch(message.type){
            case "sender":
                console.log("sender")
                sender = ws;
                break;
            case "receiver":
                console.log("receiver");
                receiver = ws;
                break;
            case "createOffer":
                if(ws === receiver){
                    return;
                }
                console.log(message)
                receiver?.send(JSON.stringify({type:"createOffer", sdp:message.sdp}))
            case "createAnswer":
                "createAnswer"
                if(ws === sender){
                    return;
                }
               sender?.send(JSON.stringify({type:"createAnswer", sdp:message.sdp}))

        }

    });
    ws.send(JSON.stringify({
        status:'Connected'
    }))
}) 