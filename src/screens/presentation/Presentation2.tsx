import { View, Text, TouchableOpacity } from "react-native";
import { NavigationProp, useNavigation } from "@react-navigation/native";

export default function Presentation2() {
  const navigation = useNavigation<NavigationProp<any>>();
  return (
    <View>
      <Text>Presentation 2</Text>
      <TouchableOpacity onPress={() => navigation.navigate("Presentation3")}>
        <Text>Próximo</Text>
      </TouchableOpacity>
    </View>
  );
}
