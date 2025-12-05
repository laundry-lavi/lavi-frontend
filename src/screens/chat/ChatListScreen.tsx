import React from "react";
import {
  SafeAreaView,
  View,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  RefreshControl, // Importante para o puxar-para-atualizar
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

// Seus componentes existentes
import { Text, ConversationComponent } from "@/components";

// O Hook Mágico
import { useChat } from "@/contexts/ChatContext";

export default function ChatList() {
  // 1. Substituímos toda a lógica antiga por isso:
  const { chats, isLoading, refreshChats } = useChat();

  // 2. Loading Inicial (Tela cheia se não tiver chats e estiver carregando)
  if (isLoading && chats.length === 0) {
    return (
      <SafeAreaView className="flex-1 bg-white justify-center items-center">
        <ActivityIndicator size="large" color="#370e38" />
        <Text className="text-gray-500 mt-2">Carregando conversas...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Header />

      <FlatList
        data={chats}
        showsVerticalScrollIndicator={false}
        // Passa o item direto. Certifique-se que o ConversationComponent aceita o tipo do Context
        renderItem={({ item }) => (
          <ConversationComponent item={item} chatId={item.id} />
        )}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={() => (
          <View className="h-px bg-gray-200 ml-20 my-1" />
        )}
        // 3. Adicionando funcionalidade de Pull-to-Refresh
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={refreshChats}
            colors={["#370e38"]} // Cor do loading no Android
            tintColor="#370e38" // Cor do loading no iOS
          />
        }
        // 4. Tratamento para lista vazia
        ListEmptyComponent={() => (
          <View className="flex-1 justify-center items-center mt-20 p-5">
            <Ionicons name="chatbubbles-outline" size={50} color="#ccc" />
            <Text className="text-gray-400 text-center mt-2">
              Nenhuma conversa iniciada ainda.
            </Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

// O Header permanece igual (Stateless)
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
