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
import { NavigationProp, useNavigation } from "@react-navigation/native";

import { BackArrow, NotificationBtn } from "@/components";

interface CardProps {
  customerName: string;
  timestamp: string;
  shippingMethod: string;
  totalValue: string;
  paymentStatus: "Aguardando Pagamento" | "Pago";
  showDeleteIcon?: boolean;
}

const CompletedOrderCard = ({
  customerName,
  timestamp,
  shippingMethod,
  totalValue,
  paymentStatus,
  showDeleteIcon = false,
}: CardProps) => (
  <View className="w-[55vw] bg-white border border-gray-100 rounded-lg p-3 mb-4 shadow-sm">
    {/* Topo: Nome e Timestamp */}
    <View className="flex-row justify-between items-start mb-2">
      <Text className="text-sm font-bold text-gray-800 w-[70%]">
        {customerName.length > 21
          ? customerName.slice(0, 21) + "..."
          : customerName}
      </Text>
      <Text className="text-xs text-gray-400">{timestamp}</Text>
    </View>

    {/* Bloco de Informações */}
    <View className="bg-purple-100 p-2 rounded-md my-2">
      <Text className="text-xs text-gray-600">
        Formato de envio: {shippingMethod}
      </Text>
      <Text className="text-sm font-bold text-gray-800">
        Valor Total: R$ {totalValue}
      </Text>
    </View>

    {/* Ações */}
    <View className="flex-row justify-end items-center gap-3 border-t border-gray-100 pt-2 mt-2 space-x-2">
      {showDeleteIcon && (
        <TouchableOpacity>
          <Ionicons name="trash-outline" size={20} color="#4b5563" />
        </TouchableOpacity>
      )}
      <TouchableOpacity>
        {/* Usando ícones diferentes com base no status para replicar a imagem */}
        {paymentStatus === "Aguardando Pagamento" ? (
          <Ionicons
            name="chatbubble-ellipses-outline"
            size={20}
            color="#4b5563"
          />
        ) : (
          <Ionicons name="receipt-outline" size={20} color="#4b5563" />
        )}
      </TouchableOpacity>

      <TouchableOpacity className="bg-[#2c003d] px-2 py-2 rounded-md flex-1 items-center">
        <Text className="text-white text-[10px] font-bold">
          {paymentStatus}
        </Text>
      </TouchableOpacity>
    </View>
  </View>
);

// --- Componente para a Seção de Pedidos ---
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

// --- Componente Principal da Tela ---
export default function CompletedOrdersScreen() {
  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View className="bg-[#2c003d] p-4 pt-6 flex-row items-center justify-between">
        <TouchableOpacity className="bg-white p-2 rounded-full">
          <Ionicons name="arrow-back" size={24} color="#2c003d" />
        </TouchableOpacity>
        <View className="items-center">
          <Text className="text-white text-xl font-bold">
            Pedidos Concluídos
          </Text>
          <Text className="text-gray-300 text-sm">registrados</Text>
        </View>
        <TouchableOpacity className="bg-white p-2 rounded-full relative">
          <Ionicons name="notifications" size={24} color="#2c003d" />
          <View className="absolute right-1 top-1 w-2.5 h-2.5 bg-red-500 rounded-full border border-white" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {/* Seção Concluídos Hoje */}
        <OrderSection title="Concluídos Hoje">
          <CompletedOrderCard
            customerName="Adriana Santiata Barreto"
            timestamp="às 10h-50m"
            shippingMethod="Entrega a domicílio"
            totalValue="20,90"
            paymentStatus="Aguardando Pagamento"
          />
          <CompletedOrderCard
            customerName="Charles White Pen"
            timestamp="às 12h-30m"
            shippingMethod="Entrega a domicílio"
            totalValue="20,90"
            paymentStatus="Pago" // Exemplo de status diferente
          />
        </OrderSection>

        {/* Seção Concluídos essa Semana */}
        <OrderSection title="Concluídos essa Semana">
          <CompletedOrderCard
            customerName="Emma Frost Stark"
            timestamp="Ontem"
            shippingMethod="Entrega a domicílio"
            totalValue="211,90"
            paymentStatus="Aguardando Pagamento"
            showDeleteIcon={true}
          />
          <CompletedOrderCard
            customerName="Emily Silveiro Pita"
            timestamp="Ontem"
            shippingMethod="Entrega a domicílio"
            totalValue="12,90"
            paymentStatus="Pago"
            showDeleteIcon={true}
          />
        </OrderSection>

        {/* Seção Pedidos Futuros (conforme imagem) */}
        <OrderSection title="Pedidos futuros">
          <CompletedOrderCard
            customerName="Emma Frost Stark"
            timestamp="12 de Maio"
            shippingMethod="Entrega a domicílio"
            totalValue="211,90"
            paymentStatus="Aguardando Pagamento"
            showDeleteIcon={true}
          />
          <CompletedOrderCard
            customerName="Emily Silveiro Pita"
            timestamp="13 de Maio"
            shippingMethod="Entrega a domicílio"
            totalValue="12,90"
            paymentStatus="Pago"
            showDeleteIcon={true}
          />
        </OrderSection>
      </ScrollView>
    </SafeAreaView>
  );
}
