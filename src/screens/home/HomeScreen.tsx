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

export default function HomeScreen() {
  const navigation = useNavigation<NavigationProp<any>>();
  const { customerData } = useContext(CustomerContext);
  const { isLaundry } = useContext(AuthenticationContext);
  const { laundriesList, getLaundriesList } = useContext(LaundriesListContext);

  useEffect(() => {
    if (isLaundry) {
      return;
    }
    const fetchLaundries = async () => {
      await getLaundriesList();
    };
    fetchLaundries();
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
