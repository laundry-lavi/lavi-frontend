import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import Constants from "expo-constants";
import { Platform } from "react-native";

/**
 * Registra o dispositivo para receber notificações push e retorna o token do Expo.
 * Pode ser chamado de qualquer lugar, como login, splash ou inicialização do app.
 */
export async function registerForPushNotificationsAsync(): Promise<string | undefined> {
  let token: string | undefined;

  if (!Device.isDevice) {
    console.warn("As notificações só funcionam em dispositivos físicos.");
    return;
  }

  // Verifica permissões
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    console.warn("Permissão de notificações negada.");
    return;
  }

  // Obtém o token de push do Expo
  try {
    const projectId =
      Constants?.expoConfig?.extra?.eas?.projectId ??
      Constants?.easConfig?.projectId;

    const response = await Notifications.getExpoPushTokenAsync({ projectId });
    token = response.data;
    console.log("Expo Push Token:", token);
  } catch (error) {
    console.error("Erro ao obter token de notificação:", error);
  }

  // Configura canal de notificações (Android)
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  return token;
}

export async function sendLocalNotification(
  title: string,
  body: string
): Promise<void> {
  await Notifications.scheduleNotificationAsync({
    content: { title, body },
    trigger: null,
  });
}