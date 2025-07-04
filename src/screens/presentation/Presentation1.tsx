import { View, Text, TouchableOpacity } from "react-native";
import { NavigationProp, useNavigation } from "@react-navigation/native";

export default function Presentation1() {
  const navigation = useNavigation<NavigationProp<any>>();
  return (
    <View>
      <Text>Presentation 1</Text>
      <TouchableOpacity onPress={() => navigation.navigate("Presentation2")}>
        <Text>Próximo</Text>
      </TouchableOpacity>
    </View>
  );
}
