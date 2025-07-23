import React from "react";
import {
  SafeAreaView,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  ImageSourcePropType,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

import { Text, ConversationComponent } from "@/components";
import { Conversation, ConversationStatus } from "@/types";

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

export default function ChatList() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <Header />
      <FlatList
        data={conversationsData}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => <ConversationComponent item={item} />}
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
