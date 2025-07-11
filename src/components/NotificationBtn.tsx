import { View, TouchableOpacity } from "react-native";

import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

import Text from "./MyText";

export default function NotificationBtn() {
  return (
    <TouchableOpacity>
      <MaterialCommunityIcons name="bell" size={32} color="black" />
    </TouchableOpacity>
  );
}
