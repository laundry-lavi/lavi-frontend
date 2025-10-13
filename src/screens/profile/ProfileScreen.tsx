import React, { useState, useContext } from "react";
import {
  SafeAreaView,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  ImageBackground,
} from "react-native";
import { NavigationProp, useNavigation } from "@react-navigation/native";

import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

import { Text } from "@/components";
import {
  UserProfile,
  Order,
  PasswordInputProps,
  PasswordVisibilityState,
} from "@/types";
import { AuthenticationContext } from "@/contexts/AuthenticationContext";
import { EmployeeProfile, LaundryProfile } from "@/screens/laundryScreens";

const user: UserProfile = {
  name: "Rafael Teodoro Santos",
  joinDate: "26/01/2018",
  avatarUrl: { uri: "https://i.pravatar.cc/150?img=11" }, // Substitua pela imagem real
  email: "rafa.tete@gmail.com",
  phone: "+55 11 98765-4900",
  address: "R. 20 de Setembro, 700-Sala 12-Bela Vista, Teresina-PI...",
};

const orders: Order[] = [
  {
    id: "1",
    laundryName: "Lavanderia Lave-Bem",
    deliveryDate: "Entregar 17 de Maio",
    status: "Lavar e passar",
    totalValue: 179.1,
  },
  // Adicione mais pedidos aqui
];

export default function Profile() {
  const navigation = useNavigation<NavigationProp<any>>();
  const [activeFilter, setActiveFilter] = useState("Em andamento");
  const { isLaundry } = useContext(AuthenticationContext);

  const [passwordVisibility, setPasswordVisibility] =
    useState<PasswordVisibilityState>({
      isVisible: true,
      iconName: "eye",
    });

  const handlePasswordVisibility = (): void => {
    setPasswordVisibility((prevState) => ({
      isVisible: !prevState.isVisible,
      iconName: prevState.isVisible ? "eye-off" : "eye",
    }));
  };

  return isLaundry ? (
    <EmployeeProfile />
  ) : (
    <SafeAreaView>
      <ImageBackground
        className="w-full h-full p-3 pt-20"
        source={require("assets/bubble-bg.png")}
      >
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <View className="items-center">
            <Image
              source={user.avatarUrl}
              className="w-28 h-28 rounded-full border-4 border-white z-10"
            />
            <View className="w-full bg-white border border-gray-200 rounded-2xl p-5 -mt-12 pt-12 z-0 ">
              {/* Ícone de Configurações */}
              <TouchableOpacity
                onPress={() => navigation.navigate("SettingsScreen")}
                className="absolute top-4 right-4"
              >
                <View className="w-10 h-10 rounded-full border border-gray-300 justify-center items-center">
                  <Ionicons name="settings-outline" size={24} color="#4B5563" />
                </View>
              </TouchableOpacity>

              {/* Nome e Data de Entrada */}
              <View className="items-center">
                <View className="flex-row items-center">
                  <Text className="text-xl font-bold text-gray-800 mr-2">
                    {user.name}
                  </Text>
                  <Ionicons name="pencil-outline" size={20} color="#4B5563" />
                </View>
                <Text className="text-sm text-gray-500 mt-1">
                  Entrou em {user.joinDate}
                </Text>
              </View>

              {/* Formulário */}
              <View className="mt-8 mb-4">
                <Text className="text-[#210030] font-sansBold">Email</Text>
                <TextInput
                  className="text-[#d9d9d9] text-lg p-4 pl-2 mb-2 border rounded-xl border-[#d9d9d9]"
                  placeholder="Email"
                  defaultValue="arthurrollemberg"
                  placeholderTextColor="#d9d9d9"
                  editable={false}
                />
                <Text className="text-[#210030] font-sansBold">Telefone</Text>
                <TextInput
                  className="text-[#d9d9d9] text-lg p-4 pl-2 mb-2 border rounded-xl border-[#d9d9d9]"
                  placeholder="Telefone"
                  defaultValue="+55 11 943191530"
                  placeholderTextColor="#d9d9d9"
                  editable={false}
                />
                <Text className="text-[#210030] font-sansBold">Endereço</Text>
                <TextInput
                  className="text-[#d9d9d9] text-lg p-4 pl-2 mb-2 border rounded-xl border-[#d9d9d9]"
                  placeholder="Endereço"
                  defaultValue="Rua das flores, 512, jardim dos alces"
                  placeholderTextColor="#d9d9d9"
                  editable={false}
                />

                <Text className="text-[#210030] font-sansBold">
                  Senha de Acesso
                </Text>
                <View className="flex flex-row items-center gap-2 p-2 border rounded-xl border-[#d9d9d9]">
                  <TextInput
                    className="flex-1 text-[#d9d9d9] text-lg font-sans"
                    placeholder="Senha"
                    defaultValue="S3nh@Mu!t#Segur4"
                    placeholderTextColor="#d9d9d9"
                    secureTextEntry={passwordVisibility.isVisible}
                  />
                  <TouchableOpacity onPress={handlePasswordVisibility}>
                    <MaterialCommunityIcons
                      name={passwordVisibility.iconName}
                      size={24}
                      color="#d9d9d9"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* SEGUNDA SEÇÃO */}
              <View className="bg-[#210030] rounded-lg p-3">
                <Text className="text-white font-bold text-base">
                  Meus Pedidos
                </Text>
              </View>
              <View className="bg-[#fbf5ff] pt-4 px-2 mx-2 mt-0">
                {/* Filtros de Pedidos */}
                <View className="flex-row justify-center space-x-3 mb-4">
                  <FilterChip
                    text="Em andamento"
                    isSelected={activeFilter === "Em andamento"}
                    onPress={() => setActiveFilter("Em andamento")}
                  />
                  <FilterChip
                    text="Pedidos"
                    isSelected={activeFilter === "Pedidos"}
                    onPress={() => setActiveFilter("Pedidos")}
                  />
                  <FilterChip
                    text="Concluídos"
                    isSelected={activeFilter === "Concluídos"}
                    onPress={() => setActiveFilter("Concluídos")}
                  />
                </View>

                {/* Cartão de Pedido */}
                {orders.map((order) => (
                  <View
                    key={order.id}
                    className="bg-white border border-gray-200 rounded-lg p-4"
                  >
                    <View className="flex-row justify-between items-start">
                      <Text className="text-base font-bold text-gray-800">
                        {order.laundryName}
                      </Text>
                      <Text className="text-sm text-gray-600">
                        {order.deliveryDate}
                      </Text>
                    </View>
                    <View className="mt-4">
                      <View className="bg-gray-200 self-start py-1 px-2 rounded">
                        <Text className="text-xs text-gray-700 font-semibold">
                          {order.status}
                        </Text>
                      </View>
                    </View>
                    <View className="flex-row justify-between items-center mt-4">
                      <Text className="text-sm text-gray-600">
                        Valor Total:{" "}
                        <Text className="font-bold">
                          R$ {order.totalValue.toFixed(2).replace(".", ",")}
                        </Text>
                      </Text>
                      <View className="flex-row items-center space-x-3">
                        <TouchableOpacity>
                          <Ionicons
                            name="chatbubble-ellipses-outline"
                            size={24}
                            color="#4B5563"
                          />
                        </TouchableOpacity>
                        <TouchableOpacity className="bg-purple-900 py-2 px-4 rounded-lg">
                          <Text className="text-white font-bold text-sm">
                            Ver Detalhes
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
}

// --- COMPONENTES REUTILIZÁVEIS ---

interface InputFieldProps {
  label: string;
  value: string;
  placeholder?: string;
  secureTextEntry?: boolean;
  iconName?: string;
  multiline?: boolean;
}

const InputField = ({
  label,
  value,
  placeholder,
  secureTextEntry,
  iconName,
  multiline,
}: InputFieldProps) => (
  <View className="mb-4">
    <Text className="text-sm font-bold text-gray-700 mb-1">{label}</Text>
    <View className="flex-row items-center border border-gray-300 rounded-lg p-3 bg-white">
      <TextInput
        className="flex-1 text-gray-800"
        value={value}
        placeholder={placeholder}
        secureTextEntry={secureTextEntry}
        multiline={multiline}
      />
      {iconName && (
        <Ionicons name={iconName as any} size={20} color="#9CA3AF" />
      )}
    </View>
  </View>
);

interface FilterChipProps {
  text: string;
  isSelected: boolean;
  onPress: () => void;
}

const FilterChip = ({ text, isSelected, onPress }: FilterChipProps) => (
  <TouchableOpacity
    onPress={onPress}
    className={`py-2 px-4 ml-1 rounded-lg border ${
      isSelected
        ? "bg-purple-100 border-purple-500"
        : "bg-white border-gray-300"
    }`}
  >
    <Text
      className={`text-sm font-sansBold ${isSelected ? "text-purple-600" : "text-gray-600"}`}
    >
      {text}
    </Text>
  </TouchableOpacity>
);

const ProfileScreen = () => {
  const [activeFilter, setActiveFilter] = useState("Em andamento");

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Espaço para o background de bolhas */}
        <View className="h-24 bg-purple-50" />

        <View className="bg-white p-4 items-center">
          {/* O container do cartão precisa de um z-index menor para o avatar sobrepor */}
          <View className="w-full bg-white border border-gray-200 rounded-2xl p-5 pt-16 -mt-16 z-0">
            {/* Ícone de Configurações */}
            <TouchableOpacity className="absolute top-4 right-4">
              <View className="w-10 h-10 rounded-full border border-gray-300 justify-center items-center">
                <Ionicons name="settings-outline" size={24} color="#4B5563" />
              </View>
            </TouchableOpacity>

            {/* Nome e Data de Entrada */}
            <View className="items-center">
              <View className="flex-row items-center">
                <Text className="text-xl font-bold text-gray-800 mr-2">
                  {user.name}
                </Text>
                <Ionicons name="pencil-outline" size={20} color="#4B5563" />
              </View>
              <Text className="text-sm text-gray-500 mt-1">
                Entrou em {user.joinDate}
              </Text>
            </View>

            {/* Formulário */}
            <View className="mt-8">
              <InputField label="Email" value={user.email} />
              <InputField label="Telefone" value={user.phone} />
              <InputField label="Endereço" value={user.address} multiline />
              <InputField
                label="Senha de Acesso"
                value="************"
                secureTextEntry
                iconName="eye-outline"
              />
            </View>
          </View>

          {/* Avatar - Posicionado absolutamente para sobrepor o cartão */}
          <Image
            source={user.avatarUrl}
            className="w-28 h-28 rounded-full border-4 border-white absolute top-8 z-10"
          />
        </View>

        {/* Seção Meus Pedidos */}
        <View className="px-4 pb-8 -mt-2">
          {/* Header */}
          <View className="bg-purple-900 rounded-lg p-3 mb-4">
            <Text className="text-white font-bold text-base">Meus Pedidos</Text>
          </View>

          {/* Filtros de Pedidos */}
          <View className="flex-row justify-center space-x-3 mb-4">
            <FilterChip
              text="Em andamento"
              isSelected={activeFilter === "Em andamento"}
              onPress={() => setActiveFilter("Em andamento")}
            />
            <FilterChip
              text="Pedidos"
              isSelected={activeFilter === "Pedidos"}
              onPress={() => setActiveFilter("Pedidos")}
            />
            <FilterChip
              text="Concluídos"
              isSelected={activeFilter === "Concluídos"}
              onPress={() => setActiveFilter("Concluídos")}
            />
          </View>

          {/* Cartão de Pedido */}
          {orders.map((order) => (
            <View
              key={order.id}
              className="bg-white border border-gray-200 rounded-lg p-4"
            >
              <View className="flex-row justify-between items-start">
                <Text className="text-base font-bold text-gray-800">
                  {order.laundryName}
                </Text>
                <Text className="text-sm text-gray-600">
                  {order.deliveryDate}
                </Text>
              </View>
              <View className="mt-4">
                <View className="bg-gray-200 self-start py-1 px-2 rounded">
                  <Text className="text-xs text-gray-700 font-semibold">
                    {order.status}
                  </Text>
                </View>
              </View>
              <View className="flex-row justify-between items-center mt-4">
                <Text className="text-sm text-gray-600">
                  Valor Total:{" "}
                  <Text className="font-bold">
                    R$ {order.totalValue.toFixed(2).replace(".", ",")}
                  </Text>
                </Text>
                <View className="flex-row items-center space-x-3">
                  <TouchableOpacity>
                    <Ionicons
                      name="chatbubble-ellipses-outline"
                      size={24}
                      color="#4B5563"
                    />
                  </TouchableOpacity>
                  <TouchableOpacity className="bg-purple-900 py-2 px-4 rounded-lg">
                    <Text className="text-white font-bold text-sm">
                      Ver Detalhes
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
