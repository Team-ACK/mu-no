import { create } from "zustand";
import UserType from "./types/UserType";

interface LobbyStoreType {
  userList: UserType[];
  setUserList: (userList: UserType[]) => void;
  headCount: string;
  setHeadCount: (headCount: string) => void;
  isComeBack: boolean;
  setIsComeBack: (isComeBack: boolean) => void;
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
  isComeBack: false,
  setIsComeBack: (isComeBack) => {
    set((_) => ({ isComeBack }));
  },
}));

export default lobbyStore;
