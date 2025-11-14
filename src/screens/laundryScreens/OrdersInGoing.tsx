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
import {
  NavigationProp,
  useNavigation,
  useRoute,
  RouteProp,
} from "@react-navigation/native";
import { CompletedOrderType } from "@/types"; // 1. Importar o tipo

// --- Interface para os parâmetros da rota ---
type ScreenRouteProp = RouteProp<
  { params: { orders: CompletedOrderType[] } },
  "params"
>;

// --- Componente para o Card de Pedido em Andamento ---
interface OrderCardProps {
  order: CompletedOrderType; // Passa o objeto inteiro para facilitar a navegação
}

function InProgressOrderCard({ order }: OrderCardProps) {
  const navigation = useNavigation<NavigationProp<any>>();

  // Calcula o total de peças a partir dos itens do pedido
  const totalPieces = order.items.items.reduce(
    (acc, item) => acc + item.qntd,
    0
  );
  // Pega uma lista de serviços únicos
  const services = [...new Set(order.items.items.map((item) => item.service))];

  return (
    <View className="bg-white rounded-lg p-4 mb-4 shadow-sm border border-gray-100">
      <View className="flex-row justify-between items-center mb-2">
        {/* Usa o ID do cliente como nome temporário */}
        <Text className="text-base font-bold text-gray-800">
          Cliente ID: {order.customerId.substring(0, 8)}...
        </Text>
        <Text className="text-xs text-gray-400">
          Total de peças: {totalPieces}
        </Text>
      </View>

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

      {/* A informação da máquina não vem da API, então usamos um placeholder */}
      <Text className="text-sm text-gray-500 my-2">
        Máquina não especificada
      </Text>

      <View className="flex-row justify-end items-center border-t border-gray-100 pt-3 mt-2">
        <TouchableOpacity className="p-1">
          <Ionicons
            name="chatbubble-ellipses-outline"
            size={24}
            color="#4b5563"
          />
        </TouchableOpacity>
        <TouchableOpacity
          // Navega para detalhes passando o objeto completo do pedido
          onPress={() => navigation.navigate("OrderDetails", { order: order })}
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
  const route = useRoute<ScreenRouteProp>();
  // 2. Pega os pedidos dos parâmetros da rota
  const orders = route.params?.orders || [];

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

      <View className="px-4 py-3 flex-row items-center">
        <View className="bg-[#2c003d] px-4 py-2 rounded-lg flex-row items-center">
          <Text className="text-white font-bold mr-2">Máquinas ocupadas</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 16 }}>
        {/* 3. Renderização dinâmica */}
        {orders.length > 0 ? (
          orders.map((order) => (
            <InProgressOrderCard key={order.id} order={order} />
          ))
        ) : (
          // 4. Mensagem para quando não houver pedidos
          <View className="mt-10 items-center">
            <Text className="text-gray-500">
              Nenhum pedido em andamento no momento.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
