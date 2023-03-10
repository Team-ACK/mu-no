import { create } from "zustand";

interface UserStoreType {
  nickname: string;
  setNickname: (nickname: string) => void;
  userColor: string;
  setUserColor: (userColor: string) => void;
  isMember: boolean;
  setIsMember: (isMember: boolean) => void;
  isHost: boolean;
  setIsHost: (isHost: boolean) => void;
  roomCode: string;
  setRoomCode: (roomCode: string) => void;
}

const userStore = create<UserStoreType>((set) => ({
  nickname: "",
  setNickname: (nickname) => {
    set((_) => ({ nickname }));
  },
  userColor: "",
  setUserColor: (userColor) => {
    set((_) => ({ userColor }));
  },
  isMember: false,
  setIsMember: (isMember) => {
    set((_) => ({ isMember }));
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
