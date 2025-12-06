import { Socket } from "socket.io-client";

export const notificationEvent = (io: Socket) => {
  io.on('notification', (data) => {
    console.log(data);
  })
}