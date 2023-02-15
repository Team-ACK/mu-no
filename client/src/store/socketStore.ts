import { io, Socket } from "socket.io-client";
import { create } from "zustand";

interface User {
  socket: Socket | null;
  setSocket: () => void;
}

const socketStore = create<User>((set) => ({
  socket: null,
  setSocket: () => {
    set((_) => ({ socket: io("http://54.250.12.96/") }));
  },
}));

export default socketStore;
