import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  Image,
} from "react-native";
import { NavigationProp, useNavigation } from "@react-navigation/native";

import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

import { Text, BackArrow, PasswordInput } from "@/components";

export default function CorpLogin() {
  const [password, setPassword] = useState("");
  const navigation = useNavigation<NavigationProp<any>>();

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

          {/* CAMPO DE CÓDIGO DA LAVANDERIA */}
          <View className="flex flex-row items-center gap-2 p-1 pl-2 border rounded-xl border-[#d9d9d9]">
            <MaterialCommunityIcons name="security" size={24} color="#d9d9d9" />
            <TextInput
              className="flex-1 text-xl"
              placeholder="Código da Lavanderia"
              placeholderTextColor="#d9d9d9"
            />
          </View>

          {/* CAMPO DE SENHA */}
          <PasswordInput password={password} setPassword={setPassword} />

          {/* TEXTO ESQUECEU SUA SENHA */}
          <TouchableOpacity
            onPress={() => navigation.navigate("ForgotPassword")}
            className="mb-5"
          >
            <Text className="text-[#737373] underline">
              Esqueceu sua senha?
            </Text>
          </TouchableOpacity>

          {/* BOTÃO DE CONFIRMAÇÃO DO FORMS */}
          <TouchableOpacity
            className="w-full py-3 items-center bg-[#080030] rounded-lg"
            onPress={() => navigation.navigate("InitialRoute")}
          >
            <Text className="text-white text-lg font-sansBold">Login</Text>
          </TouchableOpacity>

          {/* TEXTO PARA LEVAR AO LOGIN EMPRESARIAL */}
          <View className="flex flex-row items-center justify-center mb-10">
            <Text className="text-[#545454]">Não tem uma conta? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("CorpLogin")}>
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
