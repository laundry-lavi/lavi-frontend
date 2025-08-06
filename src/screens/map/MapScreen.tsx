import { View } from "react-native";
import MapView from "react-native-maps";

import { Text, Header, BottomSheet } from "@/components";

export default function Map() {
  return (
    <View className="flex-1">
      <Header />
      <MapView style={{ flex: 1 }} showsUserLocation={true} />
      <BottomSheet />
    </View>
  );
}
