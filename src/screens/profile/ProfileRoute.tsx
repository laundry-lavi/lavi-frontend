import { createStackNavigator } from "@react-navigation/stack";
import ProfileScreen from "./ProfileScreen";

const Stack = createStackNavigator();

export default function ProfileRoute() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Profile" component={ProfileScreen} />
    </Stack.Navigator>
  );
}
