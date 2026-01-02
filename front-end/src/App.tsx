import { useEffect, useRef, useState } from "react";
import "./index.css";
import { Sender } from "./components/sender";
import { Receiver } from "./components/receiver";

export function App() { 

  return (<div className="flex justify-between w-full gap-10">
      <Sender/>
        <Receiver/>
    </div>
   
  );
}

export default App;
