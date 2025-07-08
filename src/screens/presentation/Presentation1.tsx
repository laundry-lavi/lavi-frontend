import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ImageBackground,
} from "react-native";
import { NavigationProp, useNavigation } from "@react-navigation/native";

export default function Presentation1() {
  const navigation = useNavigation<NavigationProp<any>>();
  return (
    <View>
      <ImageBackground
        className="w-full h-full py-10"
        source={require("assets/bubble-bg3.png")}
      >
        <View className="flex-[2] items-center justify-between">
          <Image
            className="h-[80] border border-red-500"
            source={require("assets/logo.png")}
            resizeMode="contain"
          />
          <Text className="text-3xl font-bold">Bem vindo! 1</Text>
        </View>
        <View className="flex-[4] items-center justify-around">
          <Text className="text-base w-[70%] text-center">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Et enim
            praesentium nostrum blanditiis aliquid possimus, fuga velit dolor
            aliquam, excepturi labore temporibus consequatur eum. Adipisci
            necessitatibus quas velit laudantium eius!
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("Presentation2")}
          >
            <Text>Próximo</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
}
