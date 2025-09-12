import AntDesign from "@expo/vector-icons/AntDesign";
import { TouchableOpacity } from "react-native";
import { NavigationProp, useNavigation } from "@react-navigation/native";

export default function BackArrow({ size = 36 }: { size?: number }) {
  const navigation = useNavigation<NavigationProp<any>>();
  return (
    <TouchableOpacity
      className="absolute top-4 left-4 z-10 justify-center p-1 items-center rounded-[50%] bg-white"
      onPress={() => navigation.goBack()}
    >
      <AntDesign name="arrowleft" size={size} color="black" />
    </TouchableOpacity>
  );
}
