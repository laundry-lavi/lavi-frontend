import { createStackNavigator } from "@react-navigation/stack";
import LaundryHome from "./LaundryHome";
import OrdersScreen from "./OrdersScreen";
import OrdersInGoing from "./OrdersInGoing";
import OrdersConcluded from "./OrdersConcluded";
import OrderDetails from "./OrderDetails";

const Stack = createStackNavigator();

export default function LaundryScreensRoute() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="LaundryHomeScreen" component={LaundryHome} />
      <Stack.Screen name="OrdersScreen" component={OrdersScreen} />
      <Stack.Screen name="OrdersInGoing" component={OrdersInGoing} />
      <Stack.Screen name="OrdersConcluded" component={OrdersConcluded} />
      <Stack.Screen name="OrderDetails" component={OrderDetails} />
    </Stack.Navigator>
  );
}
