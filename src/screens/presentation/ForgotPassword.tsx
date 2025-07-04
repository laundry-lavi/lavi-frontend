import { View, Text, TouchableOpacity } from "react-native";
import { NavigationProp, useNavigation } from "@react-navigation/native";

export default function ForgotPassword() {
  const navigation = useNavigation<NavigationProp<any>>();
  return (
    <View>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text>voltar</Text>
      </TouchableOpacity>
      <Text>Forgot Password</Text>
      <TouchableOpacity>
        <Text>Enviar email!</Text>
      </TouchableOpacity>
    </View>
  );
}
