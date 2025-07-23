import React, { useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ImageSourcePropType,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { NavigationProp, useNavigation } from "@react-navigation/native";

// --- TIPAGEM (TYPESCRIPT) ---

type MessageType = "text" | "system" | "timestamp" | "typing";

type Message = {
  id: string;
  type: MessageType;
  sender?: "me" | "other";
  content: string;
};

type UserInfo = {
  name: string;
  phone: string;
  avatarUrl: ImageSourcePropType;
};

// --- DADOS DE EXEMPLO (MOCK DATA) ---
const userInfo: UserInfo = {
  name: "Rafael Teodoro Santos",
  phone: "+55 11 98765-4900",
  avatarUrl: { uri: "https://i.pravatar.cc/150?img=11" }, // Substitua pela imagem real
};

const messagesData: Message[] = [
  {
    id: "1",
    type: "system",
    content:
      "Aviso de mensagem importante!\nEssa conversa ficará salva por apenas 48h",
  },
  {
    id: "2",
    type: "timestamp",
    content: "17h 17m",
  },
  {
    id: "3",
    type: "text",
    sender: "other",
    content: "Olá, Boa tarde",
  },
  {
    id: "4",
    type: "text",
    sender: "other",
    content: "Você entregam a domicílio?",
  },
  {
    id: "5",
    type: "text",
    sender: "me",
    content: "Olá, Boa tarde",
  },
  {
    id: "6",
    type: "text",
    sender: "me",
    content: "Infelizmente, não trabalhamos com este tipo de serviço.",
  },
  {
    id: "7",
    type: "typing",
    content: "...", // Placeholder for typing indicator
  },
];

// --- COMPONENTES ---

function ChatHeader({ user }: { user: UserInfo }) {
  const navigation = useNavigation<NavigationProp<any>>();

  return (
    <View className="flex-row items-center p-3 bg-white border-b border-gray-200">
      <TouchableOpacity className="p-2" onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="#374151" />
      </TouchableOpacity>
      <Image source={user.avatarUrl} className="w-10 h-10 rounded-full mx-3" />
      <View>
        <Text className="font-bold text-base text-gray-800">{user.name}</Text>
        <Text className="text-sm text-gray-500">{user.phone}</Text>
      </View>
    </View>
  );
}

const MessageBubble = ({ message }: { message: Message }) => {
  const isMyMessage = message.sender === "me";

  // --- Renderização condicional por tipo de mensagem ---

  if (message.type === "system") {
    return (
      <View className="bg-purple-900 self-center rounded-lg py-2 px-4 my-2 max-w-[80%]">
        <Text className="text-white text-center text-sm">
          {message.content}
        </Text>
      </View>
    );
  }

  if (message.type === "timestamp") {
    return (
      <Text className="text-gray-500 text-xs self-center my-2">
        {message.content}
      </Text>
    );
  }

  if (message.type === "typing") {
    return (
      <View className="bg-purple-200 self-start rounded-xl rounded-bl-none p-3 my-1">
        <Text className="text-gray-600 font-bold tracking-widest">...</Text>
      </View>
    );
  }

  // --- Bolha de texto padrão ---
  return (
    <View
      className={`py-3 px-4 my-1 max-w-[75%] rounded-xl ${
        isMyMessage
          ? "bg-purple-800 self-end rounded-br-none"
          : "bg-purple-200 self-start rounded-bl-none"
      }`}
    >
      <Text className={isMyMessage ? "text-white" : "text-gray-800"}>
        {message.content}
      </Text>
    </View>
  );
};

const MessageInput = () => {
  const [input, setInput] = useState("");

  return (
    <View className="flex-row items-center p-3 bg-white border-t border-gray-200">
      <View className="flex-1 bg-white border border-gray-300 rounded-lg">
        <TextInput
          placeholder="Mensagem..."
          placeholderTextColor="#9CA3AF"
          value={input}
          onChangeText={setInput}
          className="p-3 text-gray-800"
        />
      </View>
      <TouchableOpacity className="w-12 h-12 rounded-full bg-purple-800 justify-center items-center ml-3">
        <Ionicons name="paper-plane-outline" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};

// --- TELA PRINCIPAL ---

export default function ChatScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : -50} // Ajuste conforme necessário
      >
        <ChatHeader user={userInfo} />
        <FlatList
          data={messagesData}
          renderItem={({ item }) => <MessageBubble message={item} />}
          keyExtractor={(item) => item.id}
          className="flex-1"
          contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 10 }}
          // A propriedade 'inverted' pode ser usada para chats que começam de baixo para cima
          // Se usar 'inverted', lembre-se de inverter a ordem do seu array de dados
        />
        <MessageInput />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
