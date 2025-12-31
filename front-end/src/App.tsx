// App.tsx
import React, { useState } from 'react';
import { VideoCall } from './components/video';
import './App.css';

function App() {
  const [roomId, setRoomId] = useState('');
  const [userId, setUserId] = useState('');
  const [inCall, setInCall] = useState(false);

  const handleJoinCall = (e: React.FormEvent) => {
    e.preventDefault();
    if (roomId && userId) {
      setInCall(true);
    }
  };

  const handleEndCall = () => {
    setInCall(false);
    setRoomId('');
    setUserId('');
  };

  if (inCall) {
    return (
      <VideoCall
        roomId={roomId}
        userId={userId}
        onEndCall={handleEndCall}
      />
    );
  }

  return (
    <div className="app">
      <div className="join-container">
        <h1>WebRTC Video Call</h1>
        <form onSubmit={handleJoinCall}>
          <input
            type="text"
            placeholder="Enter Room ID"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Enter Your Name"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            required
          />
          <button type="submit">Join Call</button>
        </form>
      </div>
    </div>
  );
}

export default App;
