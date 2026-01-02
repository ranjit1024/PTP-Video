import { useEffect, useRef, type RefObject } from "react";
import { WebSocket } from "ws";

export function Sender(){
  const wsRef = useRef<WebSocket | null>(null);
  useEffect(()=>{
    const ws = new WebSocket("ws://localhost:8080");
    ws.onopen = () =>{
      wsRef.current = ws;
    }
  },[])
    return <div className="border-2 border-emerald-200 w-full rounded">
         <button onClick={()=>{
          
      }} className=" bg-slate-200 text-black px-8 py-2 rounded font-medium">Start Camara</button>
        <video className="h-64 w-150 object-cover"></video>
      </div>
}