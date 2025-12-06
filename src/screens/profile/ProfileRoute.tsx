import { createStackNavigator } from "@react-navigation/stack";
import ProfileScreen from "./ProfileScreen";
import ProfileEditScreen from "./ProfileEditScreen";
import SettingsScreen from "./SettingsScreen";

const Stack = createStackNavigator();

export default function ProfileRoute() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
      <Stack.Screen name="SettingsScreen" component={SettingsScreen} />
      <Stack.Screen name="ProfileEditScreen" component={ProfileEditScreen} />
    </Stack.Navigator>
  );
}
