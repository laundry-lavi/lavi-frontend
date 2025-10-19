import React, { useContext } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  ImageSourcePropType,
} from "react-native";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import PieChart, { Slice } from "react-native-pie-chart";

import Ionicons from "@expo/vector-icons/Ionicons";

import { NotificationBtn, BackArrow } from "@/components";
import { OwnerContext } from "@/contexts";

const bgImages = [
  require("assets/ordersImage.png"),
  require("assets/ordersInGoingImage.png"),
  require("assets/ordersConcludedImage.png"),
];

const chartData: Slice[] = [
  {
    value: 50,
    color: "#C5B4E3",
  },
  {
    value: 25,
    color: "#8A63D2",
  },
  {
    value: 25,
    color: "#5A3E9A",
  },
];

const legendData = [
  { name: "Dipirona 30mg", value: "10 / 30", color: "#C5B4E3" },
  { name: "Dipirona 30mg", value: "10 / 30", color: "#8A63D2" },
  { name: "Dipirona 30mg", value: "10 / 30", color: "#5A3E9A" },
];

// --- COMPONENTE ---
const LegendItem = ({ item }: { item: (typeof legendData)[0] }) => (
  <View className="flex-row items-center mb-2">
    <View
      style={{ backgroundColor: item.color }}
      className="w-4 h-4 rounded-full mr-3"
    />
    <View>
      <Text className="text-gray-700">{item.name}</Text>
      <Text className="text-gray-500 text-xs">{item.value}</Text>
    </View>
  </View>
);

// --- Componente da Tela Principal ---
export default function LaundryHomeScreen() {
  const navigation = useNavigation<NavigationProp<any>>();
  const rating = 4.2;
  const { ownerData } = useContext(OwnerContext);

  const OrderCard = ({
    imageUri,
    title,
    route,
  }: {
    imageUri: ImageSourcePropType;
    title: string;
    route: never;
  }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate(route)}
      className="w-[31%] h-36 rounded-lg overflow-hidden justify-end"
    >
      <ImageBackground source={imageUri} resizeMode="cover">
        <View className="bg-black/40 p-2 h-full justify-end">
          <View className="bg-purple-600/60 px-2 py-1 rounded-md flex-col items-center justify-between">
            <Text className="text-white font-bold text-sm">{title}</Text>
            <Text className="text-white font-bold text-sm">10</Text>
          </View>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <ScrollView>
        {/* Header */}
        <View className="flex-row-reverse p-4 items-center justify-between">
          <NotificationBtn />
          <View>
            <Text className="text-2xl font-bold text-gray-800">
              Olá, Lavanderia Lave-Bem
            </Text>
            <Text className="text-base text-gray-500">
              Este é seu espaço de trabalho!
            </Text>
          </View>
        </View>

        {/* Gerenciamento de Pedidos */}
        <View className="p-4">
          <Text className="text-lg font-bold text-gray-800 mb-3">
            Gerenciamento de Pedidos
          </Text>
          <View className="flex-row justify-between">
            <OrderCard
              title="Pedidos"
              imageUri={bgImages[0]}
              route="OrdersScreen"
            />
            <OrderCard
              title="Em andamento"
              imageUri={bgImages[1]}
              route="OrdersInGoing"
            />
            <OrderCard
              title="Concluídos"
              imageUri={bgImages[2]}
              route="OrdersConcluded"
            />
          </View>
        </View>

        {/* Status da Qualidade */}
        <View className="p-4">
          <Text className="text-lg font-bold text-gray-800 mb-3">
            Status da Qualidade
          </Text>
          <View className="bg-white p-4 rounded-lg shadow-sm flex-row items-center">
            {/* Lado Esquerdo: Gráfico */}
            <View className="flex-1 items-center">
              <View className="bg-purple-200 px-2 py-1 rounded-md mb-2">
                <Text className="text-purple-800 text-xs font-bold">
                  Gráfico de avaliações geral
                </Text>
              </View>
              <PieChart widthAndHeight={150} series={chartData} />
            </View>

            {/* Divisor Vertical */}
            <View className="w-px h-24 bg-gray-200 mx-2" />

            {/* Lado Direito: Avaliação */}
            <View className="flex-1 items-center">
              <View className="bg-purple-200 px-2 py-1 rounded-md mb-2">
                <Text className="text-purple-800 text-xs font-bold">
                  Avaliação Atual
                </Text>
              </View>
              <Text className="text-5xl font-bold text-gray-800">{rating}</Text>
              <View className="flex-row my-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Ionicons
                    key={star}
                    name={star <= rating ? "star" : "star-outline"}
                    size={20}
                    color="#facc15" // Cor amarela para estrelas
                  />
                ))}
              </View>
              <Text className="text-sm font-semibold text-gray-600">
                Alta Qualidade
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
