import {
  View,
  TouchableOpacity,
  ImageBackground,
  Image,
  TextInput,
} from "react-native";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";

import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

import BouncyCheckbox from "react-native-bouncy-checkbox";

import { Text, BackArrow, PasswordInput } from "@/components";

export default function ClientSignin() {
  const navigation = useNavigation<NavigationProp<any>>();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [hasEightChar, setHasEightChar] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  useEffect(() => {
    setHasEightChar(false);
    if (password.length >= 8) setHasEightChar(true);
  }, [password]);

  return (
    <View>
      <ImageBackground
        className="w-full h-full"
        source={require("assets/bubble-bg4.png")}
      >
        {/* SETA PARA VOLTAR */}
        <BackArrow />

        {/* HEADER DA TELA */}
        <Image
          className="h-[140] self-center"
          source={require("assets/logo.png")}
          resizeMode="contain"
        />
        <Text className="text-[#5b5265] text-3xl font-sansBold text-center">
          Bem vindo!
        </Text>

        {/* CONTAINER DO FORMS */}
        {/* TODO: Adicionar verificação de preenchimento dos campos e termos */}
        <View className="gap-3 w-[95vw] h-[74vh] mx-auto my-3 p-4 bg-white border rounded-xl border-[#d9d9d9]">
          {/* CAMPO DE NOME E SOBRENOME */}
          <View className="flex flex-row gap-2">
            {/* CAMPO DE NOME */}
            <TextInput
              className="w-[49%] p-4 pl-2 text-xl border rounded-xl border-[#d9d9d9]"
              placeholder="Nome"
              placeholderTextColor="#d9d9d9"
            />

            {/* CAMPO DE SOBRENOME */}
            <TextInput
              className="w-[49%] p-4 pl-2 text-xl border rounded-xl border-[#d9d9d9]"
              placeholder="Sobrenome"
              placeholderTextColor="#d9d9d9"
            />
          </View>

          {/* CAMPO DE EMAIL */}
          <View className="flex flex-row items-center gap-2 p-1 pl-2 border rounded-xl border-[#d9d9d9]">
            <MaterialCommunityIcons name="mail" size={24} color="#d9d9d9" />
            <TextInput
              className="flex-1 text-xl"
              placeholder="Email"
              placeholderTextColor="#d9d9d9"
            />
          </View>

          {/* CONTAINER DOS CAMPOS LADO A LADO */}
          <View className="flex flex-row gap-2">
            {/* CAMPO DE PAÍS */}
            {/* TODO: adicionar api de localização?? */}
            <TextInput
              className="w-[49%] p-4 pl-2 text-xl border rounded-xl border-[#d9d9d9]"
              placeholder="País"
              placeholderTextColor="#d9d9d9"
            />

            {/* CAMPO DE CIDADE */}
            {/* TODO: adicionar api de localização?? */}
            <TextInput
              className="w-[49%] p-4 pl-2 text-xl border rounded-xl border-[#d9d9d9]"
              placeholder="Cidade"
              placeholderTextColor="#d9d9d9"
            />
          </View>

          {/* CAMPO DE MUNICÍPIO */}
          {/* TODO: adicionar api de localização?? */}
          <TextInput
            className="text-xl p-4 pl-2 border rounded-xl border-[#d9d9d9]"
            placeholder="Município"
            placeholderTextColor="#d9d9d9"
          />

          {/* CAMPO DE SENHA */}
          <Text className="-mb-2 text-[#737373] font-sansBold">
            Defina sua senha
          </Text>
          <PasswordInput password={password} setPassword={setPassword} />
          <BouncyCheckbox
            useBuiltInState={false}
            isChecked={hasEightChar}
            size={16}
            textComponent={
              <Text className="text-sm ml-2">Possui 8 carateres</Text>
            }
            fillColor="purple"
            bounceEffectIn={1}
          />

          {/* CAMPO DE CONFIRMAÇÃO DE SENHA */}
          <Text className="-mb-2 text-[#737373] font-sansBold">
            Confirme sua senha
          </Text>
          <PasswordInput
            password={confirmPassword}
            setPassword={setConfirmPassword}
          />
          <BouncyCheckbox
            useBuiltInState={false}
            isChecked={agreeTerms}
            size={16}
            textComponent={
              <Text className="text-sm ml-2">
                Li e concordo com os
                <Text className="font-sansBold"> termos e condições</Text>
              </Text>
            }
            fillColor="purple"
            bounceEffectIn={0.95}
            onPress={(checked: boolean) => {
              setAgreeTerms(!agreeTerms);
            }}
          />

          {/* BOTÃO DE CONFIRMAÇÃO DO FORMS */}
          <TouchableOpacity
            className="w-full py-3 items-center border-2 border-black rounded-lg"
            onPress={() => navigation.navigate("InitialRoute")}
          >
            <Text className="text-black text-lg font-sansBold">
              Cadastrar-se
            </Text>
          </TouchableOpacity>

          {/* TEXTO PARA LEVAR AO LOGIN DE CLIENTE */}
          <View className="flex flex-row items-center justify-center">
            <Text className="text-[#545454]">Já tem uma conta ? </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("ClientLogin")}
            >
              <Text className="text-[#822083] underline">Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}
