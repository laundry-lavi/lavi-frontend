import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ImageBackground,
} from "react-native";
import { NavigationProp, useNavigation } from "@react-navigation/native";

export default function Welcome() {
  const navigation = useNavigation<NavigationProp<any>>();
  return (
    <View>
      <ImageBackground
        className="w-full h-full py-10"
        source={require("assets/bubble-bg3.png")}
      >
        <View className="flex-[2] items-center justify-between mb-14">
          <Image
            className="h-[140] border border-red-500"
            source={require("assets/logo.png")}
            resizeMode="contain"
          />
          <Text className="text-3xl font-bold">Bem vindo!</Text>
        </View>
        <View className="flex-[4] items-center justify-center gap-3">
          <TouchableOpacity
            className="w-[80%] py-3 items-center bg-[#822083] rounded-lg"
            onPress={() => navigation.navigate("CorpWelcome")}
          >
            <Text className="text-white text-base font-bold">
              Sou um Funcionário/Empresa
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="w-[80%] py-3 items-center bg-[#370e38] rounded-lg"
            onPress={() => navigation.navigate("ClientWelcome")}
          >
            <Text className="text-white text-base font-bold">Sou Cliente</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="w-[80%] py-3 items-center bg-[#370e38] rounded-lg"
            onPress={() => navigation.navigate("InitialRoute")}
          >
            <Text className="text-white text-base font-bold">
              Entrar como convidado
            </Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
}
