import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "./HomeScreen";

const Stack = createStackNavigator();

export default function HomeRoute() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
    </Stack.Navigator>
  );
}
