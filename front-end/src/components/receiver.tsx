import { answer, ice, join, offer } from "@/types/types";
import { PureComponent, useEffect, useRef, type RefObject } from "react";
export function Receiver() {
  const localVideo = useRef<HTMLVideoElement>(null);
  const remoteVideo = useRef<HTMLVideoElement>(null);
  const socket = useRef<WebSocket | null>(null);
  const remoteRef = useRef<HTMLVideoElement>(null)
  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");
    ws.onopen = () => {
      socket.current = ws;
      ws.send(JSON.stringify({
        type: 'JOIN'
      }))

      const pc = new RTCPeerConnection();
      socket.current.onmessage = async(event) => {
        const msg = JSON.parse(event.data);
        
        pc.onicecandidate=(event)=>{
          ws.send(JSON.stringify({
            type:ice,
            candidate:event.candidate
          }))
        }   
        if(msg.type === offer){
          console.log("offer")
          pc.setRemoteDescription(msg.sdp);

            pc.ontrack = (track)=>{
              const remoteStream = track.streams[0]
              if(remoteVideo.current && remoteStream){
                console.log('Steram')
                remoteVideo.current.srcObject = remoteStream
              }
            console.log(track)
          }
          const pcAns = await pc.createAnswer();
          pc.setLocalDescription(pcAns)
          socket.current?.send(JSON.stringify({
            type:answer, 
            sdp:pcAns
          }))
        
        }
        else if(msg.type === ice){
          pc.addIceCandidate(msg.candidate)
        }
        
      }
      
    }
    return () => ws.close()
  }, [])
  useEffect(() => {
    if (!socket.current) return;

  }, [socket])

  async function sendVideo() {
    const media = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true
    })
    if (localVideo.current) {
      localVideo.current.srcObject = media
    }
  }
  return <div>
    <p>Receiver</p>
    <div className="border-2 border-red-200 w-full rounded">
      <button onClick={() => {
        sendVideo()
      }} className=" bg-slate-200 text-black px-8 py-2 rounded font-medium">Start Camara</button>
      <video ref={remoteVideo} autoPlay playsInline muted className="h-64 w-150 object-cover"></video>
    </div>
  </div>
}