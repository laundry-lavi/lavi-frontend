import { View, TouchableOpacity, Image, ImageBackground } from "react-native";
import { NavigationProp, useNavigation } from "@react-navigation/native";

import { Text } from "@/components";

export default function Presentation2() {
  const navigation = useNavigation<NavigationProp<any>>();
  return (
    <View>
      <ImageBackground
        className="w-full h-full py-10"
        source={require("assets/bubble-bg3.png")}
      >
        <View className="flex-[2] items-center justify-between">
          <Image
            className="h-[140]"
            source={require("assets/logo.png")}
            resizeMode="contain"
          />
          <Text className="text-3xl font-sansBold">Bem vindo! 2</Text>
        </View>
        <View className="flex-[4] items-center justify-around">
          <Text className="text-base w-[70%] text-center">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Et enim
            praesentium nostrum blanditiis aliquid possimus, fuga velit dolor
            aliquam, excepturi labore temporibus consequatur eum. Adipisci
            necessitatibus quas velit laudantium eius!
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("Presentation3")}
          >
            <Text>Próximo</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
}
