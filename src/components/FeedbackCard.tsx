import React, { useEffect } from "react";
import { ScrollView, TouchableOpacity, View, Image } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Feedback } from "@/types/";
import { ModalImageCarousel, Text } from "@/components";
import { getCustomer } from "@/functions";
import { blankPhoto } from "assets/blank-icon";

export default function FeedbackCard({ feedback }: { feedback: Feedback }) {
  const formattedDate = new Date(
    feedback.feedbackPost.created_at
  ).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <View>
      <View className="flex-row items-start mb-2">
        <Image
          source={{ uri: feedback.customerProfileUrl || blankPhoto }}
          className="w-10 h-10 rounded-full mr-3"
        />
        <View className="flex-1">
          <Text className="font-sansBold text-base text-gray-800">
            {feedback.customerName}
          </Text>
          <View className="flex-row items-center mt-1">
            <View className="flex-row mr-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Ionicons
                  key={star}
                  name={
                    star <= feedback.feedbackPost.rate ? "star" : "star-outline"
                  }
                  size={16}
                  color="#facc15"
                />
              ))}
            </View>
            <Text className="text-sm text-gray-500">{formattedDate}</Text>
          </View>
        </View>
      </View>
      <Text className="text-base font-bold text-gray-800">
        {feedback.feedbackPost.title}
      </Text>
      <Text className="text-gray-700 leading-6 mb-4">
        {feedback.feedbackPost.content}
      </Text>

      {/* Galeria de Imagens */}
      {/* <ModalImageCarousel source={reviewImgs} resizeMode="cover" /> */}
      {/* {feedback.feedbackImages && feedback.feedbackImages.length > 0 && (
        <View className="mt-3">
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {feedback.feedbackImages.map((image) => (
              <TouchableOpacity key={image.id} activeOpacity={0.8}>
                <Image
                  source={{ uri: image.url }}
                  className="w-20 h-20 rounded-lg mr-2"
                  resizeMode="cover"
                />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )} */}
    </View>
  );
}
