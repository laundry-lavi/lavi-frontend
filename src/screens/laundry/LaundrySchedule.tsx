import React, { useState, useEffect, useContext } from "react";
import {
  SafeAreaView,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  ImageSourcePropType,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { Dropdown } from "react-native-element-dropdown";

import { BackArrow, Text } from "@/components";

const clothingDropdownData = [
  { label: "Camisa", value: "camisa", price: 30.0 },
  { label: "Calça", value: "calca", price: 25.0 },
  { label: "Vestido", value: "vestido", price: 35.0 },
  { label: "Casaco", value: "casaco", price: 40.0 },
];

const washTypeDropdownData = [
  { label: "Lavar a seco", value: "Lavar a seco" },
  { label: "Lavar e passar", value: "Lavar e passar" },
  { label: "Lavagem simples", value: "Lavagem simples" },
  { label: "Somente passar", value: "Somente passar" },
];

const colorDropdownData = [
  { label: "Branco", value: "branco" },
  { label: "Preto", value: "preto" },
  { label: "Colorido", value: "colorido" },
];

// --- TIPAGEM (TYPESCRIPT) ---

type OrderItem = {
  id: number;
  quantity: string;
  clothing: string;
  washType: string;
  color: string;
  value: string;
};

type DeliveryType = "delivery" | "pickup";
type PaymentType = "pix" | null;

// --- COMPONENTES ---

const ScreenHeader = () => (
  <View className="flex-row items-center p-4 pl-14 pt-6 bg-gray-50">
    <BackArrow size={28} />
    <Text className="text-xl font-bold text-gray-800 ml-4">
      Vamos agendar seu pedido!
    </Text>
  </View>
);

const LaundryInfoCard = ({ laundry }: any) => (
  <View className="bg-white rounded-lg shadow-md justify-between flex-row p-3 m-4 mt-2">
    <View>
      <Text className="text-xs text-gray-500">Lavanderia express</Text>
      <Text className="text-xl font-sansBold text-gray-800">
        {laundry.name}
      </Text>
    </View>
    <View className="flex-row items-center my-1">
      <Text className="text-lg font-bold text-yellow-500 mr-1">4,5</Text>
      <Text className="text-lg text-yellow-500">★★★★★</Text>
    </View>
  </View>
);

// Interface para as propriedades do OrderItemRow
interface OrderItemRowProps {
  item: OrderItem;
  onChange: (
    id: number,
    field: keyof Omit<OrderItem, "id">,
    value: string | number
  ) => void;
  removeOrderItem: (id: number | Date) => void;
}

function OrderItemRow({ item, onChange, removeOrderItem }: OrderItemRowProps) {
  const [clothingDropdownIsFocus, setClothingDropdownIsFocus] = useState(false);
  const [washTypeDropdownIsFocus, setWashTypeDropdownIsFocus] = useState(false);
  const [colorDropdownIsFocus, setColorDropdownIsFocus] = useState(false);

  useEffect(() => {
    const clothingItem = clothingDropdownData.find(
      (data) => data.value === item.clothing
    );
    const quantity = parseInt(item.quantity, 10);

    if (clothingItem && !isNaN(quantity)) {
      const newValue = clothingItem.price * quantity;
      onChange(item.id, "value", newValue.toFixed(2).replace(".", ","));
    } else {
      onChange(item.id, "value", "0,00");
    }
  }, [item.clothing, item.quantity]);

  return (
    <View className="mb-3 border border-purple-500 rounded-lg p-2 bg-white">
      <View className="flex flex-row gap-3 items-center">
        {/* Vestimenta */}
        <View className="flex-1">
          <Text className="text-xs font-bold mb-1">Vestimenta</Text>
          <Dropdown
            style={[
              {
                padding: 10,
                paddingLeft: 8,
                borderWidth: 1,
                borderRadius: 12,
                borderColor: "#d9d9d9",
              },
              clothingDropdownIsFocus && { borderColor: "#822083" },
            ]}
            data={clothingDropdownData}
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder={!clothingDropdownIsFocus ? "Selecione" : "..."}
            value={item.clothing}
            onFocus={() => setClothingDropdownIsFocus(true)}
            onBlur={() => setClothingDropdownIsFocus(false)}
            onChange={(dropdownItem) => {
              onChange(item.id, "clothing", dropdownItem.value);
              setClothingDropdownIsFocus(false);
            }}
          />
        </View>

        {/* Tipo de lavagem */}
        <View className="flex-1">
          <Text className="text-xs font-bold mb-1">Tipo de lavagem</Text>
          <Dropdown
            style={[
              {
                padding: 10,
                paddingLeft: 8,
                borderWidth: 1,
                borderRadius: 12,
                borderColor: "#d9d9d9",
              },
              washTypeDropdownIsFocus && { borderColor: "#822083" },
            ]}
            data={washTypeDropdownData}
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder={!washTypeDropdownIsFocus ? "Selecione" : "..."}
            value={item.washType}
            onFocus={() => setWashTypeDropdownIsFocus(true)}
            onBlur={() => setWashTypeDropdownIsFocus(false)}
            onChange={(dropdownItem) => {
              onChange(item.id, "washType", dropdownItem.value);
              setWashTypeDropdownIsFocus(false);
            }}
          />
        </View>

        {/* Quant. */}
        <View style={{ width: 60 }}>
          <Text className="text-xs font-bold mb-1 text-center">Quant.</Text>
          <TextInput
            className="border border-gray-300 rounded-lg p-2 text-center"
            value={item.quantity}
            onChangeText={(text) => onChange(item.id, "quantity", text)}
            keyboardType="number-pad"
          />
        </View>
      </View>

      <View className="flex flex-row gap-3 items-center mt-3">
        {/* Cor */}
        <View className="flex-1">
          <Text className="text-xs font-bold mb-1">Cor</Text>
          <Dropdown
            style={[
              {
                padding: 10,
                paddingLeft: 8,
                borderWidth: 1,
                borderRadius: 12,
                borderColor: "#d9d9d9",
              },
              colorDropdownIsFocus && { borderColor: "#822083" },
            ]}
            data={colorDropdownData}
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder={!colorDropdownIsFocus ? "Selecione" : "..."}
            value={item.color}
            onFocus={() => setColorDropdownIsFocus(true)}
            onBlur={() => setColorDropdownIsFocus(false)}
            onChange={(dropdownItem) => {
              onChange(item.id, "color", dropdownItem.value);
              setColorDropdownIsFocus(false);
            }}
          />
        </View>

        {/* Valor */}
        <View className="flex-1">
          <Text className="text-xs font-bold mb-1">Valor (R$)</Text>
          <TextInput
            className="border border-gray-300 rounded-lg p-2"
            value={item.value}
            editable={false}
          />
        </View>

        {/* botão de deletar */}
        <View className="mt-5">
          <TouchableOpacity onPress={() => removeOrderItem(item.id)}>
            <Ionicons name="trash-bin" size={24} color="red" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const SectionTitle = ({
  title,
  isPill,
}: {
  title: string;
  isPill?: boolean;
}) =>
  isPill ? (
    <View className="bg-purple-900 rounded-lg py-2 px-5 self-center">
      <Text className="text-white font-bold text-base">{title}</Text>
    </View>
  ) : (
    <Text className="text-lg font-bold text-gray-800 text-center">{title}</Text>
  );

const RadioButton = ({ selected }: { selected: boolean }) => (
  <View
    className={`w-6 h-6 rounded-full border-2 ${
      selected ? "border-purple-700 bg-purple-700" : "border-gray-400"
    } items-center justify-center`}
  >
    {selected && <View className="w-3 h-3 rounded-full bg-white" />}
  </View>
);

// --- TELA PRINCIPAL ---
export default function LaundryScheduleScreen({ route }: any) {
  const navigation = useNavigation<NavigationProp<any>>();
  const [orderItems, setOrderItems] = useState<OrderItem[]>([
    {
      id: 1,
      quantity: "0",
      clothing: "",
      washType: "",
      color: "",
      value: "00,00",
    },
  ]);
  const [deliveryType, setDeliveryType] = useState<DeliveryType>("delivery");
  const [paymentType, setPaymentType] = useState<PaymentType>("pix");
  const [totalPieces, setTotalPieces] = useState(0);
  const [totalValue, setTotalValue] = useState(0);

  const shippingFee = 15.0;

  useEffect(() => {
    const { totalPieces, subtotal } = orderItems.reduce(
      (acc, item) => {
        const quantity = parseInt(item.quantity, 10) || 0;
        const value = parseFloat(item.value.replace(",", ".")) || 0;
        acc.totalPieces += quantity;
        acc.subtotal += value;
        return acc;
      },
      { totalPieces: 0, subtotal: 0 }
    );

    setTotalPieces(totalPieces);
    const finalTotal =
      deliveryType === "delivery" ? subtotal + shippingFee : subtotal;
    setTotalValue(finalTotal);
  }, [orderItems, deliveryType]);

  const addOrderItem = () => {
    const newItem: OrderItem = {
      id: Date.now(),
      quantity: "0",
      clothing: "",
      washType: "",
      color: "",
      value: "00,00",
    };
    setOrderItems([...orderItems, newItem]);
  };

  const removeOrderItem = (id: number | Date) => {
    if (orderItems.length > 1) {
      let oldOrderItems = orderItems.filter((order) => order.id !== id);
      setOrderItems(oldOrderItems);
    }
  };

  const handleItemChange = (
    id: number,
    field: keyof Omit<OrderItem, "id">,
    value: string | number
  ) => {
    setOrderItems((currentItems) =>
      currentItems.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const handleConcludeOrder = () => {
    // Filtra apenas os itens que têm uma quantidade maior que 0
    const finalOrderItems = orderItems.filter(
      (item) => parseInt(item.quantity, 10) > 0 && item.clothing
    );

    if (finalOrderItems.length === 0) {
      // Opcional: Adicionar um alerta para o usuário
      alert("Por favor, adicione pelo menos um item ao seu pedido.");
      return;
    }

    navigation.navigate("ConcludedOrderScreen", {
      orderItems: finalOrderItems,
      totalPieces,
      totalValue,
      deliveryType,
      shippingFee,
      laundryDetails: route.params,
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScreenHeader />
        <ScrollView showsVerticalScrollIndicator={false}>
          <LaundryInfoCard laundry={route.params} />

          {/* Itens do Pedido */}
          <View className="px-4">
            {orderItems.map((item) => (
              <OrderItemRow
                key={item.id}
                item={item}
                onChange={handleItemChange}
                removeOrderItem={removeOrderItem}
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
            <View className="flex-row justify-between px-4 mt-4">
              <TouchableOpacity
                onPress={() => setDeliveryType("delivery")}
                className={`flex-1 p-3 mr-2 rounded-lg border ${
                  deliveryType === "delivery"
                    ? "bg-purple-400 border-purple-400"
                    : "bg-white border-gray-300"
                }`}
              >
                <View className="flex-row justify-between items-center">
                  <View className="w-[85%]">
                    <Text
                      className={`font-bold  ${
                        deliveryType === "delivery"
                          ? "text-white"
                          : "text-gray-800"
                      }`}
                    >
                      Entrega a Domicílio
                    </Text>
                    <Text
                      className={`mt-1 ${
                        deliveryType === "delivery"
                          ? "text-purple-50"
                          : "text-gray-500"
                      }`}
                    >
                      CEP: 09818-180
                    </Text>
                    <Text
                      className={`${
                        deliveryType === "delivery"
                          ? "text-purple-50"
                          : "text-gray-500"
                      }`}
                    >
                      R. Das Flores, 123, São Paulo - SP
                    </Text>
                  </View>
                  <RadioButton selected={deliveryType === "delivery"} />
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setDeliveryType("pickup")}
                className={`flex-1 p-4 rounded-lg border items-center justify-center ${
                  deliveryType === "pickup"
                    ? "bg-purple-400 border-purple-400"
                    : "bg-white border-gray-300"
                }`}
              >
                <View className="flex-row justify-between items-center w-full">
                  <Text
                    className={`font-bold ${
                      deliveryType === "pickup" ? "text-white" : "text-gray-800"
                    }`}
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
              <Text className="font-bold text-gray-800">
                {totalPieces} Peças
              </Text>
            </View>
            <View className="flex-row justify-between mb-2">
              <Text className="text-gray-600">Frete:</Text>
              <Text className="font-bold text-gray-800">
                {deliveryType === "delivery"
                  ? `R$ ${shippingFee.toFixed(2).replace(".", ",")}`
                  : "R$ 0,00"}
              </Text>
            </View>
            <View className="flex-row justify-between mb-4">
              <Text className="text-gray-600">Valor total:</Text>
              <Text className="font-bold text-gray-800">
                R$ {totalValue.toFixed(2).replace(".", ",")}
              </Text>
            </View>
            <TouchableOpacity
              onPress={handleConcludeOrder}
              className="bg-purple-900 rounded-lg p-4 items-center"
            >
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
