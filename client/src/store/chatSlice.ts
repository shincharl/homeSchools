import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface ChatState {
  isConnected: boolean; // WebRTC 연결 상태
  currentRoom: string | null; // 현재 방 이름
  roomCount: number; // 참여 인원
  guestNickname: string | null;
}

const initialState: ChatState = {
  isConnected: false,
  currentRoom: null,
  roomCount: 0,
  guestNickname: null,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setConnected(state, action: PayloadAction<boolean>) {
      state.isConnected = action.payload;
    },
    setCurrentRoom(state, action: PayloadAction<string | null>) {
      state.currentRoom = action.payload;
    },
    setRoomCount(state, action: PayloadAction<number>) {
      state.roomCount = action.payload;
    },
    setGuestNickname(state, action: PayloadAction<string | null>) {
      state.guestNickname = action.payload;
    },
    resetChat(state) {
      state.isConnected = false;
      state.currentRoom = null;
      state.roomCount = 0;
      state.guestNickname = null;
    },
  },
});

export const {
  setConnected,
  setCurrentRoom,
  setRoomCount,
  resetChat,
  setGuestNickname,
} = chatSlice.actions;
export default chatSlice.reducer;
