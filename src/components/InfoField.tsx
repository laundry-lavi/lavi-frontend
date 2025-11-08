import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { PasswordVisibilityState } from "@/types";
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface InfoFieldProps {
  label: string;
  value: string;
  iconName?: keyof typeof Ionicons.glyphMap;
  isPassword?: boolean;
  width?: string;
}

export default function InfoField({
  label,
  value,
  iconName,
  isPassword = false,
  width = "w-full",
}: InfoFieldProps) {
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

  return (
    <View className={`mb-4 ${width}`}>
      <Text className="text-sm font-semibold text-gray-600 mb-1 ml-1">
        {label}
      </Text>
      <View className="flex-row items-center justify-between bg-white border border-gray-200 rounded-lg px-3 py-3">
        <Text
          className={`text-base ${isPassword ? "font-bold" : "text-gray-700"}`}
        >
          {isPassword
            ? passwordVisibility.isVisible
              ? "••••••••"
              : value
            : value}
        </Text>
        {isPassword && (
          <TouchableOpacity onPress={handlePasswordVisibility}>
            <MaterialCommunityIcons
              name={passwordVisibility.iconName}
              size={24}
              color="#d9d9d9"
            />
          </TouchableOpacity>
        )}
        {iconName && (
          <TouchableOpacity>
            <Ionicons name={iconName} size={20} color="#9ca3af" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
