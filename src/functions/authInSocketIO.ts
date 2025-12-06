import { getSession } from "@/storage/session";
import { Socket } from "socket.io-client";

export const authInSocketIO = async (socket: Socket) => {
  socket.connect();
  const userSession = await getSession();
  socket.emit(`${userSession.userType}-auth`, { token: userSession.token });
};
