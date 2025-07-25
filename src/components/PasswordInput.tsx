import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { PasswordInputProps, PasswordVisibilityState } from "../types";

export default function PasswordInput({
  password,
  setPassword,
}: PasswordInputProps) {
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
    <View className="flex flex-row items-center gap-2 p-2 border rounded-xl border-[#d9d9d9]">
      <MaterialCommunityIcons name="lock" size={24} color="#d9d9d9" />
      <TextInput
        className="flex-1 text-xl font-sans"
        placeholder="Senha"
        placeholderTextColor="#d9d9d9"
        secureTextEntry={passwordVisibility.isVisible}
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity onPress={handlePasswordVisibility}>
        <MaterialCommunityIcons
          name={passwordVisibility.iconName}
          size={24}
          color="#d9d9d9"
        />
      </TouchableOpacity>
    </View>
  );
}
