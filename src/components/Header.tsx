import { View, Image, TextInput } from "react-native";

import FontAwesome from "@expo/vector-icons/FontAwesome";

import Text from "./MyText";
import NotificationBtn from "./NotificationBtn";

export default function Header() {
  return (
    <View className="flex flex-row justify-between items-center h-[10vh] px-2 border-b border-x border-x-gray-300 border-b-gray-300 rounded-md">
      <Image
        className="h-[60%] w-20"
        source={require("assets/logo-min.png")}
        resizeMode="contain"
      />

      <View className="flex flex-row items-center gap-1 w-[70%] h-[5vh] p-px pl-2 border rounded-3xl border-[#d9d9d9]">
        <FontAwesome name="search" size={20} color="#a4a4a4" />
        <TextInput
          className="flex-1 text-xl"
          placeholder="Buscar Lavanderias"
          placeholderTextColor="#a4a4a4"
        />
      </View>
      <NotificationBtn />
    </View>
  );
}
