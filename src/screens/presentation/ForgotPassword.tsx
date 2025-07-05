import { View, Text, TouchableOpacity, ImageBackground } from "react-native";
import { NavigationProp, useNavigation } from "@react-navigation/native";

export default function ForgotPassword() {
  const navigation = useNavigation<NavigationProp<any>>();
  return (
    <View>
      <ImageBackground
        className="w-full h-full"
        source={require("assets/bubble-bg.png")}
      >
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text>voltar</Text>
        </TouchableOpacity>
        <Text>Forgot Password</Text>
        <TouchableOpacity>
          <Text>Enviar email!</Text>
        </TouchableOpacity>
      </ImageBackground>
    </View>
  );
}
