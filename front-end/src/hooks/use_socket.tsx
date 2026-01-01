import { useEffect, useRef } from "react";

export function Usesocket(){
    const socketRef = useRef<WebSocket | null>(null);
    useEffect(() =>{
        const ws = new WebSocket("ws://localhost:8080");
        ws.onopen = () =>{
            console.log("Conneted to Server");
            socketRef.current = ws
        }
        ws.onclose = ()=>{
            socketRef.current = null;
        }
        return () => ws.close();

    }, [])
    return socketRef.current;
}