import { View, Text, TouchableOpacity } from "react-native";
import { NavigationProp, useNavigation } from "@react-navigation/native";

export default function ClientLogin() {
  const navigation = useNavigation<NavigationProp<any>>();
  return (
    <View>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text>voltar</Text>
      </TouchableOpacity>
      <Text>Client Login</Text>
      <TouchableOpacity onPress={() => navigation.navigate("InitialRoute")}>
        <Text>Logar!</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("ClientSignin")}>
        <Text>Não tenho conta!</Text>
      </TouchableOpacity>
    </View>
  );
}
