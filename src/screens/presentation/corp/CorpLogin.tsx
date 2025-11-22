import React, { useState, useEffect, useContext } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  Image,
  Alert,
} from "react-native";
import { NavigationProp, useNavigation } from "@react-navigation/native";

import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

import { Text, BackArrow, PasswordInput } from "@/components";
import { AuthenticationContext, OwnerContext } from "@/contexts/";
import { getMember } from "@/functions/";
import { API_URL } from "@/constants/backend";

interface laundryLoginData {
  email: string;
  password: string;
}

export default function CorpLogin() {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const navigation = useNavigation<NavigationProp<any>>();
  const { setIsLaundryTrue } = useContext(AuthenticationContext);
  const { setOwnerData } = useContext(OwnerContext);

  const [errors, setErrors] = useState<{ [key: string]: string | null }>({});
  const [formMessage, setFormMessage] = useState<{
    title: string;
    msg: string;
  }>({
    title: "Erro",
    msg: "Erro ao autenticar. Tente novamente mais tarde.",
  });

  const validateFields = () => {
    const newErrors: { [key: string]: string | null } = {};

    if (!email.trim() || !email.includes("@"))
      newErrors.email = "O email é inválido.";
    if (password.length < 8)
      newErrors.password = "A senha deve ter pelo menos 8 caracteres.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const authenticateLaundry = (laundry: laundryLoginData) => {
    fetch(`${API_URL}/members/auth`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: laundry.email,
        password: laundry.password,
      }),
    })
      .then((response) => response.json())
      .then((body) => {
        if (body.details == "E-mail ou Senha incorretos.") {
          setFormMessage({
            title: "Erro",
            msg: "E-mail ou Senha incorretos. Tente novamente.",
          });
        } else if (body.token) {
          Alert.alert("Sucesso", "Login realizado com sucesso!");
          let member = null;
          getMember(email).then((m) => {
            member = m;
            setOwnerData({
              name: member.name,
              email: member.email,
              cpf: member.cpf,
              memberId: member.id,
              token: body.token,
              role: member.roles[0],
            });
          });
          navigation.navigate("InitialRoute");
        } else {
          setFormMessage({
            title: "Erro",
            msg: "Erro ao autenticar. Tente novamente mais tarde.",
          });
        }
      })
      .catch((err) => {
        console.error("Erro ao autenticar:", err);
        setFormMessage({
          title: "Erro",
          msg: "Erro ao autenticar. Tente novamente mais tarde.",
        });
      });
  };

  const handleSubmit = () => {
    if (validateFields()) {
      const laundryData: laundryLoginData = {
        email: email,
        password: password,
      };
      authenticateLaundry(laundryData);
    } else {
      setFormMessage({
        title: "Erro",
        msg: "Por favor, corrija os campos destacados.",
      });
      setTimeout(() => {
        Alert.alert(formMessage.title, formMessage.msg);
      }, 500);
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
              textContentType="emailAddress"
              importantForAutofill="yes"
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

          {/* TEXTO ESQUECEU SUA SENHA */}
          <TouchableOpacity
            onPress={() => navigation.navigate("ForgotPassword")}
            className="mb-3"
          >
            <Text className="text-[#737373] underline">
              Esqueceu sua senha?
            </Text>
          </TouchableOpacity>

          {/* BOTÃO DE CONFIRMAÇÃO DO FORMS */}
          <TouchableOpacity
            className="w-full py-3 items-center bg-[#080030] rounded-lg"
            onPress={() => {
              setIsLaundryTrue();
              handleSubmit();
            }}
          >
            <Text className="text-white text-lg font-sansBold">Login</Text>
          </TouchableOpacity>

          {/* TEXTO PARA LEVAR AO LOGIN EMPRESARIAL */}
          <View className="flex flex-row items-center justify-center mb-10">
            <Text className="text-[#545454]">Não tem uma conta? </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("OwnerRegister")}
            >
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
