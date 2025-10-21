import React, { useState, useContext } from "react";
import {
  View,
  ImageBackground,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
} from "react-native";
import { NavigationProp, useNavigation } from "@react-navigation/native";

import BouncyCheckbox from "react-native-bouncy-checkbox";
import MaskInput from "react-native-mask-input";

import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

import { Text, BackArrow, PasswordInput } from "@/components";
import { Laundry, OwnerFormData, Owner } from "@/types";
import { OwnerContext } from "@/contexts/";
import { cpfMask } from "@/constants/inputMasks";

const formMockData: OwnerFormData = {
  name: "Monkey D Luffy",
  email: "monkeydluffy@gmail.com",
  cpf: "26492759274",
  password: "Mugiwara",
  confirmPassword: "Mugiwara",
  agreeTerms: true,
};

export default function OwnerRegister() {
  const navigation = useNavigation<NavigationProp<any>>();
  const { setOwnerData: setContextFormData } = useContext(OwnerContext);

  const [formData, setFormData] = useState<OwnerFormData>({
    name: "",
    email: "",
    cpf: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  });
  const [errors, setErrors] = useState<{ [key: string]: string | null }>({});

  const validateFields = () => {
    const newErrors: { [key: string]: string | null } = {};
    const { name, email, cpf, password, confirmPassword, agreeTerms } =
      formData;

    if (!name.trim() || !name.match(/^[a-zA-Z\s]+$/g))
      newErrors.name = "Preencha o campo de nome da forma correta.";
    if (!email.trim() || !email.includes("@"))
      newErrors.email = "Preencha o campo de email da forma correta.";
    if (!cpf || cpf.length < 11)
      newErrors.cpf = "Preencha o campo de CPF da forma correta.";
    if (password.length < 8)
      newErrors.password = "A senha deve ter pelo menos 8 caracteres.";
    if (password !== confirmPassword)
      newErrors.confirmPassword = "As senhas não coincidem.";
    if (!agreeTerms) newErrors.agreeTerms = "Você deve aceitar os termos.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const createOwner = (owner: Owner) => {
    fetch("http://52.67.221.152/members", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        member: {
          profile_url: null,
          name: owner.name,
          email: owner.email,
          cpf: owner.cpf,
          password: owner.password,
          roles: ["owner"],
        },
      }),
    })
      .then((response) => response.json())
      .then((body) => {
        if (body.details === "E-mail já cadastrado!") {
          Alert.alert("Erro!", "E-mail já cadastrado!");
          return;
        }
        if (body.details === "CPF já cadastrado!") {
          Alert.alert("Erro!", "CPF já cadastrado!");
          return;
        }
        const newOwnerData = {
          name: formData.name,
          email: formData.email,
          cpf: formData.cpf,
          password: formData.password,
          memberId: body.member_id,
          role: "owner",
        };
        setContextFormData(newOwnerData);

        Alert.alert("Sucesso!", "Formulário preenchido corretamente.");
        navigation.navigate("CorpSignin");
      })
      .catch((err) => console.error(err));
  };

  const handleInputChange = (field: string, value: any) => {
    validateFields();
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleSubmit = () => {
    if (validateFields()) {
      const ownerData: Owner = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        cpf: formData.cpf,
        profile_url: "",
      };
      createOwner(ownerData);
    } else {
      Alert.alert("Erro", "Por favor, corrija os campos destacados.");
    }
  };

  return (
    <View>
      <ImageBackground
        className="w-full h-full"
        source={require("assets/bubble-bg4.png")}
      >
        <BackArrow />

        <Image
          className="h-[140] self-center"
          source={require("assets/logo.png")}
          resizeMode="contain"
        />
        <TouchableOpacity
          onPress={() => {
            setFormData(formMockData);
          }}
        >
          <Text className="text-[#5b5265] text-3xl font-sansBold text-center">
            Cadastrar-se
          </Text>
        </TouchableOpacity>

        <ScrollView className="w-[95vw] h-[74vh] mx-auto my-3 p-4 bg-white border rounded-xl border-[#d9d9d9]">
          {/* CAMPO DE NOME */}
          <View
            className={`flex flex-row items-center gap-2 p-1 pl-2 mb-2 border rounded-xl ${
              errors.name ? "border-red-500" : "border-[#d9d9d9]"
            }`}
          >
            <MaterialCommunityIcons name="pencil" size={24} color="#d9d9d9" />
            <TextInput
              value={formData.name}
              onChangeText={(text) => handleInputChange("name", text)}
              className="flex-1 text-xl"
              placeholder="Seu Nome"
              placeholderTextColor="#d9d9d9"
            />
          </View>
          {errors.name && (
            <Text className="text-red-500 -mt-1 mb-2">{errors.name}</Text>
          )}

          {/* CAMPO DE EMAIL */}
          <View
            className={`flex flex-row items-center gap-2 p-1 pl-2 mb-2 border rounded-xl ${
              errors.email ? "border-red-500" : "border-[#d9d9d9]"
            }`}
          >
            <MaterialCommunityIcons name="mail" size={24} color="#d9d9d9" />
            <TextInput
              value={formData.email}
              onChangeText={(text) => handleInputChange("email", text)}
              className="flex-1 text-xl"
              placeholder="Seu Email"
              placeholderTextColor="#d9d9d9"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
          {errors.email && (
            <Text className="text-red-500 -mt-1 mb-2">{errors.email}</Text>
          )}

          <Text className="w-[50%] text-[#737373] font-sansBold">
            Insira o seu CPF:
          </Text>
          {/* CAMPO DE CPF */}
          <View className="flex flex-row items-center gap-2 mb-2">
            <MaskInput
              className={`flex-1 p-4 pl-2 text-xl border rounded-xl ${
                errors.cpf ? "border-red-500" : "border-[#d9d9d9]"
              }`}
              value={formData.cpf}
              onChangeText={(masked) => {
                const newMasked = masked.replace(/\D/g, "");
                handleInputChange("cpf", newMasked);
              }}
              placeholderTextColor="#d9d9d9"
              mask={cpfMask}
            />
          </View>
          <View className="flex flex-row gap-2">
            {errors.cpf && (
              <Text className="w-[50%] text-red-500 -mt-1 mb-2">
                {errors.cpf}
              </Text>
            )}
          </View>

          {/* CAMPO DE SENHA */}
          <Text className="text-[#737373] font-sansBold">Defina sua senha</Text>
          <PasswordInput
            style={`flex flex-row items-center gap-2 p-2 mb-1 border rounded-xl ${
              errors.password ? "border-red-500" : "border-[#d9d9d9]"
            }`}
            password={formData.password}
            setPassword={(text) => handleInputChange("password", text)}
          />
          <BouncyCheckbox
            isChecked={formData.password.length >= 8}
            size={16}
            textComponent={
              <Text className="text-sm ml-2">Possui 8 carateres</Text>
            }
            fillColor="purple"
            bounceEffectIn={1}
            disabled
          />

          {/* CAMPO DE CONFIRMAÇÃO DE SENHA */}
          <Text className="text-[#737373] font-sansBold">
            Confirme sua senha
          </Text>
          <PasswordInput
            style={`flex flex-row items-center gap-2 p-2 mb-1 border rounded-xl ${
              errors.confirmPassword ? "border-red-500" : "border-[#d9d9d9]"
            }`}
            password={formData.confirmPassword}
            setPassword={(text) => handleInputChange("confirmPassword", text)}
          />
          {errors.confirmPassword && (
            <Text className="w-[50%] text-red-500 -mt-1 mb-2">
              {errors.confirmPassword}
            </Text>
          )}
          <BouncyCheckbox
            className="mb-1"
            isChecked={formData.agreeTerms}
            size={16}
            textComponent={
              <Text className="text-sm ml-2">
                Li e concordo com os
                <Text className="font-sansBold"> termos e condições</Text>
              </Text>
            }
            fillColor={errors.agreeTerms ? "red" : "purple"}
            bounceEffectIn={0.95}
            onPress={(isChecked: boolean) => {
              handleInputChange("agreeTerms", isChecked);
            }}
          />
          {errors.agreeTerms && (
            <Text className="text-red-500 -mt-1 mb-2">{errors.agreeTerms}</Text>
          )}

          <TouchableOpacity
            className="w-full py-3 items-center border-2 border-black rounded-lg"
            onPress={handleSubmit}
          >
            <Text className="text-black text-lg font-sansBold">
              Cadastrar-se
            </Text>
          </TouchableOpacity>

          <View className="flex flex-row items-center justify-center">
            <Text className="text-[#545454]">
              Já tem uma conta empresarial?{" "}
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate("CorpLogin")}>
              <Text className="text-[#822083] underline">Login</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </ImageBackground>
    </View>
  );
}
