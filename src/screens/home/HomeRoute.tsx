import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "./HomeScreen";
import LaundryRoute from "@/screens/laundry/LaundryRoute";

const Stack = createStackNavigator();

export default function HomeRoute() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="LaundryRoute" component={LaundryRoute} />
    </Stack.Navigator>
  );
}
