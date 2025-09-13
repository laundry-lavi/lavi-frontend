import React, { useState, useEffect } from "react";
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

const data = [
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
  email: "arthur123@gmail.com",
};

export default function CorpSignin() {
  const navigation = useNavigation<NavigationProp<any>>();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [hasEightChar, setHasEightChar] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [cep, setCep] = useState("");
  const [city, setCity] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [address, setAddress] = useState("");
  const [doc, setDoc] = useState("");
  const [email, setEmail] = useState("");
  const [coordinates, setCoordinates] = useState({ lat: "", lng: "" });
  const [accountNumber, setAccountNumber] = useState("");
  const [accountType, setAccountType] = useState("");
  const [bankAgency, setBankAgency] = useState("");
  const [bankCode, setBankCode] = useState("");

  const cnpjMask = [
    /\d/,
    /\d/,
    ".",
    /\d/,
    /\d/,
    /\d/,
    ".",
    /\d/,
    /\d/,
    /\d/,
    "/",
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    "-",
    /\d/,
    /\d/,
  ];
  const cepMask = [/\d/, /\d/, /\d/, /\d/, /\d/, "-", /\d/, /\d/, /\d/];
  const checkingCep = async (cep: string) => {
    fetch(`https://brasilapi.com.br/api/cep/v2/${cep}`)
      .then((response) => response.json())
      .then((body) => {
        setCity(body.city);
        setNeighborhood(body.neighborhood);
        setAddress(body.street);
      })
      .catch((err) => {
        console.error(err);
      });
    fetch(`https://cep.awesomeapi.com.br/json/${cep}`)
      .then((response) => response.json())
      .then((body) => {
        setCoordinates({ lat: body.lat, lng: body.lng });
      })
      .catch((err) => console.error(err));
  };

  // address // FEITO
  // Type:string
  // required

  // cnpj // FEITO
  // Type:string
  // required

  // latitude // FEITO
  // Type:string
  // Pattern:^-?\d+(\.\d+)?$
  // required

  // lnggitude // FEITO
  // Type:string
  // Pattern:^-?\d+(\.\d+)?$
  // required

  // name // FEITO
  // Type:string
  // required

  // ownerId
  // Type:string
  // Format:uuid
  // required

  // type
  // Type:string
  // required

  // profile_url
  // Type:string | null
  // Format:uri

  useEffect(() => {
    setHasEightChar(false);
    if (password.length >= 8) setHasEightChar(true);
  }, [password]);

  const [errors, setErrors] = useState<{ [key: string]: string | null }>({});

  const validateFields = () => {
    const newErrors: { [key: string]: string | null } = {};

    // Validação de campos obrigatórios
    if (!name.trim()) newErrors.name = "O nome é obrigatório.";
    if (!address.trim()) newErrors.address = "O endereço é obrigatório.";
    if (!email.trim() || !email.includes("@"))
      newErrors.email = "O email é obrigatório.";
    if (!accountNumber.trim())
      newErrors.accountNumber = "O número da conta é obrigatório.";
    if (!accountType.trim())
      newErrors.accountType = "O tipo da conta é obrigatório.";
    if (!bankAgency.trim())
      newErrors.bankAgency = "A agência do banco é obrigatório.";
    if (!bankCode.trim())
      newErrors.bankCode = "O código do banco é obrigatório.";

    // Validação de CNPJ
    if (!doc) {
      newErrors.doc = "O CNPJ é obrigatório.";
    }

    // Validação de CEP
    if (!cep) {
      newErrors.cep = "O CEP é obrigatório.";
    }

    // Validação de senha
    if (password.length < 8) {
      newErrors.password = "A senha deve ter pelo menos 8 caracteres.";
    }

    // Validação de confirmação de senha
    if (password !== confirmPassword) {
      newErrors.confirmPassword = "As senhas não coincidem.";
    }

    setErrors(newErrors);

    // Retorna true se não houver erros
    return Object.keys(newErrors).length === 0;
  };

  const createLaundry = (laundry: Laundry) => {
    fetch("http://52.67.221.152/laundry", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
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

  const [value, setValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);

  const fulling = () => {
    setName(dados.name);
    setEmail(dados.email);
    setDoc(dados.cnpj);
    setCep(dados.cep);
    setAddress(dados.address);
    setAccountNumber(dados.accountNumber);
    setBankAgency(dados.bankAgency);
    setBankCode(dados.bankCode);
    setPassword(dados.senha);
    setConfirmPassword(dados.senha);
  };

  const handleSubmit = () => {
    const isFormValid = validateFields();
    if (isFormValid) {
      Alert.alert("Sucesso!", "Formulário preenchido corretamente.");
      const laundry = {
        accountNumber: dados.accountNumber,
        accountType: dados.accountType,
        address: dados.address,
        bankAgency: dados.bankAgency,
        bankCode: dados.bankCode,
        cnpj: dados.cnpj,
        lat: dados.lat,
        lng: dados.lng,
        name: dados.name,
        ownerId: "29ec3279-ec13-4cff-86ae-e21f7d8528f7",
        type: "lavagem",
        profileUrl: null,
      };
      // const laundry = {
      //   accountNumber: accountNumber,
      //   accountType: accountType,
      //   address: address,
      //   bankAgency: bankAgency,
      //   bankCode: bankCode,
      //   cnpj: doc,
      //   lat: coordinates.lat,
      //   lng: coordinates.lng,
      //   name: name,
      //   ownerId: "29ec3279-ec13-4cff-86ae-e21f7d8528f7",
      //   type: "lavagem",
      //   profileUrl: null,
      // };

      createLaundry(laundry);
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
        {/* SETA PARA VOLTAR */}
        <BackArrow />

        {/* HEADER DA TELA */}
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

        {/* CONTAINER DO FORMS */}
        <ScrollView className="w-[95vw] h-[74vh] mx-auto my-3 p-4 bg-white border rounded-xl border-[#d9d9d9]">
          {/* CAMPO DE NOME */}
          <View
            className={`flex flex-row items-center gap-2 p-1 pl-2 mb-2 border rounded-xl ${errors.name ? "border-red-500" : "border-[#d9d9d9]"}`}
          >
            <MaterialCommunityIcons name="pencil" size={24} color="#d9d9d9" />
            <TextInput
              value={name}
              onChangeText={(text) => setName(text)}
              className="flex-1 text-xl"
              placeholder="Nome da Lavanderia"
              placeholderTextColor="#d9d9d9"
            />
          </View>

          {/* CAMPO DE EMAIL */}
          <View
            className={`flex flex-row items-center gap-2 p-1 pl-2 mb-2 border rounded-xl ${errors.email ? "border-red-500" : "border-[#d9d9d9]"}`}
          >
            <MaterialCommunityIcons name="mail" size={24} color="#d9d9d9" />
            <TextInput
              value={email}
              onChangeText={(text) => setEmail(text)}
              className="flex-1 text-xl"
              placeholder="Email"
              placeholderTextColor="#d9d9d9"
            />
          </View>

          <View className="flex flex-row gap-2">
            <Text className="w-[50%] text-[#737373] font-sansBold">
              Insira o CNPJ da lavanderia:
            </Text>
            <Text className="w-[50%] text-[#737373] font-sansBold">
              Insira o CEP da lavanderia:
            </Text>
          </View>
          {/* CONTAINER DOS CAMPOS LADO A LADO */}
          <View className="flex flex-row gap-2 mb-2">
            {/* CAMPO DE CNPJ */}
            {/* TODO: adicionar validação do cnpj */}
            <MaskInput
              className={`w-[49%] p-4 pl-2 text-xl border rounded-xl ${errors.doc ? "border-red-500" : "border-[#d9d9d9]"}`}
              value={doc}
              onChangeText={(text) => setDoc(text)}
              placeholderTextColor="#d9d9d9"
              mask={cnpjMask}
            />

            <MaskInput
              className={`w-[49%] justify-center border rounded-xl ${errors.cep ? "border-red-500" : "border-[#d9d9d9]"} p-4 pl-2 text-xl`}
              value={cep}
              onChangeText={(text) => {
                checkingCep(text);
                setCep(text);
              }}
              placeholderTextColor="#d9d9d9"
              mask={cepMask}
            />
          </View>

          {/* CAMPOS DE MUNICIPIO E CIDADE */}
          <View className="flex flex-row gap-2 mb-2">
            {/* CAMPO DE MUNICÍPIO */}
            {/* TODO: adicionar api de localização?? */}
            <TextInput
              className="w-[49%] p-4 pl-2 text-xl border rounded-xl border-[#d9d9d9]"
              value={neighborhood}
              onChangeText={(text) => setNeighborhood(text)}
              placeholder="Município"
              placeholderTextColor="#d9d9d9"
            />

            {/* CAMPO DE CIDADE */}
            {/* TODO: adicionar api de localização?? */}
            <TextInput
              className="w-[49%] p-4 pl-2 text-xl border rounded-xl border-[#d9d9d9]"
              value={city}
              onChangeText={(text) => setCity(text)}
              placeholder="Cidade"
              placeholderTextColor="#d9d9d9"
            />
          </View>

          {/* CAMPO DE ENDEREÇO */}
          <View
            className={`flex flex-row items-center gap-2 p-1 pl-2 mb-2 border rounded-xl ${errors.address ? "border-red-500" : "border-[#d9d9d9]"}`}
          >
            <FontAwesome6
              name="location-dot"
              size={24}
              color={errors.address ? "red" : "#d9d9d9"}
            />
            <TextInput
              className="flex-1 text-xl"
              value={address}
              onChangeText={(text) => setAddress(text)}
              placeholder="Endereço"
              placeholderTextColor="#d9d9d9"
            />
          </View>

          {/* 
          // account_number
          // Type:string
          // required

          // account_type
          // Type:string
          // required

          // bank_agency
          // Type:string
          // required

          // bank_code
          // Type:string
          // required 
          */}

          <Text className="w-[90%] text-[#737373] text-lg font-sansBold">
            Insira suas informações bancárias:
          </Text>
          <View className="flex flex-row gap-2 mb-2">
            <TextInput
              className={`w-[49%] p-4 pl-2 text-xl border rounded-xl ${errors.accountNumber ? "border-red-500" : "border-[#d9d9d9]"}`}
              value={accountNumber}
              onChangeText={(text) => setAccountNumber(text)}
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
                  borderColor: "#d9d9d9",
                },
                isFocus && { borderColor: "#822083" },
              ]}
              data={data}
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder={!isFocus ? "Tipo de conta" : "..."}
              value={value}
              onFocus={() => setIsFocus(true)}
              onBlur={() => setIsFocus(false)}
              onChange={(item) => {
                setAccountType(item.label);
                setValue(item.value);
                setIsFocus(false);
              }}
            />

            {/* <TextInput
              className={`w-[49%] p-4 pl-2 text-xl border rounded-xl ${errors.accountType ? "border-red-500" : "border-[#d9d9d9]"}`}
              value={accountType}
              onChangeText={(text) => setAccountType(text)}
              placeholder="Tipo da conta"
              placeholderTextColor="#d9d9d9"
            /> */}
          </View>

          <View className="flex flex-row gap-2 mb-2">
            <TextInput
              className={`w-[49%] p-4 pl-2 text-xl border rounded-xl ${errors.bankAgency ? "border-red-500" : "border-[#d9d9d9]"}`}
              value={bankAgency}
              onChangeText={(text) => setBankAgency(text)}
              placeholder="Banco"
              placeholderTextColor="#d9d9d9"
            />

            <TextInput
              className={`w-[49%] p-4 pl-2 text-xl border rounded-xl ${errors.bankCode ? "border-red-500" : "border-[#d9d9d9]"}`}
              value={bankCode}
              onChangeText={(text) => setBankCode(text)}
              placeholder="Agência"
              placeholderTextColor="#d9d9d9"
            />
          </View>

          {/* CAMPO DE SENHA */}
          <Text className="text-[#737373] font-sansBold">Defina sua senha</Text>
          <PasswordInput
            style={`flex flex-row items-center gap-2 p-2 mb-1 border rounded-xl ${errors.password ? "border-red-500" : "border-[#d9d9d9]"}`}
            password={password}
            setPassword={setPassword}
          />
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
          <Text className="text-[#737373] font-sansBold">
            Confirme sua senha
          </Text>
          <PasswordInput
            style={`flex flex-row items-center gap-2 p-2 mb-1 border rounded-xl ${errors.confirmPassword ? "border-red-500" : "border-[#d9d9d9]"}`}
            password={confirmPassword}
            setPassword={setConfirmPassword}
          />
          <BouncyCheckbox
            className="mb-1"
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
            onPress={handleSubmit}
          >
            <Text className="text-black text-lg font-sansBold">
              Cadastrar empresa
            </Text>
          </TouchableOpacity>

          {/* TEXTO PARA LEVAR AO LOGIN EMPRESARIAL */}
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
