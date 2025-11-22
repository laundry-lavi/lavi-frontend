import { WS_URL } from "@/constants/backend";
import { io, Socket } from "socket.io-client";
import { notificationEvent } from "./events/notification";

export const socket: Socket = io(WS_URL, {
  transports: ["websocket"], // <--- OBRIGATÓRIO: Remove o polling da lista
  autoConnect: false,
});

export const registerEvents = (io: Socket) => {
  notificationEvent(io);
}
