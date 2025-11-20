import { useEffect, useRef } from "react";
export default function Sender() {
  const socketRef = useRef<WebSocket | null>(null);
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
      console.log(message)
    }
  }, []);
  async function sendVideo() {
    
    const pc = new RTCPeerConnection();
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
  
    //sending create offer
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
        socketRef.current?.send(JSON.stringify({
            type:"createOffer",
            sdp:pc.localDescription
        }))
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
