import { useContext, useEffect,  useState } from "react";
import { WebRTCContext } from "../providers/WebRTCProvider";
import Videos from "./Videos";
import { useAuth } from "./AuthContextType";
import Styles from "../css/ChatRoom.module.css";
import FullscreenWrapper from "./FullscreenWrapper";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "../store";
import type { RootState } from "../store/index";
import { resetChat, setConnected, setCurrentRoom, setRoomCount } from "../store/chatSlice";

const ChatRoom = ({socket}) => {

  const dispatch = useDispatch<AppDispatch>();
  const {isConnected, currentRoom, roomCount} = useSelector((state: RootState) => state.chat);
  const {startConnection, messages, sendMessage, roleRef} = useContext(WebRTCContext);
  const {nickname} = useAuth();

  const [roomInput, setRoomInput] = useState("");
  const [msg, setMsg] = useState("");
  const welcome = !isConnected; // Redux 상태로 판단

  const [guestNickname, setGuestNickname] = useState<string | null>(null);

   type RoomInfo = {
    roomId: string;
    count: number;
    max: number;
   }; 

   const [roomList, setRoomList] = useState<RoomInfo[]>([]);

    // 서버에서 방 목록 수신
    useEffect(() => {
        socket.emit("getRooms"); // 처음 방 목록 요청

        socket.on("roomList", (rooms: RoomInfo[]) => {
            setRoomList(rooms);
        });
        socket.on("roomCount", (count: number) => { // 방 인원 수 갱신 코드
            dispatch(setRoomCount(count));
        });
        socket.on("roomFull", (room: string) => {
            alert(`방 ${room}이(가) 이미 가득 찼습니다!`);
        });
        socket.on("joinSuccess", async ({room, isHost, roomCount: latestRoomCount}) => {
            dispatch(setCurrentRoom(room));
            dispatch(setConnected(true));
            dispatch(setRoomCount(roomCount));

            console.log("joinSuccess roomCount:", latestRoomCount)


            await startConnection(isHost); // Host도 무조건 실행

        });
        socket.on("leftRoom", () => {
           dispatch(resetChat());
        });
        socket.on("roomClosed", () => {
            alert("방장이 나가서 방이 종료되었습니다.");
            window.location.href = "/";
        });
        socket.on("guestJoined", ({nickname}) => {
            setGuestNickname(nickname);
        });

        socket.on("hostInfo", ({nickname}) => {
            setGuestNickname(nickname);
        });

        return () => {
            socket.off("roomList");
            socket.off("roomCount");
            socket.off("roomFull");
            socket.off("joinSuccess");
            socket.off("roomClosed");
            socket.off("leftRoom");
            socket.off("guestJoined");
            socket.off("hostInfo");
        };
    }, [socket, roomCount, startConnection, dispatch])

     // spa 복귀 시 기존 방 재연결 
    useEffect(() => {
        if(currentRoom && !isConnected){
            startConnection(roleRef.current === "host"); // 재연결
            dispatch(setConnected(true));
        }
        }, [currentRoom, isConnected, startConnection, roleRef, dispatch]);

        const handleJoinAsGuest = (roomName?: string) => {
        const finalRoom = roomName || roomInput;
        if(!finalRoom) return;

        socket.emit("join", {
            room: finalRoom,
            nickname
        });

      
    };

    const handleJoinAsHost = () => {
        const finalRoom = roomInput || prompt("Enter room name"); // roomInput : 방이름
        if (!finalRoom) return;

        socket.emit("join", {
            room: finalRoom,
            nickname
        });


    };

    return (
        <div className={Styles.chatRoom}>
            {welcome && (
                <div className={Styles.welcomeCard}>
                    <h3>환영합니다 <strong>{nickname}</strong>님
                    <br /> 
                    참여할 채팅방을 골라주세요!
                    </h3>
                    <ul className={Styles.roomList}>
                        {roomList.map((r) => (
                            <li key={r.roomId} className={Styles.roomItem}>
                                <div>
                                    <strong>{r.roomId}</strong>
                                    <span>{r.count} / {r.max}명</span>
                                </div>
                                <button onClick={() => handleJoinAsGuest(r.roomId)}>
                                    입장
                                </button>
                            </li>
                        ))}
                    </ul>

                    <div className="roomInput">
                        <input value={roomInput} onChange={(e) => setRoomInput(e.target.value)} placeholder="새 방 이름 입력" />
                        <button onClick={handleJoinAsHost}>방 만들기</button>
                        <button onClick={handleJoinAsGuest}>참여하기</button>
                    </div> 
                </div>
            )}

            {!welcome && (
                <FullscreenWrapper className = {Styles.fullscreenLocation}>
                    <div className={Styles.meetingLayout}>
                        <div className={Styles.meetingHeader}>
                            <span>현재 참여 인원: {roomCount}명</span>
                        </div>

                        <div className={Styles.meetingBody}>
                            <div className={Styles.videoArea}>
                                <Videos myNickname={nickname} guestNickname={guestNickname ?? ""}/>
                            </div>

                            <div className={Styles.chatArea}>
                                <div className={Styles.chatMessages}>
                                    {messages.map((m, i) => (
                                        <div key={i} className={Styles.chatBubble}>
                                            {m}
                                        </div>
                                    ))}
                                </div>

                                <div className={Styles.chatInput}>
                                    <input value={msg} onChange={(e) => setMsg(e.target.value)} placeholder="메시지를 입력하세요..." />
                                    <button onClick={() => {
                                        sendMessage(msg);
                                        setMsg("");
                                    }}>
                                        전송
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </FullscreenWrapper>
            )}      

        </div>
    );
}

export default ChatRoom;
