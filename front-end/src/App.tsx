import { useEffect, useRef, useState } from "react";
import "./index.css";
import { offer } from "./types/types";
import { Sender } from "./components/sender";
import { Receiver } from "./components/receiver";
import { revision } from "bun";

export function App() { 
  const [sender,setSender] = useState<WebSocket | null>(null);
  const [receiver,setReciever] = useState<WebSocket | null>(null);
  const localSteram = useRef<MediaStream | null>(null)
  const remoteSteram = useRef<MediaStream | null>(null)
  const localVideo = useRef<HTMLVideoElement | null>(null)
  useEffect(()=>{
    
  },[])
  return (
   
    <div className="flex justify-between w-full gap-10">
      
        
    </div>
   
  );
}

export default App;
