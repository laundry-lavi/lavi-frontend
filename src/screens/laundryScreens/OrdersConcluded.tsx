import React, { useMemo } from "react";
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
  useRoute,
  RouteProp,
  useNavigation,
  NavigationProp,
} from "@react-navigation/native";
import { CompletedOrderType } from "@/types"; // 1. Importar o tipo

// --- Interface para os parâmetros da rota ---
type ScreenRouteProp = RouteProp<
  { params: { orders: CompletedOrderType[] } },
  "params"
>;

interface CardProps {
  order: CompletedOrderType;
}

const CompletedOrderCard = ({ order }: CardProps) => {
  const navigation = useNavigation<NavigationProp<any>>();

  // Formata os dados para exibição
  const timestamp = new Date(order.created_at || 0).toLocaleTimeString(
    "pt-BR",
    {
      hour: "2-digit",
      minute: "2-digit",
    }
  );
  const shippingMethod =
    order.delivery_type === "delivery"
      ? "Entrega a domicílio"
      : "Buscar no local";
  const totalValue = ((order.total_inCents || 0) / 100)
    .toFixed(2)
    .replace(".", ",");
  // O status de pagamento deve vir da API, aqui usamos um placeholder
  const paymentStatus = "Pago";

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate("OrderDetails", { order: order })}
      className="w-[65vw] bg-white border border-gray-100 rounded-lg p-3 mb-4 shadow-sm"
    >
      <View className="flex-row justify-between items-start mb-2">
        <Text className="text-sm font-bold text-gray-800 w-[70%]">
          Cliente ID: {order.customerId.substring(0, 8)}...
        </Text>
        <Text className="text-xs text-gray-400">{timestamp}</Text>
      </View>

      <View className="bg-purple-100 p-2 rounded-md my-2">
        <Text className="text-xs text-gray-600">
          Formato de envio: {shippingMethod}
        </Text>
        <Text className="text-sm font-bold text-gray-800">
          Valor Total: R$ {totalValue}
        </Text>
      </View>

      <View className="flex-row justify-end items-center gap-3 border-t border-gray-100 pt-2 mt-2 space-x-2">
        <TouchableOpacity>
          <Ionicons name="receipt-outline" size={20} color="#4b5563" />
        </TouchableOpacity>

        <View className="bg-[#2c003d] px-2 py-2 rounded-md flex-1 items-center">
          <Text className="text-white text-[10px] font-bold">
            {paymentStatus}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const OrderSection = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <View className="mb-6">
    <View className="flex-row items-center mb-4">
      <View className="bg-[#2c003d] px-4 py-2 rounded-lg">
        <Text className="text-white font-bold">{title}</Text>
      </View>
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

export default function CompletedOrdersScreen() {
  const route = useRoute<ScreenRouteProp>();
  // 2. Pega os pedidos da rota
  const orders = route.params?.orders || [];

  // 3. Reutiliza a mesma lógica de categorização por data
  const categorizedOrders = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const endOfWeek = new Date(today);
    endOfWeek.setDate(today.getDate() + 7);

    const todayOrders: CompletedOrderType[] = [];
    const weekOrders: CompletedOrderType[] = [];
    const pastOrders: CompletedOrderType[] = [];

    orders.forEach((order) => {
      if (!order.close_at) return;
      const orderDate = new Date(order.close_at);
      orderDate.setHours(0, 0, 0, 0);

      if (orderDate.getTime() === today.getTime()) {
        todayOrders.push(order);
      } else if (orderDate < today && orderDate > endOfWeek) {
        weekOrders.push(order);
      } else {
        pastOrders.push(order);
      }
    });

    return { todayOrders, weekOrders, pastOrders };
  }, [orders]);

  // 4. Função auxiliar para renderizar a lista ou a mensagem de vazio
  const renderOrderList = (
    orderList: CompletedOrderType[],
    emptyMessage: string
  ) => {
    if (orderList.length === 0) {
      return <Text className="text-gray-500 ml-4">{emptyMessage}</Text>;
    }
    return orderList.map((order) => (
      <CompletedOrderCard key={order.id} order={order} />
    ));
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <StatusBar barStyle="light-content" />

      <BackArrow size={32} />
      <View className="bg-[#2c003d] p-4 pt-6 pl-32 flex-row items-center justify-between">
        <View className="items-center">
          <Text className="text-white text-xl font-bold">
            Pedidos Concluídos
          </Text>
        </View>
        <NotificationBtn color="white" />
      </View>

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {/* 5. Renderização dinâmica das seções */}
        <OrderSection title="Concluídos Hoje">
          {renderOrderList(
            categorizedOrders.todayOrders,
            "Nenhum pedido concluído hoje."
          )}
        </OrderSection>

        <OrderSection title="Concluídos essa Semana">
          {renderOrderList(
            categorizedOrders.weekOrders,
            "Nenhum pedido concluído nesta semana."
          )}
        </OrderSection>

        <OrderSection title="Concluídos Anteriormente">
          {renderOrderList(
            categorizedOrders.pastOrders,
            "Nenhum pedido antigo encontrado."
          )}
        </OrderSection>
      </ScrollView>
    </SafeAreaView>
  );
}
