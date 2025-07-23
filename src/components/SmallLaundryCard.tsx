import React from "react";
import { TouchableOpacity, View, Image } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

import Text from "./MyText";
import { Laundry } from "@/types";

export default function SmallLaundryCard({ item }: { item: Laundry }) {
  return (
    <View className="flex flex-row gap-2 rounded-lg p-3 mr-4 w-72 h-32 border border-[#d9d9d9]">
      <View className="w-1 h-full bg-[#a391c2] rounded-xl"></View>
      <View className="flex-[6] flex-col justify-between">
        <Text className="text-base font-bold text-gray-800 mt-1">
          {item.name}
        </Text>
        <View className="flex-row items-center mt-2">
          <Text className="text-sm text-yellow-500 mr-1">{item.grade}</Text>
          <Text className="text-yellow-500">★★★★★</Text>
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
          <Text className="text-white text-xs font-bold">
            {item.distance} minutos
          </Text>
          <Text className="text-white text-xs text-center">Chega ás 12:01</Text>
        </View>
      </View>
    </View>
  );
}
