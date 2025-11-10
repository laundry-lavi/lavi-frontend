import React from "react";
import { TouchableOpacity, View, Image } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

import Text from "./MyText";
import { Laundry } from "@/types";
import StarRating from "./StarRating";

export default function SmallLaundryCard({ item }: { item: Laundry }) {
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
  const date = new Date();
  date.setMinutes(date.getMinutes() + item.duration);

  return (
    <View className="flex flex-row gap-2 rounded-lg p-3 mb-3 w-full h-32 border border-[#d9d9d9]">
      <View className="w-1 h-full bg-[#a391c2] rounded-xl"></View>
      <View className="flex-[6] flex-col justify-between">
        <Text className="text-base font-bold text-gray-800 mt-1">
          {item.name}
        </Text>
        <View className="flex-row items-center mt-2">
          {item.grade.length !== 0 && (
            <Text className="text-sm text-yellow-500 mr-1">
              ({item.grade.length > 50 ? "+50" : item.grade.length})
            </Text>
          )}
          <Text className="text-sm text-yellow-500 mr-1">
            {makeRate(item.grade)}
          </Text>
          <Text className="text-yellow-500">
            <StarRating starSize={14} rating={Number(makeRate(item.grade))} />
          </Text>
        </View>
        <View className="flex flex-row justify-between">
          <Text className="text-xs text-gray-500 mt-1">{item.type}</Text>
          <TouchableOpacity>
            <Ionicons name="heart-outline" size={24} color="#4B5563" />
          </TouchableOpacity>
        </View>
      </View>
      <View className="flex-[4]">
        {/* <Image source={item.img} className="w-24 h-24 rounded-lg" /> */}
        <View className="flex-1 bg-purple-700/30 p-2 rounded-tl-lg rounded-br-lg items-center">
          <Ionicons name="location-sharp" size={20} color="white" />
          <Text className="text-white text-xs text-center font-bold">
            {item.duration < 1 ? "Menos que 1 minuto" : `${item.duration} min`}
          </Text>
          <Text className="text-white text-xs text-center">
            Chega às {date.getHours().toString().padStart(2, "0")}:
            {date.getMinutes().toString().padStart(2, "0")}
          </Text>
        </View>
      </View>
    </View>
  );
}
