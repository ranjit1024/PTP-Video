import { PureComponent, useEffect, useRef } from "react"

export default function Receiver(){
    const socketRef = useRef<WebSocket | null>(null)
    useEffect(()=>{
        const socket = new WebSocket("ws://localhost:8080");
        let pc:RTCPeerConnection | null = null;
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
        
            pc = new RTCPeerConnection();
            // sending ice candidate
            pc.onicecandidate = (event) =>{
                if(socketRef.current && socketRef.current.readyState === WebSocket.OPEN){
                    socketRef.current.send(JSON.stringify({
                          type:'iceCandidate',
                          candidate:event.candidate
                    }))
                }
            }
            console.log(message)
            if(message.type === 'createOffer'){
                await pc.setRemoteDescription(message.sdp);
                const answer = await pc.createAnswer();
                await pc.setLocalDescription(answer);
                // sending answer
                if(socketRef.current && socketRef.current.readyState === WebSocket.OPEN){
                    socketRef.current.send(JSON.stringify({type:"createAnswer", sdp:pc.localDescription }))
                }
        }
        /// addig ice candidate
        else if(message.type === "iceCandidate"){
            pc?.addIceCandidate(message.candidate)
        }
    
    }

    },[])
    return <div>
        Receive
    </div>
}