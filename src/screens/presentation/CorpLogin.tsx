import { View, Text, TouchableOpacity } from "react-native";
import { NavigationProp, useNavigation } from "@react-navigation/native";

export default function CorpLogin() {
  const navigation = useNavigation<NavigationProp<any>>();
  return (
    <View>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text>voltar</Text>
      </TouchableOpacity>
      <Text>Corp Login</Text>
      <TouchableOpacity onPress={() => navigation.navigate("InitialRoute")}>
        <Text>Logar!</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("ForgotPassword")}>
        <Text>Esqueci minha senha!</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("CorpSignin")}>
        <Text>Não tenho conta!</Text>
      </TouchableOpacity>
    </View>
  );
}
