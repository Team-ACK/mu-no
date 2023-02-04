import create from "zustand";

interface User {
  nickname: string;
  setNickname: (nickname: string) => void;
  userColor: string;
  setUserColor: (userColor: string) => void;
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
}));

export default userStore;
