import { create } from "zustand";

type asd = {
  admin: boolean;
  nickname: string;
  userColor: string;
};

interface User {
  nickname: string;
  setNickname: (nickname: string) => void;
  userColor: string;
  setUserColor: (userColor: string) => void;
  isHost: boolean;
  setIsHost: (isHost: boolean) => void;
  roomCode: string;
  setRoomCode: (roomCode: string) => void;
  userList: asd[];
  setUserList: (userList: asd[]) => void;
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
  userList: [],
  setUserList: (userList) => {
    set((_) => ({ userList }));
  },
}));

export default userStore;
