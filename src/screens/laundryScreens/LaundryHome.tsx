import React, { useContext, useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  ImageSourcePropType,
  ActivityIndicator,
} from "react-native";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import PieChart from "react-native-pie-chart";
import Ionicons from "@expo/vector-icons/Ionicons";

import { NotificationBtn } from "@/components";
import {
  OwnerContext,
  LaundryContext,
  AuthenticationContext,
} from "@/contexts";
import {
  generateChartDataFromFeedbacks,
  getLaundry,
  getFeedbacks,
  getOrders,
} from "@/functions/";
import { CompletedOrderType, Feedback } from "@/types/";
import FeedbackCard from "@/components/FeedbackCard";

const bgImages = [
  require("assets/ordersImage.png"),
  require("assets/ordersInGoingImage.png"),
  require("assets/ordersConcludedImage.png"),
];

// --- COMPONENTE ---
const LegendItem = ({
  item,
}: {
  item: { name: string; value: string; color: string };
}) => (
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
  const navigation = useNavigation<any>();
  const { ownerData } = useContext(OwnerContext);
  const { setLaundryData, laundryData } = useContext(LaundryContext);
  const { isGuest } = useContext(AuthenticationContext);

  const [allFeedbacks, setAllFeedbacks] = useState<Feedback[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<number | null>(null);

  // 1. NOVO ESTADO: Um único objeto para armazenar as listas de pedidos por categoria.
  const [categorizedOrders, setCategorizedOrders] = useState<{
    pending: CompletedOrderType[];
    ongoing: CompletedOrderType[];
    concluded: CompletedOrderType[];
  }>({
    pending: [],
    ongoing: [],
    concluded: [],
  });

  // Efeito para carregar dados da lavanderia e feedbacks iniciais
  useEffect(() => {
    async function loadInitialData() {
      if (!ownerData?.memberId || isGuest) return;
      setIsLoading(true);

      const laundryInfo = await getLaundry(ownerData.memberId);
      if (laundryInfo) {
        setLaundryData({ ownerId: ownerData.memberId, laundry: laundryInfo });

        const fetchedFeedbacks = await getFeedbacks(laundryInfo.id, 1);
        setAllFeedbacks(fetchedFeedbacks);
        setPage(1);
        setHasMore(fetchedFeedbacks.length === 10);
      }
      setIsLoading(false);
    }
    loadInitialData();
  }, [ownerData]);

  // Efeito para carregar e CATEGORIZAR os pedidos
  useEffect(() => {
    async function getInitialOrders() {
      if (!laundryData?.laundry.id || isGuest) return;

      const initialOrders = await getOrders(laundryData.laundry.id);

      if (initialOrders && initialOrders.length > 0) {
        // 2. LÓGICA ATUALIZADA: Agrupa a lista completa de pedidos em categorias.
        const groupedOrders = initialOrders.reduce(
          (acc, order) => {
            // AJUSTE OS VALORES DE STATUS CONFORME O RETORNO DA SUA API
            const status = order.status;

            if (status === "PENDING") {
              acc.pending.push(order);
            } else if (status === "ONGOING") {
              acc.ongoing.push(order);
            } else if (status === "CONCLUDED") {
              acc.concluded.push(order);
            }
            return acc;
          },
          // Objeto inicial do acumulador, com as listas vazias
          { pending: [], ongoing: [], concluded: [] } as {
            pending: CompletedOrderType[];
            ongoing: CompletedOrderType[];
            concluded: CompletedOrderType[];
          }
        );

        // Atualiza o estado com o objeto contendo as listas de pedidos
        setCategorizedOrders(groupedOrders);
      }
    }

    getInitialOrders();
  }, [laundryData?.laundry.id]);

  const handleLoadMore = async () => {
    if (isLoadingMore || !hasMore || !laundryData?.laundry?.id) return;

    setIsLoadingMore(true);
    const nextPage = page + 1;
    const newFeedbacks = await getFeedbacks(laundryData.laundry.id, nextPage);

    if (newFeedbacks.length > 0) {
      setAllFeedbacks((prev) => [...prev, ...newFeedbacks]);
      setPage(nextPage);
    }
    if (newFeedbacks.length < 10) {
      setHasMore(false);
    }
    setIsLoadingMore(false);
  };

  const { series, legendData } = useMemo(() => {
    return generateChartDataFromFeedbacks(allFeedbacks);
  }, [allFeedbacks]);

  const rating = useMemo(() => {
    if (allFeedbacks.length === 0) return "0.0";
    const totalStars = allFeedbacks.reduce(
      (acc, feedback) => acc + feedback.feedbackPost.rate,
      0
    );
    return (totalStars / allFeedbacks.length).toFixed(1);
  }, [allFeedbacks]);

  const filteredFeedbacks = useMemo(() => {
    if (selectedFilter === null) {
      return allFeedbacks;
    }
    return allFeedbacks.filter(
      (feedback) => feedback.feedbackPost.rate === selectedFilter
    );
  }, [allFeedbacks, selectedFilter]);

  const OrderCard = ({
    imageUri,
    title,
    route,
    count,
    params,
  }: {
    imageUri: ImageSourcePropType;
    title: string;
    route: string;
    count: number;
    params: CompletedOrderType[];
  }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate(route, { orders: params })}
      className="w-[31%] h-36 rounded-lg overflow-hidden justify-end"
    >
      <ImageBackground source={imageUri} resizeMode="cover">
        <View className="bg-black/40 p-2 h-full justify-end">
          <View className="bg-purple-600/60 px-2 py-1 rounded-md flex-col items-center justify-between">
            <Text className="text-white font-bold text-sm">{title}</Text>
            <Text className="text-white font-bold text-sm">{count}</Text>
          </View>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-slate-50 dark:bg-gray-900">
      <ScrollView>
        {/* Header */}
        <View className="flex-row-reverse p-4 items-center justify-between">
          <NotificationBtn />
          <TouchableOpacity onPress={() => console.log(categorizedOrders)}>
            <View>
              <Text className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                Olá, {laundryData?.laundry?.name || "Lavanderia"}
              </Text>
              <Text className="text-base text-gray-500 dark:text-gray-400">
                Este é seu espaço de trabalho!
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Gerenciamento de Pedidos */}
        <View className="p-4">
          <Text className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-3">
            Gerenciamento de Pedidos
          </Text>
          <View className="flex-row justify-between">
            {/* 3. ATUALIZAR CONTAGEM: A contagem agora é o comprimento (.length) da lista correspondente */}
            <OrderCard
              title="Pedidos"
              imageUri={bgImages[0]}
              route="OrdersScreen"
              count={categorizedOrders.pending.length}
              params={categorizedOrders.pending}
            />
            <OrderCard
              title="Em andamento"
              imageUri={bgImages[1]}
              route="OrdersInGoing"
              count={categorizedOrders.ongoing.length}
              params={categorizedOrders.ongoing}
            />
            <OrderCard
              title="Concluídos"
              imageUri={bgImages[2]}
              route="OrdersConcluded"
              count={categorizedOrders.concluded.length}
              params={categorizedOrders.concluded}
            />
          </View>
        </View>

        {/* Status da Qualidade (código inalterado) */}
        <View className="p-4">
          <Text className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-3">
            Status da Qualidade
          </Text>
          {isLoading && !isGuest ? (
            <ActivityIndicator size="large" color="#8A63D2" className="my-10" />
          ) : allFeedbacks.length > 0 ? (
            <View className="bg-white dark:bg-black p-4 rounded-lg shadow-sm flex-row items-center">
              <View className="flex-1 items-center">
                <View className="bg-purple-200 px-2 py-1 rounded-md mb-2">
                  <Text className="text-purple-800 text-xs font-bold">
                    Gráfico de avaliações geral
                  </Text>
                </View>
                <PieChart widthAndHeight={150} series={series} />
                <View className="mt-4 w-full px-2">
                  {legendData.map((item, index) => (
                    <LegendItem key={index} item={item} />
                  ))}
                </View>
              </View>

              <View className="w-px h-full bg-gray-200 mx-2" />

              <View className="flex-1 items-center">
                <View className="bg-purple-200 px-2 py-1 rounded-md mb-2">
                  <Text className="text-purple-800 text-xs font-bold">
                    Avaliação Atual
                  </Text>
                </View>
                <Text className="text-5xl font-bold text-gray-800 dark:text-gray-200">
                  {rating}
                </Text>
                <View className="flex-row my-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Ionicons
                      key={star}
                      name={star <= Number(rating) ? "star" : "star-outline"}
                      size={20}
                      color="#facc15"
                    />
                  ))}
                </View>
                <Text className="text-sm font-semibold text-gray-600">
                  {(() => {
                    const r = Number(rating);
                    if (r >= 4.5) return "Qualidade Impecável";
                    if (r >= 3.5) return "Serviço de Confiança";
                    if (r >= 2.5) return "Resultados Satisfatórios";
                    if (r >= 1.5) return "Qualidade Inconsistente";
                    return "Não Recomendado";
                  })()}
                </Text>
              </View>
            </View>
          ) : (
            <View className="bg-white dark:bg-black p-4 rounded-lg shadow-sm items-center justify-center h-48">
              <Ionicons
                name="chatbox-ellipses-outline"
                size={32}
                color="#6B7280"
              />
              <Text className="text-gray-500 dark:text-gray-200 mt-2 text-center">
                A lavanderia ainda não possui avaliações.
              </Text>
            </View>
          )}
        </View>

        {/* Seção de Comentários (código inalterado) */}
        <View className="p-4">
          <Text className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-3">
            Comentários Recentes
          </Text>

          <View className="mb-4">
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <TouchableOpacity
                onPress={() => setSelectedFilter(null)}
                className={`px-4 py-2 rounded-full mr-2 ${
                  selectedFilter === null ? "bg-purple-600" : "bg-purple-100"
                }`}
              >
                <Text
                  className={`font-bold ${selectedFilter === null ? "text-white" : "text-purple-800"}`}
                >
                  Todos
                </Text>
              </TouchableOpacity>
              {[5, 4, 3, 2, 1].map((star) => (
                <TouchableOpacity
                  key={star}
                  onPress={() => setSelectedFilter(star)}
                  className={`px-3 py-2 rounded-full mr-2 flex-row items-center ${
                    selectedFilter === star ? "bg-purple-600" : "bg-purple-100"
                  }`}
                >
                  <Text
                    className={`font-bold mr-1 ${selectedFilter === star ? "text-white" : "text-purple-800"}`}
                  >
                    {star}
                  </Text>
                  <Ionicons
                    name="star"
                    size={16}
                    color={selectedFilter === star ? "#FFFFFF" : "#facc15"}
                  />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {isLoading && !isGuest ? (
            <ActivityIndicator size="large" color="#8A63D2" className="my-10" />
          ) : filteredFeedbacks.length > 0 ? (
            <>
              {filteredFeedbacks.map((feedback) => (
                <FeedbackCard
                  key={feedback.feedbackPost.id}
                  feedback={feedback}
                />
              ))}
              {hasMore && (
                <TouchableOpacity
                  onPress={handleLoadMore}
                  disabled={isLoadingMore}
                  className="bg-purple-100 p-3 rounded-lg flex-row justify-center items-center mt-2"
                >
                  {isLoadingMore ? (
                    <ActivityIndicator size="small" color="#6A3E9A" />
                  ) : (
                    <Text className="text-purple-800 font-bold">
                      Carregar mais comentários
                    </Text>
                  )}
                </TouchableOpacity>
              )}
            </>
          ) : (
            <View className="bg-white dark:bg-black p-4 rounded-lg shadow-sm items-center justify-center h-24">
              <Text className="text-gray-600 dark:text-gray-200 text-center">
                Nenhum comentário encontrado para este filtro.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
