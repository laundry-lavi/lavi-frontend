import {
  View,
  TouchableOpacity,
  ImageBackground,
  Image,
  TextInput,
  Alert,
} from "react-native";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { useState } from "react";

import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

import { Text, BackArrow, PasswordInput } from "@/components";
import { UserLogin } from "@/types";

const dados = {
  email: "teste@gmail.com",
  senha: "12345678",
};

export default function ClientLogin() {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const navigation = useNavigation<NavigationProp<any>>();
  const [errors, setErrors] = useState<{ [key: string]: string | null }>({});

  const validateFields = () => {
    const newErrors: { [key: string]: string | null } = {};

    // Validação de email
    if (!email.trim() || !email.includes("@"))
      newErrors.email = "O email é obrigatório.";

    // Validação de senha
    if (password.length < 8) {
      newErrors.password = "A senha deve ter pelo menos 8 caracteres.";
    }

    setErrors(newErrors);

    // Retorna true se não houver erros
    return Object.keys(newErrors).length === 0;
  };

  const loginCostumer = (customer: UserLogin) => {
    fetch("http://52.67.221.152/customer/sign", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: customer.email,
        password: customer.password,
      }),
    })
      .then((response) => response.json())
      .then((body) => {
        console.log(body);
        navigation.navigate("InitialRoute");
      })
      .catch((err) => console.log(err));
  };

  const handleSubmit = () => {
    const isFormValid = validateFields();
    if (isFormValid) {
      Alert.alert("Sucesso!", "Formulário preenchido corretamente.");
      const customer: UserLogin = {
        email: email,
        password: password,
      };
      loginCostumer(customer);
    } else {
      Alert.alert("Erro", "Por favor, corrija os campos destacados.");
    }
  };

  return (
    <View>
      <ImageBackground
        className="w-full h-full"
        source={require("assets/bubble-bg2.png")}
      >
        {/* SETA PARA VOLTAR */}
        <BackArrow />

        {/* HEADER DA TELA */}
        <Image
          className="h-[140] mt-20 self-center"
          source={require("assets/logo.png")}
          resizeMode="contain"
        />

        {/* CONTAINER DO FORMS */}
        <View className="gap-3 w-[95vw] h-[70vh] mx-auto my-3 p-4 bg-white border rounded-xl border-[#d9d9d9]">
          {/* TEXTO INTRODUTÓRIO */}
          <Text className="text-[#5b5265] text-xl font-sansBold text-center my-7">
            Que bom ter você de volta!
          </Text>

          {/* CAMPO DE EMAIL */}
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
            />
          </View>

          {/* CAMPO DE SENHA */}
          <PasswordInput
            style={`flex flex-row items-center gap-2 p-2 mb-1 border rounded-xl ${errors.password ? "border-red-500" : "border-[#d9d9d9]"}`}
            password={password}
            setPassword={setPassword}
          />

          {/* TEXTO ESQUECEU SUA SENHA */}
          <TouchableOpacity
            className="mb-5"
            onPress={() => navigation.navigate("ForgotPassword")}
          >
            <Text className="text-[#737373] underline">
              Esqueceu sua senha?
            </Text>
          </TouchableOpacity>

          {/* BOTÃO DE CONFIRMAÇÃO DO FORMS */}
          <TouchableOpacity
            className="w-full py-3 items-center bg-[#080030] rounded-lg"
            onPress={handleSubmit}
          >
            <Text className="text-white text-lg font-sansBold">Login</Text>
          </TouchableOpacity>

          {/* TEXTO PARA LEVAR AO LOGIN EMPRESARIAL */}
          <View className="flex flex-row items-center justify-center mb-10">
            <Text className="text-[#545454]">Não tem uma conta? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("CorpSignin")}>
              <Text className="text-[#822083] underline">Cadastrar-se</Text>
            </TouchableOpacity>
          </View>

          {/* ENTRAR COM O GOOGLE */}
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
