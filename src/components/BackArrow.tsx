import AntDesign from "@expo/vector-icons/AntDesign";
import { Appearance, TouchableOpacity } from "react-native";
import { NavigationProp, useNavigation } from "@react-navigation/native";

export default function BackArrow({ size = 36 }: { size?: number }) {
  const theme = Appearance.getColorScheme();
  const navigation = useNavigation<NavigationProp<any>>();
  return (
    <TouchableOpacity
      className="absolute top-4 left-4 z-10 justify-center p-1 items-center rounded-[50%] bg-white dark:bg-gray-800 dark:opacity-80"
      onPress={() => navigation.goBack()}
    >
      <AntDesign
        name="arrowleft"
        size={size}
        color={theme === "dark" ? "white" : "black"}
      />
    </TouchableOpacity>
  );
}
