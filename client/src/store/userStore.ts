import { create } from "zustand";

interface User {
  nickname: string;
  setNickname: (nickname: string) => void;
  userColor: string;
  setUserColor: (userColor: string) => void;
  isHost: boolean;
  setIsHost: (isHost: boolean) => void;
  roomCode: string;
  setRoomCode: (roomCode: string) => void;
}

const userStore = create<User>((set) => ({
  nickname: "",
  setNickname: (nickname) => {
    set((_) => ({ nickname }));
  },
  userColor: "",
  setUserColor: (userColor) => {
    set((_) => ({ userColor }));
  },
  isHost: false,
  setIsHost: (isHost) => {
    set((_) => ({ isHost }));
  },
  roomCode: "",
  setRoomCode: (roomCode) => {
    set((_) => ({ roomCode }));
  },
}));

export default userStore;
