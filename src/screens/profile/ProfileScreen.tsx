import React, { useState, useContext, useEffect, useMemo } from "react";
import {
  SafeAreaView,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  ImageBackground,
  Alert,
  ActivityIndicator,
} from "react-native";
import { NavigationProp, useNavigation } from "@react-navigation/native";

import Ionicons from "@expo/vector-icons/Ionicons";

import { Text, InfoField } from "@/components";
import { Laundry, OrderType } from "@/types";
import {
  AuthenticationContext,
  OwnerContext,
  CustomerContext,
  LaundryContext,
} from "@/contexts";
import { EmployeeProfile, LaundryProfile } from "@/screens/laundryScreens";
import { getCostumerOrders } from "@/functions/";
import { blankPhoto } from "assets/blank-icon";
import { getLaundryById } from "@/functions/";
import { API_URL } from "@/constants/backend";

type EnrichedOrder = OrderType & { laundryData?: Laundry };

const formatReadableDate = (isoString: string | null | undefined): string => {
  // Se a data for nula ou indefinida, retorna um texto padrão.
  if (!isoString) {
    return "Data não definida";
  }

  const date = new Date(isoString);

  // Opções para formatar a data para o padrão brasileiro (dia/mês/ano).
  const options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "long", // 'long' para "Setembro", 'short' para "set.", '2-digit' para "09"
    year: "numeric",
  };

  // Retorna a data formatada no idioma português do Brasil.
  return `Entregar ${date.toLocaleDateString("pt-BR", options)}`;
};

export default function Profile() {
  const navigation = useNavigation<NavigationProp<any>>();
  const [activeFilter, setActiveFilter] = useState("Pedidos");
  const [isLoading, setIsLoading] = useState(true);

  // 2. ESTADO CORRIGIDO: A tipagem agora reflete um objeto com arrays de EnrichedOrder.
  const [categorizedOrders, setCategorizedOrders] = useState<{
    requested: EnrichedOrder[];
    inProgress: EnrichedOrder[];
    completed: EnrichedOrder[];
  }>({
    inProgress: [],
    requested: [],
    completed: [],
  });

  const { customerData, clearCustomerData } = useContext(CustomerContext);
  const { isLaundry, isGuest } = useContext(AuthenticationContext);
  const { ownerData, clearOwnerData } = useContext(OwnerContext);
  const { clearLaundryData } = useContext(LaundryContext);

  // 3. LÓGICA DE BUSCA E PROCESSAMENTO CORRIGIDA
  useEffect(() => {
    const fetchAndProcessOrders = async () => {
      if (!customerData?.id) {
        setIsLoading(false);
        return;
      }
      setIsLoading(true);

      // Passo 1: Buscar todos os pedidos do cliente.
      const orders = await getCostumerOrders(customerData.id);

      if (orders && orders.length > 0) {
        // Passo 2: Para cada pedido, criar uma promessa que busca os dados da lavanderia
        // e retorna um novo objeto de pedido "enriquecido".
        const enrichedOrdersPromises = orders.map(async (order) => {
          const laundryInfo = await getLaundryById(order.laundryId);
          return {
            ...order,
            laundryData: laundryInfo, // Adiciona os dados da lavanderia ao pedido
          };
        });

        // Passo 3: Aguardar que todas as buscas de lavanderia terminem.
        const enrichedOrders = await Promise.all(enrichedOrdersPromises);

        // Passo 4: Agrupar os pedidos já enriquecidos usando um reduce SÍNCRONO.
        const groupedOrders = enrichedOrders.reduce(
          (acc, order) => {
            const status = order.status;

            if (status === "ONGOING") {
              acc.inProgress.push(order);
            } else if (status === "PENDING") {
              acc.requested.push(order);
            } else if (status === "CONCLUDED") {
              acc.completed.push(order);
            }
            return acc;
          },
          { inProgress: [], requested: [], completed: [] } as {
            inProgress: EnrichedOrder[];
            requested: EnrichedOrder[];
            completed: EnrichedOrder[];
          }
        );

        setCategorizedOrders(groupedOrders);
      }
      setIsLoading(false);
    };

    fetchAndProcessOrders();
  }, [customerData?.id]);

  useEffect(() => {
    if (!isLaundry && !customerData) {
      Alert.alert(
        "Erro",
        "Dados do cliente não disponíveis. Você entrou como convidado?",
        [
          { text: "Sim", onPress: () => {} },
          {
            text: "Não",
            onPress: () => {
              clearCustomerData();
              clearOwnerData();
              clearLaundryData();
              navigation.navigate("Welcome");
              Alert.alert(
                "Redirecionando",
                "Você será redirecionado para a tela de boas-vindas."
              );
            },
          },
        ]
      );
    }

    if (isLaundry && !ownerData) {
      Alert.alert(
        "Erro",
        "Dados da lavanderia não disponíveis. Você entrou como convidado?",
        [
          { text: "Sim", onPress: () => {} },
          {
            text: "Não",
            onPress: () => {
              clearCustomerData();
              clearOwnerData();
              clearLaundryData();
              navigation.navigate("Welcome");
              Alert.alert(
                "Redirecionando",
                "Você será redirecionado para a tela de boas-vindas."
              );
            },
          },
        ]
      );
    }
  }, [isLaundry, customerData, ownerData]);

  // 3. FILTRAGEM: Seleciona a lista correta com base no filtro ativo.
  // useMemo otimiza a performance, evitando recalcular a cada renderização.
  const filteredOrders = useMemo(() => {
    if (activeFilter === "Em andamento") {
      return categorizedOrders.inProgress;
    }
    // "Pedidos" aqui corresponde aos pedidos com status "PENDING"
    if (activeFilter === "Pedidos") {
      return categorizedOrders.requested;
    }
    if (activeFilter === "Concluídos") {
      return categorizedOrders.completed;
    }
    return []; // Retorna um array vazio como padrão
  }, [activeFilter, categorizedOrders]);

  if (isLaundry) {
    return ownerData?.role === "owner" || isGuest ? (
      <LaundryProfile />
    ) : (
      <EmployeeProfile />
    );
  }

  async function goToOrder(oderId: string) {}

  async function goToChat(laundryId: string) {
    if (!customerData?.id) {
      Alert.alert(
        "Caro convidado",
        "É necessário estar logado para realizar esta ação."
      );
      return;
    }
    try {
      const response = await fetch(`${API_URL}/chats`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat: {
            laundryId,
            customerId: customerData.id,
            memberId: null,
          },
        }),
      });
      const body = await response.json();
      if (!response.ok) {
        console.error(body);
        Alert.alert("Erro ao ir para o chat", body.details || "Erro");
        return;
      }
      const { chat } = body;
      navigation.navigate("ChatRoute", {
        screen: "ChatScreen",
        params: {
          chatId: chat.id,
        },
      });
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  return (
    <SafeAreaView>
      <ImageBackground
        className="w-full h-full p-3 pt-20"
        source={require("assets/bubble-bg.png")}
      >
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <View className="items-center">
            <Image
              source={{
                uri: customerData?.profileUrl || blankPhoto,
              }}
              className="w-28 h-28 rounded-full border-4 border-white z-10"
            />
            <View className="w-full bg-white border border-gray-200 rounded-2xl p-5 -mt-12 pt-12 z-0 ">
              <TouchableOpacity
                onPress={() => navigation.navigate("SettingsScreen")}
                className="absolute top-4 right-4"
              >
                <View className="w-10 h-10 rounded-full border border-gray-300 justify-center items-center">
                  <Ionicons name="settings-outline" size={24} color="#4B5563" />
                </View>
              </TouchableOpacity>

              <View className="items-center">
                <View className="flex-row items-center">
                  <Text className="text-xl font-bold text-gray-800 mr-2">
                    {customerData?.name}
                  </Text>
                </View>
              </View>

              <View className="mt-4 mb-4">
                <InfoField label="Email" value={customerData?.email || ""} />
                <InfoField
                  label="Endereço"
                  value={customerData?.address || ""}
                />
                <InfoField
                  label="Senha"
                  value={isGuest ? "" : "************"}
                  isPassword
                />
              </View>

              {/* SEÇÃO MEUS PEDIDOS */}
              <View className="bg-[#210030] rounded-lg p-3">
                <Text className="text-white font-bold text-base">
                  Meus Pedidos
                </Text>
              </View>
              <View className="bg-[#fbf5ff] pt-4 px-2 mx-2 mt-0">
                <View className="flex-row justify-center space-x-3 mb-4">
                  <FilterChip
                    text="Pedidos"
                    isSelected={activeFilter === "Pedidos"}
                    onPress={() => setActiveFilter("Pedidos")}
                  />
                  <FilterChip
                    text="Em andamento"
                    isSelected={activeFilter === "Em andamento"}
                    onPress={() => setActiveFilter("Em andamento")}
                  />
                  <FilterChip
                    text="Concluídos"
                    isSelected={activeFilter === "Concluídos"}
                    onPress={() => setActiveFilter("Concluídos")}
                  />
                </View>

                {isLoading ? (
                  <ActivityIndicator
                    size="large"
                    color="#4B0082"
                    className="my-8"
                  />
                ) : filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => (
                    <View
                      key={order.id}
                      className="bg-white border border-gray-200 rounded-lg p-4 mb-3"
                    >
                      <View className="flex-row justify-between items-start">
                        {/* 4. RENDERIZAÇÃO SEGURA: Usa optional chaining para evitar erros
                            caso os dados da lavanderia não sejam encontrados. */}
                        <Text className="text-base font-bold text-gray-800">
                          {order.laundryData?.name ||
                            "Lavanderia não encontrada"}
                        </Text>
                        <Text className="w-[55%] text-sm text-gray-600">
                          {formatReadableDate(order.close_at)}
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
                            R${" "}
                            {((order?.total_inCents ?? 0) / 100)
                              .toFixed(2)
                              .replace(".", ",")}
                          </Text>
                        </Text>
                        <View className="flex-row items-center space-x-3">
                          <TouchableOpacity
                            onPress={() => goToChat(order.laundryId || "")}
                          >
                            <Ionicons
                              name="chatbubble-ellipses-outline"
                              size={24}
                              color="#4B5563"
                            />
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={() => goToOrder(order.id || "")}
                            className="bg-purple-900 py-2 px-4 rounded-lg"
                          >
                            <Text className="text-white font-bold text-sm">
                              Ver Detalhes
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  ))
                ) : (
                  <View className="items-center justify-center p-8 bg-white rounded-lg">
                    <Ionicons
                      name="file-tray-outline"
                      size={32}
                      color="#9CA3AF"
                    />
                    <Text className="text-gray-500 mt-2 text-center">
                      Nenhum pedido encontrado nesta categoria.
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </View>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
}

// --- COMPONENTES REUTILIZÁVEIS (sem alterações) ---

const FilterChip = ({
  text,
  isSelected,
  onPress,
}: {
  text: string;
  isSelected: boolean;
  onPress: () => void;
}) => (
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
