import { View, Text, TouchableOpacity } from "react-native";
import { NavigationProp, useNavigation } from "@react-navigation/native";

export default function ClientSignin() {
  const navigation = useNavigation<NavigationProp<any>>();
  return (
    <View>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text>voltar</Text>
      </TouchableOpacity>
      <Text>Client Signin</Text>
      <TouchableOpacity onPress={() => navigation.navigate("InitialRoute")}>
        <Text>Cadastrar!</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("ClientLogin")}>
        <Text>Já tenho conta!</Text>
      </TouchableOpacity>
    </View>
  );
}
