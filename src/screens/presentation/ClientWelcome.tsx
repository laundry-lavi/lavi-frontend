import { View, Text, TouchableOpacity } from "react-native";
import { NavigationProp, useNavigation } from "@react-navigation/native";

export default function ClientWelcome() {
  const navigation = useNavigation<NavigationProp<any>>();
  return (
    <View>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text>voltar</Text>
      </TouchableOpacity>
      <Text>Client Welcome</Text>
      <TouchableOpacity onPress={() => navigation.navigate("ClientLogin")}>
        <Text>Fazer Login</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("ClientSignin")}>
        <Text>Fazer cadastro</Text>
      </TouchableOpacity>
    </View>
  );
}
