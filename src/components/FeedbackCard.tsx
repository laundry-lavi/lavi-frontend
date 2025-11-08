import React, { useEffect } from "react";
import { View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Feedback } from "@/types/";
import { Text } from "@/components";
import { getCustomer } from "@/functions";

export default function FeedbackCard({ feedback }: { feedback: Feedback }) {
  const formattedDate = new Date(
    feedback.feedbackPost.created_at
  ).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <View className="bg-white p-4 rounded-lg shadow-sm mb-3">
      {/* Cabeçalho do Card */}
      <View className="flex-row justify-between items-start mb-2">
        <View className="flex-1">
          <Text className="text-base font-bold text-gray-800">
            {feedback.customerName}
          </Text>
          <Text className="text-xs text-gray-500">{formattedDate}</Text>
        </View>
        <View className="flex-row items-center">
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
      </View>

      {/* Corpo do Comentário */}
      <View>
        <Text className="text-sm font-semibold text-gray-700 mb-1">
          {feedback.feedbackPost.title}
        </Text>
        <Text className="text-sm text-gray-600">
          {feedback.feedbackPost.content}
        </Text>
      </View>
    </View>
  );
}
