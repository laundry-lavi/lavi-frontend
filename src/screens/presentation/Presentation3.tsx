import { View, Text, TouchableOpacity } from "react-native";
import { NavigationProp, useNavigation } from "@react-navigation/native";

export default function Presentation3() {
  const navigation = useNavigation<NavigationProp<any>>();
  return (
    <View>
      <Text>Presentation 3</Text>
      <TouchableOpacity onPress={() => navigation.navigate("Welcome")}>
        <Text>Próximo</Text>
      </TouchableOpacity>
    </View>
  );
}
