import AntDesign from "@expo/vector-icons/AntDesign";
import { TouchableOpacity } from "react-native";
import { NavigationProp, useNavigation } from "@react-navigation/native";

export default function BackArrow() {
  const navigation = useNavigation<NavigationProp<any>>();
  return (
    <TouchableOpacity
      className="absolute top-4 left-4 z-50 rounded-[50%] bg-white size-12"
      onPress={() => navigation.goBack()}
    >
      <AntDesign name="arrowleft" size={40} color="black" />
    </TouchableOpacity>
  );
}
