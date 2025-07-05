import { createStackNavigator } from "@react-navigation/stack";
import ChatScreen from "./ChatScreen";

const Stack = createStackNavigator();

export default function ChatRoute() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ChatScreen" component={ChatScreen} />
    </Stack.Navigator>
  );
}
