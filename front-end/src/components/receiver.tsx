import { PureComponent, useEffect, useRef } from "react"

export default function Receiver(){
    const socketRef = useRef<WebSocket | null>(null);
     const remoteVideoRef = useRef<HTMLVideoElement>(null);
    useEffect(()=>{
        const socket = new WebSocket("ws://localhost:8080");
        let pc:RTCPeerConnection | null = new RTCPeerConnection();
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
    pc.ontrack = (event) =>{
        if(remoteVideoRef.current && event.streams[0]){
            remoteVideoRef.current.srcObject = event.streams[0];
            console.log(event.streams)
        }
        console.log(event.streams[0]);
    }
    },[])
    return <div>
        Receive
        <video style={{
            border:'1px solid white'
        }}   ref={remoteVideoRef}
            autoPlay
            playsInline
            muted
            className="local-video"></video>
    </div>
}