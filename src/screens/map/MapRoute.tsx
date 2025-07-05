import { createStackNavigator } from "@react-navigation/stack";
import MapScreen from "./MapScreen";

const Stack = createStackNavigator();

export default function MapRoute() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MapScreen" component={MapScreen} />
    </Stack.Navigator>
  );
}
