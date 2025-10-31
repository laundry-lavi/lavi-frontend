import React, { useState, useMemo } from "react";
import {
  SafeAreaView,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import Feather from "@expo/vector-icons/Feather";
import Modal from "react-native-modal";
import { useNavigation, useRoute } from "@react-navigation/native";
import { BackArrow, Text } from "@/components";

// --- DADOS PARA MAPEAMENTO (pode ser importado de um arquivo de constantes) ---
const clothingDropdownData = [
  { label: "Camisa", value: "camisa", price: 30.0 },
  { label: "Calça", value: "calca", price: 25.0 },
  { label: "Vestido", value: "vestido", price: 35.0 },
  { label: "Casaco", value: "casaco", price: 40.0 },
];

// --- COMPONENTES REUTILIZÁVEIS ---
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
    className={`flex-1 rounded-lg border p-3 ${
      isSelected
        ? "bg-purple-300 border-purple-500"
        : "bg-white border-gray-300"
    }`}
  >
    <View className="flex-row justify-between items-start">
      <View className="flex-1">
        <Text
          className={`font-bold ${
            isSelected ? "text-purple-900" : "text-gray-700"
          }`}
        >
          {title}
        </Text>
        {cep && (
          <Text className="text-xs text-purple-800 mt-1">CEP: {cep}</Text>
        )}
        {address && <Text className="text-xs text-purple-800">{address}</Text>}
      </View>
      <View
        className={`w-5 h-5 rounded-full border-2 justify-center items-center ${
          isSelected ? "border-white bg-purple-900" : "border-gray-400"
        }`}
      >
        {isSelected && <View className="w-2 h-2 rounded-full bg-white" />}
      </View>
    </View>
  </TouchableOpacity>
);

// --- TELA PRINCIPAL ---
export default function OrderCompletedScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const {
    orderItems,
    totalPieces,
    totalValue,
    deliveryType: initialDeliveryType,
    shippingFee,
  } = route.params as any;

  const [deliveryType, setDeliveryType] = useState(initialDeliveryType);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const orderTimestamp = useMemo(() => new Date(), []);
  const orderDate = orderTimestamp.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
  });
  const orderTime = orderTimestamp.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const uniqueWashTypes = [...new Set(orderItems.map((item) => item.washType))];

  const toggleModal = () => setIsModalVisible(!isModalVisible);

  const getClothingLabel = (value: string) => {
    return clothingDropdownData.find((c) => c.value === value)?.label || value;
  };
  const getClothingPrice = (value: string) => {
    return clothingDropdownData.find((c) => c.value === value)?.price || 0;
  };

  return (
    <>
      <Modal
        isVisible={isModalVisible}
        coverScreen={false}
        animationIn="slideInRight"
        animationOut="slideInRight"
        backdropOpacity={0.5}
        onBackdropPress={toggleModal}
        onBackButtonPress={toggleModal}
        style={{
          marginHorizontal: 0,
          alignSelf: "center",
          justifyContent: "center",
        }}
      >
        <View className="relative w-[70vw] h-[60%] p-2 bg-[#f2f2f2] rounded-xl items-center justify-center">
          <TouchableOpacity
            className="absolute right-2 top-2"
            onPress={toggleModal}
          >
            <Feather
              className="opacity-75"
              name="x"
              size={28}
              color="#4c4669"
            />
          </TouchableOpacity>
          <Text className="text-[#a276d7] text-2xl font-sansBold text-center mb-3">
            Use o QR Code do Pix para pagar
          </Text>
          <Text className="text-center mb-3">
            Abra o app em que vai fazer a transferência, escaneie a imagem ou
            copie o código do QR code
          </Text>
          <Image
            source={require("assets/qr-code.png")}
            className="w-[50%] h-[130px] border border-[#a276d7] rounded-xl mb-3"
          />
          <Text className="text-[#a276d7] text-xl font-sansBold text-center mb-3">
            R$ {totalValue.toFixed(2).replace(".", ",")}
          </Text>
          <TouchableOpacity className="bg-[#a276d7] w-[70%] p-3 rounded-md">
            <Text className="text-white font-sansBold text-center">
              Copiar Código Pix
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>
      <SafeAreaView className="flex-1 bg-gray-100">
        {/* Header */}
        <View className="bg-purple-900 p-5 rounded-b-2xl">
          <BackArrow size={32} />
          <Text className="text-white text-2xl font-bold text-center mt-2">
            Pedido concluído!
          </Text>
          <Text className="text-gray-300 text-sm text-center">
            Pedido feito: {orderDate} às {orderTime}h
          </Text>
          <Text className="text-gray-300 text-sm text-center">
            Aguardando pagamento: 48h
          </Text>
        </View>

        <ScrollView contentContainerStyle={{ padding: 16 }}>
          {/* Tipo de Lavagem */}
          <View className="flex-row items-center mb-5 flex-wrap">
            <Text className="font-bold text-gray-600 mr-3">
              TIPO DE LAVAGEM:
            </Text>
            {uniqueWashTypes.map((washType) => (
              <TouchableOpacity
                key={washType}
                className="bg-purple-900 py-1 px-3 rounded-md mr-2 mt-1"
              >
                <Text className="text-white text-sm">{washType}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Opções de Entrega */}
          <View className="flex-row gap-2 mb-6">
            <DeliveryOptionCard
              title="Entrega a Domicílio"
              cep="09818-180"
              address="R. Das Flores, 123, São Paulo - SP"
              isSelected={deliveryType === "delivery"}
              onPress={() => setDeliveryType("delivery")}
            />
            <DeliveryOptionCard
              title="Buscar no local"
              isSelected={deliveryType === "pickup"}
              onPress={() => setDeliveryType("pickup")}
            />
          </View>

          {/* Resumo dos Itens */}
          <View className="bg-white p-4 rounded-lg">
            {orderItems.map((item) => (
              <View
                key={item.id}
                className="flex-row justify-between items-center mb-3"
              >
                <Text className="text-gray-700">
                  {item.quantity} {getClothingLabel(item.clothing)}
                </Text>
                <Text className="text-gray-700">
                  {item.quantity}x -{" "}
                  {getClothingPrice(item.clothing).toFixed(2).replace(".", ",")}
                </Text>
              </View>
            ))}

            <View className="border-t border-gray-200 pt-3 mt-2">
              <View className="flex-row justify-between items-center mb-2">
                <Text className="text-gray-600">Total de peças:</Text>
                <Text className="font-bold text-gray-800">
                  {totalPieces} Peças
                </Text>
              </View>
              <View className="flex-row justify-between items-center">
                <Text className="text-gray-600">Frete:</Text>
                <Text className="font-bold text-gray-800">
                  {deliveryType === "delivery"
                    ? `R$ ${shippingFee.toFixed(2).replace(".", ",")}`
                    : "R$ 0,00"}
                </Text>
              </View>
            </View>
          </View>

          {/* Valor Total */}
          <View className="bg-purple-900 rounded-lg p-3 my-4">
            <Text className="text-white font-bold text-lg text-center">
              Valor Total: R$ {totalValue.toFixed(2).replace(".", ",")}
            </Text>
          </View>
        </ScrollView>

        {/* Footer Actions */}
        <View className="flex-row gap-2 p-4 bg-gray-100 items-center ">
          <TouchableOpacity className="bg-gray-200 p-3 rounded-full">
            <Ionicons
              name="chatbubble-ellipses-sharp"
              size={28}
              color="#4B5563"
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={toggleModal}
            className="flex-1 bg-purple-500 p-4 rounded-lg justify-center items-center"
          >
            <Text className="text-white font-bold text-base">
              Gerar código pix
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </>
  );
}
