import { create } from "zustand";

type userType = {
  admin: boolean;
  nickname: string;
  userColor: string;
  socketID: string;
};

interface LobbyStoreType {
  userList: userType[];
  setUserList: (userList: userType[]) => void;
  headCount: string;
  setHeadCount: (headCount: string) => void;
}

const lobbyStore = create<LobbyStoreType>((set) => ({
  userList: [],
  setUserList: (userList) => {
    set((_) => ({ userList }));
  },
  headCount: "",
  setHeadCount: (headCount) => {
    set((_) => ({ headCount }));
  },
}));

export default lobbyStore;
