import { useEffect, useRef } from "react";
export default function Sender() {
  const socketRef = useRef<WebSocket | null>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);
  let pc = new RTCPeerConnection()
  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8080");
    socketRef.current = socket;
    
    socketRef.current.onopen = () => {
      if (
        socketRef.current &&
        socketRef.current.readyState === WebSocket.OPEN
      ) {
        socketRef.current.send(
          JSON.stringify({
            type: "sender",
          })
        );
      }
    };
    socketRef.current.onmessage = (event:any) =>{
      const message = JSON.parse(event.data);
      console.log(message);
      if(message.type === 'iceCandidate'){
       pc.addIceCandidate(message.candidate) 
      }
      else if(message.type === 'createAnswer'){
        pc.setRemoteDescription(message.sdp)
      }
    }
    // receiving ice Candidate
    
  }, []);
  async function sendVideo() {
    
    pc = new RTCPeerConnection();
    pc.onnegotiationneeded = async() =>{
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
          socketRef.current?.send(JSON.stringify({
              type:"createOffer",
              sdp:pc.localDescription
          }))
      }
    }
    //sending create offer
    // sending ice candidate
    pc.onicecandidate =  (event) =>{
      if(socketRef.current && socketRef.current.readyState === WebSocket.OPEN){
        socketRef.current.send(JSON.stringify({
          type:'iceCandidate',
          candidate:event.candidate
        }))
      }
    }
  }
  return (
    <div>
      <button
        onClick={
          sendVideo
        }
      >
        Send Video
      </button>
    </div>
  );
}


