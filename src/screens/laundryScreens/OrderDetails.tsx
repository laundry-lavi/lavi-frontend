import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Image,
  Alert,
} from "react-native";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";

import { BackArrow } from "@/components";
import { CompletedOrderType } from "@/types";
import { blankPhoto } from "assets/blank-icon";

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
export default function OrderDetailsScreen({ route }: { route: any }) {
  const navigation = useNavigation();
  const [totalPieces, setTotalPieces] = useState(0);
  const [order, setOrder] = useState<CompletedOrderType>();

  useEffect(() => {
    const currentOrder = route.params.order;

    setOrder(currentOrder);

    const calculateTotalPieces = () => {
      if (currentOrder && currentOrder.items && currentOrder.items.items) {
        const total = currentOrder.items.items.reduce((sum, item) => {
          return sum + item.qntd;
        }, 0);

        setTotalPieces(total);
      }
    };

    calculateTotalPieces();
  }, [route.params.order]);

  function formatarData(dateString: string): string {
    // Cria um objeto Date a partir da string ISO
    const data = new Date(dateString);

    // Define as opções de formatação com o tipo Intl.DateTimeFormatOptions
    const options: Intl.DateTimeFormatOptions = {
      // Nota: O 'year' é solicitado para garantir que o formato 'pt-BR'
      // sempre inclua DD/MM, mesmo que não usemos o ano no final.
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "America/Sao_Paulo", // Converte para o fuso de Brasília (UTC-3)
    };

    // Cria o formatador regional (Português do Brasil)
    const formatador = new Intl.DateTimeFormat("pt-BR", options);

    // Define o tipo para o objeto de partes da data
    // Usamos Record<string, string> para manter simples
    type DatePartsMap = Record<string, string>;

    // Formata a data e extrai as partes usando 'reduce'
    const partes = formatador
      .formatToParts(data)
      .reduce((acc: DatePartsMap, part) => {
        // part.type pode ser 'day', 'month', 'year', 'hour', 'minute', 'literal', etc.
        // Armazenamos o valor de cada parte usando seu 'type' como chave
        acc[part.type] = part.value;
        return acc;
      }, {}); // O objeto inicial vazio é tipado por 'acc: DatePartsMap'

    // Monta a string no formato exato "DD/MM às HHhMM"
    return `${partes.day}/${partes.month} às ${partes.hour}h${partes.minute}`;
  }

  async function updateOrderStatus(orderId: string, status: string) {
    if (status === "EXCLUDED") {
      const response = await fetch(
        `https://illuminational-earlene-incoherently.ngrok-free.dev/orders/${orderId}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        Alert.alert(
          "Erro",
          "houve um erro durante a operação, tente novamente mais tarde."
        );
        console.log(response);
        return;
      }
      const data = await response.json();
      console.log(data);
    }

    const response = await fetch(
      `https://illuminational-earlene-incoherently.ngrok-free.dev/orders/${orderId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fields: {
            status: status,
          },
        }),
      }
    );
    if (!response.ok) {
      Alert.alert("Erro", "Tente novamente mais tarde");
      console.log(response);
      return;
    }
    const data = await response.json();
    console.log(data);
    navigation.goBack();
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="bg-[#2c003d] p-4 pt-6 pb-6 pl-0 rounded-b-2xl">
        <View className="flex-row items-center justify-between">
          <BackArrow />

          <View className="flex-1 ml-20">
            <Text className="text-white text-2xl font-bold">
              Cliente ID: {order?.customerId.substring(0, 8)}...
            </Text>
            <Text className="text-gray-300 text-sm">
              Pedido feito: {formatarData(route.params.order?.created_at || "")}
            </Text>
            <Text className="text-gray-300 text-sm">
              Para entrega: {formatarData(route.params.order?.close_at || "")}
            </Text>
          </View>

          <Image
            source={{ uri: blankPhoto }} // Imagem de avatar placeholder
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
            {order?.items.items.map((item, i) => {
              return (
                <View key={i} className={`px-4 py-2 rounded-lg bg-[#2c003d]`}>
                  <Text className={`text-white font-semibold`}>
                    {item.service}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Opções de Entrega */}
        <View className="flex-row justify-between mb-6">
          <View
            className={`w-full p-3 rounded-lg border-2 border-purple-700 bg-purple-100`}
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
            </View>
          </View>
        </View>

        {/* Lista de Itens */}
        <View className="bg-gray-50 p-4 rounded-lg mb-6">
          {order?.items.items.map((item, i) => {
            return (
              <OrderItemRow
                key={i}
                quantity={item.qntd}
                name={item.name}
                price={((item.unitPrice_inCents * item.qntd) / 100)
                  .toFixed(2)
                  .replace(".", ",")}
              />
            );
          })}
        </View>

        {/* Sumário de Custos */}
        <View className="mb-8">
          <View className="flex-row justify-between py-1">
            <Text className="text-gray-500">Total de peças:</Text>
            <Text className="font-bold text-gray-800">{totalPieces} Peças</Text>
          </View>
          <View className="flex-row justify-between py-1">
            <Text className="text-gray-500">Frete:</Text>
            <Text className="font-bold text-gray-800">R$ 15,00</Text>
          </View>
          <View className="bg-[#2c003d] p-3 rounded-lg flex-row justify-between mt-3">
            <Text className="text-white font-bold text-lg">Valor Total:</Text>
            <Text className="text-white font-bold text-lg">
              R${" "}
              {((order?.total_inCents || 0) / 100).toFixed(2).replace(".", ",")}
            </Text>
          </View>
        </View>

        {/* Botões de Ação */}
        <View className="flex-row items-center gap-2">
          <TouchableOpacity className="bg-gray-100 p-3 rounded-full">
            <Ionicons name="chatbubbles-outline" size={30} color="#2c003d" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              updateOrderStatus(
                order?.id || "",
                order?.status === "PENDING"
                  ? "ONGOING"
                  : order?.status === "ONGOING"
                    ? "CONCLUDED"
                    : "EXCLUDED"
              )
            }
            className="bg-purple-400 flex-1 py-4 rounded-lg items-center"
          >
            <Text className="text-white text-base font-bold">
              {order?.status === "PENDING"
                ? "Iniciar Lavagem"
                : order?.status === "ONGOING"
                  ? "Concluir Lavagem"
                  : "Excluir Lavagem"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
