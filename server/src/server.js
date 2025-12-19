// server.js
import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*" },
});

// 현재 호스트 관리
const hosts = {}; // 방마다 호스트 관리

// 현재 존재하는 실제 방 목록 가져오기
const getRooms = () => {
  const { rooms: allRooms, sids } = io.sockets.adapter;
  const list = [];

  for (const [roomId, room] of allRooms) {
    if (!sids.has(roomId) && room.size > 0) {
      list.push({
        roomId,
        count: room.size,
        max: 2, // 최대 2명
      });
    }
  }
  return list;
};

// 모든 클라이언트에게 방 목록 브로드캐스트
const broadcastRooms = () => {
  io.emit("roomList", getRooms());
};

// 특정 방의 현재 인원수를 roomCount로 전송
const broadcastRoomCount = (room) => {
  const clients = Array.from(io.sockets.adapter.rooms.get(room) || []);
  const count = clients.length;
  io.to(room).emit("roomCount", count);
};

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // 클라이언트가 방 목록 요청 전달
  socket.on("getRooms", () => {
    socket.emit("roomList", getRooms());
  });

  // 방 참여
  socket.on("join", ({ room, nickname }) => {
    socket.nickname = nickname;
    socket.room = room;

    const clients = io.sockets.adapter.rooms.get(room) || new Set();

    if (clients.size >= 2) {
      socket.emit("roomFull", room);
      return;
    }

    socket.join(room);

    let isHost = false;

    // 호스트가 이미 있는지 확인
    if (!hosts[room]) {
      // ---- HOST ----
      hosts[room] = socket.id;
      isHost = true;
    }

    //  호스트가 이미 존재하면 게스트 처리
    if (!isHost) {
      // ---- GUEST ----
      const hostId = hosts[room];
      const hostSocket = io.sockets.sockets.get(hostId);

      if (hostSocket) {
        io.to(hostId).emit("guestJoined", {
          nickname: socket.nickname,
        });

        socket.emit("hostInfo", {
          nickname: hostSocket.nickname,
        });
      }
    }

    const clientsAfterJoin = Array.from(
      io.sockets.adapter.rooms.get(room) || []
    );

    const roomCount = clientsAfterJoin.length;

    socket.emit("joinSuccess", { room, isHost, roomCount });

    broadcastRoomCount(room);
    broadcastRooms();
  });

  socket.on("host-ready", () => {
    const room = socket.room;
    if (!room) return;
    console.log(`Host ${socket.id} ready in room ${room}`);
    const clients = Array.from(io.sockets.adapter.rooms.get(room) || []);
    if (clients.length > 1) {
      io.to(socket.id).emit("readyForOffer");
    }
  });

  socket.on("requestOffer", () => {
    const room = socket.room;
    if (!room) return;

    const hostId = hosts[room];
    if (!hostId) return;

    console.log("requestOffer from", socket.id, "-> host", hostId);

    io.to(hostId).emit("readyForOffer");
  });

  // Offer, Answer, ICE Candidate 전달
  const relayEvent = (eventName) => (payload) => {
    // 방 목록 중 첫 번째 방으로만 전달
    const rooms = Array.from(socket.rooms).filter((r) => r !== socket.id);
    rooms.forEach((room) => {
      socket.to(room).emit(eventName, payload);
    });
  };

  socket.on("offer", relayEvent("offer"));
  socket.on("answer", relayEvent("answer"));
  socket.on("ice", relayEvent("ice"));

  // 연결 끊김
  socket.on("disconnecting", () => {
    console.log("User disconnecting:", socket.id);

    if (socket.room && hosts[socket.room] === socket.id) {
      // Host가 나가면 방에서 Host 제거
      delete hosts[socket.room];
      console.log(`Host left, room ${socket.room} now has no host`);
    }

    if (socket.room) {
      broadcastRoomCount(socket.room);
    }

    //setTimeout(broadcastRooms, 0);
    broadcastRooms();
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });

  // 연결되자마자 방 목록 브로드캐스트
  broadcastRooms();
});

server.listen(3000, () => console.log("Socket.IO server running on port 3000"));
