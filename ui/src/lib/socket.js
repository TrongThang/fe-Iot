import { io } from "socket.io-client";

const socket = io(process.env.SOCKET_URL, {
  path: "/socket.io",
  transports: ["websocket"],
  withCredentials: false,
});

export default socket;
