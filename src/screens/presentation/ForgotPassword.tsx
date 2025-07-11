import {
  View,
  TouchableOpacity,
  ImageBackground,
  TextInput,
} from "react-native";
import { NavigationProp, useNavigation } from "@react-navigation/native";

import Fontisto from "@expo/vector-icons/Fontisto";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import AntDesign from "@expo/vector-icons/AntDesign";

import { Text } from "@/components";

export default function ForgotPassword() {
  const navigation = useNavigation<NavigationProp<any>>();
  return (
    <View>
      <ImageBackground
        className="w-full h-full"
        source={require("assets/bubble-bg2.png")}
      >
        <View className="flex-[6] justify-center items-center">
          <Fontisto name="locked" size={36} color="#8866a2" />
          <Text className="text-5xl text-[#8866a2] font-sansBold">
            Esqueceu
          </Text>
          <Text className="text-5xl font-sansBold">sua senha?</Text>
          <Text>Não se preocupe</Text>
          <Text>Vamos te mandar as instruções</Text>
        </View>

        <View className="flex-[4] items-center p-10 border-t border-gray-200 rounded-lg">
          <View className="flex flex-row items-center gap-2 mb-3 p-1 pl-2 border rounded-xl border-[#d9d9d9]">
            <MaterialCommunityIcons name="mail" size={24} color="#d9d9d9" />
            <TextInput
              className="flex-1 text-xl font-sans"
              placeholder="Email"
              placeholderTextColor="#d9d9d9"
            />
          </View>
          <TouchableOpacity className="w-full mb-28 py-3 items-center border-2 bg-[#210030] rounded-lg">
            <Text className="text-white text-lg font-sansBold">
              Enviar E-mail
            </Text>
          </TouchableOpacity>

          <Text className="font-sansBold text-[#210030] mb-1">
            Voltar ao login
          </Text>
          <TouchableOpacity
            className="justify-center items-center rounded-[50%] bg-white border border-gray-100 size-12"
            onPress={() => navigation.goBack()}
          >
            <AntDesign name="arrowleft" size={36} color="black" />
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
}
