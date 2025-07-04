import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import {
  ClientLogin,
  ClientSignin,
  CorpLogin,
  CorpSignin,
  Presentation1,
  Presentation2,
  Presentation3,
  Welcome,
  CorpWelcome,
  ClientWelcome,
  ForgotPassword,
} from "@/screens/presentation";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <View style={{ flex: 1, paddingTop: 40 }}>
        <Stack.Navigator
          initialRouteName="Presentation1"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="Presentation1" component={Presentation1} />
          <Stack.Screen name="Presentation2" component={Presentation2} />
          <Stack.Screen name="Presentation3" component={Presentation3} />
          <Stack.Screen name="Welcome" component={Welcome} />
          <Stack.Screen name="ClientLogin" component={ClientLogin} />
          <Stack.Screen name="ClientSignin" component={ClientSignin} />
          <Stack.Screen name="CorpLogin" component={CorpLogin} />
          <Stack.Screen name="CorpSignin" component={CorpSignin} />
          <Stack.Screen name="CorpWelcome" component={CorpWelcome} />
          <Stack.Screen name="ClientWelcome" component={ClientWelcome} />
          <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
        </Stack.Navigator>
      </View>
      <StatusBar style="auto" hidden={false} />
    </NavigationContainer>
  );
}
