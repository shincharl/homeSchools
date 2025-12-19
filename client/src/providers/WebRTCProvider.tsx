import { createContext, useState, useEffect, useRef } from "react";

const WebRTCContext = createContext(null);

const WebRTCProvider = ({ children, socket }) => {
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const dataChannelRef = useRef<RTCDataChannel | null>(null);

  const localStreamRef = useRef<MediaStream | null>(null);
  const remoteStreamRef = useRef<MediaStream | null>(null);

  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [messages, setMessages] = useState<string[]>([]);
  const [channelReady, setChannelReady] = useState(false);

  const roleRef = useRef<"host" | "guest" | null>(null);

  // 로컬 미디어 초기화
  const initMedia = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      localStreamRef.current = stream;
      setLocalStream(stream);

      if (peerConnectionRef.current) {
        const senders = peerConnectionRef.current.getSenders();
        stream.getTracks().forEach(track => {
          if(!senders.find(s => s.track?.kind === track.kind)){
            peerConnectionRef.current!.addTrack(track, stream);
          }
        });
      }
    } catch (error) {
      console.log("미디어 가져오기 실패:", error);
    }
  };

  //useEffect(() => { initMedia(); }, []);

  // 오디오/비디오 토글
  const toggleAudio = () => {
    const track = localStreamRef.current?.getAudioTracks()[0];
    if (track) track.enabled = !track.enabled;
  };
  const toggleVideo = () => {
    const track = localStreamRef.current?.getVideoTracks()[0];
    if (track) track.enabled = !track.enabled;
  };

  const switchCamera = async (deviceId: string) => {
    try {
      const newStream = await navigator.mediaDevices.getUserMedia({ video: { deviceId: { exact: deviceId } }, audio: true });
      localStreamRef.current?.getTracks().forEach(t => t.stop());
      localStreamRef.current = newStream;
      setLocalStream(newStream);

      if (peerConnectionRef.current) {
        const sender = peerConnectionRef.current.getSenders().find(s => s.track?.kind === "video");
        if (sender) await sender.replaceTrack(newStream.getVideoTracks()[0]);
      }
    } catch (e) {
      console.log("카메라 전환 실패:", e);
    }
  };

  // DataChannel 설정
  const setupDataChannel = (dc: RTCDataChannel) => {
    dc.onopen = () => setChannelReady(true);
    dc.onclose = () => setChannelReady(false);
    dc.onmessage = e => setMessages(prev => [...prev, `상대: ${e.data}`]);
    return dc;
  };

  // PeerConnection 생성
  const createConnection = (isHost: boolean) => {
    if (peerConnectionRef.current) return peerConnectionRef.current;

    const pc = new RTCPeerConnection();

    pc.onicecandidate = e => {
      if (e.candidate) socket.emit("ice", e.candidate);
    };

    pc.ontrack = (event) => {
      console.log("ontrack fired", event.streams[0]);
      remoteStreamRef.current = event.streams[0];
      setRemoteStream(event.streams[0]);
    };

    pc.ondatachannel = event => {
      dataChannelRef.current = setupDataChannel(event.channel);
    };

    localStreamRef.current?.getTracks().forEach(track => pc.addTrack(track, localStreamRef.current as MediaStream));

    if (isHost) {
      dataChannelRef.current = setupDataChannel(pc.createDataChannel("chat"));
    }

    peerConnectionRef.current = pc;
    return pc;
  };

  // 시그널링 이벤트
  useEffect(() => {
    if (!socket) return;

    // Host 클라이언트
    socket.on("readyForOffer", async () => {

      if(roleRef.current !== "host") return;

      const pc = peerConnectionRef.current;
      if (!pc) return;

      console.log("Host: creating offer");

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      socket.emit("offer", offer);
    });

    // Offer 수신
    socket.on("offer", async (offer) => {
      const pc = createConnection(false);
      await pc.setRemoteDescription(offer);
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      socket.emit("answer", answer);
    });

    // Answer 수신
    socket.on("answer", async (answer) => {
      const pc = peerConnectionRef.current;
      if (!pc) return;
      await pc.setRemoteDescription(answer);
    });

    // ICE 후보
    socket.on("ice", async (candidate) => {
      const pc = peerConnectionRef.current;
      if (!pc) return;
      await pc.addIceCandidate(candidate);
    });

    return () => {
      socket.off("requestOffer");
      socket.off("offer");
      socket.off("answer");
      socket.off("ice");
    };
  }, [socket]);

  // 연결 시작
  const startConnection = async (isHost: boolean) => {
    await initMedia();
    roleRef.current = isHost ? "host" : "guest";

    if (!peerConnectionRef.current) createConnection(isHost);

    if (!isHost) socket.emit("requestOffer");
  };

  const sendMessage = (message: string) => {
    if (channelReady && dataChannelRef.current) {
      dataChannelRef.current.send(message);
      setMessages(prev => [...prev, `나: ${message}`]);
    }
  };

  return (
    <WebRTCContext.Provider value={{
      startConnection, sendMessage, messages,
      localStream, remoteStream, toggleAudio, toggleVideo, switchCamera, roleRef
    }}>
      {children}
    </WebRTCContext.Provider>
  );
};

export default WebRTCProvider;
export { WebRTCContext };
