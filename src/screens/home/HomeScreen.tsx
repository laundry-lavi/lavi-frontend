import React, { useContext, useEffect } from "react";
import { View, Image, FlatList, TouchableOpacity } from "react-native";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import * as SplashScreen from "expo-splash-screen";

import { Text, Header, SmallLaundryCard } from "@/components";
import { LaundryHome } from "@/screens/laundryScreens/";
import {
  AuthenticationContext,
  LaundriesListContext,
  CustomerContext,
} from "@/contexts/";
import { useSocket } from "@/contexts/SocketContext";
import { getSession } from "@/storage/session";
import { authInSocketIO } from "@/functions/authInSocketIO";
import { useInAppNotification } from "@/contexts/InAppNotification";

export default function HomeScreen() {
  const navigation = useNavigation<NavigationProp<any>>();
  const socket = useSocket();
  const { customerData } = useContext(CustomerContext);
  const { isLaundry } = useContext(AuthenticationContext);
  const { laundriesList, getLaundriesList } = useContext(LaundriesListContext);
  const { showNotification } = useInAppNotification(); // Hook mágico

  const handleNovaMensagem = () => {
    showNotification({
      title: "Nova Mensagem",
      message: "Rafael: Oi, tudo bem?",
      type: "info", // ou 'success', 'error', 'warning'
      onPress: () => {
        navigation.navigate("ChatScreen", { chatId: "123" });
      },
    });
  };

  useEffect(() => {
    if (isLaundry) {
      return;
    }
    const fetchLaundries = async () => {
      await getLaundriesList();
    };
    fetchLaundries();
  }, []);

  useEffect(() => {
    authInSocketIO(socket);
    handleNovaMensagem();
  }, []);

  return isLaundry ? (
    <LaundryHome />
  ) : (
    <View className="flex-1">
      <Header />
      <FlatList
        className="px-4" // Adiciona padding horizontal à lista
        showsVerticalScrollIndicator={false}
        data={laundriesList}
        ListHeaderComponent={
          // Componentes que aparecem no topo da lista
          <>
            <Image
              className="h-[28vh] w-full rounded-xl my-3"
              source={require("assets/promo.png")}
              resizeMode="cover"
            />
            <Text className="text-lg text-[#210030] font-sansBold mb-3">
              Lavanderias em alta
            </Text>
          </>
        }
        renderItem={({ item }) => {
          return (
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("LaundryRoute", { ...item });
              }}
            >
              <SmallLaundryCard item={item} />
            </TouchableOpacity>
          );
        }}
        keyExtractor={(item, i) => i.toString()}
      />
    </View>
  );
}
