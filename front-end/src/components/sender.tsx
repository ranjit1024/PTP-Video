import { useEffect, useRef } from "react";
export default function Sender() {
  const socketRef = useRef<WebSocket | null>(null);
  let pc = new RTCPeerConnection();
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
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
    socketRef.current.onmessage = (event: any) => {
      const message = JSON.parse(event.data);
      console.log(message);
      if (message.type === "iceCandidate") {
        pc.addIceCandidate(message.candidate);
      } else if (message.type === "createAnswer") {
        pc.setRemoteDescription(message.sdp);
      }
    };
    // receiving ice Candidate
  }, []);
  async function sendVideo() {
   
    pc.onnegotiationneeded = async () => {
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      if (
        socketRef.current &&
        socketRef.current.readyState === WebSocket.OPEN
      ) {
        socketRef.current?.send(
          JSON.stringify({
            type: "createOffer",
            sdp: pc.localDescription,
          })
        );
      }
    };
    //sending create offer
    // sending ice candidate
    pc.onicecandidate = (event) => {
      if (
        socketRef.current &&
        socketRef.current.readyState === WebSocket.OPEN
      ) {
        socketRef.current.send(
          JSON.stringify({
            type: "iceCandidate",
            candidate: event.candidate,
          })
        );
      }
    };

     const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = stream;
    }
    console.log(stream);
  

    // Add all tracks to the peer connection

    stream.getTracks().forEach((track) => {
      pc.addTrack(track, stream);
    });
  }
  return (
    <div>
      <video
        autoPlay
        playsInline
        muted
        className="local-video"
        ref={localVideoRef}
      ></video>
      <button onClick={sendVideo}>Send Video</button>
    </div>
  );
}
