// contexts/SocketContext.tsx
import React, { createContext, useContext, useEffect } from "react";
import { registerEvents, socket } from "@/socket-io";

const SocketContext = createContext(socket);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    socket.on("connect", () => {
      console.log("Conectado ao Socket:", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("❌ Desconectado do Socket");
    });

    socket.on("connect_error", (err) => {
      console.log("Erro de conexão:", err.message);
      throw err;
    });

    socket.on("from-server", (data) => {
      console.log(`Mensagem do Servidor `);
      console.log(data);
    });
    registerEvents(socket);

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export const useSocket = () => {
  return useContext(SocketContext);
};
