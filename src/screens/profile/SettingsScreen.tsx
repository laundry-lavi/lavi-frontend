import React, { useContext, useState, useEffect } from "react";
import {
  View,
  SafeAreaView,
  TouchableOpacity,
  Appearance,
  Alert,
  Switch,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { NavigationProp, useNavigation } from "@react-navigation/native";

import { BackArrow, Text } from "@/components";
import {
  CustomerContext,
  LaundryContext,
  OwnerContext,
  AuthenticationContext,
} from "@/contexts";

export default function SettingsScreen() {
  const navigation = useNavigation<NavigationProp<any>>();
  const { customerData, clearCustomerData } = useContext(CustomerContext);
  const { ownerData, clearOwnerData } = useContext(OwnerContext);
  const { laundryData, clearLaundryData } = useContext(LaundryContext);
  const { setIsLaundryFalse } = useContext(AuthenticationContext);

  const [isDarkMode, setIsDarkMode] = useState(
    Appearance.getColorScheme() === "dark"
  );

  // ALTERAÇÃO 2: Efeito para manter o switch sincronizado com o tema do sistema
  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setIsDarkMode(colorScheme === "dark");
    });

    return () => subscription.remove();
  }, []);

  // Sua função toggleTheme continua a mesma
  const toggleTheme = () => {
    const newTheme = isDarkMode ? "light" : "dark";
    Appearance.setColorScheme(newTheme);
    setIsDarkMode(!isDarkMode); // Sincroniza o estado local
  };

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
      <BackArrow />
      <View className="bg-[#2c003d] dark:bg-[#8313af] p-4 pt-3.5 pl-20">
        <View className="flex-row items-center">
          <View>
            <Text className="text-white text-2xl font-bold">Configurações</Text>
            <Text className="text-gray-300 text-sm">Opções de ajuste</Text>
          </View>
        </View>
      </View>

      <View className="p-5">
        <TouchableOpacity
          onPress={() => navigation.navigate("ProfileEditScreen")}
          className="py-4"
        >
          <Text className="text-gray-700 dark:text-white text-base">
            Dados do perfil
          </Text>
        </TouchableOpacity>

        <TouchableOpacity className="py-4 border-t border-gray-100 dark:border-gray-700">
          <Text className="text-gray-700 dark:text-white text-base">
            Notificações
          </Text>
        </TouchableOpacity>

        <View className="flex-row justify-between items-center py-4 border-t border-gray-100 dark:border-gray-700">
          <Text className="text-gray-700 dark:text-white text-base">
            Tema do App
          </Text>
          <Switch
            trackColor={{ false: "#767577", true: "#a276d7" }} // Cor da trilha do switch
            thumbColor={isDarkMode ? "#8313af" : "#f4f3f4"} // Cor do botão do switch
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleTheme}
            value={isDarkMode}
          />
        </View>

        <TouchableOpacity
          onPress={() => {
            Alert.alert(
              "Tem certeza que deseja sair?",
              "Ao sair, a sua conta será esquecida e você terá que entrar novamente.",
              [
                {
                  text: "Sair",
                  onPress: () => {
                    navigation.navigate("Welcome");
                    clearCustomerData();
                    clearOwnerData();
                    clearLaundryData();
                    setIsLaundryFalse();
                  },
                },
                {
                  text: "Cancelar",
                  onPress: () => {
                    return;
                  },
                },
              ]
            );
          }}
          className="py-4 border-t border-gray-100 dark:border-gray-700"
        >
          <Text className="text-red-500 text-base font-semibold">Sair</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
