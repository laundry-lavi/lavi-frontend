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
import { NavigationProp, useNavigation } from "@react-navigation/native";

import Text from "./MyText";

type ConversationStatus = "sent" | "delivered" | "read" | "pending";

type Conversation = {
  id: string;
  name: string;
  avatarUrl: ImageSourcePropType;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  status: ConversationStatus;
  isActive: boolean;
};

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

export default function ConversationComponent({
  item,
  chatId,
}: {
  item: Conversation;
  chatId: string;
}) {
  const navigation = useNavigation<NavigationProp<any>>();

  const statusIcons: Record<ConversationStatus, string> = {
    pending: "time-outline",
    sent: "checkmark-outline",
    delivered: "checkmark-done-outline",
    read: "checkmark-done-outline",
  };

  const statusIconColor =
    item.status === "read" ? "text-blue-500" : "text-gray-400";

  return (
    <TouchableOpacity
      className="flex-row gap-2 items-center p-3"
      onPress={() =>
        navigation.navigate("ChatRoute", {
          screen: "ChatScreen",
          params: {
            chatId: chatId,
          },
        })
      }
    >
      {/* Indicador de ativa */}
      {item.isActive ? (
        <View className={`w-1 h-10 rounded-full bg-purple-600`} />
      ) : (
        <></>
      )}

      {/* Avatar */}
      <Image source={item.avatarUrl} className="w-14 h-14 rounded-full mr-1" />

      {/* Conteúdo da Mensagem */}
      <View className="flex-1">
        <View className="flex-row justify-between items-center">
          <Text className="font-bold text-xl text-gray-800">{item.name}</Text>
          <Text className="text-xs text-gray-500">{item.timestamp}</Text>
        </View>
        <View className="flex-row justify-between items-center mt-1">
          <View className="flex-row items-center flex-1">
            <Ionicons
              name={statusIcons[item.status] as any}
              size={16}
              className={`${statusIconColor} mr-1`}
            />
            <Text className="text-gray-500" numberOfLines={1}>
              {item.lastMessage}
            </Text>
          </View>

          {/* Contador de não lidas */}
          {item.unreadCount > 0 && (
            <View className="bg-purple-200 w-5 h-5 rounded-full justify-center items-center ml-2">
              <Text className="text-purple-700 font-bold text-xs">
                {item.unreadCount}
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}
