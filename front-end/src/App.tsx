import { useEffect, useRef } from "react";
import "./index.css";

export function App() { 
  const socketRef = useRef<WebSocket | null>(null);
  useEffect(()=>{
    const socket = new WebSocket("ws://localhost:8080");
    socket.onopen = ()=>{
      socket.send(JSON.stringify({type:'JOIN'}))
      socketRef.current = socket;
    }

  },[])
  return (
    <div>
    <div className="flex justify-between w-full gap-10">
      <div className="border-2 border-emerald-200 w-full rounded">
        <video className="h-64 w-150 object-cover"></video>
      </div>
      <div className="border-2 border-red-200 w-full rounded">
        <video  className="h-64 w-full object-cover"></video>
      </div>
    </div>
      <button onClick={()=>{

      }} className="mt-5 bg-slate-200 text-black px-8 py-2 rounded font-medium">Start Camara</button>
    </div>
  );
}

export default App;
