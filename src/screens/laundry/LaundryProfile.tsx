import React, { useState, useContext, useMemo, useEffect } from "react";
import {
  SafeAreaView,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  ImageSourcePropType,
  FlatList,
  ActivityIndicator,
  Alert,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import * as Clipboard from "expo-clipboard";

import {
  ModalImage,
  ModalImageCarousel,
  BackArrow,
  Text,
  StarRating,
  FeedbackCard,
  ReviewsSection,
} from "@/components";
import { Feedback } from "@/types";
import { CustomerContext } from "@/contexts";
import { getFeedbacks } from "@/functions";
import { API_URL } from "@/constants/backend";

// --- DADOS DE EXEMPLO (MOCK DATA) ---
const laundryImages = [
  {
    uri: "https://tse4.mm.bing.net/th/id/OIP.Vl7R5JNqqIBldgtaAA3cmQHaJI?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
  },
  {
    uri: "https://tse2.mm.bing.net/th/id/OIP.VU4zPrLLQgF7Kj-Y4w7hAQHaHa?r=0&w=564&h=564&rs=1&pid=ImgDetMain&o=7&rm=3",
  },
  {
    uri: "https://tse3.mm.bing.net/th/id/OIP.IYzfX0TQUuu7Hi5y1cqQCAHaE8?r=0&w=1310&h=876&rs=1&pid=ImgDetMain&o=7&rm=3",
  },
];

// --- COMPONENTES DA TELA ---

// Componente para a aba "Serviços"
const ServicesSection = () => {
  const ServiceItem = ({
    title,
    description,
  }: {
    title: string;
    description: string;
  }) => (
    <View className="py-4 border-b border-gray-200">
      <Text className="text-base font-sansBold text-gray-700">{title}</Text>
      <Text className="text-base text-gray-600 mt-1">{description}</Text>
    </View>
  );

  return (
    <View className="pt-4">
      <ServiceItem title="Tipo de Lavagem" description="Lavagem Doméstica" />
      <ServiceItem
        title="Formas de Entrega"
        description="Retirada na Lavanderia e Entrega a Domicílio"
      />
      <ServiceItem
        title="O que não lavamos"
        description="Tapetes, Cortinas e Edredons."
      />
    </View>
  );
};

// --- TELA PRINCIPAL ---
export default function LaundryProfileScreen({ route }: any) {
  const navigation = useNavigation<NavigationProp<any>>();
  const [activeTab, setActiveTab] = useState<"Avaliações" | "Serviços">(
    "Avaliações"
  );

  // --- ESTADOS DE DADOS (LIFTED STATE) ---
  const [allFeedbacks, setAllFeedbacks] = useState<Feedback[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);

  const { customerData } = useContext(CustomerContext);
  const laundryId = route.params.params.id;

  async function goToChat() {
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
      navigation.navigate('ChatRoute', {
        screen: 'ChatScreen',
        params: {
          chatId: chat.id,
        }
      });
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  const fetchFeedbacks = async (isRefreshing = false) => {
    if (!laundryId) return;

    const pageToFetch = isRefreshing ? 1 : page;
    if (isRefreshing) {
      setIsLoading(true);
    } else {
      setIsLoadingMore(true);
    }

    const newFeedbacks = await getFeedbacks(laundryId, pageToFetch);

    if (newFeedbacks.length > 0) {
      setAllFeedbacks((prev) =>
        isRefreshing ? newFeedbacks : [...prev, ...newFeedbacks]
      );
      setPage(pageToFetch + 1);
    }
    if (newFeedbacks.length < 10) {
      setHasMore(false);
    }

    setIsLoading(false);
    setIsLoadingMore(false);
  };

  useEffect(() => {
    fetchFeedbacks(true); // Carga inicial
  }, [laundryId]);

  const handleLoadMore = () => {
    if (!isLoadingMore && hasMore) {
      fetchFeedbacks();
    }
  };

  const handleRefresh = () => {
    fetchFeedbacks(true);
  };

  const filteredFeedbacks = useMemo(() => {
    // Se o filtro for null ("Todos"), retorna a lista completa
    if (selectedFilter === null) {
      return allFeedbacks;
    }
    // Se não for null, é uma string como "5★", então podemos filtrar
    const starFilter = parseInt(selectedFilter.charAt(0));
    return allFeedbacks.filter((fb) => fb.feedbackPost.rate === starFilter);
  }, [allFeedbacks, selectedFilter]);

  const date = new Date();
  date.setMinutes(date.getMinutes() + route.params.params.duration);

  const makeRate = (grade: number[]) => {
    if (grade.length === 0) {
      return "0 avaliações";
    }
    let rate = 0;
    grade.forEach((g) => {
      rate += g;
    });
    const finalRate = rate / grade.length;
    return finalRate.toFixed(1);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await Clipboard.setStringAsync(text);
      Alert.alert("Sucesso", "Texto copiado para a área de transferência!");
    } catch (error) {
      Alert.alert("Erro", "Não foi possível copiar o texto.");
      console.error(error);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Carrossel de Imagens */}
        <View className="h-60">
          <FlatList
            className="bg-black"
            data={laundryImages}
            keyExtractor={(item, i) => i.toString()}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <ModalImage
                source={item}
                sourceArr={laundryImages}
                resizeMode="contain"
              />
            )}
          />
          <BackArrow />
        </View>

        <View className="p-4">
          {/* Informações Principais */}
          <Text className="text-2xl font-sansBold text-gray-800">
            {route.params.params.name}
          </Text>
          <Text className="text-base text-gray-500 mt-1">
            {route.params.params.duration < 1
              ? "Menos que 1 minuto"
              : `${route.params.params.duration} min`}{" "}
            • Chega às {date.getHours().toString().padStart(2, "0")}:
            {date.getMinutes().toString().padStart(2, "0")}
          </Text>
          <View className="flex-row items-center mt-1">
            {route.params.params.grade.length !== 0 && (
              <Text className="text-lg text-yellow-500 mr-1">
                (
                {route.params.params.grade.length > 50
                  ? "+50"
                  : route.params.params.grade.length}
                )
              </Text>
            )}
            <Text className="text-yellow-500 text-lg font-sansBold mr-1">
              {makeRate(route.params.params.grade)}
            </Text>
            <Text className="text-yellow-500">
              <StarRating
                starSize={20}
                rating={Number(makeRate(route.params.params.grade))}
              />
            </Text>
          </View>

          {/* Detalhes e Ações */}
          <View className="mt-6">
            <View className="flex-row justify-between items-center mb-4">
              <View className="flex-row items-start flex-1 mr-4">
                <Ionicons
                  name="call-outline"
                  size={22}
                  color="#4B5563"
                  className="mt-1"
                />
                <TouchableOpacity
                  onPress={() => copyToClipboard("+55 11 98765-4900")}
                >
                  <Text className="text-sm text-gray-700 ml-3">
                    +55 11 98765-4900
                  </Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("LaundryScheduleScreen", {
                    ...route.params.params,
                  })
                }
                className="flex-row items-center border border-gray-300 rounded-lg p-3 flex-1"
              >
                <Ionicons name="calendar-outline" size={24} color="#4B5563" />
                <View className="ml-3">
                  <Text className="text-sm font-sansBold text-gray-800">
                    Agendamento
                  </Text>
                  <Text className="text-xs text-gray-500">Requer Login</Text>
                </View>
              </TouchableOpacity>
            </View>

            <View className="flex-row justify-between items-center mb-4">
              <View className="flex-row items-start flex-1 mr-4">
                <Ionicons
                  name="location-outline"
                  size={22}
                  color="#4B5563"
                  className="mt-1"
                />
                <TouchableOpacity
                  onPress={() => copyToClipboard(route.params.params.address)}
                >
                  <Text
                    className="text-sm text-gray-700 ml-3"
                    numberOfLines={2}
                  >
                    {route.params.params.address}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View className="flex-row justify-between items-center">
              <View className="flex-row items-start flex-1 mr-4">
                <Ionicons
                  name="time-outline"
                  size={22}
                  color="#4B5563"
                  className="mt-1"
                />
                <Text className="w-[85%] text-sm text-gray-700 ml-3">
                  {route.params.params.opening}
                </Text>
              </View>
              <TouchableOpacity
                onPress={goToChat}
                className="flex-row items-center border border-gray-300 rounded-lg p-3 flex-1"
              >
                <Ionicons
                  name="chatbubbles-outline"
                  size={24}
                  color="#4B5563"
                />
                <View className="ml-3">
                  <Text className="text-sm font-sansBold w-[80%] text-gray-800">
                    Entrar em contato agora
                  </Text>
                  <Text className="text-xs w-[80%] text-gray-500">
                    Geralmente responde em um dia
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* Navegação por Abas */}
          <View className="flex-row mt-8 border-b border-gray-200">
            <TouchableOpacity
              onPress={() => setActiveTab("Avaliações")}
              className={`flex-1 items-center pb-2 border-b-2 ${activeTab === "Avaliações" ? "border-purple-600" : "border-transparent"}`}
            >
              <Text
                className={`font-sansBold ${activeTab === "Avaliações" ? "text-purple-600" : "text-gray-500"}`}
              >
                Avaliações
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setActiveTab("Serviços")}
              className={`flex-1 items-center pb-2 border-b-2 ${activeTab === "Serviços" ? "border-purple-600" : "border-transparent"}`}
            >
              <Text
                className={`font-sansBold ${activeTab === "Serviços" ? "text-purple-600" : "text-gray-500"}`}
              >
                Serviços
              </Text>
            </TouchableOpacity>
          </View>

          {/* Conteúdo da Aba */}
          {activeTab === "Avaliações" ? (
            isLoading && page === 1 ? (
              <ActivityIndicator
                size="large"
                color="#8A63D2"
                className="my-10"
              />
            ) : (
              <ReviewsSection
                laundryId={laundryId}
                reviews={filteredFeedbacks}
                selectedFilter={selectedFilter}
                onFilterChange={setSelectedFilter}
                onLoadMore={handleLoadMore}
                onFeedbackPosted={handleRefresh}
                isLoadingMore={isLoadingMore}
                hasMore={hasMore}
              />
            )
          ) : (
            <ServicesSection />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
