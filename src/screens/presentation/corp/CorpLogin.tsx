import React, { useState, useEffect, useContext } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  Image,
  Alert,
  ActivityIndicator, // <--- Importe isso
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage"; // <--- Importe isso
import { NavigationProp, useNavigation } from "@react-navigation/native";

import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

import { Text, BackArrow, PasswordInput } from "@/components";
import { AuthenticationContext, OwnerContext } from "@/contexts/";
import { getMember } from "@/functions/";
import { API_URL } from "@/constants/backend";
import { saveMemberSession } from "@/storage/session";

interface laundryLoginData {
  email: string;
  password: string;
}

export default function CorpLogin() {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false); // <--- Estado de Loading

  const navigation = useNavigation<NavigationProp<any>>();
  const { setIsLaundryTrue } = useContext(AuthenticationContext);
  const { setOwnerData } = useContext(OwnerContext);

  const [errors, setErrors] = useState<{ [key: string]: string | null }>({});

  const validateFields = () => {
    const newErrors: { [key: string]: string | null } = {};

    if (!email.trim() || !email.includes("@"))
      newErrors.email = "O email é inválido.";
    if (password.length < 8)
      newErrors.password = "A senha deve ter pelo menos 8 caracteres.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // === NOVA LÓGICA REFATORADA ===
  const authenticateLaundry = async (laundry: laundryLoginData) => {
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/members/auth`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: laundry.email,
          password: laundry.password,
        }),
      });

      const body = await response.json();
      console.log(body);

      // 1. Validação de Credenciais (401)
      if (response.status === 401) {
        Alert.alert("Erro", "E-mail ou senha incorretos.");
        return;
      }

      // 2. Validação de Erros Genéricos
      if (response.status !== 200 && response.status !== 201) {
        throw new Error(body.details || "Erro ao autenticar.");
      }

      // 3. Se chegou aqui, o token é válido. Agora buscamos os dados do membro.
      const member = body.member;

      if (!member) {
        throw new Error("Login validado, mas dados do membro não encontrados.");
      }

      // 4. Atualiza o Contexto (Memória)
      setIsLaundryTrue(); // Define que é uma lavanderia
      setOwnerData({
        name: member.name,
        email: member.email,
        cpf: member.cpf,
        memberId: member.id,
        token: body.token,
        role: member.roles[0],
      });

      // 5. Persiste a Sessão (Disco)
      // Salvamos o tipo como 'corporate' para diferenciar do 'customer' no auto-login
      await saveMemberSession(body.token);
      Alert.alert("Sucesso", "Login realizado com sucesso!");
      navigation.navigate("InitialRoute");
    } catch (error: any) {
      console.error("Erro login corp:", error);
      Alert.alert("Erro", error.message || "Ocorreu um erro inesperado.");
    } finally {
      setIsLoading(false);
    }
  };
  // ==============================

  const handleSubmit = () => {
    if (isLoading) return; // Evita duplo clique

    if (validateFields()) {
      const laundryData: laundryLoginData = {
        email: email,
        password: password,
      };
      authenticateLaundry(laundryData);
    } else {
      Alert.alert("Atenção", "Por favor, corrija os campos destacados.");
    }
  };

  return (
    <View>
      <ImageBackground
        className="w-full h-full"
        source={require("assets/bubble-bg2.png")}
      >
        <BackArrow />

        <Image
          className="h-[140] mt-20 self-center"
          source={require("assets/logo.png")}
          resizeMode="contain"
        />

        <View className="gap-3 w-[95vw] h-[70vh] mx-auto my-3 p-4 bg-white border rounded-xl border-[#d9d9d9]">
          <Text className="text-[#5b5265] text-xl font-sansBold text-center my-7">
            Que bom ter você de volta!
          </Text>

          {/* CAMPO DE EMAIL */}
          <View
            className={`flex flex-row items-center gap-2 p-1 pl-2 border rounded-xl ${
              errors.email ? "border-red-500" : "border-[#d9d9d9]"
            }`}
          >
            <MaterialCommunityIcons name="mail" size={24} color="#d9d9d9" />
            <TextInput
              className="flex-1 text-xl"
              placeholder="Seu email"
              placeholderTextColor="#d9d9d9"
              onChangeText={(text) => setEmail(text)}
              value={email}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="email"
            />
          </View>
          {errors.email && (
            <Text className="w-full text-red-500 -mt-2 mb-1">
              {errors.email}
            </Text>
          )}

          {/* CAMPO DE SENHA */}
          <PasswordInput
            style={`flex flex-row items-center gap-2 p-2 mb-1 border rounded-xl ${
              errors.password ? "border-red-500" : "border-[#d9d9d9]"
            }`}
            password={password}
            setPassword={setPassword}
          />
          {errors.password && (
            <Text className="w-full text-red-500 -mt-2 mb-1">
              {errors.password}
            </Text>
          )}

          <TouchableOpacity
            onPress={() => navigation.navigate("ForgotPassword")}
            className="mb-3"
          >
            <Text className="text-[#737373] underline">
              Esqueceu sua senha?
            </Text>
          </TouchableOpacity>

          {/* BOTÃO DE LOGIN COM LOADING */}
          <TouchableOpacity
            className={`w-full py-3 items-center rounded-lg ${isLoading ? "bg-gray-400" : "bg-[#080030]"}`}
            onPress={handleSubmit} // Removi o setIsLaundryTrue daqui e coloquei no sucesso da função
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text className="text-white text-lg font-sansBold">Login</Text>
            )}
          </TouchableOpacity>

          <View className="flex flex-row items-center justify-center mb-10">
            <Text className="text-[#545454]">Não tem uma conta? </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("OwnerRegister")}
            >
              <Text className="text-[#822083] underline">Cadastrar-se</Text>
            </TouchableOpacity>
          </View>

          <Text className="text-center text-[#545454]">
            Ou, continuar por...
          </Text>
          <TouchableOpacity className="mx-auto p-3 border border-black rounded-lg">
            <AntDesign name="google" size={50} color="black" />
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
}
