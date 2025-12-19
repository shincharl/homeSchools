import { useContext, useEffect, useRef, useState } from "react"
import { WebRTCContext } from "../providers/WebRTCProvider"
import Styles from "../css/Videos.module.css";

type VideosProps = {
  myNickname: string;
  guestNickname?: string;
};

const Videos = ({myNickname, guestNickname}: VideosProps) => {
    const {localStream, remoteStream, toggleAudio, toggleVideo, switchCamera} = useContext(WebRTCContext);

    const localRef = useRef(null);
    const remoteRef = useRef(null);

    const [audioOn, setAudioOn] = useState(true);
    const [videoOn, setVideoOn] = useState(true);

    // 카메라 목록
    const [cameras, setCameras] = useState([]);
    const [selectedCam, setSelectedCam] = useState("");

    useEffect(() => {
        console.log("localStream:", localStream);
        if(localRef.current && localStream){
            localRef.current.srcObject = localStream;
        }
    }, [localStream]);

    useEffect(() => {
        console.log("remoteStream:", remoteStream);
        if(remoteRef.current && remoteStream){
            remoteRef.current.srcObject = remoteStream;
        }
    }, [remoteStream]);

    useEffect(() => {
        const loadCameras = async () => {
            const devices = await navigator.mediaDevices.enumerateDevices();

            const videoDevices = devices.filter((d) => d.kind === "videoinput");
            setCameras(videoDevices);

            if(videoDevices.length > 0){
                setSelectedCam(videoDevices[0].deviceId);
            }  
        };

        loadCameras();
    }, []);

  return (
      <div className={Styles.videoLayout}>
        {/* ================= 내 영상 ================= */}
        <div className={Styles.videoCard}>
          <div className={Styles.videoWrapper}>
            <span className={Styles.badge}>{myNickname}</span>

            {localStream ? (
              <video ref={localRef} autoPlay muted playsInline />
            ) : (
              <div className={Styles.placeholder}>카메라 준비중...</div>
            )}
          </div>

          {/* 내 영상 하단 컨트롤 */}
          <div className={Styles.videoFooter}>
            <select
              value={selectedCam}
              onChange={(e) => {
                setSelectedCam(e.target.value);
                switchCamera(e.target.value);
              }}
            >
              {cameras.map((cam) => (
                <option key={cam.deviceId} value={cam.deviceId}>
                  {cam.label || "카메라"}
                </option>
              ))}
            </select>

            <button
              className={!audioOn ? Styles.off : ""}
              onClick={() => {
                toggleAudio();
                setAudioOn((prev) => !prev);
              }}
            >
              {audioOn ? "🎤 ON" : "🎤 OFF"}
            </button>

            <button
              className={!videoOn ? Styles.off : ""}
              onClick={() => {
                toggleVideo();
                setVideoOn((prev) => !prev);
              }}
            >
              {videoOn ? "📸 ON" : "📸 OFF"}
            </button>
          </div>
        </div>

        {/* ================= 상대 영상 ================= */}
        <div className={Styles.videoCard}>
          <div className={Styles.videoWrapper}>
            <span className={Styles.badge}>{typeof guestNickname === "string" ? guestNickname : guestNickname?.nickname || "상대방"}</span>

            {remoteStream ? (
              <video ref={remoteRef} autoPlay playsInline />
            ) : (
              <div className={Styles.placeholder}>상대방을 기다리는 중...</div>
            )}
          </div>

          <div className={Styles.videoFooter} />
        </div>
      </div>
  );
};

export default Videos;