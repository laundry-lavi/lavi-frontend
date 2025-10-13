// LaundryProfileScreen.tsx
import React from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
  ImageBackground,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

// --- Componente Reutilizável para os Campos de Informação ---
interface InfoFieldProps {
  label: string;
  value: string;
  iconName?: keyof typeof Ionicons.glyphMap;
  isPassword?: boolean;
  width?: string; // Para campos de largura parcial
}

const InfoField = ({
  label,
  value,
  iconName,
  isPassword = false,
  width = "w-full",
}: InfoFieldProps) => (
  <View className={`mb-4 ${width}`}>
    <Text className="text-sm font-semibold text-gray-600 mb-1 ml-1">
      {label}
    </Text>
    <View className="flex-row items-center justify-between bg-white border border-gray-200 rounded-lg px-3 py-3">
      <Text
        className={`text-base ${isPassword ? "font-bold" : "text-gray-700"}`}
      >
        {isPassword ? "••••••••" : value}
      </Text>
      {iconName && (
        <TouchableOpacity>
          <Ionicons name={iconName} size={20} color="#9ca3af" />
        </TouchableOpacity>
      )}
    </View>
  </View>
);

// --- Componente Principal da Tela ---
export default function LaundryProfileScreen() {
  return (
    <SafeAreaView className="flex-1 bg-slate-100">
      <ImageBackground
        className="w-full h-full p-3 pt-20"
        source={require("assets/bubble-bg.png")}
      >
        <ScrollView>
          {/* Ícone da Câmera */}
          <View className="bg-white/80 p-4 rounded-full">
            <Ionicons name="camera-outline" size={32} color="#333" />
          </View>

          {/* Avatares dos Funcionários */}
          <View className="absolute top-4 left-4 flex-row">
            {[
              "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg",
              "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg",
              "https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg",
            ].map((uri, index) => (
              <Image
                key={index}
                source={{ uri }}
                className={`w-10 h-10 rounded-full border-2 border-white ${index > 0 ? "-ml-3" : ""}`}
              />
            ))}
          </View>

          {/* Conteúdo Principal */}
          <View className="bg-white p-6 mt-20 mx-4 rounded-2xl shadow-md">
            {/* Título e Configurações */}
            <View className="flex-row justify-between items-center mb-6">
              <View>
                <Text className="text-2xl font-bold text-gray-800">
                  Lavanderia Lava-bem
                </Text>
                <Text className="text-base text-gray-500">
                  Unidade Zona Sul
                </Text>
              </View>
              <TouchableOpacity className="bg-gray-100 p-2 rounded-full">
                <Ionicons name="settings-outline" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            {/* Formulário */}
            <InfoField label="Email" value="lavanderia.lavebem@gmail.com" />

            <View className="flex-row justify-between">
              <InfoField
                label="Código de Acesso"
                value="234578LB"
                iconName="at-outline"
                width="w-[48%]"
              />
              <InfoField
                label="Senha de acesso"
                value=""
                iconName="eye-outline"
                isPassword={true}
                width="w-[48%]"
              />
            </View>

            <InfoField
              label="Localização"
              value="R. 20 de Setembro, 700-Sala 12-Bela Vista, Teresina-PI..."
            />
            <InfoField label="Telefone" value="+55 11 98765-4320" />

            <View className="flex-row justify-between">
              <InfoField label="Abre às:" value="12:00 p.m" width="w-[48%]" />
              <InfoField label="Fecha às:" value="7:00 a.m" width="w-[48%]" />
            </View>
          </View>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
}
