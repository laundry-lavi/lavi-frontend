import React, { useContext, useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  ImageSourcePropType,
  Alert,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

import { Text, ConversationComponent } from "@/components";
import { Conversation, ConversationStatus } from "@/types";
import { getSession } from "@/storage/session";
import { CustomerContext, LaundryContext, OwnerContext } from "@/contexts";
import { API_URL } from "@/constants/backend";
import { useNavigation } from "@react-navigation/native";

const conversationsData: Conversation[] = [
  {
    id: "1",
    name: "Rafael Teodoro Santos",
    avatarUrl: { uri: "https://i.pravatar.cc/150?img=1" },
    lastMessage: "Olá, boa tarde",
    timestamp: "08:42",
    unreadCount: 1,
    status: "delivered",
    isActive: true,
  },
  {
    id: "2",
    name: "Luis Terrosa Barbosa",
    avatarUrl: { uri: "https://i.pravatar.cc/150?img=2" },
    lastMessage: "Boa noite Luis Terrosa, o pedido enviado está...",
    timestamp: "19:44",
    unreadCount: 0,
    status: "pending",
    isActive: false,
  },
  {
    id: "3",
    name: "Teresa Boullvar Gudwill",
    avatarUrl: { uri: "https://i.pravatar.cc/150?img=3" },
    lastMessage: "Bom dia Teresa Boullvar, o pedido enviado em...",
    timestamp: "Ontem",
    unreadCount: 0,
    status: "pending",
    isActive: false,
  },
  {
    id: "4",
    name: "Charles White Moist",
    avatarUrl: { uri: "https://i.pravatar.cc/150?img=4" },
    lastMessage: "Olá Charles White, seu pedido foi concluído, se...",
    timestamp: "Ontem",
    unreadCount: 0,
    status: "pending",
    isActive: false,
  },
  {
    id: "5",
    name: "Livia Silicaro Mozart",
    avatarUrl: { uri: "https://i.pravatar.cc/150?img=5" },
    lastMessage: "Obrigado pela compra!",
    timestamp: "Ontem",
    unreadCount: 0,
    status: "read",
    isActive: false,
  },
  {
    id: "6",
    name: "Julianna Grayson Silveiro",
    avatarUrl: { uri: "https://i.pravatar.cc/150?img=6" },
    lastMessage: "Mas de qualquer forma, agradeço!",
    timestamp: "Antontem",
    unreadCount: 3,
    status: "delivered",
    isActive: true,
  },
  {
    id: "7",
    name: "Otávio Garcia Silveiro Rosa",
    avatarUrl: { uri: "https://i.pravatar.cc/150?img=7" },
    lastMessage: "Obrigado pela compra!",
    timestamp: "Antontem",
    unreadCount: 0,
    status: "read",
    isActive: false,
  },
  {
    id: "8",
    name: "Rúbens Goupard Pergido",
    avatarUrl: { uri: "https://i.pravatar.cc/150?img=8" },
    lastMessage: "Vocês fazem de graça?",
    timestamp: "22/09/2025",
    unreadCount: 0,
    status: "sent",
    isActive: false,
  },
];

type ChatFromApi = {
  id: string;
  customer_name: string;
  laundry_name: string;
  customer_profileUrl: string | null;
  laundry_profileUrl: string | null;
  customerId: string;
  laundryId: string;
};

export default function ChatList() {
  const navigation = useNavigation();
  const { customerData, clearCustomerData } = useContext(CustomerContext);
  const { laundryData } = useContext(LaundryContext);
  const { ownerData } = useContext(OwnerContext);
  const [chats, setChats] = useState<Conversation[]>([]);

  useEffect(() => {
    const fetchChats = async () => {
      const isCustomer = !!customerData?.id;
      const currentUserId = customerData?.id || ownerData?.id;

      if (!currentUserId) return;

      try {
        const endpoint = isCustomer
          ? `${API_URL}/chats/customer/${currentUserId}`
          : `${API_URL}/chats/laundry/${laundryData?.laundry.id}`;

        const response = await fetch(endpoint);
        const body = await response.json();

        if (!response.ok) {
          Alert.alert("Erro!", body.details || "Erro ao buscar chats");
          console.error(body);
          return;
        }

        const { chats: apiChats } = body as { chats: ChatFromApi[] };

        setChats(
          apiChats.map((c) => ({
            id: c.id,
            // Se sou cliente, vejo o nome da Lavanderia. Se sou Dono, vejo o nome do Cliente.
            name: isCustomer ? c.laundry_name : c.customer_name,

            // Mesma lógica para a foto
            avatarUrl: {
              uri: isCustomer
                ? c.laundry_profileUrl || "https://placehold.co/1"
                : c.customer_profileUrl || "https://placehold.co/1",
            },

            // Dados genéricos precisam vir da API futuramente
            lastMessage: "Clique para ver as mensagens",
            timestamp: "Hoje",
            unreadCount: 0,
            status: "sent",
            isActive: false,
          }))
        );
      } catch (err) {
        console.error(err);
        Alert.alert("Erro", "Falha na conexão");
      }
    };

    fetchChats();

    // Adicione ownerData e customerData nas dependências para refazer a busca se o user mudar
  }, [customerData, ownerData]);
  return (
    <SafeAreaView className="flex-1 bg-white">
      <Header />
      <FlatList
        data={chats}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <ConversationComponent item={item} chatId={item.id} />
        )}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={() => (
          <View className="h-px bg-gray-200 ml-20 my-1" />
        )}
      />
    </SafeAreaView>
  );
}

const Header: React.FC = () => (
  <View className="flex-row justify-between items-center p-4 bg-white border-b border-gray-200">
    <View className="bg-[#370e38] py-2 px-5 rounded-lg">
      <Text className="text-white font-bold text-base">Conversas</Text>
    </View>
    <TouchableOpacity>
      <Ionicons name="filter" size={30} color="#370e38" />
    </TouchableOpacity>
  </View>
);
