import { View, TouchableOpacity, Image, ImageBackground } from "react-native";
import { NavigationProp, useNavigation } from "@react-navigation/native";

import BackArrow from "@/components/BackArrow";
import Text from "@/components/MyText";

export default function ClientWelcome() {
  const navigation = useNavigation<NavigationProp<any>>();
  return (
    <View>
      <ImageBackground
        className="w-full h-full py-10"
        source={require("assets/bubble-bg3.png")}
      >
        <BackArrow />
        <View className="flex-[2] items-center justify-between mb-14">
          <Image
            className="h-[140]"
            source={require("assets/logo.png")}
            resizeMode="contain"
          />
          <Text className="text-3xl font-sansBold text-[#822083]">
            Olá, Bem-Vindo!
          </Text>
          <Text className="text-xl w-[60%] text-center">
            <Text className="font-sansBold">Cliente</Text> faça o seu login ou
            cadastro abaixo
          </Text>
        </View>
        <View className="flex-[4] items-center justify-center gap-3">
          <TouchableOpacity
            className="w-[80%] py-3 items-center bg-[#370e38] rounded-lg"
            onPress={() => navigation.navigate("ClientSignin")}
          >
            <Text className="text-white text-lg font-sansBold">Cadastro</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="w-[80%] py-3 items-center border-2 border-[#370e38] rounded-lg"
            onPress={() => navigation.navigate("ClientLogin")}
          >
            <Text className="text-[#370e38] text-lg font-sansBold">Login</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
}
