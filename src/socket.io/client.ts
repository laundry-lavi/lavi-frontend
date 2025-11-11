import { webSocketAddr } from "@/constants/env";
import { io } from "socket.io-client";

const clientSocket = io(webSocketAddr);

clientSocket.on("connect", () => {
  console.log("Conectado ao servidor Socket.IO");
});

export { clientSocket };
