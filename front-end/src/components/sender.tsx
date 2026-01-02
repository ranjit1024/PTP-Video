import { answer, join, offer } from "@/types/types";
import { useEffect, useRef, type RefObject } from "react";


export function Sender() {
  const socket = useRef<WebSocket | null>(null);
  const localVideo = useRef<HTMLVideoElement>(null)
  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");
    ws.onopen = () => {
      socket.current = ws;
      ws.send(JSON.stringify({
        type: join
      }))
    
    }
    return () => ws.close()
  }, [])
  async function sendVideo() {
    const media = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true
    })
    const videoTrack = media.getVideoTracks()[0];
    if (localVideo.current) {
      localVideo.current.srcObject = media
    }
    const pc = new RTCPeerConnection();
    pc.onnegotiationneeded = async() =>{
      const senderoffer = await pc.createOffer();
      pc.setLocalDescription(senderoffer);
      socket.current?.send(JSON.stringify({
        type:offer,
        sdp: senderoffer
      }))
    }
    if(socket.current){
      socket.current.onmessage = (event)=>{
        const msg = JSON.parse(event.data);
        if(msg.type === answer){
          console.log("dafdsf")
          pc.setRemoteDescription(msg.sdp)
        }
      }
    }
    if(videoTrack){
      pc.addTrack(videoTrack,media)
    }
  }
  return <div>
    <p>Sender</p>
    <div className="border-2 border-emerald-200 w-full rounded">
    <button onClick={() => {
      sendVideo()
    }} className=" bg-slate-200 text-black px-8 py-2 rounded font-medium">Start Camara</button>
    <video ref={localVideo} autoPlay playsInline muted className="h-64 w-150 object-cover"></video>
  </div>
  </div>
}