import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  ImageSourcePropType,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

import { BackArrow } from "@/components";

// --- TIPAGEM (TYPESCRIPT) ---

type OrderItem = {
  id: number;
  quantity: string;
  clothing: string;
  washType: string;
  value: string;
};

type DeliveryType = "delivery" | "pickup";
type PaymentType = "pix" | null;

// --- COMPONENTES ---

const ScreenHeader: React.FC = () => (
  <View className="flex-row items-center p-4 pl-14 bg-gray-50">
    <BackArrow size={28} />
    <Text className="text-xl font-bold text-gray-800 ml-4">
      Vamos agendar seu pedido!
    </Text>
  </View>
);

const LaundryInfoCard: React.FC = () => (
  <View className="bg-white rounded-lg shadow-md flex-row p-4 m-4">
    <Image
      source={{
        uri: "https://images.pexels.com/photos/1648377/pexels-photo-1648377.jpeg?auto=compress&cs=tinysrgb&w=600",
      }}
      className="w-24 h-32 rounded-lg"
    />
    <View className="flex-1 ml-4">
      <Text className="text-xs text-gray-500">Lavanderia express</Text>
      <Text className="text-lg font-bold text-gray-800">Lave-bem</Text>
      <View className="flex-row items-center my-1">
        <Text className="text-sm font-bold text-yellow-500 mr-1">4,5</Text>
        <Text className="text-yellow-500">★★★★★</Text>
      </View>
      <Text className="text-xs text-gray-600 leading-4 mb-3">
        -- Prima clean é uma lavanderia com ótima reputação{" "}
        <Text className="font-bold">Lorem Ipsum</Text> is very much imp...
      </Text>
      <TouchableOpacity className="flex-row items-center">
        <Ionicons name="chatbubbles-outline" size={20} color="#374151" />
        <View className="ml-2">
          <Text className="text-sm font-bold text-gray-800">
            Entrar em contato agora
          </Text>
          <Text className="text-xs text-gray-500">
            Geralmente responde em um dia
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  </View>
);

// Interface para as propriedades do OrderItemRow
interface OrderItemRowProps {
  item: OrderItem;
  onChange: (
    id: number,
    field: keyof Omit<OrderItem, "id">,
    value: string
  ) => void;
}

const OrderItemRow = ({ item, onChange }: OrderItemRowProps) => (
  <View className="flex-row items-center space-x-2 mb-3">
    {/* Quant. */}
    <View className="w-16">
      <Text className="text-xs font-bold mb-1 text-center">Quant.</Text>
      <TextInput
        className="border border-gray-300 rounded-lg p-2 text-center"
        value={item.quantity}
        onChangeText={(text) => onChange(item.id, "quantity", text)}
        keyboardType="number-pad"
      />
    </View>
    {/* Vestimenta (Simulado como Picker) */}
    <View className="flex-1">
      <Text className="text-xs font-bold mb-1">Vestimenta</Text>
      <TouchableOpacity className="flex-row justify-between items-center border border-gray-300 rounded-lg p-2.5">
        <Text className={item.clothing ? "text-gray-800" : "text-gray-400"}>
          {item.clothing || "Ex: Camisa"}
        </Text>
        <Ionicons name="chevron-down-outline" size={16} color="#6B7280" />
      </TouchableOpacity>
    </View>
    {/* Tipo (Simulado como Picker) */}
    <View className="flex-1">
      <Text className="text-xs font-bold mb-1">Tipo de lavagem</Text>
      <TouchableOpacity className="flex-row justify-between items-center border border-gray-300 rounded-lg p-2.5">
        <Text className={item.washType ? "text-gray-800" : "text-gray-400"}>
          {item.washType || "Nenhum"}
        </Text>
        <Ionicons name="chevron-down-outline" size={16} color="#6B7280" />
      </TouchableOpacity>
    </View>
    {/* Valor */}
    <View className="w-24">
      <Text className="text-xs font-bold mb-1">Valor</Text>
      <TextInput
        className="border border-gray-300 rounded-lg p-2"
        value={item.value}
        onChangeText={(text) => onChange(item.id, "value", text)}
      />
    </View>
  </View>
);

const SectionTitle: React.FC<{ title: string; isPill?: boolean }> = ({
  title,
  isPill,
}) =>
  isPill ? (
    <View className="bg-purple-900 rounded-lg py-2 px-5 self-center">
      <Text className="text-white font-bold text-base">{title}</Text>
    </View>
  ) : (
    <Text className="text-lg font-bold text-gray-800 text-center">{title}</Text>
  );

const RadioButton: React.FC<{ selected: boolean }> = ({ selected }) => (
  <View
    className={`w-6 h-6 rounded-full border-2 ${selected ? "border-purple-700 bg-purple-700" : "border-gray-400"} items-center justify-center`}
  >
    {selected && <View className="w-3 h-3 rounded-full bg-white" />}
  </View>
);

// --- TELA PRINCIPAL ---
export default function LaundryScheduleScreen() {
  const [orderItems, setOrderItems] = useState<OrderItem[]>([
    { id: 1, quantity: "0", clothing: "", washType: "", value: "R$ 00,00" },
    { id: 2, quantity: "0", clothing: "", washType: "", value: "R$ 00,00" },
  ]);
  const [deliveryType, setDeliveryType] = useState<DeliveryType>("delivery");
  const [paymentType, setPaymentType] = useState<PaymentType>("pix");

  const addOrderItem = () => {
    const newItem: OrderItem = {
      id: Date.now(),
      quantity: "0",
      clothing: "",
      washType: "",
      value: "R$ 00,00",
    };
    setOrderItems([...orderItems, newItem]);
  };

  const handleItemChange = (
    id: number,
    field: keyof Omit<OrderItem, "id">,
    value: string
  ) => {
    setOrderItems((currentItems) =>
      currentItems.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScreenHeader />
        <ScrollView showsVerticalScrollIndicator={false}>
          <LaundryInfoCard />

          {/* Itens do Pedido */}
          <View className="px-4">
            {orderItems.map((item) => (
              <OrderItemRow
                key={item.id}
                item={item}
                onChange={handleItemChange}
              />
            ))}
            <TouchableOpacity
              onPress={addOrderItem}
              className="bg-purple-400 rounded-lg p-3 items-center justify-center mt-2"
            >
              <Ionicons name="add" size={28} color="white" />
            </TouchableOpacity>
          </View>

          {/* Tipos de Entrega */}
          <View className="my-6">
            <SectionTitle title="Tipos de Entrega" />
            <View className="flex-row justify-between px-4 mt-4 space-x-3">
              <TouchableOpacity
                onPress={() => setDeliveryType("delivery")}
                className={`flex-1 p-4 rounded-lg border ${deliveryType === "delivery" ? "bg-purple-400 border-purple-400" : "bg-white border-gray-300"}`}
              >
                <View className="flex-row justify-between items-start">
                  <View>
                    <Text
                      className={`font-bold ${deliveryType === "delivery" ? "text-white" : "text-gray-800"}`}
                    >
                      Entrega a Domicílio
                    </Text>
                    <Text
                      className={`mt-1 ${deliveryType === "delivery" ? "text-purple-50" : "text-gray-500"}`}
                    >
                      CEP: 09818-180
                    </Text>
                    <Text
                      className={`${deliveryType === "delivery" ? "text-purple-50" : "text-gray-500"}`}
                    >
                      R. Das Flores, 123, São Paulo - SP
                    </Text>
                  </View>
                  <RadioButton selected={deliveryType === "delivery"} />
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setDeliveryType("pickup")}
                className={`flex-1 p-4 rounded-lg border items-center justify-center ${deliveryType === "pickup" ? "bg-purple-400 border-purple-400" : "bg-white border-gray-300"}`}
              >
                <View className="flex-row justify-between items-center w-full">
                  <Text
                    className={`font-bold ${deliveryType === "pickup" ? "text-white" : "text-gray-800"}`}
                  >
                    Buscar no local
                  </Text>
                  <RadioButton selected={deliveryType === "pickup"} />
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* Forma de Pagamento */}
          <View className="my-6">
            <SectionTitle title="Forma de Pagamento" isPill />
            <View className="px-4 mt-4">
              <TouchableOpacity
                onPress={() => setPaymentType("pix")}
                className="flex-row justify-between items-center bg-purple-200 p-4 rounded-lg"
              >
                <View className="flex-row items-center">
                  <Ionicons name="qr-code-outline" size={24} color="#581C87" />
                  <Text className="text-purple-900 font-bold ml-3">
                    Pagar com Pix
                  </Text>
                </View>
                <RadioButton selected={paymentType === "pix"} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Resumo e Botão Final */}
          <View className="bg-white p-4">
            <View className="flex-row justify-between mb-2">
              <Text className="text-gray-600">Total de peças:</Text>
              <Text className="font-bold text-gray-800">16 Peças</Text>
            </View>
            <View className="flex-row justify-between mb-2">
              <Text className="text-gray-600">Frete:</Text>
              <Text className="font-bold text-gray-800">R$ 15,00</Text>
            </View>
            <View className="flex-row justify-between mb-4">
              <Text className="text-gray-600">Valor total:</Text>
              <Text className="font-bold text-gray-800">R$ 15,00</Text>
            </View>
            <TouchableOpacity className="bg-purple-900 rounded-lg p-4 items-center">
              <Text className="text-white font-bold text-base">
                Concluir agendamento
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
