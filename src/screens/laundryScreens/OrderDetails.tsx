import React, { useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Image,
} from "react-native";
import { NavigationProp, useNavigation } from "@react-navigation/native";

import { BackArrow } from "@/components";

import Ionicons from "@expo/vector-icons/Ionicons";

const OrderItemRow = ({
  quantity,
  name,
  price,
}: {
  quantity: number;
  name: string;
  price: string;
}) => (
  <View className="flex-row justify-between items-center py-2">
    <Text className="text-sm text-gray-600">
      {quantity} {name}
    </Text>
    <Text className="text-sm text-gray-800 font-semibold">
      {quantity}x - {price}
    </Text>
  </View>
);

// --- Componente para o botão de rádio customizado ---
const RadioButton = ({ selected }: { selected: boolean }) => (
  <View
    className={`w-5 h-5 rounded-full border-2 ${selected ? "border-purple-700" : "border-gray-400"} items-center justify-center`}
  >
    {selected && <View className="w-2.5 h-2.5 rounded-full bg-purple-700" />}
  </View>
);

// --- Componente Principal da Tela ---
export default function OrderDetailsScreen() {
  const [washType, setWashType] = useState("washAndIron");
  const [deliveryType, setDeliveryType] = useState("homeDelivery");

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="bg-[#2c003d] p-4 pt-6 pb-6 pl-0 rounded-b-2xl">
        <View className="flex-row items-center justify-between">
          <BackArrow />

          <View className="flex-1 ml-20">
            <Text className="text-white text-2xl font-bold">Romeiro Brito</Text>
            <Text className="text-gray-300 text-sm">
              Pedido feito: 08/08 às 14h27
            </Text>
            <Text className="text-gray-300 text-sm">
              Para entrega: 09/08 até às 16h
            </Text>
          </View>

          <Image
            source={{ uri: "https://i.pravatar.cc/150?u=a042581f4e29026704d" }} // Imagem de avatar placeholder
            className="w-16 h-16 rounded-full border-2 border-white"
          />
        </View>
      </View>

      <ScrollView contentContainerStyle={{ padding: 10 }}>
        {/* Tipo de Lavagem */}
        <View className="mb-6">
          <Text className="text-base font-bold text-gray-800 mb-3">
            Tipo de Lavagem:
          </Text>
          <View className="flex-row gap-3">
            <TouchableOpacity
              className={`px-4 py-2 rounded-lg ${washType === "washAndIron" ? "bg-[#2c003d]" : "bg-gray-200"}`}
              onPress={() => setWashType("washAndIron")}
            >
              <Text
                className={`${washType === "washAndIron" ? "text-white" : "text-gray-700"} font-semibold`}
              >
                Lavar e passar
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`px-4 py-2 rounded-lg ${washType === "dryClean" ? "bg-[#2c003d]" : "bg-gray-200"}`}
              onPress={() => setWashType("dryClean")}
            >
              <Text
                className={`${washType === "dryClean" ? "text-white" : "text-gray-700"} font-semibold`}
              >
                Lavagem à seco
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Opções de Entrega */}
        <View className="flex-row justify-between mb-6">
          <TouchableOpacity
            className={`w-[48%] p-3 rounded-lg border-2 ${deliveryType === "homeDelivery" ? "border-purple-700 bg-purple-100" : "border-gray-300"}`}
            onPress={() => setDeliveryType("homeDelivery")}
          >
            <View className="flex-row items-start">
              <View className="w-[91%]">
                <Text className="font-bold text-sm text-gray-800">
                  Entrega a Domicílio
                </Text>
                <Text className="text-xs text-gray-600 mt-1">
                  CEP: 08018-180
                </Text>
                <Text className="text-xs text-gray-600">
                  R. Das Flores, 123, São Paulo - SP
                </Text>
              </View>
              <RadioButton selected={deliveryType === "homeDelivery"} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            className={`w-[48%] p-3 rounded-lg border-2 ${deliveryType === "pickup" ? "border-purple-700 bg-purple-100" : "border-gray-300"} items-center justify-center`}
            onPress={() => setDeliveryType("pickup")}
          >
            <View className="flex-row justify-between items-start w-full">
              <Text className="font-bold text-gray-800">Buscar no local</Text>
              <RadioButton selected={deliveryType === "pickup"} />
            </View>
          </TouchableOpacity>
        </View>

        {/* Lista de Itens */}
        <View className="bg-gray-50 p-4 rounded-lg mb-6">
          <OrderItemRow quantity={4} name="Camisas" price="24,90" />
          <OrderItemRow quantity={3} name="Calças" price="24,90" />
          <OrderItemRow quantity={2} name="Pares de meias" price="24,90" />
          <OrderItemRow quantity={7} name="Calcinhas" price="24,90" />
        </View>

        {/* Sumário de Custos */}
        <View className="mb-8">
          <View className="flex-row justify-between py-1">
            <Text className="text-gray-500">Total de peças:</Text>
            <Text className="font-bold text-gray-800">16 Peças</Text>
          </View>
          <View className="flex-row justify-between py-1">
            <Text className="text-gray-500">Frete:</Text>
            <Text className="font-bold text-gray-800">R$ 15,00</Text>
          </View>
          <View className="bg-[#2c003d] p-3 rounded-lg flex-row justify-between mt-3">
            <Text className="text-white font-bold text-lg">Valor Total:</Text>
            <Text className="text-white font-bold text-lg">R$ 178,10</Text>
          </View>
        </View>

        {/* Botões de Ação */}
        <View className="flex-row items-center gap-2">
          <TouchableOpacity className="bg-gray-100 p-3 rounded-full">
            <Ionicons name="chatbubbles-outline" size={30} color="#2c003d" />
          </TouchableOpacity>
          <TouchableOpacity className="bg-purple-400 flex-1 py-4 rounded-lg items-center">
            <Text className="text-white text-base font-bold">
              Iniciar Lavagem
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
