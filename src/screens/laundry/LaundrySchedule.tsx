import React, { useState, useEffect, useContext } from "react";
import {
  SafeAreaView,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform, // Importado para lidar com o comportamento do KeyboardAvoidingView
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { Dropdown } from "react-native-element-dropdown";
// 1. IMPORTAR O DATETIMEPICKER
import DateTimePicker from "@react-native-community/datetimepicker";

import { BackArrow, Text } from "@/components";
import { CustomerContext, LocationContext } from "@/contexts";
import { OrderType, ItemType } from "@/types";

// --- DEMAIS COMPONENTES E LÓGICA (sem alterações) ---
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

type DeliveryOptionProps = {
  title: string;
  cep?: string;
  address?: string;
  isSelected: boolean;
  onPress: () => void;
};

const DeliveryOptionCard = ({
  title,
  cep,
  address,
  isSelected,
  onPress,
}: DeliveryOptionProps) => (
  <TouchableOpacity
    onPress={onPress}
    className={`flex-1 rounded-lg border p-3 ${isSelected ? "bg-purple-300 border-purple-500" : "bg-white border-gray-300"}`}
  >
    <View className="flex-row justify-between items-start">
      <View className="flex-1">
        <Text
          className={`font-bold ${isSelected ? "text-purple-900" : "text-gray-700"}`}
        >
          {title}
        </Text>
        {cep && (
          <Text className="text-xs text-purple-800 mt-1">CEP: {cep}</Text>
        )}
        {address && <Text className="text-xs text-purple-800">{address}</Text>}
      </View>
      <View
        className={`w-5 h-5 rounded-full border-2 justify-center items-center ${isSelected ? "border-white bg-purple-900" : "border-gray-400"}`}
      >
        {isSelected && <View className="w-2 h-2 rounded-full bg-white" />}
      </View>
    </View>
  </TouchableOpacity>
);

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
        <View className="flex-1">
          <Text className="text-xs font-bold mb-1">Valor (R$)</Text>
          <TextInput
            className="border border-gray-300 rounded-lg p-2"
            value={item.value}
            editable={false}
          />
        </View>
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
    className={`w-6 h-6 rounded-full border-2 ${selected ? "border-purple-700 bg-purple-700" : "border-gray-400"} items-center justify-center`}
  >
    {selected && <View className="w-3 h-3 rounded-full bg-white" />}
  </View>
);

// --- TELA PRINCIPAL ---
export default function LaundryScheduleScreen({ route }: any) {
  const { location } = useContext(LocationContext);
  const { customerData } = useContext(CustomerContext);
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

  // 2. NOVOS ESTADOS PARA O DATETIMEPICKER
  const [close_at, setClose_at] = useState(
    new Date(new Date().setDate(new Date().getDate() + 1))
  ); // Inicia com amanhã
  const [showDatePicker, setShowDatePicker] = useState(false);

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

  // Função para lidar com a mudança de data
  const onChangeDate = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false); // Esconde o seletor em qualquer ação
    if (selectedDate) {
      setClose_at(selectedDate); // Atualiza a data se uma foi selecionada
    }
  };

  const addOrderItem = () => {
    setOrderItems([
      ...orderItems,
      {
        id: Date.now(),
        quantity: "0",
        clothing: "",
        washType: "",
        color: "",
        value: "00,00",
      },
    ]);
  };

  const removeOrderItem = (id: number | Date) => {
    if (orderItems.length > 1) {
      setOrderItems(orderItems.filter((order) => order.id !== id));
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

  const createOrder = async (order: OrderType, items: ItemType[]) => {
    try {
      const response = await fetch(
        "https://illuminational-earlene-incoherently.ngrok-free.dev/orders",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            order: order,
            items: [...items],
          }),
        }
      );

      const data = await response.json();
      console.log(close_at);

      if (!response.ok) {
        console.error("Erro da API:", data);
        // Mostra um alerta mais útil para o usuário
        alert(data.details || "Não foi possível criar o pedido.");
        return null; // Retorna nulo para indicar falha
      }

      return data;
    } catch (error) {
      console.error("Erro na requisição:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Erro desconhecido ao criar o pedido.";
      alert(errorMessage);
    }
  };

  const handleConcludeOrder = async () => {
    const finalOrderItems = orderItems.filter(
      (item) => parseInt(item.quantity, 10) > 0 && item.clothing
    );

    if (finalOrderItems.length === 0) {
      alert("Por favor, adicione pelo menos um item válido ao seu pedido.");
      return;
    }

    const itemsToApi: ItemType[] = finalOrderItems.map((item) => {
      const clothingLabel =
        clothingDropdownData.find((c) => c.value === item.clothing)?.label ||
        item.clothing;

      // O cálculo do preço unitário também foi corrigido
      const quantity = Number(item.quantity);
      const totalRowValue = parseFloat(item.value.replace(",", "."));
      const unitPriceInCents =
        quantity > 0 ? (totalRowValue / quantity) * 100 : 0;

      return {
        qntd: Number(item.quantity),
        unitPrice_inCents: Math.round(unitPriceInCents),
        name: clothingLabel,
        color: item.color,
        service: item.washType,
      };
    });

    // CORREÇÃO 2: O objeto `orderToApi` agora é construído corretamente
    const orderToApi: OrderType = {
      details: `Pedido com ${totalPieces} peças. Valor total: R$ ${totalValue.toFixed(2).replace(".", ",")}`,
      status: "PENDING",
      delivery_type: deliveryType,
      // Passamos o objeto Date diretamente. JSON.stringify vai convertê-lo para o formato ISO.
      close_at: close_at,
      latitude: String(location.coords.latitude),
      longitude: String(location.coords.longitude),
      laundryId: String(route.params.id),
      customerId: String(customerData?.id),
      // O total em centavos agora é calculado corretamente a partir do estado
      total_inCents: Math.round(totalValue * 100),
    };

    const result = await createOrder(orderToApi, itemsToApi);

    // if (result && result.order) {
    //   navigation.navigate("ConcludedOrderScreen", {
    //     order: result.order,
    //     orderItems: finalOrderItems,
    //     totalPieces,
    //     totalValue,
    //     deliveryType,
    //     shippingFee,
    //     laundryDetails: route.params,
    //     close_at: close_at.toISOString(),
    //   });
    // }
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

          <View className="my-6">
            <SectionTitle title="Tipos de Entrega" />
            <View className="flex-row justify-between px-4 mt-4 gap-3">
              <DeliveryOptionCard
                title="Entrega a Domicílio"
                cep="09818-180"
                address={customerData?.address}
                isSelected={deliveryType === "delivery"}
                onPress={() => setDeliveryType("delivery")}
              />
              <DeliveryOptionCard
                title="Buscar no local"
                address={route.params.address}
                isSelected={deliveryType === "pickup"}
                onPress={() => setDeliveryType("pickup")}
              />
            </View>
          </View>

          {/* 3. NOVA SEÇÃO PARA A DATA DE ENTREGA */}
          <View className="my-6 px-4">
            <SectionTitle title="Agendar Entrega" />
            <TouchableOpacity
              onPress={() => setShowDatePicker(true)}
              className="bg-white border border-gray-300 rounded-lg p-4 mt-4 flex-row justify-between items-center"
            >
              <Ionicons name="calendar-outline" size={24} color="#581C87" />
              <Text className="text-gray-800 font-bold">
                {close_at.toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </Text>
              <Ionicons name="chevron-down" size={20} color="#581C87" />
            </TouchableOpacity>
          </View>

          {/* 4. RENDERIZAÇÃO CONDICIONAL DO DATETIMEPICKER */}
          {showDatePicker && (
            <DateTimePicker
              testID="dateTimePicker"
              value={close_at}
              mode="date"
              display="default"
              onChange={onChangeDate}
              minimumDate={
                new Date(new Date().setDate(new Date().getDate() + 1))
              } // Data mínima é amanhã
            />
          )}

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
