import { View, Text, TouchableOpacity } from "react-native";
import { NavigationProp, useNavigation } from "@react-navigation/native";

export default function CorpWelcome() {
  const navigation = useNavigation<NavigationProp<any>>();
  return (
    <View>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text>voltar</Text>
      </TouchableOpacity>
      <Text>Corp Welcome</Text>
      <TouchableOpacity onPress={() => navigation.navigate("CorpLogin")}>
        <Text>Fazer Login</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("CorpSignin")}>
        <Text>Fazer cadastro</Text>
      </TouchableOpacity>
    </View>
  );
}
