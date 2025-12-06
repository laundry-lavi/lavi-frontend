import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useCallback,
  useEffect,
} from "react";
import { Alert } from "react-native";
import { API_URL } from "@/constants/backend";

// Importe os contextos de usuário existentes
import { CustomerContext, LaundryContext, OwnerContext } from "@/contexts";
// Importe o Socket Context
import { useSocket } from "@/contexts/SocketContext";

// --- 1. TIPAGEM ---

type ChatFromApi = {
  id: string;
  laundry_name: string;
  customer_name: string;
  laundry_profileUrl: string | null;
  customer_profileUrl: string | null;
};

export type ChatSummary = {
  id: string;
  name: string;
  avatarUrl: { uri: string };
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  status: "sent" | "delivered" | "read";
  isActive: boolean;
};

type ChatContextData = {
  chats: ChatSummary[];
  isLoading: boolean;
  refreshChats: () => Promise<void>;
  setActiveChat: (chatId: string | null) => void;
};

// --- 2. CRIAÇÃO DO CONTEXTO ---

export const ChatContext = createContext<ChatContextData>(
  {} as ChatContextData
);

// --- 3. PROVIDER ---

export function ChatProvider({ children }: { children: ReactNode }) {
  const [chats, setChats] = useState<ChatSummary[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);

  // Consumindo os contextos
  const { customerData } = useContext(CustomerContext);
  const { ownerData } = useContext(OwnerContext);
  const { laundryData } = useContext(LaundryContext);
  const socket = useSocket(); // <--- Hook do Socket

  // --- FUNÇÃO DE BUSCA (API) ---
  const fetchChats = useCallback(async () => {
    const currentUserId = customerData?.id || ownerData?.id;
    const isCustomer = !!customerData?.id;

    if (!currentUserId) {
      setChats([]);
      return;
    }

    if (!isCustomer && !laundryData?.laundry?.id) {
      return;
    }

    try {
      setIsLoading(true);

      const endpoint = isCustomer
        ? `${API_URL}/chats/customer/${currentUserId}`
        : `${API_URL}/chats/laundry/${laundryData?.laundry.id}`;

      const response = await fetch(endpoint);
      const body = await response.json();

      if (!response.ok) {
        console.error("Erro API Chats:", body.details);
        return;
      }

      const { chats: apiChats } = body as { chats: ChatFromApi[] };

      const formattedChats: ChatSummary[] = apiChats.map((c) => ({
        id: c.id,
        name: isCustomer ? c.laundry_name : c.customer_name,
        avatarUrl: {
          uri:
            (isCustomer ? c.laundry_profileUrl : c.customer_profileUrl) ||
            "https://placehold.co/150",
        },
        lastMessage: "Toque para ver a conversa", // Placeholder inicial
        timestamp: "",
        unreadCount: 0,
        status: "sent",
        isActive: false,
      }));

      setChats(formattedChats);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [customerData, ownerData, laundryData]);

  // --- FUNÇÃO DE ATUALIZAÇÃO EM TEMPO REAL (SOCKET) ---
  const updateChatList = useCallback(
    (
      chatId: string,
      newMessage: string,
      status?: string,
      serverUnreadCount?: number
    ) => {
      setChats((prevChats) => {
        const existingChatIndex = prevChats.findIndex((c) => c.id === chatId);
        if (existingChatIndex === -1) {
          fetchChats();
          return prevChats;
        }

        const chatToUpdate = { ...prevChats[existingChatIndex] };

        // Atualiza texto e hora
        chatToUpdate.lastMessage = newMessage;
        chatToUpdate.timestamp = new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });

        // --- A LÓGICA DE OURO ---
        // Se este é o chat que o usuário está olhando agora (activeChatId),
        // mantemos o contador em 0.
        if (chatId === activeChatId) {
          chatToUpdate.unreadCount = 0;
          // Opcional: Marcar como lido na hora
          chatToUpdate.status = "read";
        } else {
          // Se o usuário está em outra tela ou outro chat, aí sim incrementa
          if (typeof serverUnreadCount === "number") {
            chatToUpdate.unreadCount = serverUnreadCount;
          } else {
            chatToUpdate.unreadCount = (chatToUpdate.unreadCount || 0) + 1;
          }
        }

        // Move pro topo
        const otherChats = prevChats.filter((c) => c.id !== chatId);
        return [chatToUpdate, ...otherChats];
      });
    },
    [fetchChats, activeChatId] // <--- Importante: activeChatId nas dependências
  );

  // --- EFEITO: OUVINTES DO SOCKET ---
  useEffect(() => {
    if (!socket) return;

    // Caso 1: Lavanderia recebe atualização (evento 'chat-update' do seu backend)
    const handleChatUpdate = (data: any) => {
      console.log("🔔 Socket Chat Update:", data);
      // Backend envia: { chatId, lastMessage, status }
      if (data.chatId && data.lastMessage) {
        updateChatList(data.chatId, data.lastMessage, data.status);
      }
    };

    // Caso 2: Cliente recebe mensagem (evento 'message-created' do seu backend)
    const handleMessageCreated = (data: any) => {
      console.log("🔔 Socket Message Created:", data);
      // Backend envia: { content, type, metadata: { chatId } }
      if (data.metadata?.chatId && data.content) {
        updateChatList(data.metadata.chatId, data.content);
      }
    };

    socket.on("chat-update", handleChatUpdate);
    socket.on("message-created", handleMessageCreated);

    return () => {
      socket.off("chat-update", handleChatUpdate);
      socket.off("message-created", handleMessageCreated);
    };
  }, [socket, updateChatList]);

  // --- EFEITO: CARGA INICIAL ---
  useEffect(() => {
    fetchChats();
  }, [fetchChats]);

  return (
    <ChatContext.Provider
      value={{
        chats,
        isLoading,
        refreshChats: fetchChats,
        setActiveChat: setActiveChatId
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

// --- 4. HOOK PERSONALIZADO ---

export function useChat() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat deve ser usado dentro de um ChatProvider");
  }
  return context;
}
