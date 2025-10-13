import React from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  FlatList,
} from "react-native";
import { NavigationProp, useNavigation } from "@react-navigation/native";

import { BackArrow, NotificationBtn } from "@/components";

import Ionicons from "@expo/vector-icons/Ionicons";

interface OrderCardProps {
  customerName: string;
  time: string;
  serviceType: string;
  deliveryDate: string;
}

function OrderCard({
  customerName,
  time,
  serviceType,
  deliveryDate,
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
          onPress={() => navigation.navigate("OrderDetails")}
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

// --- Componente para a Seção de Pedidos ---
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
    {/* <FlatList
      horizontal={true}
      showsHorizontalScrollIndicator={false}
      className="flex-row flex-wrap justify-between"
      data={children ? React.Children.toArray(children) : []}
      renderItem={({ item }) => <View className="w-[48%]">{item}</View>}
      keyExtractor={(item) => Math.random().toString()}
    /> */}
  </View>
);

// --- Componente Principal da Tela ---
export default function RegisteredOrdersScreen() {
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
          <OrderCard
            customerName="Adriana Santiata Barreto"
            time="16h-00m"
            serviceType="Lavar e passar"
            deliveryDate="Entregar 17 de Maio"
          />
          <OrderCard
            customerName="Charlie White Tom"
            time="18h-30m"
            serviceType="Lavar e passar"
            deliveryDate="Entregar 17 de Maio"
          />
          <OrderCard
            customerName="Charlie White Tom"
            time="18h-30m"
            serviceType="Lavar e passar"
            deliveryDate="Entregar 17 de Maio"
          />
          <OrderCard
            customerName="Charlie White Tom"
            time="18h-30m"
            serviceType="Lavar e passar"
            deliveryDate="Entregar 17 de Maio"
          />
        </OrderSection>

        {/* Seção Pedidos dessa Semana */}
        <OrderSection title="Pedidos dessa Semana">
          <OrderCard
            customerName="Adriana Santiata Barreto"
            time="16h-00m"
            serviceType="Lavar e passar"
            deliveryDate="Entregar 18 de Maio"
          />
          <OrderCard
            customerName="Charlie White Tom"
            time="12h-00m"
            serviceType="Lavar e passar"
            deliveryDate="Entregar 20 de Maio"
          />
        </OrderSection>

        {/* Seção Pedidos Futuros */}
        <OrderSection title="Pedidos futuros">
          <OrderCard
            customerName="Adriana Santiata Barreto"
            time="09h-00m"
            serviceType="Lavar e passar"
            deliveryDate="Entregar 02 de Junho"
          />
          <OrderCard
            customerName="Charlie White Tom"
            time="15h-00m"
            serviceType="Lavar e passar"
            deliveryDate="Entregar 02 de Junho"
          />
        </OrderSection>
      </ScrollView>
    </SafeAreaView>
  );
}
