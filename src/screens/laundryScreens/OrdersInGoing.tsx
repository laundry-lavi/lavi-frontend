import React from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { BackArrow, NotificationBtn } from "@/components";
import { NavigationProp, useNavigation } from "@react-navigation/native";

// --- Dados Mock para a lista de pedidos ---
const mockOrders = [
  {
    id: 1,
    customerName: "Adriana Santiata Barreto",
    totalPieces: 12,
    services: ["Lavar e passar"],
    machine: "Máquina A2 - 08 Brastemp",
  },
  {
    id: 2,
    customerName: "Melissa Somally Yuo-ho",
    totalPieces: 12,
    services: ["Lavar e passar", "Lavagem a seco"],
    machine: "Máquina A2 - 11 Philco",
  },
  {
    id: 3,
    customerName: "Alexandre Ramos Ramasy",
    totalPieces: 12,
    services: ["Lavar e passar"],
    machine: "Máquina A1 - 02 Brastemp",
  },
  {
    id: 4,
    customerName: "Alexandre Ramos Ramasy",
    totalPieces: 12,
    services: ["Lavar e passar", "Lavagem a seco"],
    machine: "Máquina A1 - 02 Brastemp",
  },
];

// --- Componente para o Card de Pedido em Andamento ---
interface OrderCardProps {
  customerName: string;
  totalPieces: number;
  services: string[];
  machine: string;
}

function InProgressOrderCard({
  customerName,
  totalPieces,
  services,
  machine,
}: OrderCardProps) {
  const navigation = useNavigation<NavigationProp<any>>();

  return (
    <View className="bg-white rounded-lg p-4 mb-4 shadow-sm border border-gray-100">
      {/* Linha Superior: Nome e Total de Peças */}
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-base font-bold text-gray-800">
          {customerName}
        </Text>
        <Text className="text-xs text-gray-400">
          Total de peças: {totalPieces}
        </Text>
      </View>

      {/* Tags de Serviço */}
      <View className="flex-row flex-wrap my-1">
        {services.map((service, index) => (
          <View
            key={index}
            className="bg-purple-100 self-start px-2 py-1 rounded-md mr-2 mb-1"
          >
            <Text className="text-purple-700 text-xs font-semibold">
              {service}
            </Text>
          </View>
        ))}
      </View>

      {/* Informação da Máquina */}
      <Text className="text-sm text-gray-500 my-2">{machine}</Text>

      {/* Ações */}
      <View className="flex-row justify-end items-center border-t border-gray-100 pt-3 mt-2">
        <TouchableOpacity className="p-1">
          <Ionicons
            name="chatbubble-ellipses-outline"
            size={24}
            color="#4b5563"
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("OrderDetails")}
          className="bg-gray-800 px-3 py-2 rounded-md ml-2"
        >
          <Text className="text-white text-xs font-bold">Mostrar Tarefa</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// --- Componente Principal da Tela ---
export default function InProgressOrdersScreen() {
  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <BackArrow />
      <View className="bg-[#2c003d] p-4 pt-6 pl-32 flex-row items-center justify-between">
        <View className="items-center">
          <Text className="text-white text-xl font-bold">
            Pedidos em Andamento
          </Text>
          <Text className="text-gray-300 text-sm">registrados</Text>
        </View>

        <NotificationBtn color="white" />
      </View>

      {/* Filtro */}
      <View className="px-4 py-3 flex-row items-center">
        <View className="bg-[#2c003d] px-4 py-2 rounded-lg flex-row items-center">
          <Text className="text-white font-bold mr-2">Máquinas ocupadas</Text>
        </View>
      </View>

      {/* Lista de Pedidos */}
      <ScrollView contentContainerStyle={{ paddingHorizontal: 16 }}>
        {mockOrders.map((order) => (
          <InProgressOrderCard
            key={order.id}
            customerName={order.customerName}
            totalPieces={order.totalPieces}
            services={order.services}
            machine={order.machine}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
