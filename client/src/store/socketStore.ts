import { create } from "zustand";
import { io, Socket } from "socket.io-client";

interface SocketStoreType {
  socket: Socket | null;
  setSocket: () => void;
}

const socketStore = create<SocketStoreType>((set) => ({
  socket: null,
  setSocket: () => {
    set((_) => ({ socket: io("http://localhost:8080") }));
    // set((_) => ({ socket: io("http://muno.fun/") }));
  },
}));

export default socketStore;
