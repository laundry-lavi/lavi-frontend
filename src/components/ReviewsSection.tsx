import React, { useState, useContext } from "react";
import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import Ionicons from "@expo/vector-icons/Ionicons";

import { Feedback } from "@/types";
import { FeedbackCard, StarRating, Text } from "@/components";
import { CustomerContext } from "@/contexts";

type ReviewsSectionProps = {
  laundryId: string;
  reviews: Feedback[];
  selectedFilter: string | null;
  onFilterChange: (filter: string | null) => void;
  onLoadMore: () => void;
  onFeedbackPosted: () => void; // Callback para recarregar a lista
  isLoadingMore: boolean;
  hasMore: boolean;
};

export default function ReviewsSection({
  laundryId,
  reviews,
  selectedFilter,
  onFilterChange,
  onLoadMore,
  onFeedbackPosted,
  isLoadingMore,
  hasMore,
}: ReviewsSectionProps) {
  const { customerData } = useContext(CustomerContext);

  // Estados locais para a caixa de novo comentário
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [rate, setRate] = useState(5);
  const [images, setImages] = useState<ImagePicker.ImagePickerAsset[]>([]);
  const [isPosting, setIsPosting] = useState(false);

  const filters = ["Todos", "5★", "4★", "3★", "2★", "1★"];

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.7,
      selectionLimit: 5,
    });

    if (!result.canceled) {
      setImages((prev) => [...prev, ...result.assets]);
    }
  };

  const createFeedback = async () => {
    if (!content || !title || isPosting) return;
    setIsPosting(true);

    try {
      // 1. Postar o texto do feedback
      const response = await fetch(
        "https://illuminational-earlene-incoherently.ngrok-free.dev/feedbacks/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            feedback: {
              content: content,
              title: title,
              laundryId: laundryId,
              customerId: customerData?.id,
            },
            rate: rate,
          }),
        }
      );
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Erro ao postar feedback");

      const feedbackId = data.feedback_created.id;

      // 2. Se houver imagens, fazer o upload delas (requer endpoint específico)
      // if (images.length > 0) {
      //   // LÓGICA DE UPLOAD DE IMAGEM IRIA AQUI
      //   // Ex: await uploadImages(feedbackId, images);
      //   console.log(
      //     "Simulando upload de",
      //     images.length,
      //     "imagens para o feedback ID:",
      //     feedbackId
      //   );
      // }

      // 3. Limpar campos e recarregar a lista
      setTitle("");
      setContent("");
      setImages([]);
      setRate(5);
      onFeedbackPosted(); // Chama a função do pai para recarregar a lista
    } catch (err) {
      console.error(err);
      // Adicionar um Alert.alert() para o usuário aqui seria ideal
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <View className="pt-4">
      {/* Filtros */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="mb-4"
      >
        {filters.map((filter) => {
          const isActive =
            (filter === "Todos" && selectedFilter === null) ||
            selectedFilter === filter;

          return (
            <TouchableOpacity
              key={filter}
              onPress={() => onFilterChange(filter === "Todos" ? null : filter)}
              className={`py-2 px-4 rounded-lg border mr-2 ${
                isActive
                  ? "bg-purple-100 border-purple-500"
                  : "bg-white border-gray-300"
              }`}
            >
              <Text
                className={`font-semibold ${
                  isActive ? "text-purple-600" : "text-gray-600"
                }`}
              >
                {filter}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Caixa de Comentário */}
      <View className="border border-gray-300 rounded-lg p-3 mb-6">
        <Text className="font-sansBold text-base mb-2">
          Deixe sua avaliação
        </Text>
        <StarRating rating={rate} onRatingChange={setRate} starSize={30} />
        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="Título da sua avaliação"
          className="border-b border-gray-200 py-2 my-2"
        />
        <TextInput
          multiline
          value={content}
          onChangeText={setContent}
          placeholder="Escreva sua experiência..."
          className="h-24"
          textAlignVertical="top"
        />
        <View className="flex-row justify-between items-center mt-2">
          {/* <TouchableOpacity onPress={pickImage}>
            <Ionicons name="attach-outline" size={24} color="#6B7280" />
          </TouchableOpacity> */}
          <TouchableOpacity
            onPress={createFeedback}
            disabled={isPosting}
            className="bg-purple-600 rounded-lg px-4 py-2"
          >
            {isPosting ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white font-sansBold">Enviar</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Lista de Avaliações com FlatList */}
      <FlatList
        data={reviews}
        keyExtractor={(item) => item.feedbackPost.id}
        renderItem={({ item }) => <FeedbackCard feedback={item} />}
        scrollEnabled={false} // Importante para não conflitar com o ScrollView pai
        ListFooterComponent={() =>
          hasMore && (
            <TouchableOpacity
              onPress={onLoadMore}
              disabled={isLoadingMore}
              className="bg-purple-100 p-3 rounded-lg flex-row justify-center items-center mt-2"
            >
              {isLoadingMore ? (
                <ActivityIndicator size="small" color="#6A3E9A" />
              ) : (
                <Text className="text-purple-800 font-bold">
                  Carregar mais avaliações
                </Text>
              )}
            </TouchableOpacity>
          )
        }
        ListEmptyComponent={() => (
          <View className="items-center justify-center py-10 bg-gray-50 rounded-lg">
            <Ionicons
              name="chatbox-ellipses-outline"
              size={32}
              color="#9CA3AF"
            />
            <Text className="text-gray-500 mt-2">
              Nenhuma avaliação encontrada.
            </Text>
          </View>
        )}
      />
    </View>
  );
}
