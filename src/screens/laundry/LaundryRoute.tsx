import { createStackNavigator } from "@react-navigation/stack";
import LaundryProfile from "./LaundryProfile";
import LaundrySchedule from "./LaundrySchedule";
import ConcludedOrder from "./ConcludedOrder";

const Stack = createStackNavigator();

export default function LaundryRoute() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="LaundryProfileScreen" component={LaundryProfile} />
      <Stack.Screen name="LaundryScheduleScreen" component={LaundrySchedule} />
      <Stack.Screen name="ConcludedOrderScreen" component={ConcludedOrder} />
    </Stack.Navigator>
  );
}
