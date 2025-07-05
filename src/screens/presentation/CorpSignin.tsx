import { View, Text, TouchableOpacity, ImageBackground } from "react-native";
import { NavigationProp, useNavigation } from "@react-navigation/native";

export default function CorpSignin() {
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
        <Text>Corp Signin</Text>
        <TouchableOpacity onPress={() => navigation.navigate("InitialRoute")}>
          <Text>Cadastrar!</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("CorpLogin")}>
          <Text>Já tenho conta!</Text>
        </TouchableOpacity>
      </ImageBackground>
    </View>
  );
}
