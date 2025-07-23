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
  FlatList,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation, NavigationProp } from "@react-navigation/native";

// --- TIPAGEM (TYPESCRIPT) ---

type Review = {
  id: string;
  userName: string;
  userAvatar: ImageSourcePropType;
  rating: number;
  date: string;
  comment: string;
  images: ImageSourcePropType[];
};

// --- DADOS DE EXEMPLO (MOCK DATA) ---
const laundryImages = [
  {
    id: "1",
    source: {
      uri: "https://images.pexels.com/photos/3993208/pexels-photo-3993208.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    },
  },
  {
    id: "2",
    source: {
      uri: "https://images.pexels.com/photos/7759439/pexels-photo-7759439.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    },
  },
  {
    id: "3",
    source: {
      uri: "https://images.pexels.com/photos/6782047/pexels-photo-6782047.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    },
  },
];

const reviewData: Review = {
  id: "r1",
  userName: "Fernando Hibsaro Silva Comelli",
  userAvatar: { uri: "https://i.pravatar.cc/150?img=12" },
  rating: 5,
  date: "18/07/2025",
  comment:
    "A Lave-bem é uma lavanderia com ótima reputação. Ela fez um ótimo trabalho com minhas roupas, até anexei algumas imagens com um antes e depois. Sensacional! Parece novo.",
  images: [
    {
      uri: "https://images.pexels.com/photos/1450372/pexels-photo-1450372.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
    {
      uri: "https://images.pexels.com/photos/2089698/pexels-photo-2089698.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
    {
      uri: "https://images.pexels.com/photos/4046313/pexels-photo-4046313.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
    // Adicione mais URIs para o contador "+2" funcionar
  ],
};

// --- COMPONENTES DA TELA ---

// Componente para a aba "Avaliações"
const ReviewsSection: React.FC = () => {
  const filters = ["Todos", "Mais recentes", "Mais antigos", "5★", "4★", "3★"];
  const [selectedFilter, setSelectedFilter] = useState("Todos");

  const renderStars = (count: number) => {
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <Ionicons
          key={i}
          name="star"
          size={16}
          color={i < count ? "#EAB308" : "#D1D5DB"}
        />
      ));
  };

  return (
    <View className="pt-4">
      {/* Filtros */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="mb-4"
      >
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter}
            onPress={() => setSelectedFilter(filter)}
            className={`py-2 px-4 rounded-lg border mr-2 ${selectedFilter === filter ? "bg-purple-100 border-purple-500" : "bg-white border-gray-300"}`}
          >
            <Text
              className={`font-semibold ${selectedFilter === filter ? "text-purple-600" : "text-gray-600"}`}
            >
              {filter}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Caixa de Comentário */}
      <View className="flex-row items-center border border-gray-300 rounded-lg p-2 mb-6">
        <Ionicons name="chatbubble-outline" size={20} color="#6B7280" />
        <TextInput
          placeholder="Deixar seu comentário..."
          className="flex-1 mx-2 text-gray-700"
        />
        <TouchableOpacity className="bg-purple-600 w-10 h-10 rounded-full justify-center items-center">
          <Ionicons name="send" size={20} color="white" />
        </TouchableOpacity>
      </View>

      {/* Cartão de Avaliação */}
      <View>
        <View className="flex-row items-start mb-2">
          <Image
            source={reviewData.userAvatar}
            className="w-10 h-10 rounded-full mr-3"
          />
          <View className="flex-1">
            <Text className="font-bold text-base text-gray-800">
              {reviewData.userName}
            </Text>
            <View className="flex-row items-center mt-1">
              <View className="flex-row mr-2">
                {renderStars(reviewData.rating)}
              </View>
              <Text className="text-sm text-gray-500">{reviewData.date}</Text>
            </View>
          </View>
        </View>
        <Text className="text-gray-700 leading-6 mb-4">
          {reviewData.comment}
        </Text>

        {/* Galeria de Imagens */}
        <View className="flex-row h-48">
          <Image
            source={reviewData.images[0]}
            className="w-1/2 h-full rounded-lg mr-2"
            resizeMode="cover"
          />
          <View className="w-1/2 h-full flex-col">
            <Image
              source={reviewData.images[1]}
              className="h-[48%] w-full rounded-lg mb-2"
              resizeMode="cover"
            />
            <View className="h-[48%] w-full relative">
              <Image
                source={reviewData.images[2]}
                className="h-full w-full rounded-lg"
                resizeMode="cover"
              />
              {reviewData.images.length > 3 && (
                <View className="absolute inset-0 bg-black/50 rounded-lg justify-center items-center">
                  <Text className="text-white text-2xl font-bold">
                    +{reviewData.images.length - 2}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

// Componente para a aba "Serviços"
const ServicesSection: React.FC = () => {
  const ServiceItem = ({
    title,
    description,
  }: {
    title: string;
    description: string;
  }) => (
    <View className="py-4 border-b border-gray-200">
      <Text className="text-base font-bold text-gray-700">{title}</Text>
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
export default function LaundryProfileScreen() {
  const navigation = useNavigation<NavigationProp<any>>();
  const [activeTab, setActiveTab] = useState<"Avaliações" | "Serviços">(
    "Avaliações"
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Carrossel de Imagens */}
        <View className="h-60">
          <FlatList
            data={laundryImages}
            keyExtractor={(item) => item.id}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <Image source={item.source} className="w-screen h-60" />
            )}
          />
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="absolute top-4 left-4 bg-black/40 p-2 rounded-full"
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
        </View>

        <View className="p-4">
          {/* Informações Principais */}
          <Text className="text-2xl font-bold text-gray-800">Lave-bem</Text>
          <Text className="text-base text-gray-500 mt-1">
            11 Minutos • Chega às 12:54
          </Text>
          <View className="flex-row items-center mt-1">
            <Text className="text-yellow-500 font-bold mr-1">4.8</Text>
            <Ionicons name="star" size={16} color="#EAB308" />
            <Ionicons name="star" size={16} color="#EAB308" />
            <Ionicons name="star" size={16} color="#EAB308" />
            <Ionicons name="star" size={16} color="#EAB308" />
            <Ionicons name="star-half" size={16} color="#EAB308" />
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
                <Text className="text-base text-gray-700 ml-3">
                  +55 11 98765-4900
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => navigation.navigate("LaundryScheduleScreen")}
                className="flex-row items-center border border-gray-300 rounded-lg p-3 flex-1"
              >
                <Ionicons name="calendar-outline" size={24} color="#4B5563" />
                <View className="ml-3">
                  <Text className="font-bold text-gray-800">Agendamento</Text>
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
                <Text
                  className="text-base text-gray-700 ml-3"
                  numberOfLines={2}
                >
                  R. 20 de Setembro, 700-Sala 12, Bela Vista, Teresina-PI,
                  13723-00
                </Text>
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
                <Text className="text-base text-gray-700 ml-3">
                  <Text className="font-bold text-green-600">Aberto</Text> •
                  Fecha às 19:00
                </Text>
              </View>
              <TouchableOpacity className="flex-row items-center border border-gray-300 rounded-lg p-3 flex-1">
                <Ionicons
                  name="chatbubbles-outline"
                  size={24}
                  color="#4B5563"
                />
                <View className="ml-3">
                  <Text className="font-bold text-gray-800">
                    Entrar em contato agora
                  </Text>
                  <Text className="text-xs text-gray-500">
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
                className={`font-bold ${activeTab === "Avaliações" ? "text-purple-600" : "text-gray-500"}`}
              >
                Avaliações
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setActiveTab("Serviços")}
              className={`flex-1 items-center pb-2 border-b-2 ${activeTab === "Serviços" ? "border-purple-600" : "border-transparent"}`}
            >
              <Text
                className={`font-bold ${activeTab === "Serviços" ? "text-purple-600" : "text-gray-500"}`}
              >
                Serviços
              </Text>
            </TouchableOpacity>
          </View>

          {/* Conteúdo da Aba */}
          {activeTab === "Avaliações" ? (
            <ReviewsSection />
          ) : (
            <ServicesSection />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
