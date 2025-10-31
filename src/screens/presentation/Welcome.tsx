import React, { useContext, useEffect } from "react";
import { View, TouchableOpacity, Image, ImageBackground } from "react-native";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import * as SplashScreen from "expo-splash-screen";

import { Text } from "@/components";
import { AuthenticationContext, LocationContext } from "@/contexts/";

SplashScreen.preventAutoHideAsync();

export default function Welcome() {
  const navigation = useNavigation<NavigationProp<any>>();
  const { setIsLaundryTrue, setIsLaundryFalse } = useContext(
    AuthenticationContext
  );
  const { location, getCurrentLocation } = useContext(LocationContext);

  useEffect(() => {
    getCurrentLocation();
    if (location) {
      SplashScreen.hideAsync();
    }
  }, [location]);

  if (!location) {
    return null;
  }

  return (
    <View>
      <ImageBackground
        className="w-full h-full py-10"
        source={require("assets/bubble-bg3.png")}
      >
        <View className="flex-[2] items-center justify-between mb-14">
          <Image
            className="h-[140]"
            source={require("assets/logo.png")}
            resizeMode="contain"
          />
          <Text className="text-3xl font-sansBold">Bem vindo!</Text>
        </View>
        <View className="flex-[4] items-center justify-center gap-3">
          <TouchableOpacity
            className="w-[80%] py-3 items-center bg-[#822083] rounded-lg"
            onPress={() => navigation.navigate("CorpWelcome")}
          >
            <Text className="text-white text-base font-sansBold">
              Sou empreendedor
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="w-[80%] py-3 items-center bg-[#370e38] rounded-lg"
            onPress={() => navigation.navigate("ClientWelcome")}
          >
            <Text className="text-white text-base font-sansBold">
              Sou Cliente
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="w-[80%] py-3 items-center bg-[#370e38] rounded-lg"
            onPress={() => {
              setIsLaundryFalse();
              navigation.navigate("InitialRoute");
            }}
          >
            <Text className="text-white text-base font-sansBold">
              Entrar como cliente convidado
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="w-[80%] py-3 items-center bg-[#370e38] rounded-lg"
            onPress={() => {
              setIsLaundryTrue();
              navigation.navigate("InitialRoute");
            }}
          >
            <Text className="text-white text-base font-sansBold">
              Entrar como empreendedor convidado
            </Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
}
