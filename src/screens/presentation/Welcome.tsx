import { View, Text, TouchableOpacity, ImageBackground } from "react-native";
import { NavigationProp, useNavigation } from "@react-navigation/native";

export default function Welcome() {
  const navigation = useNavigation<NavigationProp<any>>();
  return (
    <View>
      <ImageBackground
        className="w-full h-full"
        source={require("assets/bubble-bg.png")}
      >
        <Text>Welcome</Text>
        <TouchableOpacity onPress={() => navigation.navigate("CorpWelcome")}>
          <Text>Sou uma empresa</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("ClientWelcome")}>
          <Text>Sou um cliente</Text>
        </TouchableOpacity>
      </ImageBackground>
    </View>
  );
}
