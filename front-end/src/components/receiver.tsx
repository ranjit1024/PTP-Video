import { useEffect, useRef } from "react"

export default function Receiver(){
    const socketRef = useRef<WebSocket | null>(null)
    useEffect(()=>{
        const socket = new WebSocket("ws://localhost:8080");
        socketRef.current = socket;
        socketRef.current.onopen = () =>{
            if(socketRef.current && socketRef.current.readyState === WebSocket.OPEN){
                socketRef.current.send(
              JSON.stringify({
                type: "receiver",
              })
            );
            }
        }
        socketRef.current.onmessage = async(event) =>{
        const message = JSON.parse(event.data);

        console.log(message)
        if(message.type === 'createOffer'){
            const pc = new RTCPeerConnection();
            await pc.setRemoteDescription(message.sdp);
            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);
            if(socketRef.current && socketRef.current.readyState === WebSocket.OPEN){
                socketRef.current.send(JSON.stringify({type:"createAnswer", sdp:pc.localDescription }))
            }
        }
    }
    },[])
    return <div>
        Receive
    </div>
}