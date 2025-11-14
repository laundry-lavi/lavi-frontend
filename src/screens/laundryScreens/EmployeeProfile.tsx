import React, { useContext } from "react";
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
import { NavigationProp, useNavigation } from "@react-navigation/native";

import { OwnerContext } from "@/contexts";

// --- Componente Reutilizável para os Campos de Informação ---
interface InfoFieldProps {
  label: string;
  value: string;
  iconName?: keyof typeof Ionicons.glyphMap; // Permite passar qualquer nome de ícone do Ionicons
  isPassword?: boolean;
}

const InfoField = ({
  label,
  value,
  iconName,
  isPassword = false,
}: InfoFieldProps) => (
  <View className="mb-4">
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
export default function EmployeeProfileScreen() {
  const navigation = useNavigation<NavigationProp<any>>();
  const { ownerData } = useContext(OwnerContext);

  return (
    <SafeAreaView className="flex-1 bg-slate-100">
      <ImageBackground
        className="w-full h-full p-3 pt-20"
        source={require("assets/bubble-bg.png")}
      >
        <ScrollView
          contentContainerStyle={{
            padding: 20,
            justifyContent: "center",
            flexGrow: 1,
          }}
        >
          {/* Card Principal */}
          <View className="bg-white rounded-2xl p-6 shadow-lg relative">
            {/* Botão de Configurações */}
            <TouchableOpacity
              onPress={() => navigation.navigate("SettingsScreen")}
              className="absolute top-4 right-4 bg-gray-100 p-2 rounded-full"
            >
              <Ionicons name="settings-outline" size={24} color="#333" />
            </TouchableOpacity>

            {/* Avatar */}
            <View className="items-center -mt-20">
              <View className="w-32 h-32 rounded-full bg-purple-200 justify-center items-center">
                <Image
                  source={{
                    uri: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
                  }}
                  className="w-28 h-28 rounded-full border-4 border-white"
                />
              </View>
            </View>

            {/* Nome e Cargo */}
            <View className="items-center mt-4 mb-8">
              <Text className="text-2xl font-bold text-gray-800">
                Adriana de Souza Guimarães
              </Text>
              <Text className="text-base text-gray-500 mt-1">Funcionária</Text>
            </View>

            {/* Campos de Informação */}
            <InfoField label="Email" value="guimaraes.adriana@gmail.com" />
            <InfoField
              label="Lavanderia correspondente"
              value="Lavanderia Lave-Bem"
            />
            <InfoField label="Unidade" value="Unidade Zona Sul - São Paulo" />
            <InfoField
              label="Código de Acesso"
              value="234578LB"
              iconName="at-outline"
            />
            <InfoField
              label="Senha de Acesso"
              value=""
              iconName="eye-outline"
              isPassword={true}
            />

            {/* Botão de Ação */}
            <TouchableOpacity className="bg-[#2c003d] w-full py-4 rounded-lg mt-6">
              <Text className="text-white text-center text-base font-bold">
                Ir para a Área de trabalho
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
}
