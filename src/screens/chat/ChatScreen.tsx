import React, { useContext, useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  TextInput,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation, useRoute } from "@react-navigation/native";

// --- IMPORTS DO PROJETO ---
// Ajuste os caminhos conforme sua estrutura de pastas
import { API_URL } from "@/constants/backend";
import { CustomerContext, OwnerContext } from "@/contexts";
import { useSocket } from "@/contexts/SocketContext";
import { useChat } from "@/contexts/ChatContext";

// --- TIPAGENS ---
type Message = {
  id: string;
  type: "text" | "system";
  sender: "me" | "other";
  content: string;
};

type RouteParams = {
  chatId: string;
};

type ChatHeaderData = {
  name: string;
  avatarUrl: { uri: string };
  phone?: string;
};

// --- COMPONENTES AUXILIARES ---

const ChatHeader = ({
  data,
  onBack,
}: {
  data: ChatHeaderData;
  onBack: () => void;
}) => (
  <View className="flex-row items-center p-3 bg-white border-b border-gray-200 pt-10">
    <TouchableOpacity onPress={onBack} className="mr-2 p-1">
      <Ionicons name="arrow-back" size={24} color="#374151" />
    </TouchableOpacity>
    <Image
      source={data.avatarUrl}
      className="w-10 h-10 rounded-full bg-gray-200"
    />
    <View className="ml-3">
      <Text className="font-bold text-base text-gray-800">{data.name}</Text>
      {data.phone && (
        <Text className="text-xs text-gray-500">{data.phone}</Text>
      )}
    </View>
  </View>
);

const MessageBubble = ({ message }: { message: Message }) => {
  const isMe = message.sender === "me";
  return (
    <View
      className={`py-3 px-4 my-1 max-w-[75%] rounded-xl ${
        isMe
          ? "bg-purple-800 self-end rounded-br-none"
          : "bg-purple-200 self-start rounded-bl-none"
      }`}
    >
      <Text className={isMe ? "text-white" : "text-gray-800"}>
        {message.content}
      </Text>
    </View>
  );
};

const MessageInput = ({ onSend }: { onSend: (t: string) => void }) => {
  const [text, setText] = useState("");
  const handleSend = () => {
    if (text.trim()) {
      onSend(text);
      setText("");
    }
  };
  return (
    <View className="flex-row items-center p-3 bg-white border-t border-gray-200 pb-8">
      <TextInput
        className="flex-1 bg-gray-50 border border-gray-300 rounded-full px-4 py-3 mr-2 text-black"
        placeholder="Digite uma mensagem..."
        placeholderTextColor="#9CA3AF"
        value={text}
        onChangeText={setText}
        onSubmitEditing={handleSend}
      />
      <TouchableOpacity
        onPress={handleSend}
        className="bg-purple-800 p-3 rounded-full"
      >
        <Ionicons name="send" size={20} color="white" />
      </TouchableOpacity>
    </View>
  );
};

// --- TELA PRINCIPAL ---

export default function ChatScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const params = route.params as RouteParams;

  // Hooks de Contexto
  const { customerData } = useContext(CustomerContext);
  const { ownerData } = useContext(OwnerContext);
  const { chats, setActiveChat } = useChat();
  const socket = useSocket();

  // Estados Locais
  const [messages, setMessages] = useState<Message[]>([]);
  const [headerData, setHeaderData] = useState<ChatHeaderData | null>(null);
  const flatListRef = useRef<FlatList>(null);

  // Identificação do Usuário
  const currentUserId = customerData?.id || ownerData?.id;
  const isCustomer = !!customerData?.id;

  // 1. CARREGAR DADOS DO CABEÇALHO
  useEffect(() => {
    // Avisa o Context global que estamos nesta conversa (para não notificar novas msgs aqui)
    setActiveChat(params.chatId);

    const loadHeader = async () => {
      // Tenta pegar do cache global primeiro
      const cachedChat = chats.find((c) => c.id === params.chatId);
      if (cachedChat) {
        setHeaderData({
          name: cachedChat.name,
          avatarUrl: cachedChat.avatarUrl,
        });
        return;
      }
      // Fallback para API
      try {
        const response = await fetch(`${API_URL}/chats/${params.chatId}`);
        const body = await response.json();
        const chat = body.chat;
        setHeaderData({
          name: isCustomer ? chat.laundry_name : chat.customer_name,
          avatarUrl: {
            uri:
              (isCustomer
                ? chat.laundry_profileUrl
                : chat.customer_profileUrl) || "https://placehold.co/150",
          },
        });
      } catch (error) {
        console.log("Erro ao carregar header:", error);
      }
    };
    loadHeader();

    // Cleanup: Ao sair da tela, libera o chat ativo
    return () => {
      setActiveChat(null);
    };
  }, [params.chatId, chats, isCustomer, setActiveChat]);

  // 2. FETCH MENSAGENS ANTIGAS (Histórico)
  useEffect(() => {
    const fetchMessages = async () => {
      if (!currentUserId) return;
      try {
        const response = await fetch(`${API_URL}/messages/${params.chatId}`);
        const body = await response.json();
        const apiMessages = body.messages || [];

        const formatted = apiMessages.map((msg: any) => {
          // Comparação segura convertendo para String
          const isMe = String(msg.sender_id) === String(currentUserId);
          return {
            id: msg.id,
            type: "text",
            content: msg.content,
            sender: isMe ? "me" : "other",
          };
        });
        setMessages(formatted);
      } catch (error) {
        console.error("Erro fetch mensagens:", error);
      }
    };
    fetchMessages();
  }, [params.chatId, currentUserId]);

  // 3. SOCKET: ESCUTAR MENSAGENS EM TEMPO REAL
  useEffect(() => {
    if (!socket || !currentUserId) return;

    // Função que decide a cor da mensagem (me vs other)
    const appendMessage = (content: string, senderIdFromEvent: string) => {
      // LOG DE DEBUG CRÍTICO: Veja isso no terminal se a cor estiver errada
      console.log(
        `Socket Debug - ID Evento: [${senderIdFromEvent}] vs Meu ID: [${currentUserId}]`
      );

      const isMe = String(senderIdFromEvent) === String(currentUserId);

      setMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(), // ID temporário para lista
          type: "text",
          sender: isMe ? "me" : "other",
          content: content,
        },
      ]);

      // Scroll para o fim
      setTimeout(
        () => flatListRef.current?.scrollToEnd({ animated: true }),
        100
      );
    };

    // Handler A: Evento principal de nova mensagem (recebido por quem envia e quem recebe)
    const handleMessageCreated = (data: any) => {
      // 1. Verifica se a mensagem pertence a este chat
      if (data.metadata?.chatId !== params.chatId) return;

      console.log("📨 Evento message-created recebido:", data);

      // 2. Extrai o ID do remetente com segurança
      // O seu backend manda 'message' com o objeto completo dentro.
      const msgSenderId = data.message?.sender_id || data.sender_id;

      if (msgSenderId) {
        appendMessage(data.content, msgSenderId);
      } else {
        console.warn("⚠️ Evento sem sender_id:", data);
      }
    };

    // Handler B: Evento específico da Lavanderia (caso necessário)
    const handleChatUpdate = (data: any) => {
      // Se eu recebo isso e o status é 'unread_by_team', foi o Cliente que mandou.
      if (data.chatId === params.chatId && data.status === "unread_by_team") {
        // Passamos um ID falso apenas para garantir que não seja igual ao currentUserId
        // Ou, se o data tiver senderId, melhor ainda.
        appendMessage(data.lastMessage, "id_do_cliente_generico");
      }
    };

    socket.on("message-created", handleMessageCreated);
    socket.on("chat-update", handleChatUpdate);

    return () => {
      socket.off("message-created", handleMessageCreated);
      socket.off("chat-update", handleChatUpdate);
    };
  }, [socket, params.chatId, currentUserId]);

  // 4. FUNÇÃO DE ENVIAR (Sem Optimistic UI - Confia 100% no servidor)
  const handleSendMessage = async (text: string) => {
    try {
      socket?.emit("create-message", {
        chat_id: params.chatId,
        content: text,
      });
      // Não adicionamos na lista manualmente aqui.
      // Esperamos o evento 'message-created' voltar do servidor.
    } catch (error) {
      Alert.alert("Erro", "Falha ao enviar conexão socket");
    }
  };

  if (!headerData) {
    return (
      <SafeAreaView className="flex-1 bg-white justify-center items-center">
        <ActivityIndicator size="large" color="#6B21A8" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ChatHeader data={headerData} onBack={() => navigation.goBack()} />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1"
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={({ item }) => <MessageBubble message={item} />}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 10 }}
          onContentSizeChange={() =>
            flatListRef.current?.scrollToEnd({ animated: false })
          }
        />

        <MessageInput onSend={handleSendMessage} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
