import { create } from "zustand";
import { io, Socket } from "socket.io-client";
import { END_POINT } from "../utils/envProvider";

interface SocketStoreType {
  socket: Socket | null;
  setSocket: () => void;
}

const socketStore = create<SocketStoreType>((set) => ({
  socket: null,
  setSocket: () => {
    set((_) => ({
      socket: io(END_POINT),
    }));
  },
}));

export default socketStore;
