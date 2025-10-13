import React, {
  useState,
  useEffect,
  EffectCallback,
  SetStateAction,
  Dispatch,
} from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  ImageBackground,
  TextInput,
  Alert,
} from "react-native";
import { NavigationProp, useNavigation } from "@react-navigation/native";

import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

import BouncyCheckbox from "react-native-bouncy-checkbox";
import MaskInput from "react-native-mask-input";
import { Dropdown } from "react-native-element-dropdown";

import { Text, BackArrow, PasswordInput } from "@/components";
import { cnpjMask, cepMask } from "@/constants/inputMasks";
import { checkingCep } from "@/functions/";
import { LaundryFormData } from "@/types";

const dropdownData = [
  { label: "Corrente", value: "corrente" },
  { label: "Poupança", value: "poupanca" },
];

interface Laundry {
  accountNumber: string;
  accountType: string;
  address: string;
  bankAgency: string;
  bankCode: string;
  cnpj: string;
  lat: string;
  lng: string;
  name: string;
  ownerId: string;
  type: string;
  profileUrl: string | null;
}

const dados = {
  accountNumber: "27982-4",
  accountType: "Corrente",
  address: "Rua Cesarino Ferreira",
  cep: "13486-159",
  bankAgency: "Itaú",
  bankCode: "0749",
  cnpj: "89.097.142/0001-22",
  lat: "-22.5597604",
  lng: "-47.3838961",
  name: "Lavanderia express",
  ownerId: "29ec3279-ec13-4cff-86ae-e21f7d8528f7",
  type: "lavagem",
  profileUrl: null,
  senha: "Arthur123",
  email: "ArthurPendragon123@gmail.com",
};

export default function CorpSignin() {
  const navigation = useNavigation<NavigationProp<any>>();

  const [formData, setFormData] = useState<LaundryFormData>({
    name: "",
    email: "",
    doc: "",
    cep: "",
    city: "",
    neighborhood: "",
    address: "",
    accountNumber: "",
    accountType: "",
    bankAgency: "",
    bankCode: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
    coordinates: { lat: "", lng: "" },
  });

  const [errors, setErrors] = useState<{ [key: string]: string | null }>({});

  const [dropdownValue, setDropdownValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);

  const handleInputChange = (field: string, value: any) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const validateFields = () => {
    const newErrors: { [key: string]: string | null } = {};
    const {
      name,
      address,
      email,
      accountNumber,
      accountType,
      bankAgency,
      bankCode,
      doc,
      cep,
      password,
      confirmPassword,
      agreeTerms,
    } = formData;

    if (!name.trim()) newErrors.name = "O nome é obrigatório.";
    if (!address.trim()) newErrors.address = "O endereço é obrigatório.";
    if (!email.trim() || !email.includes("@"))
      newErrors.email = "O email é inválido.";
    if (!accountNumber.trim())
      newErrors.accountNumber = "O número da conta é obrigatório.";
    if (!accountType.trim())
      newErrors.accountType = "O tipo da conta é obrigatório.";
    if (!bankAgency.trim())
      newErrors.bankAgency = "A agência do banco é obrigatória.";
    if (!bankCode.trim())
      newErrors.bankCode = "O código do banco é obrigatório.";
    if (!doc) newErrors.doc = "O CNPJ é obrigatório.";
    if (!cep) newErrors.cep = "O CEP é obrigatório.";
    if (password.length < 8)
      newErrors.password = "A senha deve ter pelo menos 8 caracteres.";
    if (password !== confirmPassword)
      newErrors.confirmPassword = "As senhas não coincidem.";
    if (!agreeTerms) newErrors.agreeTerms = "Você deve aceitar os termos.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const createLaundry = (laundry: Laundry) => {
    fetch("http://52.67.221.152/laundry", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        laundry: {
          name: laundry.name,
          profile_url: null,
          cnpj: laundry.cnpj,
          address: laundry.address,
          latitude: laundry.lat,
          longitude: laundry.lng,
          bank_code: laundry.bankCode,
          bank_agency: laundry.bankAgency,
          account_number: laundry.accountNumber,
          account_type: laundry.accountType,
          type: laundry.type,
          ownerId: laundry.ownerId,
        },
      }),
    })
      .then((response) => response.json())
      .then((body) => console.log(body))
      .catch((err) => console.error(err));
  };

  const fulling = () => {
    setFormData({
      ...formData,
      name: dados.name,
      email: dados.email,
      doc: dados.cnpj,
      cep: dados.cep,
      address: dados.address,
      accountNumber: dados.accountNumber,
      accountType: dados.accountType,
      bankAgency: dados.bankAgency,
      bankCode: dados.bankCode,
      password: dados.senha,
      confirmPassword: dados.senha,
    });
    // Manually trigger cep check for autofill
    checkingCep(setFormData, dados.cep);
  };

  const handleSubmit = () => {
    if (validateFields()) {
      Alert.alert("Sucesso!", "Formulário preenchido corretamente.");
      const laundryData: Laundry = {
        name: formData.name,
        cnpj: formData.doc,
        address: formData.address,
        lat: formData.coordinates.lat,
        lng: formData.coordinates.lng,
        bankCode: formData.bankCode,
        bankAgency: formData.bankAgency,
        accountNumber: formData.accountNumber,
        accountType: formData.accountType,
        ownerId: "29ec3279-ec13-4cff-86ae-e21f7d8528f7",
        type: "lavagem",
        profileUrl: null,
      };
      createLaundry(laundryData);
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
        <TouchableOpacity onPress={fulling}>
          <Text className="text-[#5b5265] text-3xl font-sansBold text-center">
            Cadastrar empresa
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
              placeholder="Nome da Lavanderia"
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
              placeholder="Email do Dono"
              placeholderTextColor="#d9d9d9"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
          {errors.email && (
            <Text className="text-red-500 -mt-1 mb-2">{errors.email}</Text>
          )}

          <View className="flex flex-row gap-2">
            <Text className="w-[50%] text-[#737373] font-sansBold">
              Insira o CNPJ da lavanderia:
            </Text>
            <Text className="w-[50%] text-[#737373] font-sansBold">
              Insira o CEP da lavanderia:
            </Text>
          </View>
          {/* CAMPOS DE CNPJ E CEP */}
          <View className="flex flex-row gap-2 mb-2">
            {/* CAMPO DE CNPJ */}
            <MaskInput
              className={`w-[49%] p-4 pl-2 text-xl border rounded-xl ${
                errors.doc ? "border-red-500" : "border-[#d9d9d9]"
              }`}
              value={formData.doc}
              onChangeText={(masked) => handleInputChange("doc", masked)}
              placeholderTextColor="#d9d9d9"
              mask={cnpjMask}
            />

            {/* CAMPO DE CEP */}
            <MaskInput
              className={`w-[49%] justify-center border rounded-xl ${
                errors.cep ? "border-red-500" : "border-[#d9d9d9]"
              } p-4 pl-2 text-xl`}
              value={formData.cep}
              onChangeText={(masked) => {
                handleInputChange("cep", masked);
                checkingCep(setFormData, masked);
              }}
              placeholderTextColor="#d9d9d9"
              mask={cepMask}
              keyboardType="numeric"
            />
          </View>
          <View className="flex flex-row gap-2">
            {errors.doc && (
              <Text className="w-[50%] text-red-500 -mt-1 mb-2">
                {errors.doc}
              </Text>
            )}
            {errors.cep && (
              <Text className="text-red-500 -mt-1 mb-2">{errors.cep}</Text>
            )}
          </View>

          {/* CAMPOS DE BAIRRO E CIDADE */}
          <View className="flex flex-row gap-2 mb-2">
            <TextInput
              className="w-[49%] p-4 pl-2 text-xl border rounded-xl border-[#d9d9d9]"
              value={formData.neighborhood}
              onChangeText={(text) => handleInputChange("neighborhood", text)}
              placeholder="Bairro"
              placeholderTextColor="#d9d9d9"
            />
            <TextInput
              className="w-[49%] p-4 pl-2 text-xl border rounded-xl border-[#d9d9d9]"
              value={formData.city}
              onChangeText={(text) => handleInputChange("city", text)}
              placeholder="Cidade"
              placeholderTextColor="#d9d9d9"
            />
          </View>

          {/* CAMPO DE ENDEREÇO */}
          <View
            className={`flex flex-row items-center gap-2 p-1 pl-2 mb-2 border rounded-xl ${
              errors.address ? "border-red-500" : "border-[#d9d9d9]"
            }`}
          >
            <FontAwesome6 name="location-dot" size={24} color="#d9d9d9" />
            <TextInput
              className="flex-1 text-xl"
              value={formData.address}
              onChangeText={(text) => handleInputChange("address", text)}
              placeholder="Endereço"
              placeholderTextColor="#d9d9d9"
            />
          </View>
          {errors.address && (
            <Text className="text-red-500 -mt-1 mb-2">{errors.address}</Text>
          )}

          <Text className="w-[90%] text-[#737373] text-lg font-sansBold">
            Insira suas informações bancárias:
          </Text>
          <View className="flex flex-row gap-2 mb-2">
            <TextInput
              className={`w-[49%] p-4 pl-2 text-xl border rounded-xl ${
                errors.accountNumber ? "border-red-500" : "border-[#d9d9d9]"
              }`}
              value={formData.accountNumber}
              onChangeText={(text) => handleInputChange("accountNumber", text)}
              placeholder="Número da conta"
              placeholderTextColor="#d9d9d9"
            />

            <Dropdown
              style={[
                {
                  width: "49%",
                  padding: 16,
                  paddingLeft: 8,
                  borderWidth: 1,
                  borderRadius: 12,
                  borderColor: errors.accountType ? "red" : "#d9d9d9",
                },
                isFocus && { borderColor: "#822083" },
              ]}
              data={dropdownData}
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder={!isFocus ? "Tipo de conta" : "..."}
              value={dropdownValue}
              onFocus={() => setIsFocus(true)}
              onBlur={() => setIsFocus(false)}
              onChange={(item) => {
                handleInputChange("accountType", item.label);
                setDropdownValue(item.value);
                setIsFocus(false);
              }}
            />
          </View>
          <View className="flex flex-row gap-2">
            {errors.accountNumber && (
              <Text className="w-[50%] text-red-500 -mt-1 mb-2">
                {errors.accountNumber}
              </Text>
            )}
            {errors.accountType && (
              <Text className="w-[50%] text-red-500 -mt-1 mb-2">
                {errors.accountType}
              </Text>
            )}
          </View>

          <View className="flex flex-row gap-2 mb-2">
            <TextInput
              className={`w-[49%] p-4 pl-2 text-xl border rounded-xl ${
                errors.bankAgency ? "border-red-500" : "border-[#d9d9d9]"
              }`}
              value={formData.bankAgency}
              onChangeText={(text) => handleInputChange("bankAgency", text)}
              placeholder="Agência"
              placeholderTextColor="#d9d9d9"
            />

            <TextInput
              className={`w-[49%] p-4 pl-2 text-xl border rounded-xl ${
                errors.bankCode ? "border-red-500" : "border-[#d9d9d9]"
              }`}
              value={formData.bankCode}
              onChangeText={(text) => handleInputChange("bankCode", text)}
              placeholder="Código do Banco"
              placeholderTextColor="#d9d9d9"
            />
          </View>
          <View className="flex flex-row gap-2">
            {errors.bankAgency && (
              <Text className="w-[50%] text-red-500 -mt-1 mb-2">
                {errors.bankAgency}
              </Text>
            )}
            {errors.bankCode && (
              <Text className="w-[50%] text-red-500 -mt-1 mb-2">
                {errors.bankCode}
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
              Cadastrar empresa
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
