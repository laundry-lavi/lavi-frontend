import { useState, useContext } from "react";
import {
  View,
  TouchableOpacity,
  ImageBackground,
  Image,
  TextInput,
  Alert,
  ActivityIndicator, // Importe isso para feedback visual
} from "react-native";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

import { Text, BackArrow, PasswordInput } from "@/components";
import { UserLogin } from "@/types";
import { CustomerContext, OwnerContext } from "@/contexts";
import { API_URL } from "@/constants/backend";
import { saveCustomerSession } from "@/storage/session";

const dados = {
  email: "test3123@gmail.com",
  senha: "12345678",
};

export default function ClientLogin() {
  const { setCustomerData, customerData } = useContext(CustomerContext);
  const { clearOwnerData } = useContext(OwnerContext);
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Novo estado de loading
  const [errors, setErrors] = useState<{ [key: string]: string | null }>({});

  const navigation = useNavigation<NavigationProp<any>>();

  const validateFields = () => {
    const newErrors: { [key: string]: string | null } = {};

    if (!email.trim() || !email.includes("@"))
      newErrors.email = "O email é obrigatório.";

    if (password.length < 8) {
      newErrors.password = "A senha deve ter pelo menos 8 caracteres.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const loginCostumer = async (customer: UserLogin) => {
    setIsLoading(true); // Inicia loading

    try {
      const response = await fetch(`${API_URL}/customer/sign`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: customer.email,
          password: customer.password,
        }),
      });

      const body = await response.json();
      console.log(response.status);
      // === LÓGICA DE VALIDAÇÃO DO STATUS ===
      if (response.status !== 201) {
        if(response.status === 401) {
          Alert.alert("Erro!", body.details);
          return;
        }
        throw new Error(
          body.details || body.message || "Email ou senha incorretos."
        );
      }

      if(!body.token) {
        throw new Error("Token não definido no Body da requisição");
      }
      await saveCustomerSession(body.token);
      const customerDetails = body.customer;
      setCustomerData({
        token: body.token,
        id: customerDetails.id,
        name: customerDetails.name || "",
        email: customerDetails.email,
        cpf: customerDetails.doc || "",
        birthDate: customerDetails.birthDate || "",
        address: customerDetails.address || "",
        gender: customerDetails.gender || "",
        isPj: customerDetails.isPj || false,
        password: customerData?.password || "",
        profileUrl: customerDetails.profileUrl || null,
        role: customerDetails.role || "customer",
      });

      Alert.alert("Sucesso!", "Login realizado com sucesso.");
      clearOwnerData();
      navigation.navigate("InitialRoute");
    } catch (error: any) {
      console.error(error);
      // Exibe a mensagem de erro capturada no throw new Error acima
      Alert.alert(
        "Erro de Login",
        error.message || "Ocorreu um erro inesperado."
      );
    } finally {
      setIsLoading(false); // Para o loading independente de sucesso ou erro
    }
  };

  const handleSubmit = () => {
    if (isLoading) return; // Evita duplo clique

    const isFormValid = validateFields();
    if (isFormValid) {
      const customer: UserLogin = {
        email: email,
        password: password,
      };
      loginCostumer(customer);
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
          <TouchableOpacity
            onPress={() => {
              setEmail(dados.email);
              setPassword(dados.senha);
            }}
          >
            <Text className="text-[#5b5265] text-xl font-sansBold text-center my-7">
              Que bom ter você de volta!
            </Text>
          </TouchableOpacity>

          <View
            className={`flex flex-row items-center gap-2 p-1 pl-2 border rounded-xl ${errors.email ? "border-red-500" : "border-[#d9d9d9]"}`}
          >
            <MaterialCommunityIcons name="mail" size={24} color="#d9d9d9" />
            <TextInput
              className="flex-1 text-xl"
              placeholder="Email"
              value={email}
              keyboardType="email-address"
              onChangeText={(text) => setEmail(text)}
              placeholderTextColor="#d9d9d9"
              autoCapitalize="none" // Importante para emails
            />
          </View>
          {errors.email && (
            <Text className="text-red-500 -mt-1 mb-2">{errors.email}</Text>
          )}

          <PasswordInput
            style={`flex flex-row items-center gap-2 p-2 mb-1 border rounded-xl ${errors.password ? "border-red-500" : "border-[#d9d9d9]"}`}
            password={password}
            setPassword={setPassword}
          />
          {errors.password && (
            <Text className="text-red-500 -mt-1 mb-2">{errors.password}</Text>
          )}

          <TouchableOpacity
            className="mb-5"
            onPress={() => navigation.navigate("ForgotPassword")}
          >
            <Text className="text-[#737373] underline">
              Esqueceu sua senha?
            </Text>
          </TouchableOpacity>

          {/* BOTÃO COM LOADING */}
          <TouchableOpacity
            className={`w-full py-3 items-center rounded-lg ${isLoading ? "bg-gray-400" : "bg-[#080030]"}`}
            onPress={handleSubmit}
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
            <TouchableOpacity onPress={() => navigation.navigate("CorpSignin")}>
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
