import { createStackNavigator } from "@react-navigation/stack";
import MapScreen from "./MapScreen";

import { LaundriesListProvider } from "@/contexts/";

const Stack = createStackNavigator();

export default function MapRoute() {
  return (
    <LaundriesListProvider>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="MapScreen" component={MapScreen} />
      </Stack.Navigator>
    </LaundriesListProvider>
  );
}
