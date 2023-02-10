import { create } from "zustand";

type datainfo = {
  admin: boolean;
  nickname: string;
  userColor: string;
};

interface Lobby {
  userList: datainfo[];
  setUserList: (userList: datainfo[]) => void;
  headCount: string;
  setHeadCount: (headCount: string) => void;
}

const lobbyStore = create<Lobby>((set) => ({
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
