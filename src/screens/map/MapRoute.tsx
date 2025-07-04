import { createStackNavigator } from "@react-navigation/stack";
import MapScreen from "./MapScreen";

const Stack = createStackNavigator();

export default function MapRoute() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Map" component={MapScreen} />
    </Stack.Navigator>
  );
}
