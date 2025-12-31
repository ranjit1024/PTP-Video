// client.ts
class VideoCallClient {
  private ws: WebSocket;
  private peerConnection: RTCPeerConnection;
  private localStream: MediaStream | null = null;
  
  constructor(private userId: string, private remoteUserId: string) {
    this.ws = new WebSocket(`ws://localhost:8080?userId=${userId}`);
    
    this.peerConnection = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' }
      ]
    });

    this.setupWebSocket();
    this.setupPeerConnection();
  }

  private setupWebSocket() {
    this.ws.onmessage = async (event) => {
      const message = JSON.parse(event.data);
      
      switch (message.type) {
        case 'offer':
          await this.handleOffer(message.data);
          break;
        case 'answer':
          await this.handleAnswer(message.data);
          break;
        case 'ice-candidate':
          await this.handleIceCandidate(message.data);
          break;
      }
    };
  }

  private setupPeerConnection() {
    this.peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        this.sendMessage('ice-candidate', event.candidate);
      }
    };

    this.peerConnection.ontrack = (event) => {
      const remoteVideo = document.getElementById('remoteVideo') as HTMLVideoElement;
      remoteVideo.srcObject = event.streams[0];
    };
  }

  async startCall() {
    this.localStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true
    });

    this.localStream.getTracks().forEach(track => {
      this.peerConnection.addTrack(track, this.localStream!);
    });

    const offer = await this.peerConnection.createOffer();
    await this.peerConnection.setLocalDescription(offer);
    
    this.sendMessage('offer', offer);
  }

  private async handleOffer(offer: RTCSessionDescriptionInit) {
    await this.peerConnection.setRemoteDescription(offer);
    
    const answer = await this.peerConnection.createAnswer();
    await this.peerConnection.setLocalDescription(answer);
    
    this.sendMessage('answer', answer);
  }

  private async handleAnswer(answer: RTCSessionDescriptionInit) {
    await this.peerConnection.setRemoteDescription(answer);
  }

  private async handleIceCandidate(candidate: RTCIceCandidateInit) {
    await this.peerConnection.addIceCandidate(candidate);
  }

  private sendMessage(type: string, data: any) {
    this.ws.send(JSON.stringify({
      type,
      source: this.userId,
      target: this.remoteUserId,
      data
    }));
  }
}
