import React, { useRef, useState, useContext } from "react";
import {
  View,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
  ImageBackground,
  Dimensions,
} from "react-native";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";

import {
  OwnerContext,
  LaundryContext,
  AuthenticationContext,
} from "@/contexts";
import { InfoField, Text } from "@/components";

// --- Componente Principal da Tela ---
export default function LaundryProfileScreen() {
  const navigation = useNavigation<NavigationProp<any>>();
  const { ownerData } = useContext(OwnerContext);
  const { laundryData } = useContext(LaundryContext);
  const { isGuest } = useContext(AuthenticationContext);
  const profileData = {
    name: ownerData?.name,
    email: ownerData?.email,
    cpf: ownerData?.cpf,
    memberId: ownerData?.memberId,
    token: ownerData?.token || "",
  };

  const [activeIndex, setActiveIndex] = useState(0);
  const scrollViewRef = useRef(null);
  const { width: screenWidth } = Dimensions.get("window");

  const handleScroll = (event: {
    nativeEvent: { contentOffset: { x: any } };
  }) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / screenWidth);
    if (index !== activeIndex) {
      setActiveIndex(index);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-100">
      <ImageBackground
        className="w-full h-full p-3 pt-20"
        source={require("assets/bubble-bg.png")}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Ícone da Câmera */}
          <View className="items-center -mb-16 z-10">
            <View className="bg-white/80 p-4 rounded-full shadow-lg">
              <Ionicons name="camera-outline" size={32} color="#333" />
            </View>
          </View>

          {/* Avatares dos Funcionários */}
          {/* <View className="absolute top-4 left-4 flex-row">
            {[
              "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg",
              "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg",
              "https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg",
            ].map((uri, index) => (
              <Image
                key={index}
                source={{ uri }}
                className={`w-10 h-10 rounded-full border-2 border-white ${
                  index > 0 ? "-ml-3" : ""
                }`}
              />
            ))}
          </View> */}

          {/* Conteúdo Principal com Carrossel */}
          <View className="mt-20 mx-2">
            <ScrollView
              ref={scrollViewRef}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onScroll={handleScroll}
              scrollEventThrottle={16}
              style={{ width: screenWidth - 30, overflow: "visible" }}
            >
              {/* === Slide 1: Informações Principais === */}
              <View
                style={{ width: screenWidth - 44 }}
                className="bg-white p-4 rounded-2xl shadow-md mr-5"
              >
                {/* Título e Configurações */}
                <View className="flex-row justify-between items-center mb-6">
                  <View>
                    <Text className="text-2xl font-bold text-gray-800">
                      Perfil da Lavanderia
                    </Text>
                    <Text className="text-base text-gray-500">
                      Lavanderia Lava-bem
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => navigation.navigate("SettingsScreen")}
                    className="bg-gray-100 p-2 rounded-full"
                  >
                    <Ionicons name="settings-outline" size={24} color="#333" />
                  </TouchableOpacity>
                </View>

                <InfoField
                  label="Email"
                  value={laundryData?.laundry.email || ""}
                />
                <InfoField
                  label="Localização"
                  value={laundryData?.laundry.address || ""}
                />
                <InfoField
                  label="Telefone"
                  value={isGuest ? "" : "+55 11 98765-4320"}
                />

                <View className="flex-row justify-between">
                  <InfoField
                    label="Horários:"
                    value={laundryData?.laundry.opening || ""}
                    width="w-[48%]"
                  />
                </View>
              </View>

              {/* === Slide 2: Acesso e Horários === */}
              <View
                style={{ width: screenWidth - 40 }}
                className="bg-white p-6 rounded-2xl shadow-md"
              >
                <View className="flex-row justify-between items-center mb-6">
                  <View>
                    <Text className="text-2xl font-bold text-gray-800">
                      Seu Perfil
                    </Text>
                    <Text className="text-base text-gray-500">
                      {profileData.name}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => navigation.navigate("SettingsScreen")}
                    className="bg-gray-100 p-2 rounded-full"
                  >
                    <Ionicons name="settings-outline" size={24} color="#333" />
                  </TouchableOpacity>
                </View>

                <InfoField label="Email" value={profileData.email || ""} />
                <InfoField
                  label="Documento (CPF)"
                  value={profileData.cpf || ""}
                />
              </View>
            </ScrollView>

            {/* Bolinhas de Paginação */}
            <View className="flex-row justify-center mt-4">
              {[0, 1].map((i) => (
                <View
                  key={i}
                  className={`h-2 rounded-full mx-1 ${
                    activeIndex === i ? "bg-purple-500 w-4" : "bg-gray-300 w-2"
                  }`}
                />
              ))}
            </View>
          </View>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
}
