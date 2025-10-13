import React from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Appearance,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function SettingsScreen() {
  const toggleTheme = () => {
    Appearance.setColorScheme(
      Appearance.getColorScheme() === "dark" ? "light" : "dark"
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="bg-[#2c003d] p-5 pt-8">
        <View className="flex-row items-center">
          <View className="bg-white p-3 rounded-full mr-4">
            <Ionicons name="settings-sharp" size={24} color="#2c003d" />
          </View>
          <View>
            <Text className="text-white text-2xl font-bold">Configurações</Text>
            <Text className="text-gray-300 text-sm">Opções de ajuste</Text>
          </View>
        </View>
      </View>

      <View className="p-5">
        <TouchableOpacity className="py-4">
          <Text className="text-gray-700 text-base">Dados do perfil</Text>
        </TouchableOpacity>

        <TouchableOpacity className="py-4 border-t border-gray-100">
          <Text className="text-gray-700 text-base">Notificações</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={toggleTheme}
          className="py-4 border-t border-gray-100"
        >
          <Text className="text-gray-700 text-base">Tema do App</Text>
        </TouchableOpacity>

        <TouchableOpacity className="py-4 border-t border-gray-100">
          <Text className="text-red-500 text-base font-semibold">Sair</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
