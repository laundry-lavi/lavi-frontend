import React, { useMemo } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import {
  NavigationProp,
  useNavigation,
  useRoute,
  RouteProp,
} from "@react-navigation/native";

import { BackArrow, NotificationBtn } from "@/components";
import Ionicons from "@expo/vector-icons/Ionicons";
import { CompletedOrderType } from "@/types"; // Importe seu tipo

// --- Interface para os parâmetros da rota ---
type ScreenRouteProp = RouteProp<
  { params: { orders: CompletedOrderType[] } },
  "params"
>;

// --- COMPONENTES (sem alteração na lógica interna) ---

interface OrderCardProps {
  customerName: string;
  time: string;
  serviceType: string;
  deliveryDate: string;
  orderId: string; // Adicionado para navegação
}

function OrderCard({
  customerName,
  time,
  serviceType,
  deliveryDate,
  orderId,
}: OrderCardProps) {
  const navigation = useNavigation<NavigationProp<any>>();

  return (
    <View className="w-[65vw] bg-white border border-gray-100 rounded-lg p-3 mb-4 shadow-sm">
      <View className="flex-row justify-between items-start">
        <Text className="text-sm font-bold text-gray-800 w-3/5">
          {customerName}
        </Text>
        <Text className="text-xs text-gray-400">{time}</Text>
      </View>

      <View className="my-3">
        <View className="bg-purple-100 self-start px-2 py-1 rounded-md">
          <Text className="text-purple-700 text-xs font-semibold">
            {serviceType}
          </Text>
        </View>
      </View>

      <Text className="text-sm text-gray-500 mb-4">{deliveryDate}</Text>

      <View className="flex-row-reverse gap-2 items-center border-t border-gray-100 pt-2">
        <TouchableOpacity
          // Passa o ID do pedido para a tela de detalhes
          onPress={() =>
            navigation.navigate("OrderDetails", { orderId: orderId })
          }
          className="bg-gray-800 px-3 py-2 rounded-md"
        >
          <Text className="text-white text-xs font-bold">Mostrar Tarefa</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons
            name="chatbubble-ellipses-outline"
            size={24}
            color="#4b5563"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const OrderSection = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <View className="m-2">
    <View className="flex-row items-center mb-4">
      <View className="bg-[#2c003d] px-4 py-2 rounded-lg">
        <Text className="text-white font-bold">{title}</Text>
      </View>
      <Ionicons name="time-outline" size={24} color="#555" className="ml-2" />
    </View>
    <ScrollView
      className="p-3"
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ gap: 12 }}
    >
      {children}
    </ScrollView>
  </View>
);

// --- COMPONENTE PRINCIPAL DA TELA (com a nova lógica) ---
export default function RegisteredOrdersScreen() {
  const route = useRoute<ScreenRouteProp>();
  // Pega os pedidos passados via parâmetro ou usa um array vazio como fallback
  const orders = route.params?.orders || [];

  // Hook `useMemo` para categorizar os pedidos de forma eficiente
  const categorizedOrders = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Zera o tempo para comparar apenas o dia

    const endOfWeek = new Date(today);
    endOfWeek.setDate(today.getDate() + 7); // Define o limite da semana

    const todayOrders: CompletedOrderType[] = [];
    const weekOrders: CompletedOrderType[] = [];
    const futureOrders: CompletedOrderType[] = [];

    orders.forEach((order) => {
      // !! IMPORTANTE !!
      // Substitua `order.created_at` pelo campo de data de entrega do seu pedido!
      if (!order.close_at) return;

      const orderDate = new Date(order.close_at);
      orderDate.setHours(0, 0, 0, 0);

      if (orderDate.getTime() === today.getTime()) {
        todayOrders.push(order);
      } else if (orderDate > today && orderDate <= endOfWeek) {
        weekOrders.push(order);
      } else if (orderDate > endOfWeek) {
        futureOrders.push(order);
      }
    });

    return { todayOrders, weekOrders, futureOrders };
  }, [orders]); // Recalcula apenas se a lista de 'orders' mudar

  // Função auxiliar para renderizar uma seção de pedidos ou uma mensagem de 'vazio'
  const renderOrderList = (
    orderList: CompletedOrderType[],
    emptyMessage: string
  ) => {
    if (orderList.length === 0) {
      return <Text className="text-gray-500 ml-4">{emptyMessage}</Text>;
    }

    return orderList.map((order) => {
      // Formata a data e hora para exibição
      const orderDate = new Date(order.created_at || 0);
      const time =
        orderDate
          .toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
          .replace(":", "h-") + "m";
      const deliveryDate = `Entregar ${orderDate.toLocaleDateString("pt-BR", { day: "2-digit", month: "long" })}`;

      return (
        <OrderCard
          key={order.id}
          orderId={order.id || ""}
          // !! IMPORTANTE !! Substitua pelos dados reais do cliente
          customerName={`Cliente ID: ${order.customerId.substring(0, 8)}...`}
          time={time}
          // Pega o serviço do primeiro item como exemplo
          serviceType={order.items[0]?.service || "Não especificado"}
          deliveryDate={deliveryDate}
        />
      );
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <BackArrow />
      <View className="bg-[#2c003d] p-4 flex-row items-center justify-between">
        <View className="items-center ml-[40%]">
          <Text className="text-white text-xl font-bold">Pedidos</Text>
          <Text className="text-gray-300 text-sm">registrados</Text>
        </View>
        <NotificationBtn color="white" />
      </View>

      <ScrollView>
        {/* Seção Pedidos de Hoje */}
        <OrderSection title="Pedidos de Hoje">
          {renderOrderList(
            categorizedOrders.todayOrders,
            "Nenhum pedido para hoje."
          )}
        </OrderSection>

        {/* Seção Pedidos dessa Semana */}
        <OrderSection title="Pedidos dessa Semana">
          {renderOrderList(
            categorizedOrders.weekOrders,
            "Nenhum pedido para esta semana."
          )}
        </OrderSection>

        {/* Seção Pedidos Futuros */}
        <OrderSection title="Pedidos futuros">
          {renderOrderList(
            categorizedOrders.futureOrders,
            "Nenhum pedido futuro registrado."
          )}
        </OrderSection>
      </ScrollView>
    </SafeAreaView>
  );
}
