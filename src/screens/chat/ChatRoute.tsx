import { createStackNavigator } from "@react-navigation/stack";
import ChatScreen from "./ChatScreen";

const Stack = createStackNavigator();

export default function ChatRoute() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Chat" component={ChatScreen} />
    </Stack.Navigator>
  );
}
