import { useEffect } from "react";
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
  OwnerRegister,
  Presentation1,
  Presentation2,
  Presentation3,
  Welcome,
  CorpWelcome,
  ClientWelcome,
  ForgotPassword,
} from "@/screens/presentation";
import InitialRoute from "@/screens/InitialRoute";
import {
  LaundryHome,
  OrdersScreen,
  OrdersInGoing,
  OrdersConcluded,
  OrderDetails,
} from "@/screens/laundryScreens/";

import {
  AuthenticationProvider,
  OwnerProvider,
  LaundryProvider,
  LocationProvider,
  CustomerProvider,
} from "./src/contexts/";
import "./global.css";
import { SocketProvider } from "@/contexts/SocketContext";
import { NotificationProvider } from "@/contexts/InAppNotification";
import { ChatProvider } from "@/contexts/ChatContext";
import { LogBox } from "react-native";

// Ignora todos os logs de notificação na tela (Logs ainda aparecem no terminal)
LogBox.ignoreAllLogs();

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
          <OwnerProvider>
            <CustomerProvider>
              <LaundryProvider>
                <LocationProvider>
                  <AuthenticationProvider>
                    <NotificationProvider>
                      <SocketProvider>
                        <ChatProvider>
                          <SafeAreaView style={{ flex: 1 }}>
                            <StatusBar style="auto" hidden={false} />
                            <Stack.Navigator
                              initialRouteName="Welcome"
                              screenOptions={{
                                headerShown: false,
                                gestureEnabled: false,
                              }}
                            >
                              {/* <Stack.Screen name="Presentation1" component={Presentation1} />
              <Stack.Screen name="Presentation2" component={Presentation2} />
              <Stack.Screen name="Presentation3" component={Presentation3} /> */}
                              <Stack.Screen
                                name="Welcome"
                                component={Welcome}
                                options={{ gestureEnabled: false }}
                              />
                              <Stack.Screen
                                name="ClientLogin"
                                component={ClientLogin}
                                options={{ gestureEnabled: false }}
                              />
                              <Stack.Screen
                                name="ClientSignin"
                                component={ClientSignin}
                                options={{ gestureEnabled: false }}
                              />
                              <Stack.Screen
                                name="CorpLogin"
                                component={CorpLogin}
                                options={{ gestureEnabled: false }}
                              />
                              <Stack.Screen
                                name="CorpSignin"
                                component={CorpSignin}
                                options={{ gestureEnabled: false }}
                              />
                              <Stack.Screen
                                name="OwnerRegister"
                                component={OwnerRegister}
                                options={{ gestureEnabled: false }}
                              />
                              <Stack.Screen
                                name="CorpWelcome"
                                component={CorpWelcome}
                                options={{ gestureEnabled: false }}
                              />
                              <Stack.Screen
                                name="ClientWelcome"
                                component={ClientWelcome}
                                options={{ gestureEnabled: false }}
                              />
                              <Stack.Screen
                                name="ForgotPassword"
                                component={ForgotPassword}
                                options={{ gestureEnabled: false }}
                              />
                              <Stack.Screen
                                name="InitialRoute"
                                component={InitialRoute}
                                options={{ gestureEnabled: false }}
                              />
                              <Stack.Screen
                                name="LaundryHomeScreen"
                                component={LaundryHome}
                                options={{ gestureEnabled: false }}
                              />
                              <Stack.Screen
                                name="OrdersScreen"
                                component={OrdersScreen}
                                options={{ gestureEnabled: false }}
                              />
                              <Stack.Screen
                                name="OrdersInGoing"
                                component={OrdersInGoing}
                                options={{ gestureEnabled: false }}
                              />
                              <Stack.Screen
                                name="OrdersConcluded"
                                component={OrdersConcluded}
                                options={{ gestureEnabled: false }}
                              />
                              <Stack.Screen
                                name="OrderDetails"
                                component={OrderDetails}
                                options={{ gestureEnabled: false }}
                              />
                            </Stack.Navigator>
                          </SafeAreaView>
                        </ChatProvider>
                      </SocketProvider>
                    </NotificationProvider>
                  </AuthenticationProvider>
                </LocationProvider>
              </LaundryProvider>
            </CustomerProvider>
          </OwnerProvider>
        </SafeAreaProvider>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
