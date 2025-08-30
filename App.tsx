import { StatusBar } from "expo-status-bar";
import { createStackNavigator } from "@react-navigation/stack";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import {
  OpenSans_400Regular,
  OpenSans_700Bold,
  useFonts,
} from "@expo-google-fonts/open-sans";
import * as SplashScreen from "expo-splash-screen";

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
import InitialRoute from "@/screens/InitialRoute";

import "./global.css";
import { useEffect } from "react";

const Stack = createStackNavigator();

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [loaded, error] = useFonts({
    OpenSans_400Regular,
    OpenSans_700Bold,
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <SafeAreaProvider>
          <SafeAreaView style={{ flex: 1 }}>
            <StatusBar style="auto" hidden={false} />
            <Stack.Navigator
              initialRouteName="InitialRoute"
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
              <Stack.Screen name="InitialRoute" component={InitialRoute} />
            </Stack.Navigator>
          </SafeAreaView>
        </SafeAreaProvider>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
